# AI Authorship Report

This file shows which AI coding agent (or human) wrote the code in each commit,
using the [git-ai](https://usegitai.com) attribution notes attached to every
commit. It is regenerated automatically by a GitHub Actions workflow on every
push to `main`.

## Summary

- Commits analyzed: **50** (last 50)
- Total lines added: **3925**
- **AI-generated:** 612 lines (15.6%)
- **Human:** 1 lines (0.2% of project)
- **Bot:** 3312 lines (84.4%)
- **Untracked:** 0 lines (0.0%)
- **Human-directed AI:** 612 lines (weighted credit: 305 lines at W=0.5, 49.9% of project)
- **Agent-suggested ideas:** 0 AI lines (0.0% of AI; idea weight 0.3) — credit to human: 305 lines; credit to agent: 0 lines
- **Co-authored commits (human + AI lines):** 0
- **Agents:** claude · swe-1-6-slow (1 lines), cline · deepseek/deepseek-v4-flash (1 lines), cline · nemotron-3.5-lightning (1 lines), devin · swe-1-6-slow (1 lines), opencode · big-pickle (605 lines), opencode · qwen2.5-7b-instruct (3 lines)

## Composition

```mermaid
pie title Co-contribution (weighted, human direction weight W=0.5)
    "Human (direct)" : 1
    "Human (direction)" : 305
    "AI · big-pickle" : 303
    "AI · deepseek/deepseek-v4-flash" : 1
    "AI · nemotron-3.5-lightning" : 1
    "AI · qwen2.5-7b-instruct" : 1
    "AI · swe-1-6-slow" : 1
    "Untracked" : 0
```

```mermaid
pie title AI lines by agent
    "claude · swe-1-6-slow" : 1
    "cline · deepseek/deepseek-v4-flash" : 1
    "cline · nemotron-3.5-lightning" : 1
    "devin · swe-1-6-slow" : 1
    "opencode · big-pickle" : 605
    "opencode · qwen2.5-7b-instruct" : 3
```

```mermaid
pie title AI lines by tool
    "claude" : 1
    "cline" : 2
    "devin" : 1
    "opencode" : 608
```

```mermaid
pie title AI lines by model
    "big-pickle" : 605
    "deepseek/deepseek-v4-flash" : 1
    "nemotron-3.5-lightning" : 1
    "qwen2.5-7b-instruct" : 3
    "swe-1-6-slow" : 2
```

```mermaid
pie title Human lines by contributor
    "CaliMark" : 1
```

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
| b064e18 | 2026-08-16 | chore: sync authorship script (REPORT_SHOW_AGENT_CHART toggle) | 8 | 100% | 0% |  |  | opencode · big-pickle |
| b405462 | 2026-08-17 | docs: regenerate AI authorship report | 124 | 0% | 0% |  |  | bot |
| a89f108 | 2026-08-16 | chore: sync authorship script (Human % matches pie) | 1 | 100% | 0% |  |  | opencode · big-pickle |
| 30051a1 | 2026-08-17 | docs: regenerate AI authorship report | 121 | 0% | 0% |  |  | bot |
| 2094d75 | 2026-08-16 | chore: sync authorship script (pie-matched percentage) | 1 | 100% | 0% |  |  | opencode · big-pickle |
| 8a1c327 | 2026-08-17 | docs: regenerate AI authorship report | 121 | 0% | 0% |  |  | bot |
| a518e99 | 2026-08-16 | chore: sync authorship script (weighted percentage fix) | 1 | 100% | 0% |  |  | opencode · big-pickle |
| 231d684 | 2026-08-17 | docs: regenerate AI authorship report | 120 | 0% | 0% |  |  | bot |
| 587d53b | 2026-08-16 | chore: sync authorship script (weighted credit text fix) | 1 | 100% | 0% |  |  | opencode · big-pickle |
| 4c3973e | 2026-08-17 | docs: regenerate AI authorship report | 130 | 0% | 0% |  |  | bot |
| 5e213ad | 2026-08-16 | sync: human lines by contributor pie from ai-authorship | 12 | 100% | 0% |  |  | opencode · big-pickle |
| 480bd3f | 2026-08-17 | docs: regenerate AI authorship report | 483 | 0% | 0% |  |  | bot |
| 7611865 | 2026-08-16 | sync: tool/model breakdown pies + agent-idea provenance from ai-authorship | 160 | 100% | 0% |  |  | opencode · big-pickle |
| f979a1f | 2026-08-16 | docs: regenerate AI authorship report | 318 | 0% | 0% |  |  | bot |
| 4a2cd6e | 2026-08-16 | sync: weighted co-contribution view (human-direction credit) + co-authored marker from ai-authorship | 125 | 100% | 0% |  |  | opencode · big-pickle |
| cdfa377 | 2026-08-16 | docs: regenerate AI authorship report | 112 | 0% | 0% |  |  | bot |
| d8fcf12 | 2026-08-16 | sync: fix copy-in workflow to commit AI-AUTHORSHIP.json alongside the .md | 5 | 100% | 0% |  |  | opencode · big-pickle |
| 54f5cf4 | 2026-08-16 | docs: regenerate AI authorship report | 41 | 0% | 0% |  |  | bot |
| b865bf1 | 2026-08-16 | chore: regenerate report — initial commit rolled out of 50-commit window | 83 | 100% | 0% |  |  | opencode · big-pickle |
| 6a89530 | 2026-08-16 | docs: regenerate AI authorship report | 56 | 0% | 0% |  |  | bot |
| 1a607b4 | 2026-08-16 | sync: update authorship report script + workflow from ai-authorship | 8 | 100% | 0% |  |  | opencode · big-pickle |
| 6033a7c | 2026-08-16 | docs: regenerate AI authorship report | 103 | 0% | 0% |  |  | bot |
| e2fa8ce | 2026-08-16 | sync: update authorship report script + workflow from ai-authorship | 34 | 100% | 0% |  |  | opencode · big-pickle |
| ee29603 | 2026-08-16 | docs: regenerate AI authorship report | 193 | 0% | 0% |  |  | bot |
| f37f6ab | 2026-08-16 | sync: update authorship report script + workflow from ai-authorship | 37 | 100% | 0% |  |  | opencode · big-pickle |
| 4bc8085 | 2026-08-16 | docs: regenerate AI authorship report | 108 | 0% | 0% |  |  | bot |
| 9a23637 | 2026-08-16 | feat: add per-agent breakdown pie chart to report composition | 12 | 100% | 0% |  |  | opencode · big-pickle |
| 9243d1b | 2026-08-16 | docs: regenerate AI authorship report | 757 | 0% | 0% |  |  | bot |
| 3cd6dab | 2026-08-16 | feat: emit machine-readable AI-AUTHORSHIP.json + composition pie chart | 89 | 100% | 0% |  |  | opencode · big-pickle |
| 243887d | 2026-08-16 | docs: regenerate AI authorship report | 52 | 0% | 0% |  |  | bot |
| e7a7c91 | 2026-08-15 | docs: note local-model (LM Studio qwen2.5-7b-instruct) proof on this repo | 2 | 100% | 0% |  |  | opencode · big-pickle |
| 2c9790a | 2026-08-15 | docs: regenerate AI authorship report | 52 | 0% | 0% |  |  | bot |
| 7b79bd1 | 2026-08-15 | Created by LM Stuido with opencode | 3 | 100% | 0% |  |  | opencode · qwen2.5-7b-instruct |
| b79a733 | 2026-08-15 | docs: regenerate AI authorship report | 52 | 0% | 0% |  |  | bot |
| d8ae5d6 | 2026-08-14 | docs: add live website link (needpc.net/life) | 2 | 100% | 0% |  |  | opencode · big-pickle |
| d61a459 | 2026-08-15 | docs: regenerate AI authorship report | 59 | 0% | 0% |  |  | bot |
| 3a4581d | 2026-08-14 | docs: tidy separator before license section | 0 | 0% | 0% |  |  | none |
| 293f451 | 2026-08-14 | docs: remove needpc.net line | 0 | 0% | 0% |  |  | none |
| 8cba1ef | 2026-08-15 | docs: regenerate AI authorship report | 47 | 0% | 0% |  |  | bot |
| b7e37f0 | 2026-08-14 | docs: manually shorten needpc.net line (human-attributed edit) | 1 | 0% | 100% |  |  | human |
| 7195ad1 | 2026-08-15 | docs: regenerate AI authorship report | 52 | 0% | 0% |  |  | bot |
| ca7ee4b | 2026-08-14 | docs: add TeamWork mention via Devin Desktop live test | 1 | 100% | 0% |  |  | devin · swe-1-6-slow |
| 9973fde | 2026-08-14 | docs: regenerate AI authorship report | 68 | 0% | 0% |  |  | bot |
| 150f8a4 | 2026-08-13 | feat: attribute Devin Desktop edits via .devin hooks to git-ai | 25 | 100% | 0% |  |  | claude · swe-1-6-slow, opencode · big-pickle |
| b0231be | 2026-08-14 | docs: regenerate AI authorship report | 52 | 0% | 0% |  |  | bot |
| 605ebd8 | 2026-08-13 | docs: add needpc line to README | 1 | 100% | 0% |  |  | cline · deepseek/deepseek-v4-flash |
| a0a233c | 2026-08-14 | docs: regenerate AI authorship report | 39 | 0% | 0% |  |  | bot |
| 09df4eb | 2026-08-13 | Remove divider rule pattern gallery | 0 | 0% | 0% |  |  | none |
| 45b21c8 | 2026-08-14 | docs: regenerate AI authorship report | 52 | 0% | 0% |  |  | bot |
| fc81dca | 2026-08-13 | Center pattern table in README | 1 | 100% | 0% |  |  | cline · nemotron-3.5-lightning |

## Raw git-ai log (last 25 commits)

<details>
<summary>Show raw attribution detail</summary>

```text
commit b064e18c2ed565701ad047e0008d6b5f4cc327a6 (HEAD -> main, origin/main)
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T23:36:56-07:00

    chore: sync authorship script (REPORT_SHOW_AGENT_CHART toggle)

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      .github/workflows/authorship-report.yml
        s_988aa8c761b089::t_710edbf2485ccb 43-45
      scripts/authorship-report.sh
        s_988aa8c761b089::t_e4384f8bf27929 98-101,364
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "b064e18c2ed565701ad047e0008d6b5f4cc327a6",
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

commit b4054623dd984cdeced034e154fddd6f6d8ea886
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-17T05:36:34Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit a89f108473cb56f7ee41f8a46798be432f25c08c
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T22:35:47-07:00

    chore: sync authorship script (Human % matches pie)

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      scripts/authorship-report.sh
        s_988aa8c761b089::t_ed8e89d4e5441c 427
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "a89f108473cb56f7ee41f8a46798be432f25c08c",
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

commit 30051a1afe5db363f39e2a99a9593edcd4266dec
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-17T05:24:23Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 2094d75e6986268511b5865c82c97bfab0c4e58b
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T22:23:35-07:00

    chore: sync authorship script (pie-matched percentage)

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      scripts/authorship-report.sh
        s_988aa8c761b089::t_7f62fa8179d9e5 430
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "2094d75e6986268511b5865c82c97bfab0c4e58b",
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

commit 8a1c3273ac2ceda0e4533c5c112627e15bd0b234
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-17T05:08:38Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit a518e9901e348058aee59b4bdc000069976be1af
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T22:07:55-07:00

    chore: sync authorship script (weighted percentage fix)

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      scripts/authorship-report.sh
        s_988aa8c761b089::t_176c2d0b9d72f5 430
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "a518e9901e348058aee59b4bdc000069976be1af",
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

commit 231d684bb85b2afe83fa8a638d213cca1579c6eb
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-17T04:58:45Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 587d53bb039f3f2149732a7af0615e07f7de1144
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T21:58:03-07:00

    chore: sync authorship script (weighted credit text fix)

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      scripts/authorship-report.sh
        s_988aa8c761b089::t_e84bc6c98a4b3c 430
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "587d53bb039f3f2149732a7af0615e07f7de1144",
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

commit 4c3973e09028619c536315752f6b523df742d017
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-17T01:58:57Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 5e213ad36392097823d2126716da246876874487
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T18:58:28-07:00

    sync: human lines by contributor pie from ai-authorship

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      scripts/authorship-report.sh
        s_52d0732141ad88::t_0c661d97d72b06 260-266,363,445-446,469-470
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "5e213ad36392097823d2126716da246876874487",
        "prompts": {},
        "sessions": {
          "s_52d0732141ad88": {
            "agent_id": {
              "tool": "opencode",
              "id": "ses_008f7fcbaffeQRUMaWQo3qCxm4",
              "model": "big-pickle"
            },
            "human_author": "CaliMark <mreed@needpc.net>"
          }
        }
      }

commit 480bd3f8c7d0af078938fbffe1cf799bef651f54
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-17T01:12:41Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 7611865bc2ad619035c975f164cb20fef2eb229c
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T18:12:09-07:00

    sync: tool/model breakdown pies + agent-idea provenance from ai-authorship

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      .github/workflows/authorship-report.yml
        s_988aa8c761b089::t_d9298cfad1df7b 37-42
      scripts/authorship-report.sh
        s_988aa8c761b089::t_ab7357c0f6406a 80-97,99,107-108,110-111,122,188-224,226-228,242-244,246,249,251-258,261-262,265,270-272,307,309-319,323,338,345-346,349,353-356,364-367,370,372-386,423,431-435,447-459,463-464,487,506-510,512-514
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "7611865bc2ad619035c975f164cb20fef2eb229c",
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

commit f979a1f97b90da57c58920dee67f6c30809dfbda
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-16T20:47:59Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 4a2cd6e3fced29e1899d87761d445fd225308691
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T13:47:31-07:00

    sync: weighted co-contribution view (human-direction credit) + co-authored marker from ai-authorship

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      .github/workflows/authorship-report.yml
        s_988aa8c761b089::t_fb37ea4c2df588 32-36
      scripts/authorship-report.sh
        s_988aa8c761b089::t_4e293999ba2885 38-41,43,45,49,58,67-79,81,105-146,167-175,237-238,240-242,245,255-257,269-285,317-318,334-343,347-348,371,385-390
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "4a2cd6e3fced29e1899d87761d445fd225308691",
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

commit cdfa377c800722f79e18b8e21560eb5e5195e407
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-16T20:00:15Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit d8fcf128f16ea9cb5778792ca0a8ae9f0801f452
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T12:59:46-07:00

    sync: fix copy-in workflow to commit AI-AUTHORSHIP.json alongside the .md

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      .github/workflows/authorship-report.yml
        s_988aa8c761b089::t_1863205ea494a2 60,69-70,72,77
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "d8fcf128f16ea9cb5778792ca0a8ae9f0801f452",
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

commit 54f5cf4db37cded72f028cf8c8345ac056820517
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-16T19:53:17Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit b865bf19b178d824d33f65d7103efa9f28273d91
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T12:52:50-07:00

    chore: regenerate report — initial commit rolled out of 50-commit window

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      AI-AUTHORSHIP.md
        s_52d0732141ad88::t_90c2214b181fbe 11-12,14-16,22,24,37,57,114-127
      AI-AUTHORSHIP.json
        s_52d0732141ad88::t_90c2214b181fbe 3,5,7-9,12-15,25,30-79
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "b865bf19b178d824d33f65d7103efa9f28273d91",
        "prompts": {},
        "sessions": {
          "s_52d0732141ad88": {
            "agent_id": {
              "tool": "opencode",
              "id": "ses_008f7fcbaffeQRUMaWQo3qCxm4",
              "model": "big-pickle"
            },
            "human_author": "CaliMark <mreed@needpc.net>"
          }
        }
      }

commit 6a8953043ba91a1fadf94de3806855f79da05e1d
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-16T19:44:47Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 1a607b4b6ace18998b5538cbf5d00823e5fec73f
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T12:44:18-07:00

    sync: update authorship report script + workflow from ai-authorship

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      .github/workflows/authorship-report.yml
        s_988aa8c761b089::t_6212bb4e2c97fd 29-31,60,69-70,72,77
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "1a607b4b6ace18998b5538cbf5d00823e5fec73f",
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

commit 6033a7cd278a26bba8d7898abbe65c716baa9b77
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-16T19:43:20Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit e2fa8ce32781d05eb67ce7dcef9616eea1107c5e
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T12:42:50-07:00

    sync: update authorship report script + workflow from ai-authorship

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      .github/workflows/authorship-report.yml
        s_988aa8c761b089::t_d2f82b7d8a9590 29-32
      scripts/authorship-report.sh
        s_988aa8c761b089::t_61a4f010ab821c 44,54-60,193-210,230,242-244
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "e2fa8ce32781d05eb67ce7dcef9616eea1107c5e",
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

commit ee29603c3cfa92745986f6358a7e4fe1a9af740b
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-16T19:05:55Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit f37f6aba442a02e97b8ea11f616495b499fbaad3
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-16T12:05:27-07:00

    sync: update authorship report script + workflow from ai-authorship

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      scripts/authorship-report.sh
        s_988aa8c761b089::t_6a341bd64174aa 54,62-63,65,73-76,81-87,90-91,93,95-96,130-131,142-143,166,198,205,208,216-221,250,260-261
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "f37f6aba442a02e97b8ea11f616495b499fbaad3",
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
