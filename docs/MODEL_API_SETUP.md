# OpenMontage Model / API Setup

This project uses provider tools, not one global model switch. Real credentials live in `D:\OpenMontage\.env`, which is gitignored. Public docs and `CLAUDE.md` must never contain real API keys.

## Current local priority

For this machine, `OPENAI_API_KEY` + `OPENAI_BASE_URL` in `.env` are configured from the local OpenClaw relay config, with:

```env
OPENAI_IMAGE_MODEL=gpt-image-2
```

That enables the `openai_image` tool path for OpenAI-compatible image generation. Keep using the OpenMontage pipeline/tool registry; do not bypass it with ad-hoc API calls during production work.

## Image providers

| Provider/tool | Env vars | Models / variants |
|---|---|---|
| `openai_image` | `OPENAI_API_KEY`, optional `OPENAI_BASE_URL`, `OPENAI_IMAGE_MODEL` | `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`, `dall-e-3`, relay aliases such as `image2` if exposed |
| fal FLUX `flux_image` | `FAL_KEY` / `FAL_API_KEY` / `FAL_AI_API_KEY` | `fal-ai/flux/dev`, image-to-image variants |
| Recraft `recraft_image` | `FAL_KEY` | Recraft via fal |
| Google `google_imagen` | `GOOGLE_API_KEY` or Vertex service account vars | Gemini/Imagen image models depending on backend |
| xAI `grok_image` | `XAI_API_KEY` | `grok-imagine-image`, `grok-imagine-image-quality` |
| stock images | `PEXELS_API_KEY`, `PIXABAY_API_KEY`, `UNSPLASH_ACCESS_KEY` | stock media search/download |
| local diffusion | local Python/GPU deps | local Stable Diffusion/diffusers path |

## Video providers

| Provider/tool | Env vars | Models / variants |
|---|---|---|
| `veo_video` | `FAL_KEY` / `FAL_AI_API_KEY` | Google Veo via fal |
| `kling_video` | `FAL_KEY` | Kling via fal |
| `minimax_video` | `FAL_KEY` | MiniMax video via fal |
| `seedance_video` | `FAL_KEY` | Seedance via fal |
| `seedance_replicate` | `REPLICATE_API_TOKEN` | Seedance via Replicate |
| `runway_video` | `RUNWAY_API_KEY` | `seedance_2.0`, `seedance_2.0_fast`, `gen4_turbo`, `gen4_aleph`, `gen3a_turbo` |
| `heygen_video` | `HEYGEN_API_KEY` | HeyGen gateway variants including VEO/Sora/Runway/Kling/Seedance where account supports them |
| `grok_video` | `XAI_API_KEY` | `grok-imagine-video` |
| `higgsfield_video` | `HIGGSFIELD_API_KEY` + `HIGGSFIELD_API_SECRET`, or `HIGGSFIELD_KEY` | Higgsfield Cloud video |
| `ltx_video_modal` | `MODAL_LTX2_ENDPOINT_URL` | self-hosted Modal LTX2 endpoint |
| local video | `VIDEO_GEN_LOCAL_ENABLED=true`, `VIDEO_GEN_LOCAL_MODEL` | `wan2.1-1.3b`, `wan2.1-14b`, `hunyuan-1.5`, `ltx2-local`, `cogvideo-5b` |

## Audio / music

| Capability | Env vars |
|---|---|
| ElevenLabs TTS / music / SFX | `ELEVENLABS_API_KEY` |
| OpenAI TTS | `OPENAI_API_KEY` |
| Google TTS | `GOOGLE_API_KEY` or `GOOGLE_APPLICATION_CREDENTIALS` |
| Doubao TTS | `DOUBAO_SPEECH_API_KEY`, optional `DOUBAO_SPEECH_VOICE_TYPE` |
| Suno music | `SUNO_API_KEY` |
| Freesound music search | `FREESOUND_API_KEY` |

## Important caveats

- `.env` is local-only and ignored by git. Put real secrets there only.
- `CLAUDE.md` is tracked. It may mention provider names and env var names, but never real keys.
- OpenClaw runtime model aliases are outer assistant routing context. OpenMontage production still goes through pipeline manifests, stage director skills, and the tool registry.
- Run preflight with the project venv:

```powershell
D:\OpenMontage\.venv\Scripts\python.exe -c "from tools.tool_registry import registry; import json; registry.discover(); print(json.dumps(registry.provider_menu_summary(), indent=2))"
```
