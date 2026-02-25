# Lolikha — Creative Solutions. Exponential Growth.

Static marketing site for Lolikha: creative web design, AI & SEO integration, social media advertising, and brand marketing. High-contrast design system, JSON-LD schema on every page, and step-by-step process timeline.

## Technical & SEO

- **Design system:** Ultra-modern high-contrast Black/White/Silver; primary hero H1 "Your Mind, Unleashed."; pillars Creative Force (film, events, visual storytelling) and Digital DNA (web, AI schema, SEO). Inter + Montserrat.
- **Layout:** 4-column grid for Services; step-by-step vertical timeline for Our Process (Strategy → Navigation → Results).
- **JSON-LD schema:** Organization, WebSite, and ProfessionalService (or page-specific type) on every page for Google Rich Snippets.
- **Micro-interactions:** Fade-in-up scroll animations (`.animate-in` + IntersectionObserver); magnetic hover on `.btn-magnetic` CTAs.
- **SEO architecture:** Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<nav>`). Use descriptive `alt` on all `<img>` tags when adding real images; project placeholders use `aria-label` for accessibility.

## Stack

- Plain HTML, CSS, and JavaScript
- No build step; ready for static hosting
- `js/main.js`: cursor, milestone scroll, nav toggle, testimonial slider, global fade-in and magnetic CTA

## Run locally

```bash
python3 -m http.server 8787
```

Open [http://localhost:8787](http://localhost:8787).

## Deploy (e.g. Vercel)

Import the repo; use **Framework: Other**, no build command. Static files are served from the project root.

## Structure

- `index.html` — Home (hero, 4-col services, process timeline, testimonials, growth CTA)
- `about.html`, `contact.html` (multi-step form)
- `services/index.html` + `creative-web-design.html`, `ai-seo-integration.html`, `social-media-advertising.html`, `brand-marketing.html`
- `projects/index.html` — Portfolio with before/after metrics
- `blog/index.html` — Latest Insights
- `css/styles.css`, `js/main.js`
