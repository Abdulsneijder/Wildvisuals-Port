# Wild Visuals — Portfolio

Personal portfolio site for **Wild Visuals**, a creative practice specializing in photo retouching, video editing, and graphic design for brands, businesses, and personal projects.

Live site: _add your Vercel URL here once deployed_

## What's inside

A single-page static site built with plain HTML, CSS, and vanilla JavaScript — no build step, no framework, no dependencies.

- `index.html` — page structure and content (hero, about, work gallery, skills, contact)
- `style.css` — all styling, including the color-grade-inspired visual identity (near-black canvas with pink/amber/mint accent gradient)
- `script.js` — interactivity: mobile nav toggle, gallery lightbox, scroll reveal animations, and an ambient mouse-responsive particle field
- `images/` — portfolio photos, logo assets, and the founder photo

## Sections

- **About** — introduces Abdullah "Wild," the person behind the brand, with a short bio and working style
- **Work** — a photo-only gallery of retouching and editing samples, click any image to view full size
- **Skills** — photo retouching, video editing, video annotation, graphic design, photography, presentation design
- **Contact** — email, WhatsApp, LinkedIn, and X links

## Running locally

No build tools required. Either:

1. Open `index.html` directly in a browser, or
2. Serve it locally for a closer-to-production experience:
   ```
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000`

## Deployment

Deployed on [Vercel](https://vercel.com) as a static site — connected directly to this GitHub repo, so every push to `main` auto-deploys.

## Updating the gallery

To swap or add work samples, drop new images into `images/`, then update the corresponding `<img src="...">` and caption inside the `.gallery` section in `index.html`.