# AGENTS.md — Guildora App Development Guide for AI Agents

Full reference for building Guildora apps with AI agents:

**https://github.com/guildora/docs/blob/main/for-developers/AGENTS.md**

---

## Quick Start

1. Read the full AGENTS.md at the URL above
2. Read `manifest.json` in this repo to understand the app structure
3. Reference the manifest schema: https://github.com/guildora/docs/blob/main/for-developers/manifest.md
4. Reference the Hub integration guide: https://github.com/guildora/docs/blob/main/for-developers/hub-integration.md
5. Reference the Bot integration guide: https://github.com/guildora/docs/blob/main/for-developers/bot-integration.md

## Critical Rules (read before writing any code)

- **Forms: always use `.field*`** — `.field`, `.field__control`, `.field__input`, `.field__select`, `.field__textarea`. The `.field__control` wrapper uses `var(--color-field-bg)` which ensures correct input contrast on all surface levels.
- **No hex colors** — CSS variables only (`var(--color-accent)`, `var(--color-error)`, etc.)
- **No imports for composables** — `useI18n`, `useAuth`, `useFetch`, `$fetch` are globally injected by the Hub.
- **`useFetch()` only accepts a plain string URL** — do NOT pass `computed()` or `ref()` as the URL. The Hub's polyfill is not the real Nuxt `useFetch` and does not support reactive URLs. For dynamic/filtered requests, use `$fetch()` directly.
- **`useAppConfig()` is NOT available** — access config values through your own API endpoint instead.

**Minimal form pattern:**
```html
<div class="field">
  <label class="field__label" for="my-field">Label</label>
  <div class="field__control">
    <input id="my-field" v-model="value" type="text" class="field__input" />
  </div>
</div>
```

## Key References

| Topic | URL |
|---|---|
| Full AGENTS.md (app dev) | https://github.com/guildora/docs/blob/main/for-developers/AGENTS.md |
| Manifest schema | https://github.com/guildora/docs/blob/main/for-developers/manifest.md |
| Hub integration | https://github.com/guildora/docs/blob/main/for-developers/hub-integration.md |
| Bot integration | https://github.com/guildora/docs/blob/main/for-developers/bot-integration.md |
| Config fields | https://github.com/guildora/docs/blob/main/for-developers/config-fields.md |
| i18n | https://github.com/guildora/docs/blob/main/for-developers/i18n.md |
| Design system | https://github.com/guildora/docs/blob/main/DESIGN_SYSTEM.md |
| Submission | https://github.com/guildora/docs/blob/main/for-developers/submission.md |
| Agent development guide | https://github.com/guildora/docs/blob/main/for-developers/agent-development.md |

Deployed docs (accessible from any system): https://guildora.github.io/docs — Claude Code agents can fetch any page directly via WebFetch.
