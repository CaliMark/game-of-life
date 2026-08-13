# AI Authorship Report

This file shows which AI coding agent (or human) wrote the code in each commit,
using the [git-ai](https://usegitai.com) attribution notes attached to every
commit. It is regenerated automatically by a GitHub Actions workflow on every
push to `main`.

## Summary

- Commits analyzed: **15** (last 50)
- Total lines added: **4041**
- **AI-generated:** 661 lines (16.4%)
- **Human:** 0 lines (0.0%)
- **Untracked:** 3380 lines (83.6%)
- **Agents:** gemini · gemini-3.6-flash-medium (132 lines), github-copilot · claude-haiku-4.5 (7 lines), opencode · big-pickle (522 lines)

> **Legend:** `opencode · big-pickle` = agent and the LLM model that generated
> the lines (model is recorded when git-ai can resolve it from the agent's
> session data). `untracked` = lines written before git-ai attribution was set
> up (cannot be retroactively attributed). `human` = written directly by
> CaliMark. Note: these are line-count percentages, not commit counts.

## Per-commit breakdown

| Commit | Date | Message | Lines | AI | Human | Agent(s) |
| --- | --- | --- | --- | --- | --- | --- |
| d32a64f | 2026-08-12 | fix: show brand title on mobile and contain active button glow in panels | 26 | 100% | 0% | opencode · big-pickle |
| 00864a3 | 2026-08-12 | feat: add undo/redo history for drawing, stamps, clear, randomize, and step | 197 | 100% | 0% | opencode · big-pickle |
| 372c70f | 2026-08-13 | docs: regenerate AI authorship report | 56 | 0% | 0% | untracked |
| 3d0b9a8 | 2026-08-12 | fix: improve mobile touch gestures (proportional pinch zoom, two-finger pan) | 40 | 100% | 0% | opencode · big-pickle |
| 6139bdc | 2026-08-12 | docs: regenerate AI authorship report | 33 | 0% | 0% | untracked |
| 460a12e | 2026-08-12 | Fix formatting in README.md section headers | 1 | 0% | 0% | untracked |
| a486b28 | 2026-08-12 | docs: regenerate AI authorship report | 66 | 0% | 0% | untracked |
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
commit d32a64fb103caf5ecf1d6bb1a18eb52280d83a87 (HEAD -> main, origin/main)
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-12T22:26:50-07:00

    fix: show brand title on mobile and contain active button glow in panels

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      src/styles/components.css
        s_988aa8c761b089::t_ee666e75c46b32 373,375-377,381
        s_988aa8c761b089::t_367804c8b135ed 393
        s_988aa8c761b089::t_8499f2240d6311 497
        s_988aa8c761b089::t_068d55b223e084 414-424
        s_988aa8c761b089::t_d2513db7227a9e 46
        s_988aa8c761b089::t_c4d153aad7700f 437,448-450
        s_988aa8c761b089::t_05105a2c54e32c 378,382
        s_988aa8c761b089::t_3978b671742566 443
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "d32a64fb103caf5ecf1d6bb1a18eb52280d83a87",
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

commit 00864a36378c241be0cc3d2ca41493fdf9219c6e
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-12T22:26:44-07:00

    feat: add undo/redo history for drawing, stamps, clear, randomize, and step

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      src/utils/lifeEngine.js
        s_988aa8c761b089::t_479201897ecfaa 282-365
        s_988aa8c761b089::t_40f6660241f46d 82-86
        s_988aa8c761b089::t_d71e41d1031c78 25-30
      src/components/CanvasViewport.jsx
        s_988aa8c761b089::t_c5e5ec96e4f8b3 289
        s_988aa8c761b089::t_4b41542dba9457 376-377
        s_988aa8c761b089::t_63f2cfcc2094ed 258-259
        s_988aa8c761b089::t_9c46c9f531a4f2 399
        s_988aa8c761b089::t_eeeaf7e613bf18 14-15
        s_988aa8c761b089::t_b72254d6fe028c 215
      src/App.jsx
        s_988aa8c761b089::t_d115a2650406c8 90,95-108,125-134,140
        s_988aa8c761b089::t_af6cc1e02b3fd6 243,255-258
        s_988aa8c761b089::t_9a459b053a5e56 72,82
      src/components/UnifiedControlDock.jsx
        s_988aa8c761b089::t_8de66b14055fe6 85-112
        s_988aa8c761b089::t_cfa0296fb7d834 180-205
        s_988aa8c761b089::t_c874d49b3b35e1 13-18
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "00864a36378c241be0cc3d2ca41493fdf9219c6e",
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

commit 372c70f87674e26c831e8fc952ac3d6a8cac47da
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-13T03:46:47Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 3d0b9a8408ce9642317ea684b9a07c7f894b9e5b
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-12T20:46:18-07:00

    fix: improve mobile touch gestures (proportional pinch zoom, two-finger pan)

    Git AI stats:
      you  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ai
           0%                                  100%

    Authorship note:
      src/components/CanvasViewport.jsx
        s_988aa8c761b089::t_c2ddc781f66b5a 296,302-305
        s_988aa8c761b089::t_5d11b58f6b5cbe 29
        s_988aa8c761b089::t_33bea061a82e9b 381
        s_988aa8c761b089::t_403e6bca0fa7a3 338-339,345-359,363-364
        s_988aa8c761b089::t_135183ac91fa9e 328-330,332-333,335-336,341-344,360-362
      ---
      {
        "schema_version": "authorship/3.0.0",
        "git_ai_version": "1.6.22",
        "base_commit_sha": "3d0b9a8408ce9642317ea684b9a07c7f894b9e5b",
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

commit 6139bdce47ff970f7af3fe48fe5efee02f83ba0e
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-12T21:34:32Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 460a12e2823ab82248421bbf55401fa01904c41b
Author: CaliMark <mreed@needpc.net>
Date:   2026-08-12T14:34:15-07:00

    Fix formatting in README.md section headers

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit a486b28f7b07f4ed2ea7d0e25806e6545c9bfebf
Author: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
Date:   2026-08-12T21:28:11Z

    docs: regenerate AI authorship report

    Git AI stats:
      you  ········································ ai
           0%           untracked 100%            0%

    Authorship note:
      (none)

commit 0e31e40c85b9fd3fe73082cb6e530097b9d329ab
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
