## Healthy Browsing Tampermonkey Scripts

Small Tampermonkey scripts to make browsing more intentional, healthy and wholesome.

Currently included (in `scripts/`):
- `scripts/x-following-only.user.js`: forces the X (Twitter) Home feed to:
  - show **Following** only
  - use **Recent** (chronological, `?f=live`)
  - hide "For you" and the tab header UI
- `scripts/block-sites.js`: hard-blocks a set of distracting news / video / social sites right at `document-start`, replacing them with a simple **"Pause. Will this move you forward?"** page and a **Return** button
- `scripts/friction-timer.js`: adds a **10‑minute delay** before allowing access to selected AI/chat sites (ChatGPT, Claude, Grok, Gemini etc.), then lets you through for a limited time after a deliberate decision

## Install (general)
1. Install Tampermonkey (Chrome)
2. Open the script file you want in your browser:
   - `scripts/x-following-only.user.js`
   - `scripts/block-sites.js`
   - `scripts/friction-timer.js`
3. Tampermonkey will prompt you to install it

## Script details

### `x-following-only.user.js`
- Forces X Home to **Following only**
- Forces timeline to **Recent (`?f=live`)**
- Hides the "For you" tab and related UI chrome

### `block-sites.js`
- Matches a curated list of news/video / distraction domains (G1, UOL, Folha, Estadão, CNN, BBC, Terra, O Globo, YouTube, 4chan and variants)
- Runs at `document-start` and immediately stops page loading
- Replaces the page with a dark, minimal screen:
  - title: **Pause**
  - question: **"Will this move you forward?"**
  - a single **Return** button that just goes `window.history.back()`
- You can optionally allow specific paths by editing the `allowedPaths` array in the script

### `friction-timer.js`
- Targets AI/chat tools:
  - `chat.openai.com`, `chatgpt.com`, `claude.ai`, `grok.x.ai`, `gemini.google.com`
- On first visit:
  - stops page load at `document-start`
  - shows a **Pause** screen with:
    - question: **"Do you really need this right now?"**
    - a countdown timer for **10 minutes**
    - a **"Really go on"** button that appears only after the timer finishes
- When you click **"Really go on"**:
  - stores an "allowed until" timestamp in `localStorage`
  - reloads the page so you can access the site normally
  - future visits within that window skip the delay

## Notes
- X changes its UI often. If `x-following-only.user.js` breaks, open an issue with screenshots / DOM snippet.
- The target site lists and timings in the scripts are meant as defaults; edit the match rules and constants in each script to suit your own habits.

