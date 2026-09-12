# <img src="./assets/brand.svg" width="34" height="34" alt="Super Adblock icon"> Super Adblock

> **Quiet web. Clear signal.**

Super Adblock is a standards-based Manifest V3/WebExtensions blocker for ads,
trackers, and annoying overlays. It combines official Declarative Net Request
(DNR) rules with a lightweight, targeted cosmetic engine. No stealth, DRM
changes, session theft, premium spoofing, anti-adblock bypass, or remote
JavaScript execution.

<p align="center">
  <img src="./assets/filter-flow.svg" alt="Animated Super Adblock filtering flow" width="900">
</p>

## What ships in v1

| Surface | Included |
| --- | --- |
| Network layer | Ads, trackers, annoyances, custom rules |
| Cosmetic layer | Generic selectors, targeted dynamic cleanup |
| YouTube | Dedicated selectors, SPA navigation hooks |
| Controls | Global toggle, per-site toggle, whitelist-ready storage |
| Observability | Local blocked-request counter |
| Performance | Debounced observer; only changed DOM nodes are processed |
| Safety | Malformed custom rules are ignored instead of crashing the engine |

## Browser support

- Firefox (WebExtensions)
- Chrome, Edge, Brave, and Opera (Chromium MV3)

Chromium browsers use the Chrome MV3 manifest because their extension APIs are
compatible. Builds are intentionally unpacked so each browser can load them
through its official developer-extension flow.

## Download

Get signed release assets from the
[v1.0.0 release page](https://github.com/dikaofc/super-ads-blocker/releases/tag/v1.0.0):

- `super-adblock-firefox-v1.0.0.zip`
- `super-adblock-chrome-v1.0.0.zip`
- `super-adblock-edge-v1.0.0.zip`
- `super-adblock-brave-v1.0.0.zip`
- `super-adblock-opera-v1.0.0.zip`

## Build locally

Requires Node.js 18 or newer. No runtime package dependencies are required.

```powershell
npm run build
```

Output:

```text
dist/
├── firefox/
├── chrome/
├── edge/
├── brave/
└── opera/
```

Create release archives:

```powershell
New-Item -ItemType Directory -Force release
Compress-Archive -Path dist\firefox\* -DestinationPath release\super-adblock-firefox.zip
Compress-Archive -Path dist\chrome\* -DestinationPath release\super-adblock-chrome.zip
```

## Architecture

```text
request ──▶ Declarative Net Request ──▶ block / allow
   │
DOM ──────▶ targeted cosmetic engine ──▶ remove / observe
                              ├── generic rules
                              └── YouTube adapter
```

The content engine never rescans the entire page for every mutation. It
debounces mutation batches, processes only added element nodes, and uses
targeted selectors. Site delivery changes over time, so the YouTube adapter and
rule packs are deliberately easy to update.

## Project layout

```text
src/
├── background/   DNR lifecycle, messaging, custom rules, stats
├── content/      cosmetic filtering and targeted mutation observer
├── sites/        site adapters, including YouTube SPA hooks
└── shared/       browser API, storage, and utilities
rules/            network and cosmetic rule packs
popup/            custom dark-glass popup UI
options/          custom control-room UI for custom rules
assets/           animated SVG brand and architecture artwork
```

## Design principles

- Use official extension APIs and least-privilege behavior.
- Keep blocking aggressive while keeping DOM work bounded.
- Keep settings and counters local by default.
- Surface failures instead of silently converting them into success.
- Make filter updates maintainable as website markup changes.

## License

This project is distributed for personal and educational use. Review and adapt
the bundled rules for the sites and jurisdictions where you use the extension.
