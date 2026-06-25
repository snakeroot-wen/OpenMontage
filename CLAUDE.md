# OpenMontage

**MANDATORY: Read [`AGENT_GUIDE.md`](AGENT_GUIDE.md) before responding to ANY user message.**

Do not act on the user's request until you have read AGENT_GUIDE.md.
It contains routing rules that determine your first action based on what the user asked.
Skipping it WILL cause you to take the wrong action.

All pipeline/production instructions are in AGENT_GUIDE.md. The section below is
**environment/runtime context only** — read it *after* AGENT_GUIDE.md, never as a
substitute. It does not override Rule Zero or any pipeline routing rule.

---

## Local API / Model Setup

Read [`docs/MODEL_API_SETUP.md`](docs/MODEL_API_SETUP.md) when you need to know
which image, video, TTS, music, or stock-media provider can be enabled by which
`.env` variable.

Important:
- Real secrets belong only in `D:\OpenMontage\.env`; `.env` is gitignored.
- Do not put real keys in this file, `.env.example`, prompts, or committed docs.
- Production work still goes through the OpenMontage pipeline system and tool
  registry. Do not bypass Rule Zero with ad-hoc provider calls.

## OpenMontage provider model hints

These are tool/provider hints for OpenMontage. Actual availability depends on
`.env` and the tool registry preflight.

### Image

- `openai_image`: `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`,
  `gpt-image-1-mini`, `dall-e-3`, and relay aliases such as `image2` if exposed.
- `flux_image`: fal FLUX models, including text-to-image and image-to-image.
- `google_imagen`: Google Gemini/Imagen image models depending on auth path.
- `grok_image`: `grok-imagine-image`, `grok-imagine-image-quality`.
- `recraft_image`: Recraft via fal.
- `pexels_image`, `pixabay_image`, `unsplash` paths: stock imagery, not generated
  imagery.

### Video

- `veo_video`: Google Veo via fal.
- `kling_video`: Kling via fal.
- `minimax_video`: MiniMax video via fal.
- `seedance_video`: Seedance via fal.
- `seedance_replicate`: Seedance via Replicate.
- `runway_video`: `seedance_2.0`, `seedance_2.0_fast`, `gen4_turbo`,
  `gen4_aleph`, `gen3a_turbo`.
- `heygen_video`: HeyGen gateway variants such as VEO/Sora/Runway/Kling/Seedance
  where the account supports them.
- `grok_video`: `grok-imagine-video`.
- `higgsfield_video`: Higgsfield Cloud video.
- Local generation: Wan, Hunyuan, LTX, CogVideo depending on local GPU/deps.

## Runtime Model Availability via OpenClaw

This machine also runs a local OpenClaw runtime that can route assistant tasks to
model aliases. These are *outer assistant routing context*, not OpenMontage tool
instructions.

Common aliases seen in local config:
- `anthropic/claude-opus-4-5` — Claude Opus 4.5
- `kuku/claude-opus-4-6-thinking` — Claude Opus 4.6 thinking
- `anthropic/claude-sonnet-4-5` — Claude Sonnet 4.5
- `kuku/claude-sonnet-4-6` — Claude Sonnet 4.6
- `kuku/gpt-5.4`, `kuku/gpt-5.4-mini`, `kuku/gpt-5.5` — GPT-5.x
- `kuku/gpt-image-2`, `kuku/gpt-image-1.5` — image-capable relay models when
  exposed by the surrounding runtime
- `kuku/gemini-3-flash`, `kuku/gemini-pro-agent` — Gemini aliases
- `kuku/grok-4.3` — Grok alias
- `moonshot/kimi-k2.5` — Kimi K2.5

Caveat: Claude Code cannot directly invoke these aliases from inside a task
unless its current runtime exposes model switching. If switching is unavailable,
recommend the appropriate alias instead of pretending to call it.

## Preflight command

Use the project venv:

```powershell
D:\OpenMontage\.venv\Scripts\python.exe -c "from tools.tool_registry import registry; import json; registry.discover(); print(json.dumps(registry.provider_menu_summary(), indent=2))"
```
