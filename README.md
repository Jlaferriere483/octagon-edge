# Octagon Edge — iPhone PWA prototype

## What's working in v0.3
- Mobile-first fighter comparison screen.
- Baseline win-probability estimate based on entered stats.
- American-odds conversion and no-vig market comparison.
- Save and grade predictions; calculate simple historical accuracy.
- CSV fighter import (including optional promotion label), CSV template download, prediction export.
- Multi-promotion fighter search through Fight Forensics when you supply a free API key, plus a best-effort UFC community API fallback. Imported profiles show their data source and available promotion label.
- Local browser storage and service-worker offline caching.

## Important limitations
- The three bundled fighter profiles are explicitly illustrative demo data, not real fighter records.
- The probability formula is a transparent baseline, not a trained or validated model.
- Multi-promotion search requires a free Fight Forensics API key (request it at https://fightforensics.com/docs) and a visible attribution link, included in the app. The key is entered into the browser and sent directly to that provider; there is no Octagon Edge backend. The UFC community fallback may fail due to service availability or API changes.
- Search results are not a complete automatic database sync. This prototype imports profiles on demand; fighter histories, duplicate reconciliation, scheduled refresh, and a persistent shared database remain future work.
- Prediction grading currently tracks winner-only accuracy. It does not yet calculate calibration, log loss, ROI, or method/round accuracy.
- Local data stays in the browser on this device; it does not sync across devices.

## Install on iPhone
A Progressive Web App must be hosted at an HTTPS address to install reliably.
1. Upload the contents of this folder to an HTTPS static host (for example, a private GitHub Pages project or a static hosting service).
2. Open the deployed URL in Safari on the iPhone.
3. Tap Share → Add to Home Screen → Add.
4. Launch from the new home-screen icon.

Opening `index.html` directly from Files is useful for a quick preview, but does not provide full PWA install/offline behavior.

## CSV import format
Required: `name`. Supported optional columns:
`wins, losses, draws, sig_strikes_landed_per_min, sig_strikes_absorbed_per_min, striking_accuracy, striking_defense, takedown_avg_per_15, takedown_accuracy, takedown_defense, submission_avg_per_15, reach_in, age, recent_form`

- Accuracy/defense may be `0.48` or `48`.
- `recent_form` is a simple 0–1 input where 1 is strongest; define it consistently if using it.
- Stats definitions vary by provider. Normalize units and missing values before importing.

## Recommended production architecture
- iPhone PWA frontend (this folder).
- Backend API proxy for provider credentials, caching, data normalization, and rate limits.
- Data provider for fighter profiles, historical bout stats/results and odds.
- Versioned model service; train/test chronologically on past fights, avoid future-data leakage, calibrate probabilities, and track Brier score/log loss alongside accuracy.
- Database for fighter profiles, bouts, odds snapshots and prediction snapshots.

## Multi-promotion data source
- Fight Forensics: https://fightforensics.com/ and https://fightforensics.com/docs — broad public-record MMA coverage, free API key requires attribution/link. Check its current terms before any commercial release.
- UFC-focused community fallback: https://github.com/malichetty/ufc-stats-api — availability/schema can change and it is described as personal/non-commercial use.

## Candidate data sources to evaluate
- FighterAPI: https://fighterapi.com/docs/atlas
- UFCalendar: https://api.ufcalendar.com/docs
- Sportradar MMA: https://developer.sportradar.com/mma/reference/mma-overview

Check pricing, historical coverage, odds availability, data license and permitted caching/display before committing.
