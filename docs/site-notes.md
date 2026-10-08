# Adi Rosenstock’s portfolio


## Local preview

```sh
npm run dev
```

Open http://127.0.0.1:4173. There are no dependencies or build step.
`dist/` contains the complete deployable site. Homepage spacing and visual
refinements live in `refinement.css`; edit the files there, then refresh the preview.

## Content sources

- Adi’s `Rosenstock_Adi_Resume.pdf`, updated September 28, 2026: education,
  internship dates, achievements, technical skills, interests, and leadership.
- [GitHub profile](https://github.com/AdiRosenstock) and linked project repositories:
  project descriptions, published code, competition results, and illustrated avatar.
- [LinkedIn](https://www.linkedin.com/in/adirosenstock): publicly indexed education,
  projects, and professional background. Direct full-profile retrieval was
  unavailable; the current résumé takes precedence over older indexed details.
- BanterBoost’s current live homepage, analytics page, and mini-league view:
  product capabilities and fresh screenshots captured October 4, 2026
  (America/Chicago). Its existing About page and approved public assets provide
  the founder biography, football portrait, and logo. The old lineup screenshot
  was replaced after review of the live product.
- Career Agent’s October 8, 2026 public README, design notes, and fictional demo screenshot: The Goat workflow, Codex and Claude Code setup, saved candidate choices, three submission modes, exact-batch approvals, and confirmation evidence. No personal application records appear in the screenshot.
- [Recruiting Agent](https://github.com/AdiRosenstock/Recruiting_Agent) public README: startup-focused discovery, explainable scoring, fact-checked research, and human-reviewed outreach. Its drafts are never sent automatically.
- [README Preview](https://github.com/AdiRosenstock/readme-reader) public source: a single HTML file with GitHub-flavored Markdown preview, local drafts, import, and export. The original HTML is copied into `dist/tools/readme-preview/` as a live demo. Its rendering libraries load from a CDN; the source repository is the canonical place for updates.
- Organization logos supplied by Adi, with official links to Bloomberg, impaKt,
  MusclePoints (now MUSCLE), Vértice, and Hanoar Hatzioni. Role details and dates
  come from the résumé. The Bloomberg experience links to Adi’s supplied
  recommendation letter, bundled as a public PDF in `dist/assets/`.

- Project logos: IMC’s wordmark SVG from [its official site](https://www.imc.com/us),
  Airbnb’s original Bélo SVG from [its Newsroom](https://news.airbnb.com/images/belo.svg),
  and TikiData FC’s profile badge from [its public Instagram](https://www.instagram.com/tikidata.fc/).
  Bundled locally for the homepage previews and project story headers. IMC’s
  single-color wordmark uses ink on the light background; the other marks retain
  their original colors.

Internship results are résumé-reported. The portfolio does not claim that FPL’s
manager population is BanterBoost’s customer count. Trading results are team results.
Adi’s supplied résumé PDF is bundled in `dist/assets/` for the hero’s public
“View résumé” link, as requested. The PDF itself is unmodified.

## Interactions

- A football/tech hero combines pitch markings, a data grid, an animated passing
  pattern, a portrait, and a football visitors can kick.
- The selected-work grid includes Career Agent, IMC Prosperity 3, the Airbnb model,
  DOMUS, and TikiData FC, beneath the featured BanterBoost preview. On pointer
  devices, each card reveals its description and stack on hover or keyboard focus;
  touch layouts show descriptions below the artwork. Each of those five cards
  links to its project page, with a separate source link. The main palette
  uses ink and teal; project previews keep their own colors and imagery.
- The opening shows an animated soccer passing move above Adi’s name and a
  football visitors can kick beside the portrait. Pitch markings connect the
  football and technical sides of the portfolio. The portrait stays steady.
- Homepage scroll entrances use one restrained movement; content reveals once,
  and keyboard focus makes pending content visible immediately. The header
  keeps the motion pause control available throughout the page.
- A persistent pause control and system reduced-motion preference stop ambient motion.
  Pausing also reveals all content immediately. Hero motion pauses offscreen,
  and all content remains visible when JavaScript is disabled.
- The hero cycles between Adi’s supplied matchday photo with his dad and the
  family photo at Cerro Chirripó. Both are copied unchanged into `dist/assets/`.
  Click the photo or its caption control to switch; both controls support keyboard
  activation and the existing motion-aware fade. Handwritten notes and arrows
  link Eitan Rosenstock and Katherine Gutreiman to their LinkedIn profiles, with
  the arrows repositioned for each photo and the mom note only shown on the hike.
  Captions, dimensions, button labels, and alt text update with the photo.
  The crest-kissing stadium photo sits beneath the About me details in the left
  column, with an independent scroll reveal and subtle hover zoom that respects
  motion pause and reduced motion. The professional headshot is no longer used.
  The AI office portrait and its disclosure are no longer used on the homepage.
- Prominent Northwestern and Bloomberg hero buttons open résumé-grounded details.
  BanterBoost retains its existing website link and native detail dialog.
- Career Agent, IMC Prosperity 3, Airbnb classification, DOMUS, and TikiData FC
  have dedicated, shareable project pages. Homepage cards open these pages,
  with direct source/product links retained. Each page includes the project context,
  approach, build details, a key decision, and references for deeper exploration.
  Pages have section navigation, copy-link feedback, and links to the next project.
  Every page respects the shared motion preference and has a pause control.
  Career Agent has a research/preparation/submission packet illustration; IMC has
  switchable strategy sketches; Airbnb illustrates five-fold validation; DOMUS
  switches between guest and host journeys; TikiData has a playable passing move.
  SVG backgrounds and page-specific palettes relate each scene to its project.
  Every story includes a specific reading cue beside its original artifact.
  Interactive illustrations are distinguished from actual project screenshots,
  results, and analysis figures. Content remains visible without JavaScript.
- The projects section ends with a lighter pair of public side builds: Recruiting Agent and the playable README Preview tool.
- Project cards lead with titles and visuals. The About biography is always shown. Role descriptions and leadership
  use native disclosure controls so visitors choose the depth. All toolkit tags are
  visible within their categories, with no extra disclosure controls.
- The homepage hero names software engineering, data science, product management,
  and finance/quant interests. A Reading section lists books Adi supplied; *Good to
  Great* is marked currently reading and *Never Split the Difference* is marked
  as his all-time favorite. Covers come from the Open Library Covers API, with
  original image URLs in `dist/assets/books/sources.json`. The section also
  recommends How to Take Over the World (Ben Wilson) and Founders (David Senra),
  with the Spotify links Adi supplied. Update the reading status when it changes.
- The BanterBoost preview embeds the actual live public analytics and mini-league
  pages, with working view controls and a link to open the selected page. Sign-in
  opens BanterBoost in a new tab. Its origin restriction blocks localhost embeds;
  verify the frame on `https://adirosenstock.github.io` after publishing. Preserve
  the live iframe when changing the portfolio's layout.
- Mobile navigation opens and closes with an accessible toggle and Escape.
- Visitors can write a message in the contact form without leaving the page.
  Name, reply email, and message are delivered to Adi’s Northwestern inbox through
  FormSubmit, with required-field validation, a spam honeypot, send progress, and
  confirmation. A failed or unconfirmed request preserves the typed message and
  offers retry or direct email. Repeated clicks cannot send parallel submissions.
- Direct email and copy remain available as alternative contact options.
- Navigation highlights the section in view; reduced motion disables smooth scrolling.

## Hosting

Hosted on [GitHub Pages](https://adirosenstock.github.io/).
The repository is [AdiRosenstock.github.io](https://github.com/AdiRosenstock/AdiRosenstock.github.io),
which makes GitHub Pages serve the portfolio at the account's root address.
Every push to `main` runs `.github/workflows/pages.yml`, checks the JavaScript,
and prepares `.pages/` from `dist/` with `npm run prepare:pages` before publishing.
Relative asset and navigation paths work at the root without a build dependency.

The generated artifact also retains `/AdiRosenstock.io/` asset paths and redirects
its former HTML routes to the new root, preserving query strings and section
anchors. This keeps existing bookmarks and shared project links working.
`.pages/` is ignored; edit the original files in `dist/`.

For rollback, revert the root-address migration commit, rename the repository back
to `AdiRosenstock.io`, update the local `origin` to that repository, and rerun the
Pages workflow. The rename preserves the repository history and settings.

The HTML references CSS and JavaScript with a 12-character SHA-256 query string.
Refresh each query string when the corresponding file changes so browsers fetch
the matching version after a deployment.

The unused Sites identity in `.openai/hosting.json` is retained for continuity.
GitHub Pages is the live provider. Do not store credentials in files.

## Project pages

The complete static pages live in `dist/projects/<slug>/index.html` and share
`dist/projects.css`, `dist/project-scenes.css`, and `dist/projects.js`.
All five pages also use `dist/motion.css` and `dist/motion.js` for shared interactions.
The scene stylesheet defines each project's visual identity, illustrations,
responsive layouts, and reduced-motion behavior. There is no build step. The preview
server supports directory indexes; use `PORT=4174 npm run dev` for another port.
Run `npm run check` before publishing, then check local asset/anchor references
and affected desktop/mobile interactions in the browser.

- `projects/career-agent/`: local application workspace and architecture.
- `projects/imc-prosperity/`: team results, strategies, and the five competition rounds.
- `projects/airbnb-classification/`: methodology, result, and the existing full HTML report.
- `projects/domus/`: WildHacks team project, host/guest flows, and dependency attribution.
- `projects/tikidata-fc/`: football analyses, original figures, notebooks, and social visuals.

New content is grounded in the public project repositories. DOMUS's table artwork
comes from `public/images/hero-meal.png`. TikiData figures come from
`Expected_Goal_Premier_League_Players/premier_league_goals_vs_xg.png` and
`Hidden_Gems_Top_5_Leagues/U23_Hidden_Gems_Graph.png`; they are saved analysis
outputs, not live player statistics. Career Agent uses the existing fictional
demonstration screenshot. Trading strategy descriptions and rankings are team
results from the public competition write-up. BanterBoost has no new project page.

## Contact delivery

The contact form posts to FormSubmit’s AJAX endpoint for
`adirosenstock2026@u.northwestern.edu`. `dist/contact.js` handles submission and
accessible status messages; no secret keys are stored in the client. FormSubmit
requires a one-time activation email to the recipient before accepting messages.
Do not treat a setup response requesting activation as successful delivery.

The native form action remains available if JavaScript is unavailable. It uses
FormSubmit’s normal flow and returns to `?message=sent#contact`. The provider’s
default CAPTCHA applies to that native flow. AJAX submissions use the honeypot.
There are no attachments or automatic replies to visitors. Shared CSS and
`contact.js` references use content hashes, as do the existing scripts.

For delivery checks, send only a clearly labeled setup/test message to Adi’s inbox;
use mocked responses for success, error, and retry behavior. Confirm the provider
accepts submissions after inbox activation before calling delivery ready.

## Toolkit and logos

The toolkit keeps names alongside decorative technology logos, with more tools
available in native disclosure controls. It covers software, data/AI, platforms
and APIs, and finance/analysis. Skills come from the current résumé, Adi’s GitHub
profile, Career Agent’s package manifest, the TikiData FC write-up, and the Airbnb
classification notebook/methodology. No proficiency ratings are invented.

Twenty-one SVG logos are bundled in `dist/assets/skills/` from
[Devicon](https://github.com/devicons/devicon), pinned to revision
`7330accdbc47e2dc0c19789a48533c4a3c50fe58`. That folder contains the MIT license
and original source URLs/checksums in `sources.json`. Concepts without a suitable
brand logo keep their readable text label. `dist/toolkit.css` is scoped to this
section and its URL is versioned with its content hash.
