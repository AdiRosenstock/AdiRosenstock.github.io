# Adi Rosenstock’s portfolio


## Local preview

```sh
npm run dev
```

Open http://127.0.0.1:4173. There are no dependencies or build step.
`dist/` contains the complete deployable site. Edit `index.html`, `styles.css`,
and `script.js` there, then refresh the preview.

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
- Career Agent’s public README and fictional demo screenshot: product capabilities
  and architecture. No personal application records appear in the screenshot.
- Organization logos supplied by Adi, with official links to impaKt, MusclePoints
  (now MUSCLE), Vértice, and Hanoar Hatzioni. Role details and dates come from the résumé.

Internship results are résumé-reported. The portfolio does not claim that FPL’s
manager population is BanterBoost’s customer count. Trading results are team results.
The original résumé file is not bundled in the published site.

## Interactions

- A football/tech hero combines pitch markings, a data grid, an animated passing
  pattern, a floating photo, and a football visitors can kick.
- The selected-work grid includes Career Agent, IMC Prosperity 3, the Airbnb model,
  DOMUS, and TikiData FC, beneath the featured BanterBoost preview. Short descriptions
  appear on card hover or keyboard focus, can be dismissed with Escape, and remain
  visible on touch screens and narrow layouts. The main palette uses ink and teal;
  project previews keep their own colors and imagery.
- Scroll entrances vary by content: project previews open from opposite sides,
  cards settle in sequence, experience follows a growing timeline, and toolkit
  tags appear in groups. Reveals happen once, with keyboard-focus visibility.
- Motion also includes a staggered hero arrival, pointer-responsive preview artwork,
  an illustrative trading trace, validation-fold bars, and a passing ball in TikiData’s
  card. Links, toolkit logos, native details, dialogs, and project galleries respond
  to the reader; experience metrics receive drawn emphasis on arrival. The header
  keeps a pause control available at every scroll position. Shared motion stops
  when paused or reduced; preview loops only run
  while visible, and browser visibility pauses ambient motion.
- A small football tracks reading progress along the navigation bar.
- A persistent pause control and system reduced-motion preference stop ambient motion.
  Pausing also reveals all content immediately. Hero motion pauses offscreen,
  and all content remains visible when JavaScript is disabled.
- The homepage opens with Adi’s supplied laptop portrait, edited with the built-in
  imagegen tool to add two Bloomberg-style market terminals and a code screen.
  `dist/assets/adi-code-portrait.jpg` is the optimized website asset; the exact
  generation prompt is in `portrait-imagegen-prompt.txt`. The portrait switch
  keeps the existing football photo available, with matching captions and alt text.
  The office background is edited, not a documentary photo of a Bloomberg office.
- Prominent Northwestern and Bloomberg hero buttons open résumé-grounded details.
  BanterBoost retains its existing website link and native detail dialog.
- Career Agent, IMC Prosperity 3, Airbnb classification, DOMUS, and TikiData FC
  have dedicated, shareable project pages. Homepage project links open these pages,
  with direct source/product links retained. Each page includes the project context,
  approach, build details, a key decision, and references for deeper exploration.
  Pages have section navigation, copy-link feedback, and links to the next project.
  Every page respects the shared motion preference and has a pause control.
  Career Agent has a research/preparation/review packet illustration; IMC has
  switchable strategy sketches; Airbnb illustrates five-fold validation; DOMUS
  switches between guest and host journeys; TikiData has a playable passing move.
  SVG backgrounds and page-specific palettes relate each scene to its project.
  Interactive illustrations are distinguished from actual project screenshots,
  results, and analysis figures. Content remains visible without JavaScript.
- Project cards lead with titles and visuals. About, role descriptions, and leadership
  use native disclosure controls so visitors choose the depth. All toolkit tags are
  visible within their categories, with no extra disclosure controls.
- The BanterBoost preview switches between current analytics and mini-league screenshots.
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
All six pages also use `dist/motion.css` and `dist/motion.js` for shared interactions.
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
