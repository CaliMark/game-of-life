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
trap 'rm -f "$DETAIL_TMP"' EXIT
git-ai log --raw -n "$DETAIL_LIMIT" --no-pager > "$DETAIL_TMP"

"$PYTHON" - "$OUT" "$OUT_JSON" "$COMMIT_LIMIT" "$DETAIL_LIMIT" "$DETAIL_TMP" <<'PY'
import datetime
import json
import os
import subprocess
import sys

out_file = sys.argv[1]
json_file = sys.argv[2]
commit_limit = int(sys.argv[3])
detail_limit = int(sys.argv[4])
detail_path = sys.argv[5]

# Whether to draw the "Bot" slice in the composition pie. Default off: the
# report's own regeneration commits (github-actions[bot]) are self-reference
# noise, so by default the chart shows AI / Human / Untracked and leaves bots
# to the summary line and per-commit table. Set REPORT_SHOW_BOT_CHART=1 (or
# true/yes) to include the Bot slice.
show_bot_chart = os.environ.get("REPORT_SHOW_BOT_CHART", "0").lower() in ("1", "true", "yes")

# --- Collect commits -------------------------------------------------------
fmt = "%h\t%ad\t%an\t%s"
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
    rows.append(
        f"| {c['sha']} | {c['date']} | {c['subject']} | {tot} | "
        f"{commit_pct(g(c, 'ai_additions'))}% | {commit_pct(g(c, 'human_additions'))}% | {agents(c)} |"
    )
    json_commits.append({
        "sha": c["sha"],
        "date": c["date"],
        "author": c["author"],
        "subject": c["subject"],
        "lines_added": tot,
        "ai_additions": g(c, "ai_additions"),
        "human_additions": g(c, "human_additions"),
        "unknown_additions": g(c, "unknown_additions"),
        "ai_pct": commit_pct(g(c, "ai_additions")),
        "human_pct": commit_pct(g(c, "human_additions")),
        "agents": agents_list(c),
        "agent_ai_lines": {
            fmt_tool(k): v.get("ai_additions", 0)
            for k, v in c["stats"].get("tool_model_breakdown", {}).items()
        },
    })

tool_summary = ", ".join(f"{t} ({n} lines)" for t, n in sorted(tool_lines.items())) or "—"

detail = open(detail_path, encoding="utf-8").read()

# Composition pie. Bot slice is opt-in via REPORT_SHOW_BOT_CHART (see above).
if show_bot_chart:
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
> human and recorded via `git-ai checkpoint human` or the git-ai extension. Note:
> these are line-count percentages, not commit counts. The composition pie
> excludes the report's own `bot` commits by default; set `REPORT_SHOW_BOT_CHART=1`
> to include them.

## Per-commit breakdown

| Commit | Date | Message | Lines | AI | Human | Agent(s) |
| --- | --- | --- | --- | --- | --- | --- |
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
    "schema_version": 2,
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
        "agents": {t: n for t, n in sorted(tool_lines.items())},
    },
    "commits": json_commits,
}

with open(json_file, "w", encoding="utf-8", newline="\n") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)
    f.write("\n")

print(f"Wrote {out_file} ({len(md)} bytes, {len(commits)} commits) and {json_file} ({len(json.dumps(report))} bytes)")
PY
