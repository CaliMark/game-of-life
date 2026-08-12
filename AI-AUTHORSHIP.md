# AI Authorship Report

This file shows which AI coding agent (or human) wrote the code in each commit,
using the [git-ai](https://usegitai.com) attribution notes attached to every
commit. It is regenerated automatically by a GitHub Actions workflow on every
push to `main`.

## Summary

- Commits analyzed: **8** (last 50)
- Total lines added: **3622**
- **AI-generated:** 398 lines (11.0%)
- **Human:** 0 lines (0.0%)
- **Untracked:** 3224 lines (89.0%)
- **Agents:** gemini · gemini-3.6-flash-medium (132 lines), github-copilot · claude-haiku-4.5 (7 lines), opencode · big-pickle (259 lines)

> **Legend:** `opencode · big-pickle` = agent and the LLM model that generated
> the lines (model is recorded when git-ai can resolve it from the agent's
> session data). `untracked` = lines written before git-ai attribution was set
> up (cannot be retroactively attributed). `human` = written directly by
> CaliMark. Note: these are line-count percentages, not commit counts.

## Per-commit breakdown

| Commit | Date | Message | Lines | AI | Human | Agent(s) |
| --- | --- | --- | --- | --- | --- | --- |
| 0e31e40 | 2026-08-12 | Merge branch 'main' of https://github.com/CaliMark/game-of-life | 0 | 0% | 0% | none |
| c8156e6 | 2026-08-12 | Update README: correct father's DOB to 1947, move AI Authorship note below Features, use info icon | 7 | 100% | 0% | github-copilot · claude-haiku-4.5 |
| a4372e9 | 2026-08-12 | docs: regenerate AI authorship report | 52 | 0% | 0% | untracked |
| 9de0204 | 2026-08-11 | docs: note this repo is a live example of the ai-authorship project | 2 | 100% | 0% | opencode · big-pickle |
| 059c0ca | 2026-08-12 | docs: regenerate AI authorship report | 52 | 0% | 0% | untracked |
| 906f076 | 2026-08-11 | chore: spice up the readme.md | 132 | 100% | 0% | gemini · gemini-3.6-flash-medium |
| 761f493 | 2026-08-12 | docs: regenerate AI authorship report | 81 | 0% | 0% | untracked |
| 94951a8 | 2026-08-11 | feat: initial commit - Conway's Game of Life | 3296 | 8% | 0% | opencode · big-pickle |

## Raw git-ai log (last 25 commits)

<details>
<summary>Show raw attribution detail</summary>

```text
commit 0e31e40c85b9fd3fe73082cb6e530097b9d329ab (HEAD -> main, origin/main)
Merge: c8156e6 a4372e9
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-12T14:27:32-07:00

    Merge branch 'main' of https://github.com/CaliMark/game-of-life

    Git AI stats:
      stats skipped for merge commit

    Authorship note:
      (none)

commit c8156e62bfea805575827bba24e38f1633b25012
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-12T14:27:10-07:00

    Update README: correct father's DOB to 1947, move AI Authorship note below Features, use info icon

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      README.md
        s_3cbf141a28feb5::t_58f0d58294c06d 9,58-63
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "c8156e62bfea805575827bba24e38f1633b25012",
        "prompts": {},
        "sessions": {
          "s_3cbf141a28feb5": {
            "agent_id": {
              "tool": "github-copilot",
              "id": "e4f126fb-bf21-40de-948b-a745d0e22508",
              "model": "claude-haiku-4.5"
            },
            "human_author": "CaliMark <mreed@needpc.net>"
          }
        }
      }

commit a4372e90fd282bd219d22614763a40fde8a5728a
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-12T04:43:29Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 9de0204c9bbbadb3ceb77617dac943d18a1e6fa3
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-11T21:42:23-07:00

    docs: note this repo is a live example of the ai-authorship project

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      README.md
        s_988aa8c761b089::t_08c8605843cbc5 15-16
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "9de0204c9bbbadb3ceb77617dac943d18a1e6fa3",
        "prompts": {},
        "sessions": {
          "s_988aa8c761b089": {
            "agent_id": {
              "tool": "opencode",
              "id": "ses_00bd75ff9ffesJ1tSH9l7XQdiY",
              "model": "big-pickle"
            },
            "human_author": "CaliMark <mreed@needpc.net>"
          }
        }
      }

commit 059c0ca7d5480a50785af43a96111c2516b0bcb9
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-12T04:33:32Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 906f076fa350bdd488259ca14c6653fe6c658bd4
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-11T21:32:49-07:00

    chore: spice up the readme.md

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      README.md
        s_2d9663bcdef3bb::t_23e07994feed1a 1,3,5,7,9-13,15,17,19-139
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "906f076fa350bdd488259ca14c6653fe6c658bd4",
        "prompts": {},
        "sessions": {
          "s_2d9663bcdef3bb": {
            "agent_id": {
              "tool": "gemini",
              "id": "80c02305-3819-4f7a-8020-077fd94661b6",
              "model": "gemini-3.6-flash-medium"
            },
            "human_author": "CaliMark <mreed@needpc.net>"
          }
        }
      }

commit 761f4934feee147d68b384d01acbc301fd203eb8
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-12T04:17:06Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 94951a81aa4ca0069765e60acc26130829f07cab
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-11T21:14:52-07:00

    feat: initial commit - Conway's Game of Life

    Git AI stats:
      you  ····································░░░░ ai
           0%           untracked  92%            8%

    Authorship note:
      .gitattributes
        s_988aa8c761b089::t_7f2a4059989744 1-6
      .gitignore
        s_988aa8c761b089::t_d92a3597993c06 15-17
        s_988aa8c761b089::t_0cf8af6ff0e27a 12-14
        s_988aa8c761b089::t_35e2063bd4c53d 18-20
      scripts/authorship-report.sh
        s_988aa8c761b089::t_7f2a4059989744 1-176
      .github/workflows/authorship-report.yml
        s_988aa8c761b089::t_7f2a4059989744 1-66
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "94951a81aa4ca0069765e60acc26130829f07cab",
        "prompts": {},
        "sessions": {
          "s_988aa8c761b089": {
            "agent_id": {
              "tool": "opencode",
              "id": "ses_00bd75ff9ffesJ1tSH9l7XQdiY",
              "model": "big-pickle"
            },
            "human_author": "CaliMark <mreed@needpc.net>"
          }
        }
      }


```
</details>

---

_Generated by [git-ai](https://usegitai.com). See `git ai blame <file>` for
line-level attribution of any file._
