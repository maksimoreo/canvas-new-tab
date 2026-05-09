# CanvasNewTab

CanvasNewTab is a browser extension that replaces deafult home page with new tab that you can design yourself.

Add this extension to your Chrome browser: https://chromewebstore.google.com/detail/canvasnewtab/afhpmegijccdfofipmlojaoaccibjmnl

See demo on YouTube: https://youtu.be/5hBneRpVfMc

Screenies:

![Screenshoft of minimal-light-rounded theme](docs/minimal-light-rounded.png)

![Screenshoft of dev theme](docs/dev.png)

See sample configurations in ./sample directory.

# Development

```sh
pnpm install
pnpm dev
```

WXT will open a new clean instance of Chrome browser automatically. Here, open a new tab. Prompt will appear notifying you that "This page was changed by "CanvasNewTab" extension". Click "Keep it". Then remove footer by clicking "Cutomize Chrome" -> Footer -> Show footer on New Tab page -> OFF

# Techs

- React
- WXT
- shadcn
- TailwindCSS
- DndKit

# Features

- Replaces browser's default home page
- In-browser home page editor
- Drag, resize, and group multiple items at once
- Multi-item editing tools

# Credits

Icons (SVG) for sample themes were taken from https://simpleicons.org/
