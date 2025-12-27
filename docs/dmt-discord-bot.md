# DMT Discord Bot

> Distribute and sell DMT collectibles on TAP Protocol directly from your Discord server.

---

## What It Does

- Issues signed `dmt-mint` inscriptions for your DMT collection when users send a qualifying amount of your TAP token to your receive address.
- Presents Tapalytics inscription links to users via slash commands (no site required).
- Works with any DMT collection and any TAP token — fully configurable.
- Can be used to sell DMT collectibles for TAP-based tokens such as USDT, TAP, NAT, or your own project token.
- Distributes right inside your Discord community for higher engagement and retention.
- No front-running; low-cost minting flow by design.

---

## Key Features

- Per-block scan with confirmations and pagination (ord-tap based)
- Deterministic DMT block assignment from a valid block pool (no reuse)
- TAP privilege signing (compact signature + recid) with local key file
- “Minted ✅” indicator (on-chain verification by DMT block)
- One-time pre-signing for reserved/partner allocations
- SQLite or JSON storage (auto-safe fallback; no accidental resets)

---

## Stack Requirements

- TAP Protocol: privilege authority + DMT collection
  - Specs: https://github.com/Trac-Systems/tap-protocol-specs
  - Boilerplate (authority + tooling): https://github.com/Trac-Systems/tap-protocol-privilege-auth-boilerplate
    - Generates the authority keypair (use as `work/prv.key`).
    - After inscribing `privilege-auth`, “tap” it (send to yourself) to confirm/activate.
  - You need both: a `privilege-auth` inscription and a `dmt-deploy` inscription.
- ord-tap indexer (HTTP API): https://github.com/Trac-Systems/ord-tap
  - Bot reads transfers, mint sets, and chain head via REST.
- DMT art/rendering tool (renderer + rarity + minted-set)
  - dmtool: https://github.com/Trac-Systems/dmtool
  - Use it to build your renderer and (optionally) derive `work/valid-blocks.json`.

---

## Discord Setup

1) Create an application at https://discord.com/developers/applications
2) Add a Bot user and copy the Bot Token into your config.
3) OAuth2 → URL Generator: select scopes `bot` and `applications.commands`. Invite the bot to your server.
4) Intents: none beyond defaults are typically required (slash commands only).

- Global vs Guild commands
  - Omit `guildId` to register commands globally (propagate in minutes). Use for production.
  - Set `guildId` to register for a single server (instant). Use for development.

---

## Configuration

Copy `config.dmtdiscord.json-dist` → `config.dmtdiscord.json` and fill these fields:

- Discord
  - `discord.token`, `discord.applicationId`, optional `discord.guildId`, `discord.pageSize`
- ord-tap
  - `ordTap.host`, `ordTap.tokenTicker`, `ordTap.dmtTicker`, `ordTap.receiveAddress`
  - `ordTap.unitAmount` (per-mint amount) and `ordTap.decimals`
  - `confirmations`, `paginationMax`, and `paths` (match your ord-tap version)
- DMT / Signing
  - `deploy.deployInscriptionId`, `deploy.privilegeAuthInscriptionId`
  - `signing.keyFile` → JSON `{ "key": "<hex_priv>", "pub": "<hex_pub>" }`
- Valid blocks
  - `blocks.validBlocksPath` (default `work/valid-blocks.json`)
  - Optional: `blocks.source: "fetch"` with `ordTap.dmtComparisonTicker` to auto-populate
- Pre-sign (optional)
  - `preSign.assignments: [{ address, count }]` — runs once at startup when total count > 0

> Secrets live in `config.dmtdiscord.json` and `work/prv.key`. Both are git-ignored by default.

---

## Install & Run

- Install dependencies:

```sh
npm install
```

- Register slash commands:

```sh
# Development (guild-only, instant)
# set discord.guildId in config, then
npm run register

# Production (global, allow a few minutes to propagate)
# remove discord.guildId in config, then
npm run register
```

- Start the bot:

```sh
# TypeScript dev
npm run dev

# Build + run
npm run build
npm start
```

---

## Commands

- `/help` — How to qualify, confirm, and inscribe (with entitlement rules).
- `/explorer` — Link to your collection on Tapalytics.
- `/mint dmt_block=<n>` — Tapalytics link for a specific DMT block (if this bot signed it).
- `/mints address=<btc>` — Paginated list of signed mints for an address.
- `/status` — Last processed height and total signed mints.

### Announcements (Mint Progress)

Keep your community informed on real, on-chain mint progress so they avoid overpaying.

What it does
- Posts a periodic “Mint Progress — dmt-<ticker>” update to a chosen channel.
- Delta-only trigger: it posts only when the on-chain minted total increases since the last post.
- Shows supply cap based on the minted-set size of the comparison ticker (`ordTap.dmtComparisonTicker`, defaults to `dmt-natcats`). Display-only; does not enforce a cap.

What it posts
- Minted: `<total> (+<delta>)` where delta is the increase since the last post.
- Remaining: `<cap - total> of <cap>` (if comparison cap available).
- Explorer link (Tapalytics) when enabled.
- Optional warning text (e.g., “Send exact units; overpays cannot be refunded.”).
- Embed or plain text, based on config.

Requirements
- Channel must be a standard Text Channel.
- Permissions for the bot in that channel:
  - `Send Messages` (always)
  - `Embed Links` (if `embed: true`)

Configuration
- Add the `announcements` block to `config.dmtdiscord.json`:

```jsonc
{
  "announcements": {
    "enabled": true,                    // turn announcements on
    "channelId": "<DISCORD_TEXT_CHANNEL_ID>",
    "intervalMinutes": 15,              // check cadence (posts only on delta)
    "minDelta": 1,                      // minimum increase required to post
    "embed": true,                      // use embeds (needs Embed Links permission)
    "includeExplorer": true,            // include Tapalytics collection link
    "includeWarning": false,            // optional warning line
    "warningText": "Send exact units; overpays cannot be refunded.",
    "displaySupplyCap": true            // show cap/remaining from comparison ticker
  }
}
```

Notes
- On-chain minted total is queried for `dmt-<dmtTicker>`; delta is based on that, not signed JSONs.
- The supply cap is computed each time from `ordTap.dmtComparisonTicker` (defaults to `dmt-natcats`). If the comparison fetch fails, the bot still posts without a cap.
- Restart the bot after changing announcement settings so the scheduler picks them up.

Troubleshooting
- No post appears:
  - Verify the channel is a text channel and the bot has `Send Messages`.
  - If `embed: true`, also grant `Embed Links` in that channel.
  - Confirm there are on-chain mints for your collection: `/r/tap/getTickerMintListLength/dmt-<dmtTicker>` should be > 0.
  - Ensure your `channelId` is correct and the bot is present in that channel.
  - Restart the bot after config changes.

Simulation (local, no Discord API)
- Run: `npm --prefix discord-bot run simulate:announce`
- Prints the exact payload the bot would send (embed or plain) without contacting Discord.
- Uses mocked on-chain totals (e.g., minted=123, cap=8064) and your current announcement settings.
- Helpful to verify formatting and delta logic independently of permissions/channel setup.

---

## How It Works

- Scan transfers per block (with confirmations) → count eligible sends to your receive address.
- Entitlement: `floor(amount / unitAmount)` per tx; remainders ignored.
- Pick a unique DMT block from `work/valid-blocks.json` (or fetched set), never reuse.
- Sign a `dmt-mint` with your privilege authority key; persist and display Tapalytics links.
- Check on-chain status of each DMT block and annotate `/mints` with “Minted ✅”.

---

## Reset & Re-index

- Reset state (JSON backend file) and re-index from a specific block:

```sh
npm run reset:state -- --from <block>
```

- Resets `work/bot.json` height/sequence; clears mints, events, used blocks.

---

## Reconcile Missing Mints (Address‑Only)

Use this when a sender’s transfers were detected on‑chain but the bot did not sign the full entitlement (e.g., due to a past bug or config change). Works with JSON and SQLite stores.

What it does
- Scans ord‑tap for the given address over a block lookback window.
- Counts entitlement per transaction: `floor(sum(amt)/unitAmount)` (uses your `ordTap.unitAmount` and `decimals`).
- Compares to store issuance per `(txid::from)` and computes the missing count.
- Apply mode: signs exactly the missing mints and updates issuance counters; nothing else is touched.

Safety
- Stop the running bot before applying to avoid race conditions.
- Snapshot `work/bot.json` or `work/bot.sqlite` before changes.
- Block selection for the new mints is random from the comparison minted‑set (`ordTap.dmtComparisonTicker`), excluding already minted and locally used blocks.

Usage
- Dry run (audit only):
  - `npm --prefix discord-bot run reconcile:address -- --address <btcAddress> [--lookback 200] [--to <block>]`
- Apply missing mints for that address only:
  - `npm --prefix discord-bot run reconcile:address -- --address <btcAddress> [--lookback 200] [--to <block>] --apply`

Notes
- `lookback` scans that many blocks ending at `head - confirmations` by default; use `--to` to cap the upper bound.
- Uses your configured `unitAmount` (e.g., `5000`) and `decimals` to compute units.
- Updates only the target address’ issuance counters and mints; does not change `last_processed_height`.

Examples
- Audit recent 400 blocks ending near 918900:
  - `npm --prefix discord-bot run reconcile:address -- --address bc1... --lookback 400 --to 918900`
- Apply the exact shortfall found by the audit:
  - `npm --prefix discord-bot run reconcile:address -- --address bc1... --lookback 400 --to 918900 --apply`

---

## Replace Collided/Unusable Assignments (Per Address)

When a previously sent JSON points to a DMT block already minted by someone else (collision), you can issue a replacement without changing entitlement.

- Add collided replacements to a reconcile run (keeps under‑issue logic):
  - Dry run: `npm --prefix discord-bot run reconcile:address -- --address bc1... --lookback 500 --include-collisions`
  - Apply:   `npm --prefix discord-bot run reconcile:address -- --address bc1... --lookback 500 --include-collisions --apply`

If the collided JSON was not saved in the store (off‑store pre‑sign), use the manual replacement helper below.

Manual replacement (no entitlement change)
- Dry run N replacements:
  - `npm --prefix discord-bot run issue:address -- --address bc1... --count N`
- Apply N replacements (stop the bot first):
  - `npm --prefix discord-bot run issue:address -- --address bc1... --count N --apply`

Notes
- Replacements draw blocks from the comparison minted‑set, excluding on‑chain minted and locally used blocks.
- `issue:address` does not modify issuance counters; it only inserts signed mints and marks blocks used.

---

## Audit Window (Last 500 Blocks)

Write a JSON summary of recent under‑issued addresses (by sends) and any detected collisions.

- Run:
  - `npm --prefix discord-bot run audit:window`
- Output:
  - `work/reconcile-audit.json` — underIssued + collisions with minimal details
- Optional flat lists (for copy/paste testing):
  - `work/reconcile-underissued.txt` — one address per line
  - `work/reconcile-collisions.txt` — one address per line

---

## Security & Git Hygiene

- Never commit `config.dmtdiscord.json` or `work/prv.key`.
- `work/` is ignored except `work/valid-blocks.json` (kept if you want deterministic distribution tracked).
- SQLite files and WAL/SHM are ignored.

---

## Notes

- No L1 Bitcoin spend keys are ever held by the bot; it only signs TAP privilege for mints.
- ord-tap pagination is required (`max`/`offset`); ensure your `paths` match your ord-tap version.

---

## License

Apache 2.0 — see `LICENSE.md` in this folder.