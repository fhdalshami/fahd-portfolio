# Fahd Al-Shami – Portfolio

Personal portfolio: iOS (Swift) & .NET developer. Static site, no build step.
All content (text, sections, experience, projects, images, contact card) is loaded from **Supabase**;
the text inside `index.html` is only a fallback if Supabase is unreachable.

## Structure
```
index.html            page structure + fallback content
css/style.css         all styling (colors and font are variables at the top)
js/config.js          Supabase URL/key, Formspree ID, fallback email  (loaded first)
js/menu.js            mobile menu
js/tenure.js          fallback work-duration text
js/email-copy.js      copy email on desktop
js/contact-form.js    contact form (Formspree)
js/typewriter.js      typing effect on the headline
js/card.js            contact card popup + save/share as image
js/data.js            loads everything from Supabase (loaded last)
assets/               logo, memoji, favicon, social preview image
Fahd-Al-Shami-CV.pdf  CV (also linkable from Supabase via site_settings.cv_url)
```

## Run locally
Open `index.html` in a browser (or use any static server).

## Deploy (GitHub Pages)
Upload the whole folder to the repository root, then Settings > Pages > Branch `main` / `/ (root)`.

## When you edit a file
Bump the `?v=` number on its `<link>` / `<script>` tag in `index.html` so browsers don't show a cached copy.

## Before sharing the link
In `index.html` replace `YOUR-USERNAME` (in `og:url` and `og:image`) with your GitHub username or your domain.

## Security
Only the **publishable** Supabase key belongs in this repo. Never commit a `secret` / `service_role` key or the database password.
