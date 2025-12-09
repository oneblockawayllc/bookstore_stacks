# STACKS Demo Injector

Console snippet tool for embedding the Discover experience on prospective bookstore websites for sales outreach.

## Purpose

Create screenshots and video demos showing STACKS on a bookstore's actual site (starting with Quail Ridge Books).

## How It Works

1. Paste snippet in DevTools console on target site
2. Floating control panel appears with placement options
3. Click to inject iframe pointing to deployed STACKS `/quail` route
4. Capture screenshots or record video
5. Reset and try different placements as needed

## Placement Modes

| Mode | Description |
|------|-------------|
| Replace Search | Swaps their search bar with STACKS iframe |
| Floating Button | Adds corner button that opens modal with STACKS |
| Inline Section | Injects new section on page with embedded STACKS |

## Fallback

If auto-detection fails for Replace Search or Inline Section, enables manual element picker - click to select target element.

## Config

```javascript
const CONFIG = {
  iframeUrl: 'https://your-app.vercel.app/quail',
  inlineHeight: '500px',
};
```

## Files

- `tools/demo-injector.js` - The console snippet
