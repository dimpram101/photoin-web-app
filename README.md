# PhotoIn Booth App

PhotoIn is a browser-based photobooth web app that lets users choose a strip layout, take a set of photos, apply filters, and export the final photostrip.

## Features

- Choose layout (strip/grid options)
- In-browser camera capture (mobile friendly)
- Countdown timer + full-screen flash effect
- Grid overlay + mirror toggle
- Photo filters (CSS filters)
- Photostrip preview with per-photo delete
- Download photostrip as PNG

## Tech Stack

- Vue 3 + TypeScript
- Vite
- Tailwind CSS
- Pinia + Vue Router
- GSAP (UI animations)

## Notes / Troubleshooting
- If the camera doesn’t open, make sure the browser has camera permission for the site.
- Some mobile browsers require the page to be served from a secure origin to enable `getUserMedia`.
- If download output includes UI controls, ensure export filtering is enabled in the download implementation.
