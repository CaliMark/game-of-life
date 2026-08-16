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

# --- Collect commits -------------------------------------------------------
fmt = "%H\t%ad\t%an\t%s"
raw = subprocess.run(
    ["git", "log", f"-n{commit_limit}", f"--pretty=format:{fmt}", "--date=short"],
    check=True, capture_output=True, text=True,
).stdout

commits = []
for line in raw.splitlines():
    parts = line.split("\t", 3)
    if len(parts) != 4:
        continue
    sha, date, author, subject = parts
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
# human driver) vs autonomous. The human is credited with direction_weight of
# the human-directed AI lines. A commit is "co-authored" when it contains BOTH
# human-written and AI lines.
total_human_directed_ai = sum(g(c, "ai_additions") for c in commits if c["human_directed"])
total_autonomous_ai = total_ai - total_human_directed_ai
total_direction_credit = round(direction_weight * total_human_directed_ai)
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

# Per-tool AI breakdown (tool_model_breakdown keys look like "tool::model")
tool_lines = {}
for c in commits:
    for key, val in c["stats"].get("tool_model_breakdown", {}).items():
        label = fmt_tool(key)
        tool_lines[label] = tool_lines.get(label, 0) + val.get("ai_additions", 0)

# Mermaid pie block for per-agent AI lines (only agents with lines > 0).
def agent_pie():
    entries = [(t, n) for t, n in sorted(tool_lines.items()) if n > 0]
    if not entries:
        return ""
    lines = ["```mermaid", "pie title AI lines by agent"]
    lines += [f'    "{t}" : {n}' for t, n in entries]
    lines.append("```")
    return "\n".join(lines)

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
    sha_short = c["sha"][:7]
    rows.append(
        f"| {sha_short} | {c['date']} | {c['subject']} | {tot} | "
        f"{commit_pct(g(c, 'ai_additions'))}% | {commit_pct(g(c, 'human_additions'))}% | "
        f"{'✓' if co else ''} | {agents(c)} |"
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
        "co_contributed": co,
        "agents": agents_list(c),
        "agent_ai_lines": {
            fmt_tool(k): v.get("ai_additions", 0)
            for k, v in c["stats"].get("tool_model_breakdown", {}).items()
        },
    })

tool_summary = ", ".join(f"{t} ({n} lines)" for t, n in sorted(tool_lines.items())) or "—"

detail = open(detail_path, encoding="utf-8").read()

# Composition pie. Two modes:
#   - show_direction (default): weighted co-contribution view. Human-direct
#     lines plus the credited share of human-directed AI lines (direction
#     weight W) vs autonomous AI vs Bot vs Untracked.
#   - otherwise: strict line-count view. Bot slice is opt-in via
#     REPORT_SHOW_BOT_CHART (see above).
if show_direction:
    pie_title = f"Co-contribution (weighted, human direction weight W={direction_weight:g})"
    pie_rows = [
        f'    "Human (direct)" : {total_human}',
        f'    "Human (direction)" : {total_direction_credit}',
        f'    "AI" : {total_ai - total_direction_credit}',
    ]
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
- **Human-directed AI:** {total_human_directed_ai} lines ({round(100 * total_human_directed_ai / total_ai, 1) if total_ai else 0.0}% of AI; direction weight {direction_weight:g})
- **Co-authored commits (human + AI lines):** {len(co_contributed_commits)}
- **Agents:** {tool_summary}

## Composition

{pie_block}

{agent_pie()}

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
> `W` = `REPORT_HUMAN_DIRECTION_WEIGHT`, default 0.5); `AI` = the AI lines not
> credited to the human (including autonomous AI with no recorded driver). A
> `✓` in the per-commit table marks a co-authored commit (contains both
> human-written and AI lines). These are line-count percentages, not commit
> counts. The composition pie excludes the report's own `bot` commits by
> default; set `REPORT_SHOW_BOT_CHART=1` to include them, or
> `REPORT_SHOW_DIRECTION=0` for a strict AI/Human/Untracked line-count pie.

## Per-commit breakdown

| Commit | Date | Message | Lines | AI | Human | Co | Agent(s) |
| --- | --- | --- | --- | --- | --- | --- | --- |
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
    "schema_version": 3,
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
        "co_contributed_commits": len(co_contributed_commits),
        "agents": {t: n for t, n in sorted(tool_lines.items())},
    },
    "commits": json_commits,
}

with open(json_file, "w", encoding="utf-8", newline="\n") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)
    f.write("\n")

print(f"Wrote {out_file} ({len(md)} bytes, {len(commits)} commits) and {json_file} ({len(json.dumps(report))} bytes)")
PY
