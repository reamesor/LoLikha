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

## Deploy on GitHub + Vercel

### 1. Create a GitHub repo and push

- On [GitHub](https://github.com/new), create a **new repository** (e.g. `oci-website`). Do **not** add a README or .gitignore (you already have them).
- In this project folder, add the remote and push:

```bash
cd "/Users/sor/Documents/Cursor Apps/Lolikha"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

(Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.)

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).
2. Click **Add New…** → **Project**.
3. **Import** your GitHub repository (e.g. `oci-website`).
4. Leave settings as-is: **Framework Preset:** Other, **Root Directory:** default, **Build Command** and **Output Directory** empty.
5. Click **Deploy**. Your site will be live at `https://your-project.vercel.app`.

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
# LoLikha
