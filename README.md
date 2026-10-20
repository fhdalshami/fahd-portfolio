# Fahd Al-Shami – Portfolio

Static site built with **Bootstrap 5.3** (local copy), glass UI, dark/light mode (dark by default).
All content (text, sections, experience, projects, skills, images, contact card) is loaded from **Supabase**.
`index.html` is an empty skeleton: if Supabase is unreachable and the visitor has no cached copy, an error message is shown.

## Structure
```
index.html                  page skeleton (no content text)
css/style.css               theme variables (dark/light), glass styles, layout on top of Bootstrap
js/theme.js                 dark/light toggle (loaded in <head>)
js/config.js                Supabase URL + publishable key
js/data.js                  loads and renders everything from Supabase (loaded last)
js/typewriter.js            typing effect on the headline
js/contact-form.js          contact form (Formspree id comes from the DB)
js/email-copy.js            copy email on desktop
js/card.js                  contact card popup + save/share as image
assets/vendor/              bootstrap.min.css / bootstrap.bundle.min.js (v5.3.3)
assets/                     logo, memoji, favicon, social preview image
```

## Database
Tables: `site_settings`, `sections`, `experiences`, `projects`, `education`, `certifications`, `skills`
(see the SQL files you ran in Supabase). Section keys: about, projects, experience, education, certifications, contact.

## Deploy (GitHub Pages)
Upload the **folders and files** (keep the structure) to the repository root, then Settings > Pages > `main` / `/ (root)`.

## When you edit a file
Bump the `?v=` number on its tag in `index.html` so browsers don't show a cached copy.

## Before sharing the link
In `index.html` replace `YOUR-USERNAME` (in `og:url` / `og:image`). The `og:*` tags must stay in the HTML because social crawlers don't run JavaScript.

## Security
Only the **publishable** Supabase key belongs here. Never commit a `secret` / `service_role` key or the database password.
