# Fahd Al-Shami – Portfolio

Static site: **Bootstrap 5.3** (local copy) + glass UI + dark/light mode (dark by default).
All content (text, sections, experience, projects, skills, images, contact card) is loaded from **Supabase**.
`index.html` is an empty skeleton; if Supabase is unreachable and the visitor has no cached copy, an error message is shown.

## Structure
```
index.html                 page skeleton (no content text) + social preview (og:*) tags
css/
  theme.css                dark / light color variables
  base.css                 body, background orbs, typography, glass effect, loading state
  layout.css               navbar, hero, sections, skills marquee, cards, contact, footer
  components.css           buttons, contact-card popup, toast
  accessibility.css        reduced-motion rules
js/                        ES modules (entry: main.js)
  theme.js                 classic script in <head>: sets dark/light before first paint + toggle
  main.js                  entry point: init features, load data, render
  config.js                Supabase URL + publishable key
  state.js                 shared runtime values (email, form id)
  api.js                   Supabase reads + browser cache
  lib/                     dom.js, format.js, toast.js  (small helpers)
  render/                  one file per DB table / UI block (settings, sections, experience, projects, lists, skills)
  features/                nav.js, typewriter.js, contact-form.js, email-copy.js, card.js
assets/                    logo, memoji, favicon, og-image.png (1200x630)
assets/vendor/             bootstrap.min.css, bootstrap.bundle.min.js (v5.3.3)
Fahd-Al-Shami-CV.pdf       CV (link it from site_settings.cv_url)
```

## Database
Tables: `site_settings`, `sections`, `experiences`, `projects`, `education`, `certifications`, `skills`.
Section keys: about, projects, experience, education, certifications, contact.
`site_settings` also controls: `hero_cta1`, `hero_cta2`, `card_greeting`, `show_card` (false hides the card icon).

## Run locally
ES modules need a web server (they don't load from `file://`):
```
python3 -m http.server 8000     # then open http://localhost:8000
```

## Deploy (GitHub Pages)
Upload the folders and files (keep the structure) to the repository root, then Settings > Pages > `main` / `/ (root)`.

## Caching
Bump the `?v=` number on the CSS/JS tags in `index.html` when you change those files. Imported modules
(`js/lib`, `js/render`, `js/features`) are cached by GitHub Pages for about 10 minutes.

## Security
Only the **publishable** Supabase key belongs here. Never commit a `secret` / `service_role` key or the database password.
