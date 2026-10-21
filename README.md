# Free Gate

Free Gate is a static web app that helps people find free-entry sports and community events in Sydney.

## Features
- modern mobile-first home screen
- real-time event list loaded from events.json
- search and filtering by audience
- PWA support
- works on Netlify
- no build step required

## Files
- index.html — homepage
- styles.css — styling
- app.js — data fetching and UI logic
- events.json — all scheduled items
- manifest.webmanifest — installable app metadata
- sw.js — offline caching
- netlify.toml — Netlify configuration
- scripts/validate.mjs — data validation
- icons/icon.svg — app icon

## Local run
Open index.html directly in a browser, or run a local server:

```bash
python3 -m http.server 8000
```

Then visit:
- http://localhost:8000

## Deploy to Netlify
1. Push this repo to GitHub
2. Import the repo into Netlify
3. Use the default settings
4. Deploy

Netlify will use netlify.toml and run the validation command before publishing.

## Update the event list
Edit events.json and commit.

## Add app icon to home screen
On mobile:
- iPhone: open in Safari → Share → Add to Home Screen
- Android: open in Chrome → menu → Install app

## Notes
This is a static app shell designed for future expansion beyond Sydney.
