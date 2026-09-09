# Flow Physics Lab — website

Static site for the research group of **Dr. Dhiraj V. Patil**, Department of
Mechanical, Materials & Aerospace Engineering, IIT Dharwad. Built as plain
HTML/CSS/JS — no build step required to host.

## Pages
- `index.html` — Home (research themes, stats, join-us)
- `about.html` — About the PI (bio, education, appointments)
- `research.html` — Research themes in detail
- `people.html` — PhD scholars, master's students, postdoc alumni
- `publications.html` — 31 journal papers + chapters/proceedings + presentations, with live search & filter
- `teaching.html` — Courses and teaching philosophy
- `contact.html` — Contact details

## Deploy on GitHub Pages
1. Create a repo named **`<your-username>.github.io`** (for a user site) — or any repo name for a project site.
2. Put every file in this folder (including the `assets/` folder and the hidden `.nojekyll`) into the repo root.
   - Easiest: on GitHub, "Add file → Upload files", then drag the whole contents in.
   - Or with git:
     ```bash
     git init
     git add .
     git commit -m "Flow Physics Lab website"
     git branch -M main
     git remote add origin https://github.com/<your-username>/<repo>.git
     git push -u origin main
     ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick `main` / `root`, Save.
4. Your site appears at `https://<your-username>.github.io/` (user site) or
   `https://<your-username>.github.io/<repo>/` (project site) within a minute or two.

`.nojekyll` is included so GitHub serves the files as-is.

## Editing content
- **Publications** live in `build_site.js` (which reads a `data.js` list). To regenerate
  after edits: `node build_site.js`. If you'd rather not run Node, just edit the
  generated `.html` files directly — they are readable.
- Colours, fonts and layout are all in `assets/css/style.css`.
- The hero flow animation is in `assets/js/site.js` (it automatically turns off for
  visitors who prefer reduced motion).

## Notes / to verify before going live
- A few journal page numbers were provisional in the source CV — check them against the publisher.
- People roster and co-supervisor details are from the PI's records; update as needed.
- Add a `PI photo`, group photos, or a `favicon.ico` if you'd like — drop images in `assets/`.
