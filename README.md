# Super Adblock

Standards-based MV3/WebExtensions ad, tracker, and annoyance blocker.

## Browser support

- Firefox (WebExtensions)
- Chrome, Edge, Brave, and Opera (Chromium MV3)

Build the browser packages with:

```powershell
npm run build
```

The unpacked builds are written to `dist/<browser>`. Chromium browsers use the
Chrome MV3 manifest because their extension APIs are compatible.
