#!/usr/bin/env bash
#
# Generates AI-AUTHORSHIP.md (+ AI-AUTHORSHIP.json, a machine-readable twin)
# — a GitHub-visible report of which AI agent (or human) wrote each commit's
# code, backed by git-ai attribution notes.
#
# Usage: bash scripts/authorship-report.sh [commit-limit] [detail-limit]
#   commit-limit  how many commits to analyze            (default: 50)
#   detail-limit  how many raw git-ai log entries to show (default: 25)
#
# Requires: git, python3 (or python), and the git-ai CLI on PATH.
set -euo pipefail

OUT="AI-AUTHORSHIP.md"
OUT_JSON="AI-AUTHORSHIP.json"
COMMIT_LIMIT="${1:-50}"
DETAIL_LIMIT="${2:-25}"

if ! command -v git-ai >/dev/null 2>&1; then
  echo "git-ai CLI not found on PATH — cannot generate $OUT / $OUT_JSON" >&2
  exit 1
fi

PYTHON=""
for cand in python3 python; do
  if command -v "$cand" >/dev/null 2>&1 && "$cand" -c "import sys" >/dev/null 2>&1; then
    PYTHON="$cand"
    break
  fi
done
if [ -z "$PYTHON" ]; then
  echo "python3/python not found — cannot generate $OUT" >&2
  exit 1
fi

# Fetch the raw detail log first so any git-ai errors surface clearly.
DETAIL_TMP=".ai-authorship-detail.tmp"
# A second, wider raw log is parsed for per-commit session metadata (whether a
# human drove the session) so the co-contribution view can weight AI lines.
NOTE_TMP=".ai-authorship-notes.tmp"
trap 'rm -f "$DETAIL_TMP" "$NOTE_TMP"' EXIT
git-ai log --raw -n "$DETAIL_LIMIT" --no-pager > "$DETAIL_TMP"
git-ai log --raw -n "$COMMIT_LIMIT" --no-pager > "$NOTE_TMP"

"$PYTHON" - "$OUT" "$OUT_JSON" "$COMMIT_LIMIT" "$DETAIL_LIMIT" "$DETAIL_TMP" "$NOTE_TMP" <<'PY'
import datetime
import json
import os
import re
import subprocess
import sys

out_file = sys.argv[1]
json_file = sys.argv[2]
commit_limit = int(sys.argv[3])
detail_limit = int(sys.argv[4])
detail_path = sys.argv[5]
note_path = sys.argv[6]

# Whether to draw the "Bot" slice in the composition pie. Default off: the
# report's own regeneration commits (github-actions[bot]) are self-reference
# noise, so by default the chart shows AI / Human / Untracked and leaves bots
# to the summary line and per-commit table. Set REPORT_SHOW_BOT_CHART=1 (or
# true/yes) to include the Bot slice.
show_bot_chart = os.environ.get("REPORT_SHOW_BOT_CHART", "0").lower() in ("1", "true", "yes")

# Co-contribution weighting. Every git-ai session records the human who drove
# it (human_author), so AI lines produced in such sessions are human-directed.
# REPORT_HUMAN_DIRECTION_WEIGHT credits that human with a share (default 0.5)
# of those lines; 0 = strict line-count view, 1 = full co-authorship.
# REPORT_SHOW_DIRECTION=0 restores the strict composition pie.
show_direction = os.environ.get("REPORT_SHOW_DIRECTION", "1").lower() in ("1", "true", "yes")
try:
    direction_weight = float(os.environ.get("REPORT_HUMAN_DIRECTION_WEIGHT", "0.5"))
except ValueError:
    direction_weight = 0.5
if not (0.0 <= direction_weight <= 1.0):
    direction_weight = 0.5

# Idea-origin weighting. When a feature implements an idea the agent itself
# suggested earlier (tagged with an "Idea-By: agent" commit trailer), the human
# who requested it still directed execution but did not originate the idea.
# REPORT_IDEA_WEIGHT is the share of the direction credit on those lines that is
# withheld from the human and shown as an "Agent (idea)" slice (default 0.3).
try:
    idea_weight = float(os.environ.get("REPORT_IDEA_WEIGHT", "0.3"))
except ValueError:
    idea_weight = 0.3
if not (0.0 <= idea_weight <= 1.0):
    idea_weight = 0.3

# Per-tool and per-model breakdown pies. Default on: alongside "AI lines by
# agent" the report draws "AI lines by tool" and "AI lines by model", and the
# weighted pie's "AI" slice is split per model when more than one model has
# lines. Set REPORT_SHOW_BREAKDOWN=0 to disable.
show_breakdown = os.environ.get("REPORT_SHOW_BREAKDOWN", "1").lower() in ("1", "true", "yes")

# --- Collect commits -------------------------------------------------------
fmt = "%H\t%ad\t%an\t%s\t%(trailers:key=Idea-By,only=yes,unfold=yes,valueonly=yes)"
raw = subprocess.run(
    ["git", "log", f"-n{commit_limit}", f"--pretty=format:{fmt}", "--date=short"],
    check=True, capture_output=True, text=True,
).stdout

commits = []
for line in raw.splitlines():
    parts = line.split("\t", 4)
    if len(parts) != 5:
        continue
    sha, date, author, subject, idea_by = parts
    idea_source = "agent" if idea_by.strip().lower() == "agent" else "human"
    stats = {}
    p = subprocess.run(["git-ai", "stats", sha, "--json"], capture_output=True, text=True)
    if p.returncode == 0 and p.stdout.strip():
        try:
            stats = json.loads(p.stdout)
        except json.JSONDecodeError:
            stats = {}
    commits.append({
        "sha": sha, "date": date, "author": author,
        "subject": subject.replace("|", "\\|"), "stats": stats,
        "idea_source": idea_source,
    })

# Parse the raw git-ai log to learn, per commit, whether a human drove the
# session(s) that produced its AI lines. The raw log prints the authorship
# note JSON after a "---" separator; session blocks carry human_author.
note_info = {}
cur_sha = None
json_buf = []
in_json = False

def flush_note():
    global cur_sha, json_buf, in_json
    if cur_sha and json_buf:
        try:
            note = json.loads("\n".join(json_buf))
            sessions = note.get("sessions") or {}
            note_info[cur_sha] = {
                "human_directed": any(
                    isinstance(s, dict) and s.get("human_author")
                    for s in sessions.values()
                ),
                "session_count": len(sessions),
            }
        except json.JSONDecodeError:
            pass
    cur_sha = None
    json_buf = []
    in_json = False

for line in open(note_path, encoding="utf-8"):
    if line.startswith("commit "):
        flush_note()
        cur_sha = line.split()[1]
    elif line.strip() == "---":
        in_json = True
    elif in_json and cur_sha:
        json_buf.append(line)
flush_note()

for c in commits:
    info = note_info.get(c["sha"], {"human_directed": False, "session_count": 0})
    c["human_directed"] = info["human_directed"]
    c["session_count"] = info["session_count"]

def g(c, key, default=0):
    return c["stats"].get(key, default)

# GitHub convention: automated accounts end in "[bot]" (github-actions[bot],
# dependabot[bot], renovate[bot], ...). Their commits have no git-ai note, so
# they'd show as "untracked" — but we know exactly who wrote them, so label
# them separately instead of lumping them in with genuinely unknown lines.
def is_bot(c):
    return c["author"].endswith("[bot]")

def totals():
    human = sum(g(c, "human_additions") for c in commits)
    bot = sum(g(c, "unknown_additions") for c in commits if is_bot(c))
    unknown = sum(g(c, "unknown_additions") for c in commits if not is_bot(c))
    ai = sum(g(c, "ai_additions") for c in commits)
    return human, bot, unknown, ai

total_human, total_bot, total_unknown, total_ai = totals()
total = total_human + total_bot + total_unknown + total_ai

# Co-contribution: split AI lines into human-directed (session recorded its
# human driver) vs autonomous. A commit is "co-authored" when it contains BOTH
# human-written and AI lines. Human-directed AI is attributed per model, and the
# human is credited with direction_weight of it; for lines implementing an
# agent-suggested idea (Idea-By: agent trailer) the idea_weight share of that
# credit is shown as an "Agent (idea)" slice instead.
model_human_directed_ai = {}
model_agent_idea_ai = {}
model_total_ai = {}
for c in commits:
    for key, val in c["stats"].get("tool_model_breakdown", {}).items():
        if "::" not in key:
            continue
        _, model = key.split("::", 1)
        if model == "unknown":
            continue
        n = val.get("ai_additions", 0)
        model_total_ai[model] = model_total_ai.get(model, 0) + n
        if c["human_directed"]:
            model_human_directed_ai[model] = model_human_directed_ai.get(model, 0) + n
            if c["idea_source"] == "agent":
                model_agent_idea_ai[model] = model_agent_idea_ai.get(model, 0) + n

model_human_credit = {}
model_agent_idea_credit = {}
model_ai_remainder = {}
for model in model_total_ai:
    directed = model_human_directed_ai.get(model, 0)
    idea = model_agent_idea_ai.get(model, 0)
    normal = directed - idea
    h = round(direction_weight * normal) + round(direction_weight * (1 - idea_weight) * idea)
    a = round(direction_weight * idea_weight * idea)
    model_human_credit[model] = h
    model_agent_idea_credit[model] = a
    model_ai_remainder[model] = model_total_ai[model] - h - a

total_human_directed_ai = sum(model_human_directed_ai.values())
total_agent_idea_ai = sum(model_agent_idea_ai.values())
total_autonomous_ai = total_ai - total_human_directed_ai
human_direction_credit = sum(model_human_credit.values())
agent_idea_credit = sum(model_agent_idea_credit.values())
total_direction_credit = human_direction_credit + agent_idea_credit
co_contributed_commits = [c for c in commits if g(c, "ai_additions") > 0 and g(c, "human_additions") > 0]

def pct(part):
    return round(100 * part / total, 1) if total else 0.0

# tool_model_breakdown keys look like "tool::model" (e.g. "opencode::big-pickle").
# Hide a model of "unknown" so labels stay clean when git-ai could not resolve it.
def fmt_tool(key):
    if "::" in key:
        tool, model = key.split("::", 1)
        return f"{tool} · {model}" if model != "unknown" else tool
    return key

# Per-agent AI breakdown (combined "tool · model" labels), plus per-dimension
# per-tool and per-model breakdowns.
agent_lines = {}
tool_lines = {}
model_lines = {}
for c in commits:
    for key, val in c["stats"].get("tool_model_breakdown", {}).items():
        n = val.get("ai_additions", 0)
        label = fmt_tool(key)
        agent_lines[label] = agent_lines.get(label, 0) + n
        if "::" in key:
            tool, model = key.split("::", 1)
            tool_lines[tool] = tool_lines.get(tool, 0) + n
            if model != "unknown":
                model_lines[model] = model_lines.get(model, 0) + n
        else:
            tool_lines[key] = tool_lines.get(key, 0) + n

# Human-written lines broken down by commit author.
human_lines_by_author = {}
for c in commits:
    ha = g(c, "human_additions")
    if ha > 0:
        human_lines_by_author[c["author"]] = human_lines_by_author.get(c["author"], 0) + ha

# Mermaid pie block for per-agent AI lines (only agents with lines > 0).
def generic_pie(title, mapping):
    entries = [(t, n) for t, n in sorted(mapping.items()) if n > 0]
    if not entries:
        return ""
    lines = ["```mermaid", f"pie title {title}"]
    lines += [f'    "{t}" : {n}' for t, n in entries]
    lines.append("```")
    return "\n".join(lines)

def agent_pie():
    return generic_pie("AI lines by agent", agent_lines)

def agents(c):
    tools = sorted({fmt_tool(k) for k in c["stats"].get("tool_model_breakdown", {})})
    if tools:
        return ", ".join(tools)
    if is_bot(c) and g(c, "unknown_additions") > 0:
        return "bot"
    if g(c, "unknown_additions") > 0:
        return "untracked"
    if g(c, "human_additions") > 0:
        return "human"
    return "none"

def agents_list(c):
    tools = sorted({fmt_tool(k) for k in c["stats"].get("tool_model_breakdown", {})})
    if tools:
        return tools
    if is_bot(c) and g(c, "unknown_additions") > 0:
        return ["bot"]
    if g(c, "unknown_additions") > 0:
        return ["untracked"]
    if g(c, "human_additions") > 0:
        return ["human"]
    return []

def commit_pct(part):
    tot = g(c, "human_additions") + g(c, "unknown_additions") + g(c, "ai_additions")
    return round(100 * part / tot) if tot else 0

# --- Render markdown -------------------------------------------------------
rows = []
json_commits = []
for c in commits:
    tot = g(c, "human_additions") + g(c, "unknown_additions") + g(c, "ai_additions")
    co = c in co_contributed_commits
    idea = c["idea_source"] == "agent"
    sha_short = c["sha"][:7]
    tool_n = {}
    model_n = {}
    for key, val in c["stats"].get("tool_model_breakdown", {}).items():
        n = val.get("ai_additions", 0)
        if "::" in key:
            tool, model = key.split("::", 1)
            tool_n[tool] = tool_n.get(tool, 0) + n
            if model != "unknown":
                model_n[model] = model_n.get(model, 0) + n
        else:
            tool_n[key] = tool_n.get(key, 0) + n
    rows.append(
        f"| {sha_short} | {c['date']} | {c['subject']} | {tot} | "
        f"{commit_pct(g(c, 'ai_additions'))}% | {commit_pct(g(c, 'human_additions'))}% | "
        f"{'✓' if co else ''} | {'A' if idea else ''} | {agents(c)} |"
    )
    json_commits.append({
        "sha": sha_short,
        "date": c["date"],
        "author": c["author"],
        "subject": c["subject"],
        "lines_added": tot,
        "ai_additions": g(c, "ai_additions"),
        "human_additions": g(c, "human_additions"),
        "unknown_additions": g(c, "unknown_additions"),
        "ai_pct": commit_pct(g(c, "ai_additions")),
        "human_pct": commit_pct(g(c, "human_additions")),
        "human_directed": c["human_directed"],
        "session_count": c["session_count"],
        "idea_source": c["idea_source"],
        "co_contributed": co,
        "agents": agents_list(c),
        "agent_ai_lines": {
            fmt_tool(k): v.get("ai_additions", 0)
            for k, v in c["stats"].get("tool_model_breakdown", {}).items()
        },
        "tool_ai_lines": tool_n,
        "model_ai_lines": model_n,
    })

tool_summary = ", ".join(f"{t} ({n} lines)" for t, n in sorted(agent_lines.items())) or "—"

detail = open(detail_path, encoding="utf-8").read()

agent_pie_block = agent_pie()
tool_pie_block = generic_pie("AI lines by tool", tool_lines) if show_breakdown else ""
model_pie_block = generic_pie("AI lines by model", model_lines) if show_breakdown else ""
human_pie_block = generic_pie("Human lines by contributor", human_lines_by_author)

# Composition pie. Two modes:
#   - show_direction (default): weighted co-contribution view. Human-direct
#     lines plus the credited share of human-directed AI lines (direction
#     weight W) vs autonomous AI vs Bot vs Untracked.
#   - otherwise: strict line-count view. Bot slice is opt-in via
#     REPORT_SHOW_BOT_CHART (see above).
if show_direction:
    pie_title = f"Co-contribution (weighted, human direction weight W={direction_weight:g}"
    if agent_idea_credit:
        pie_title += f", idea weight I={idea_weight:g}"
    pie_title += ")"
    pie_rows = [
        f'    "Human (direct)" : {total_human}',
        f'    "Human (direction)" : {human_direction_credit}',
    ]
    if agent_idea_credit:
        pie_rows.append(f'    "Agent (idea)" : {agent_idea_credit}')
    ai_remaining = total_ai - total_direction_credit
    if show_breakdown and len(model_lines) > 1:
        distributed = 0
        for model in sorted(model_lines):
            rem = model_ai_remainder.get(model, 0)
            if rem > 0:
                pie_rows.append(f'    "AI \u00b7 {model}" : {rem}')
                distributed += rem
        gap = ai_remaining - distributed
        if gap > 0:
            pie_rows.append(f'    "AI \u00b7 other" : {gap}')
    else:
        pie_rows.append(f'    "AI" : {ai_remaining}')
    if show_bot_chart:
        pie_rows.append(f'    "Bot" : {total_bot}')
    pie_rows.append(f'    "Untracked" : {total_unknown}')
elif show_bot_chart:
    pie_title = "Lines by author (AI vs Human vs Bot vs Untracked)"
    pie_rows = [
        f'    "AI" : {total_ai}',
        f'    "Human" : {total_human}',
        f'    "Bot" : {total_bot}',
        f'    "Untracked" : {total_unknown}',
    ]
else:
    pie_title = "Lines by author (AI vs Human vs Untracked; report regeneration excluded)"
    pie_rows = [
        f'    "AI" : {total_ai}',
        f'    "Human" : {total_human}',
        f'    "Untracked" : {total_unknown}',
    ]
pie_block = "```mermaid\npie title " + pie_title + "\n" + "\n".join(pie_rows) + "\n```"

md = f"""# AI Authorship Report

This file shows which AI coding agent (or human) wrote the code in each commit,
using the [git-ai](https://usegitai.com) attribution notes attached to every
commit. It is regenerated automatically by a GitHub Actions workflow on every
push to `main`.

## Summary

- Commits analyzed: **{len(commits)}** (last {commit_limit})
- Total lines added: **{total}**
- **AI-generated:** {total_ai} lines ({pct(total_ai)}%)
- **Human:** {total_human} lines ({pct(total_human)}%)
- **Bot:** {total_bot} lines ({pct(total_bot)}%)
- **Untracked:** {total_unknown} lines ({pct(total_unknown)}%)
- **Human-directed AI:** {total_human_directed_ai} lines (weighted credit: {human_direction_credit} lines at W={direction_weight:g})
- **Agent-suggested ideas:** {total_agent_idea_ai} AI lines ({round(100 * total_agent_idea_ai / total_ai, 1) if total_ai else 0.0}% of AI; idea weight {idea_weight:g}) — credit to human: {human_direction_credit} lines; credit to agent: {agent_idea_credit} lines
- **Co-authored commits (human + AI lines):** {len(co_contributed_commits)}
- **Agents:** {tool_summary}

## Composition

{pie_block}

{agent_pie_block}

{tool_pie_block}

{model_pie_block}

{human_pie_block}

> **Legend:** `opencode · big-pickle` = agent and the LLM model that generated
> the lines (model is recorded when git-ai can resolve it from the agent's
> session data). `bot` = committed by an automated account (`github-actions[bot]`
> and other `[bot]` accounts, e.g. the workflow regenerating this report) — known
> authorship, not attributed through git-ai. `untracked` = lines with no
> attribution data — written before git-ai was set up or made in the github.com
> web UI (cannot be retroactively attributed). `human` = written directly by a
> human and recorded via `git-ai checkpoint human` or the git-ai extension.
> `Human (direct)` = human-written lines; `Human (direction)` = the credited
> share of AI lines from sessions whose human driver git-ai recorded (weight
> `W` = `REPORT_HUMAN_DIRECTION_WEIGHT`, default 0.5); `Agent (idea)` = lines
> implementing an idea the agent itself suggested earlier (via `Idea-By: agent`
> commit trailer), credited to the agent rather than the human who requested
> it (weight `I` = `REPORT_IDEA_WEIGHT`, default 0.3). `AI` = the AI lines not
> credited to the human (including autonomous AI with no recorded driver). `A` in
> the per-commit table marks a commit whose idea the agent originated; `✓` marks
> a co-authored commit (contains both human-written and AI lines). These are
> line-count percentages, not commit counts. The composition pie excludes the
> report's own `bot` commits by default; set `REPORT_SHOW_BOT_CHART=1` to
> include them, or `REPORT_SHOW_DIRECTION=0` for a strict AI/Human/Untracked
> line-count pie. The "AI lines by tool" and "AI lines by model" pies break
> down the AI attribution by the agent tool and LLM model that produced the
> lines. "Human lines by contributor" shows human-written lines broken down by
> the commit author who recorded them (via `git-ai checkpoint human`).

## Per-commit breakdown

| Commit | Date | Message | Lines | AI | Human | Co | Idea | Agent(s) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
{chr(10).join(rows)}

## Raw git-ai log (last {detail_limit} commits)

<details>
<summary>Show raw attribution detail</summary>

```text
{detail}
```
</details>

---

_Generated by [git-ai](https://usegitai.com). See `git ai blame <file>` for
line-level attribution of any file._
"""

with open(out_file, "w", encoding="utf-8", newline="\n") as f:
    f.write(md)

report = {
    "schema_version": 4,
    "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "summary": {
        "commits_analyzed": len(commits),
        "commit_limit": commit_limit,
        "total_lines": total,
        "ai_lines": total_ai,
        "ai_pct": pct(total_ai),
        "human_lines": total_human,
        "human_pct": pct(total_human),
        "bot_lines": total_bot,
        "bot_pct": pct(total_bot),
        "unknown_lines": total_unknown,
        "unknown_pct": pct(total_unknown),
        "human_directed_ai_lines": total_human_directed_ai,
        "human_directed_ai_pct": round(100 * total_human_directed_ai / total_ai, 1) if total_ai else 0.0,
        "autonomous_ai_lines": total_autonomous_ai,
        "direction_weight": direction_weight,
        "direction_credit_lines": total_direction_credit,
        "human_direction_credit_lines": human_direction_credit,
        "agent_idea_ai_lines": total_agent_idea_ai,
        "agent_idea_ai_pct": round(100 * total_agent_idea_ai / total_ai, 1) if total_ai else 0.0,
        "idea_weight": idea_weight,
        "agent_idea_credit_lines": agent_idea_credit,
        "co_contributed_commits": len(co_contributed_commits),
        "agents": {t: n for t, n in sorted(agent_lines.items())},
        "tools": {t: n for t, n in sorted(tool_lines.items())},
        "models": {m: n for m, n in sorted(model_lines.items())},
    },
    "commits": json_commits,
}

with open(json_file, "w", encoding="utf-8", newline="\n") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)
    f.write("\n")

print(f"Wrote {out_file} ({len(md)} bytes, {len(commits)} commits) and {json_file} ({len(json.dumps(report))} bytes)")
PY
