# dmtool — Generative Art for DMT on TAP Protocol

## Product Requirements (Summary)

- No IP/art in the repo. Users point the tool at their own `layersRoot`.
- Traits/folders are fully dynamic via `dmtool.config.json` (no hard‑coded names).
- Default strategy mirrors the Natcats principle (block‑driven trait gating) and ships without any Natcats art.
- Element id (`elementId`) must be an inscription id (e.g., `<TXID>i0`); stored for downstream DMT JSON authoring.
- The inline artifact must not exceed the 350 KB inscription cap — plan and design layers accordingly.
- Interactive and parameterized modes supported; agent‑friendly with `AGENT.md`.
- Includes rarity simulation (`simulate`) and an optional ord‑tap distribution check (`analyze`).

A small CLI toolkit to help artists and builders turn layered art into a single, on‑chain HTML renderer with Natcats‑style, block‑driven trait gating — plus rarity simulation and distribution checks against a live ord‑tap index.

References (ord‑tap optional)
- Ord‑TAP (index + APIs): https://github.com/Trac-Systems/ord-tap — only needed for `analyze` or minted‑set `simulate`.
- TAP protocol specs: https://github.com/Trac-Systems/tap-protocol-specs

Strategy & element defaults
- Default strategy is `natcats`: a block‑driven gating approach inspired by Natcats. It does NOT copy their exact rules or art — it mirrors the principle only.
- By default, `dmtool.config.json` carries the Natcats element inscription id so you can reference a real element in your DMT JSON (deploy/mint). That element’s on‑chain content is `3b.3b.11.element` and the current observed supply is 8,064 items. You can change `elementId` at any time to your own element when shipping your collection.
- Natcats implement their own strategy; dmtool ships a generic, configurable one. You can add/replace strategies under `src/strategies/`.

Agent‑friendly
- dmtool is designed to be agent‑friendly: you can iterate quickly with tools like Codex or similar “vibe coding” workflows — tweak configs (traits, weights, profiles), rebuild, and simulate/analyze in short loops.

Important constraints:
- Ships with no art. You point it at your own local layers.
- Default strategy mirrors the dmt‑natcats principle (derive traits from the mint block). You can extend/replace strategies.
- Includes rarity simulation (local), and on‑chain distribution checks via ord‑tap endpoints (you run your own instance or point at one).
- Compression is configurable via `compression.enabled` (default `false`). When disabled, the builder does not auto‑degrade quality or width; it will warn if the output exceeds 350 KB. Enable compression to apply heuristics to target ≤350 KB.

## Quick Start

1) Install deps:
- `cd dmtool && npm i`

Using the CLI
- Local (no global install):
  - `cd dmtool`
  - Run directly: `node bin/dmtool.js <command>` (e.g., `node bin/dmtool.js build`)
  - Or use npm scripts: `npm run build`, `npm run simulate`, `npm run analyze`, `npm run init`
- Global (optional):
  - `cd dmtool && npm link` — this symlinks `dmtool` into your global npm bin
  - Then you can run `dmtool <command>` from anywhere
  - To remove: `npm unlink -g dmtool`

2) Initialize a project (interactive):
- `npm run init`
  - Points to your layers root
  - Picks a strategy (`natcats` by default)
  - Writes `dmtool.config.json`

3) Build an inline HTML renderer (350 KB cap):
- `npm run build`
  - Output: `dmtool/out/renderer.html`
  - Note: With `compression.enabled=false` (default), the build prioritizes quality and may exceed 350 KB. Enable compression in config to apply size‑targeted profiles.
  - CLI overrides: `dmtool build --compress` (force on), `dmtool build --no-compress` (force off), `--compression true|false`, and `--maxKB 300` to override the cap for this run.
  - npm tip: when passing extra flags to npm scripts, use `--` separator. Example: `npm run build -- --no-compress`. Or use helpers: `npm run build:compress` / `npm run build:nocompress`.

4) Simulate rarity
- Sampled blocks (range): `npm run simulate -- --sample 20000 --start 600000 --end 900000`
  - Output: `dmtool/out/rarity-report.json` with `mode: "sampled"`.
- Minted‑set mode (real supply via ord‑tap): `npm run simulate -- --ticker dmt-natcats --host http://localhost:4444`
  - Uses actual minted blocks from ord‑tap; default `--unique true` collapses duplicate blocks.
  - Output: `dmtool/out/rarity-report.json` with `mode: "minted"`, including per‑folder gate rates and weighted pick percents based on your `weights.json`.

5) (Optional) Compare distributions against a live ticker (requires ord‑tap):
- `npm run analyze -- --ticker dmt-natcats --host http://localhost:4444`
  - If you do not have an ord‑tap host, you can skip this step. The command will exit gracefully without a host.
  - Output (when run): `dmtool/out/ticker-gate-report.json`
  - Ord‑TAP repo: https://github.com/Trac-Systems/ord-tap
  - TAP protocol specs: https://github.com/Trac-Systems/tap

## Layer Structure

By default, dmtool expects a single category (e.g., `main`) with numbered subfolders in z‑order:

```
layers/
  main/
    1/   # background
    2/   # base
    3/   # jacket or accessory
    4/   # outline
    5/   # hand
    6/   # eyes
    7/   # head
    8/   # overlay
```

- You can change folder names, counts, order, and add/remove folders in `dmtool.config.json`.
- Trait weights and groups live in `weights.json` (one per folder key).

Supported input formats: PNG, JPG/JPEG, WebP, AVIF, and SVG. Transparent layers should be PNG or SVG. dmtool normalizes inputs to RGBA and packs atlases as AVIF/PNG‑8 per your compression settings.

## Config Overview (`dmtool.config.json`)

- `elementId`: DMT element inscription id to reference (e.g., `<TXID>i0`). Included for downstream DMT JSON authoring (dmtool does not consume it during build). Default here points to the Natcats element: `af328dc8cb5955c7f9e3db10ce3bd295f8e6974a7c7af456d1beefb702b04c33i0` whose content is "3b.3b.11.element".
- `strategy`: default `natcats` (block‑driven gates). You can add your own.
- `layers`: describe categories and folders you want to pack (see example created by `init`).
- `render`: width and brand overlay options. Default width is 400 px. If compression is enabled, the build tries multiple profiles (AVIF for complex layers at tuned quality, PNG‑8 for flat line art, basE91 packing) to keep the output under 350 KB. If it cannot, it warns and you should simplify assets or reduce width (design your layers with the 350 KB cap in mind).
- `weightsPath`: path to your `weights.json` file.
- `ordTapHost` (optional): default ord‑tap base URL for `dmtool analyze`. If omitted, `analyze` will require `--host`.

Compression:
- `compression`: knobs to steer the encoder.
  - `enabled` (boolean): when `true`, apply compression (heuristics or your `profiles`). When `false`, encode conservatively (PNG), do not auto‑degrade, and warn if size > cap.
  - `maxKB` (number): inscription size target (default 350). The builder picks the first attempt ≤ `maxKB`.
  - No auto-tune: The builder does not brute-force combinations. Provide explicit `profiles` (and optional `overrides`) to meet the target; if none meet `maxKB`, it warns and keeps the last attempt.
  - `profiles` (array, optional): ordered attempts with fields:
    - `W`: render width for this attempt, or `"inherit"` to use `render.width` from the top-level config.
    - `BG_Q`: AVIF quality for background‑like folders.
    - `FG_Q`: AVIF quality for foreground folders.
    - `OUT_COL`: PNG‑8 palette size for outlines/lines.
    - `BRAND_COL`: PNG‑8 palette size for brand overlay.
    - The first attempt that yields size ≤ `maxKB` is selected.
  - `widths` (array, optional): if no `profiles`, provide candidate widths and the builder will try sensible quality tiers per width.
  - `overrides` (object, optional): force encoders per folder key or suffix.
    - Keys: exact folder key (e.g., `"main.f4"`) or suffix style (e.g., `".outline"`, `".bg"`).
    - Values: `{ kind: "avif"|"png8"|"png", q?: number, quality?: number, colors?: number }`.
    - Use this when your folder keys aren’t semantic (e.g., `f1..f8`).
  - `brand` (object, optional): `{ colors: number }` to set PNG‑8 palette size for brand overlay.
  - CLI overrides: `--compress` / `--no-compress` / `--compression true|false` / `--maxKB <number>`.

Compression Quickstart (no config)
- Turn it on: set `compression.enabled=true` (or run `dmtool build --compress`).
- You don’t need profiles or overrides to get a big size reduction — the builder tries sensible default attempts using your `render.width` and adjusts encoder choices heuristically:
  - Keys containing “outline” or “line” → PNG‑8 (good for line art)
  - Keys containing “.bg” or “background” → AVIF at lower quality (backgrounds)
  - Everything else → AVIF at foreground quality
- If your folder keys are generic (e.g., `f1..f8`), heuristics may not match; it will still compress significantly, but you can improve results with minimal overrides (e.g., map your background folder to AVIF and your outline folder to PNG‑8).
- For tighter control or guaranteed cap compliance, add one or two `profiles` and (optionally) a simple fallback (e.g., `W: 400` → `W: 360`).

Example (created by `init`):

```
{
  "elementId": "<INSCRIPTION_ID>",
  "strategy": "natcats",
  "layersRoot": "./layers",
  "category": "main",
  "folders": [
    { "key": "bg", "path": "main/1" },
    { "key": "base", "path": "main/2" },
    { "key": "jacket", "path": "main/3" },
    { "key": "outline", "path": "main/4" },
    { "key": "hand", "path": "main/5" },
    { "key": "eyes", "path": "main/6" },
    { "key": "head", "path": "main/7" },
    { "key": "overlay", "path": "main/8" }
  ],
  "render": {
    "width": 400,
    "brand": { "path": null, "width": 40, "opacity": 1.0 }
  },
  "compression": {
    "enabled": true,
    "maxKB": 350,
    "profiles": [
      { "W": 400, "BG_Q": 28, "FG_Q": 68, "OUT_COL": 12, "BRAND_COL": 6 }
    ],
    "overrides": {
      "main.f1": { "kind": "avif", "q": 10 },
      "main.f4": { "kind": "png8", "colors": 12 }
    },
    "brand": { "colors": 6 }
  },
  "weightsPath": "./weights.json",
  "ordTapHost": "http://localhost:4444"
}
```

## Weights (`weights.json`)

Overview
- Optional file that assigns each image to a rarity group and a weight (bias). If it’s missing, the build still works: every file is treated as `{ group: "common", w: 1 }`.
- Folder rules (gates) and weights work together:
  - Gates decide which groups are allowed for a given block (e.g., allow `rare` or `mythic`).
  - Within the allowed groups, weights determine which file is picked (deterministic to the block).

Groups
- Allowed group names are: `common`, `uncommon`, `rare`, `mythic` (case‑sensitive).
- If a group isn’t allowed by gates for a block, files in that group are excluded from the pick for that render.

Key mapping
- Keys must match your config folder keys exactly using the format `<category>.<key>` from `dmtool.config.json`.
  - Example with semantic keys: `main.bg`, `main.outline`, …
  - Example with generic keys: `main.f1`, `main.f4`, …
- Filenames must be basenames (no paths), e.g., `background-1.png`.

Example (semantic keys)
```
{
  "main.bg": {
    "background-1.png": { "group": "common",   "w": 5 },
    "background-17.png": { "group": "mythic",  "w": 1 }
  },
  "main.outline": {
    "Line-1.png": { "group": "common", "w": 1 },
    "Line-4.png": { "group": "rare",   "w": 1 }
  }
}
```

Example (generic keys f1..f8)
```
{
  "main.f1": {                       // background folder (main/1)
    "background-1.png": { "group": "common",  "w": 5 },
    "background-17.png": { "group": "mythic", "w": 1 }
  },
  "main.f4": {                       // outline/line folder (main/4)
    "Line-1.png": { "group": "common", "w": 1 },
    "Line-4.png": { "group": "rare",   "w": 1 }
  }
}
```

Troubleshooting
- If minted‑set `simulate` shows `gatePercents.rare > 0` but `counts.rare = 0` in a folder, your weights likely didn’t match keys/filenames. Check that:
  - The weights key equals `<category>.<key>` from your config (e.g., `main.f4`).
  - The filename matches the basename on disk (case‑sensitive).
- If `weights.json` is missing or a file isn’t listed, it defaults to `{ group: "common", w: 1 }`.
 - To validate mapping and generate a skeleton for missing entries, run: `dmtool weights:validate` (or `npm run weights:validate`). It writes `out/weights-skeleton.json` and a summary report in `out/weights-validate.json`.

## Strategies

- `natcats` (default): gate groups using simple signals from the mint block (palindromes, perfect squares, trailing zeros, runs, rare prime tails, mod hooks). Deterministic hash controls per‑folder picks.
- Custom strategies: drop a new module in `src/strategies/` and set `strategy` in the config.

## CLI

- `dmtool init` (interactive)
- `dmtool build [--config ./dmtool.config.json] [--out ./out/renderer.html]`
- `dmtool simulate [--sample 20000] [--start 600000] [--end 900000] [--config ./dmtool.config.json]`
- `dmtool simulate --ticker dmt-natcats [--host http://localhost:4444] [--unique true|false] [--config ./dmtool.config.json]`
- `dmtool analyze [--ticker dmt-natcats] [--host http://localhost:4444]`
- `dmtool dmt:deploy-template [--config ./dmtool.config.json] [--tick NAME] [--renderer <INSCRIPTION_ID>] [--prv <INSCRIPTION_ID>] [--out ./out/dmt-deploy-template.json]`
- `dmtool dmt:mint-template [--dep <DEPLOY_INSCRIPTION_ID>] [--tick NAME] [--blk <BLOCK_HEIGHT>] [--out ./out/dmt-mint-template.json]`
- `dmtool weights:validate [--config ./dmtool.config.json] [--out ./out/weights-skeleton.json]`

## DMT Templates (Manual Update Required)

dmtool can write JSON templates for deploy and mint. These are scaffolds — you must replace the placeholder values enclosed in angle brackets `<...>` with your real inscription ids and values before inscribing.

- Deploy template (`dmt:deploy-template`)
  - Fields:
    - `elem`: set to your element inscription id (e.g., `<ELEMENT_INSCRIPTION_ID>`).
    - `tick`: ticker name (e.g., `gibnat`).
    - `dt`: `"h"` for HTML renderers.
    - `id`: renderer inscription id (e.g., `<RENDERER_INSCRIPTION_ID>`).
    - `prv` (optional): privilege authority inscription id. If you set `privilegeAuthId` (or `prv`) in `dmtool.config.json`, it is included automatically; you can also pass `--prv` to override. If not provided, `prv` is omitted.
  - Command example:
    - `dmtool dmt:deploy-template --tick gibnat --renderer <RENDERER_INSCRIPTION_ID>`
    - Then open `dmtool/out/dmt-deploy-template.json` and replace any remaining `<...>` placeholders.

- Mint template (`dmt:mint-template`)
  - Fields:
    - `dep`: your deploy inscription id (`<DEPLOY_INSCRIPTION_ID>`)
    - `tick`: your ticker (e.g., `gibnat`)
    - `blk`: chosen block height (`<BLOCK_HEIGHT>`) — this is what the renderer will read to derive traits.
  - Command example:
    - `dmtool dmt:mint-template --dep <DEPLOY_INSCRIPTION_ID> --tick gibnat --blk <BLOCK_HEIGHT>`
    - Replace the `<...>` placeholders with real values before inscribing.
  - Loader behavior (Natcats-style): the renderer reads the mint id from `<script id="preview" mint="<INSCRIPTION_ID>"></script>`. If the attribute contains the placeholder, it shows the blk input (preview mode). Otherwise it fetches `/content/<INSCRIPTION_ID>`, parses the JSON, and renders using the `blk` field.

Notes
- Placeholders are intentionally rendered as strings in angle brackets (`"<...>"`) to make the fields you must update obvious.
- `prv` refers to the “privilege authority” inscription id. If set in config as `privilegeAuthId` (or `prv`), it is added to the deploy template; otherwise it is omitted. You can also pass `--prv` on the CLI to include it.

## On‑Chain Deployment (Deploy + Reveal)

This outlines how to take your built renderer and ship a collection on Bitcoin L1 using DMT UNAT (via ord‑tap).

1) Build and inscribe the renderer
- Build your artifact: `npm run build` (or `npm run build:compress`)
- Find the file at `dmtool/out/renderer.html`.
- Inscribe the contents of `renderer.html` with your wallet (the address that will own the deployment). Save the resulting renderer inscription id.

2) Create the deploy inscription
- Generate a deploy JSON template: `dmtool dmt:deploy-template --tick <TICKER> --renderer <RENDERER_INSCRIPTION_ID>`
- Open `dmtool/out/dmt-deploy-template.json` and replace any `<...>` placeholders (e.g., `<ELEMENT_INSCRIPTION_ID>` if you left it as a placeholder).
- Important: If you want to delay reveal (hidden art at first), omit the `id` field entirely in the deploy JSON before inscribing the deploy. If you want instant reveal, keep the `id` field set to your renderer inscription id.
- Inscribe the deploy JSON with the same wallet used for the renderer.

3) Reveal later (optional)
- To reveal later, re‑inscribe the same deployment (same `tick`, same `elem`, same owner wallet) but this time include the `id` field set to the renderer inscription id.
- The deploy inscription and the renderer inscription must be controlled by the same wallet for the reveal to be accepted by indexers.

4) Wallet ownership rule
- The deploy (initial) and the reveal (re‑inscription) must be made from the same wallet address. The renderer HTML inscription must also be owned by this wallet.

## Minting

Basic mint
- Each mint is a separate `dmt-mint` JSON inscription that references your deploy and chooses a block height (`blk`).
- Generate a template: `dmtool dmt:mint-template --dep <DEPLOY_INSCRIPTION_ID> --tick <TICKER> --blk <BLOCK_HEIGHT>`
- Replace the `<...>` placeholders and inscribe.
- The on‑chain renderer reads `blk` from the mint JSON at runtime and renders deterministically.

Using privilege‑auth (gated minting)
- If you intend to gate mints (e.g., holder checks, burns) create a `privilege-auth` inscription with your policy off‑chain and include its inscription id in deploy as `prv`.
- In `dmtool.config.json`, set `privilegeAuthId` (or pass `--prv` when generating the deploy template). The `prv` field is optional; it is included only when provided.
- Your backend/service should validate eligibility, issue privileges, and coordinate wallet inscription flows according to your rules. The `prv` field in the deploy signals indexers that a privilege authority exists for mints.

Notes
- Templates created by `dmtool` contain `<...>` placeholders you must replace manually before inscribing.
- The `tick` (ticker) is your collection name. The `elem` (element id) must be the DMT element inscription id you reference.
- For reveal‑later flows, first deploy without `id`, then re‑inscribe the deploy with `id` once ready to reveal, always from the same wallet, and with the renderer inscription owned by that wallet.

## Roadmap

- Expose encoder and palette knobs per folder in config.

## Notes

- dmtool ships with no art. All assets are read from your local `layersRoot`.
- Distribution checks require a running ord‑tap instance (or a public one) you control. See https://github.com/Trac-Systems/ord-tap
- The default `elementId` and strategy mirror Natcats principles without including any Natcats art.
- Heuristics rely on semantic folder keys (e.g., `bg`, `outline`). If you use generic keys (`f1..f8`), set `compression.overrides` to steer encoders (e.g., force outlines to `png8`, backgrounds to `avif`).

## License

You own your art. dmtool is a helper to structure, pack, and verify distributions.