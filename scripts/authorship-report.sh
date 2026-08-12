#!/usr/bin/env bash
#
# Generates AI-AUTHORSHIP.md — a GitHub-visible report of which AI agent (or
# human) wrote each commit's code, backed by git-ai attribution notes.
#
# Usage: bash scripts/authorship-report.sh [commit-limit] [detail-limit]
#   commit-limit  how many commits to analyze            (default: 50)
#   detail-limit  how many raw git-ai log entries to show (default: 25)
#
# Requires: git, python3 (or python), and the git-ai CLI on PATH.
set -euo pipefail

OUT="AI-AUTHORSHIP.md"
COMMIT_LIMIT="${1:-50}"
DETAIL_LIMIT="${2:-25}"

if ! command -v git-ai >/dev/null 2>&1; then
  echo "git-ai CLI not found on PATH — cannot generate $OUT" >&2
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

"$PYTHON" - "$OUT" "$COMMIT_LIMIT" "$DETAIL_LIMIT" "$DETAIL_TMP" <<'PY'
import json
import subprocess
import sys

out_file = sys.argv[1]
commit_limit = int(sys.argv[2])
detail_limit = int(sys.argv[3])
detail_path = sys.argv[4]

# --- Collect commits -------------------------------------------------------
fmt = "%h\t%ad\t%s"
raw = subprocess.run(
    ["git", "log", f"-n{commit_limit}", f"--pretty=format:{fmt}", "--date=short"],
    check=True, capture_output=True, text=True,
).stdout

commits = []
for line in raw.splitlines():
    parts = line.split("\t", 2)
    if len(parts) != 3:
        continue
    sha, date, subject = parts
    stats = {}
    p = subprocess.run(["git-ai", "stats", sha, "--json"], capture_output=True, text=True)
    if p.returncode == 0 and p.stdout.strip():
        try:
            stats = json.loads(p.stdout)
        except json.JSONDecodeError:
            stats = {}
    commits.append({"sha": sha, "date": date, "subject": subject.replace("|", "\\|"), "stats": stats})

def g(c, key, default=0):
    return c["stats"].get(key, default)

def totals():
    human = sum(g(c, "human_additions") for c in commits)
    unknown = sum(g(c, "unknown_additions") for c in commits)
    ai = sum(g(c, "ai_additions") for c in commits)
    return human, unknown, ai

total_human, total_unknown, total_ai = totals()
total = total_human + total_unknown + total_ai

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

def agents(c):
    tools = sorted({fmt_tool(k) for k in c["stats"].get("tool_model_breakdown", {})})
    if tools:
        return ", ".join(tools)
    if g(c, "unknown_additions") > 0:
        return "untracked"
    if g(c, "human_additions") > 0:
        return "human"
    return "none"

def commit_pct(part):
    tot = g(c, "human_additions") + g(c, "unknown_additions") + g(c, "ai_additions")
    return round(100 * part / tot) if tot else 0

# --- Render markdown -------------------------------------------------------
rows = []
for c in commits:
    tot = g(c, "human_additions") + g(c, "unknown_additions") + g(c, "ai_additions")
    rows.append(
        f"| {c['sha']} | {c['date']} | {c['subject']} | {tot} | "
        f"{commit_pct(g(c, 'ai_additions'))}% | {commit_pct(g(c, 'human_additions'))}% | {agents(c)} |"
    )

tool_summary = ", ".join(f"{t} ({n} lines)" for t, n in sorted(tool_lines.items())) or "—"

detail = open(detail_path, encoding="utf-8").read()

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
- **Untracked:** {total_unknown} lines ({pct(total_unknown)}%)
- **Agents:** {tool_summary}

> **Legend:** `opencode · big-pickle` = agent and the LLM model that generated
> the lines (model is recorded when git-ai can resolve it from the agent's
> session data). `untracked` = lines written before git-ai attribution was set
> up (cannot be retroactively attributed). `human` = written directly by
> CaliMark. Note: these are line-count percentages, not commit counts.

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

print(f"Wrote {out_file} ({len(md)} bytes, {len(commits)} commits)")
PY
