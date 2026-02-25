# Outsource Consultants, Inc. — Website

Static site clone of the [OCI website](https://oci.madebybuzzworthy.com/) (Outsource Consultants, Inc.): building codes, zoning, permits, and expediting in NYC.

## Stack

- Plain HTML, CSS, and JavaScript
- No build step; ready for static hosting
- WebGL dither effect on homepage (Bayer ordered dither)
- Custom cursor and vertical milestone scroll effects

## Run locally

```bash
# From project root
python3 -m http.server 8787
```

Open [http://localhost:8787](http://localhost:8787).

## Deploy on Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), **Add New Project** → Import your GitHub repo.
3. Leave **Build Command** and **Output Directory** as default (or set Root Directory to `.` and leave framework as Other).
4. Deploy. Vercel will serve the static files from the repo root.

## Structure

- `index.html` — Home (hero, services, process, projects, testimonials, news)
- `about.html`, `contact.html`, `clients.html`, `culture-careers.html`
- `services/` — Services index + per-service pages
- `projects/` — Projects index
- `blog/` — Blog / news index
- `css/styles.css` — Shared styles
- `js/main.js` — Cursor, milestone scroll, nav toggle, testimonial slider

## License

Clone for reference/portfolio. Original design and content: Outsource Consultants, Inc. / [Made by Buzzworthy](https://oci.madebybuzzworthy.com/).
