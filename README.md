# Octagon Edge v0.4 — multi-promotion MMA analytics prototype

## What's included
- Mobile-first matchup screen and local fighter profile pool.
- Search via Fight Forensics `/api/v1/fighters?q=...` when you add a free API key.
- Best-effort UFC community API fallback; this may fail or change schema.
- CSV import/export for fighter profiles and export of prediction history.
- Stat comparison, transparent baseline probability heuristic, manual American odds comparison, prediction save/grading.
- Local browser storage and PWA manifest/service worker.

## Publish on GitHub Pages
Upload all five files (`index.html`, `styles.css`, `app.js`, `manifest.json`, `sw.js`) to the root of your existing `octagon-edge` repository, replacing files with the same names. Then open Settings → Pages and select `main` and `/(root)`. Once published, open the Pages URL in Safari and choose Share → Add to Home Screen.

## Multi-promotion data
Fight Forensics docs: https://fightforensics.com/docs. Base URL `https://fightforensics.com/api/v1`; search endpoint `GET /fighters?q=NAME&limit=15`; header `X-Api-Key: ff_...`. The free key requires a visible attribution link, which is included in the app. API key is saved in localStorage on this device and sent to the provider directly from the browser. Do not use a private key on a public shared device. Verify provider terms and current coverage before commercial use.

UFC community fallback: `https://ufcapi.aristotle.me/api/fighters?search=NAME&limit=15`; community-maintained and best effort only.

## Honest limitations
- The two bundled profiles are clearly marked illustrative examples; delete/replace them with real profiles from search or CSV.
- Live API calls depend on provider availability, CORS, valid key, terms, and schema. This build has not been verified against your own API key.
- No automatic bulk sync, persistent server database, reliable identity resolution, odds feed, or scheduled updates yet. Profiles/predictions are stored only in the current browser on this device.
- Probability estimate is a simple transparent heuristic, not a trained/backtested prediction model. Do not treat as betting advice.
- Coverage/statistics vary by promotion; unknown values stay blank. Check duplicates and identity before using imported profiles.
