# Adi Rosenstock’s portfolio


## Local preview

```sh
npm run dev
```

Open http://127.0.0.1:4173. There are no dependencies or build step.
`dist/` contains the complete deployable site. Homepage spacing and visual
refinements live in `refinement.css`; the shared homepage design refinements live in
`portfolio.css`. The seven project pages share `project-design.css`, loaded
after their individual visual styles. Edit the relevant styles, then refresh
the preview.

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
- TUKI: a private AI career project by Adi. Its public presence leads with “Building the future of job search.” and stays a brief branded teaser. Keep product mechanics, stack, integrations, roadmap, screenshots, and implementation details out of all published copy, scripts, assets, and metadata. Offer contact and portfolio links; do not invent performance claims or a release date.
- [Recruiting Agent](https://github.com/AdiRosenstock/Recruiting_Agent) public README: startup-focused discovery, explainable scoring, fact-checked research, and human-reviewed outreach. Its drafts are never sent automatically.
- [README Preview](https://github.com/AdiRosenstock/readme-reader) public source: a single HTML file with GitHub-flavored Markdown preview, local drafts, import, and export. The original HTML is copied into `dist/tools/readme-preview/` as a live demo. Its rendering libraries load from a CDN; the source repository is the canonical place for updates.
- [STAT 362: Advanced Machine Learning](https://github.com/AdiRosenstock/STAT-362-Advanced-Machine-Learning) public coursework repository: running Python notebooks cover gradient descent and SVMs; Homework 1 includes a logistic regression implementation using gradient descent. Present it as coursework, not a standalone product or case study.
- [The Paradox of Equality](https://github.com/AdiRosenstock/malthusian-rebellion), reviewed October 26, 2026: individual ECON 324: Western Economic History coursework. The public README supplies the model, analytical equilibria, 5,000 Monte Carlo runs per scenario, and sensitivity results. Present the findings within the fixed-land, fixed-technology Malthusian assumptions; do not describe them as empirical historical estimates or modern policy predictions. The original `Appendix/Figure2.png` is bundled unchanged as `dist/assets/malthusian-rebellion/monte-carlo.png`, from commit `6124b93bf4a182910daa7b60100f8433be6fcb5b`. The custom SVG plots the deterministic baseline consumption gain, `100 × (2^(0.65^t) − 1)`, for generations 0–15 after rebellion; it is distinct from the Monte Carlo output.
- Brief Intelligence: Adi's [public demo](https://www.youtube.com/watch?v=GVULpFCQ97A), the team's [public data/classification pipeline](https://github.com/ZBraffmanNorthwestern/briefintelligence), private app commit history, and the team's final report support the project page. Northwestern's [faculty profile](https://www.law.northwestern.edu/faculty/profiles/AmparoGrauRuiz/) confirms Professor Maria Amparo Grau Ruiz's affiliation. Credit the three-person team, distinguish Adi's search/interface work, and keep private app files and configuration out of the site.
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

- The opening uses Adi’s supplied professional portrait with a plain-language
  introduction. A quiet static pitch backdrop keeps the personal reference.
  Adi rejected a code/terminal treatment on October 29, 2026 because it was too
  technical for a general audience. There is no code panel or simulated data feed.
- Chiqui, the passing-ball animation, the kick control, and the match clock were
  removed at Adi’s request. A thin line indicates page progress. The switchable
  family photos and parent links live in About alongside the football biography.
- The opening names software engineering, data engineering, data science,
  product management, finance, and quantitative research. The design favors
  open image/text spreads and a staggered project gallery. Credential rows,
  preview diagrams, project lessons, and the contact form have no decorative
  outer cards. Tabs use underlines; real controls and artifacts remain legible.
- Design references reviewed: [Rauno Freiberg](https://rauno.me/) for deliberate
  typography and [Emil Kowalski](https://emilkowal.ski/) for restraint. The final
  design uses white, ink, teal, and sage; readable project summaries; consistent
  experience and toolkit layouts; a compact bookshelf; and a clear contact form.
- Selected work features Brief Intelligence, with a full project page and public video demo. Its homepage preview cycles through searching, filtering, and matching only while visible; the existing motion pause and reduced-motion preference stop the cycle. The selected-work grid includes TUKI, IMC Prosperity 3, the Airbnb model,
  DOMUS, TikiData FC, and The Paradox of Equality, beneath the featured BanterBoost preview. On pointer
  devices and touch screens, every card shows its description below the artwork;
  project pages provide the deeper technical detail. Each of those six cards
  links to its project page. Public projects retain separate source links; TUKI shows its private development status. The main palette
  uses ink and teal; project previews keep their own colors and imagery.
- The Paradox of Equality homepage preview traces its deterministic consumption
  curve, follows it with a moving point, and highlights the below-1% milestone at
  generation 10. The eight-second cycle uses the shared visible-card observer;
  it freezes offscreen or when the document is hidden. Pause motion and system
  reduced motion show the complete static chart. Both previews use the same model coordinates; the inline
  homepage path samples every 0.1 generation and the marker every 0.5 generation.
- The Paradox of Equality project hero has an interactive deterministic walkthrough
  in `economics-explorer.js` and `economics-explorer.css`. Its village, graphs, and
  equations share a timeline from immediately before rebellion through 15 generations
  afterward. Play/pause, keyboard scrubbing, and milestone buttons update the same
  exact model: population ratio `2^((1 - 0.65^t) / 0.35)`, consumption ratio
  `2^(0.65^t)`, and output ratio equal to the population ratio raised to 0.65.
  Graphs compare consumption, population, and total output against continued
  extraction. The walkthrough shows six live outcomes: total output, population,
  output per worker, retained income per worker, consumption per worker, and
  expected surviving children per worker. Each shows its original pre-rebellion
  value plus a population/output multiple or signed per-worker percentage change.
  Per-worker values use three decimals so small late-generation gains stay visible.
  All outcomes update with playback, milestone controls, and keyboard scrubbing.
  Village people are rounded illustrations (about 3,500 workers each);
  numerical results are calculated without rounding. Playback pauses offscreen or
  with a hidden document; shared pause and reduced motion stop it while leaving
  manual controls available. The static consumption SVG remains the no-JavaScript
  fallback. “Follow the equations” expands the production, household, and equilibrium
  derivation. These illustrations remain distinct from the original Monte Carlo figure.
- The opening defines the Malthusian feedback loop before introducing the rebellion.
  The simulation lab near the start runs the production, household, and population
  equations with editable extraction rates, a one-time productivity improvement,
  ongoing technology growth, the labor exponent, preferences for children, and
  child costs. Land and the horizon (10–120 generations) are also editable in the
  Python parameter cell. Each run starts at its own pre-change equilibrium;
  changing household preferences recalculates that equilibrium. The default
  horizon is 30 generations. Sliders, presets, the timeline, and displayed code
  share one validated parameter object. The notebook uses Python assignments
  (`tau_before`, `tau_after`, `A_jump`, `tech_growth`, `alpha`, `gamma`, `rho`,
  `H`, `generations`) and shows the real Python model from
  `dist/assets/malthusian-rebellion/simulation.py`. Run cell or Shift+Enter runs
  the Python source in an isolated module worker and uses its returned results
  for the graphs. Sliders use an instant JavaScript equivalent; tests compare
  every output against Python. Preview output is labeled separately from executed
  Python output. Python errors retain the previous results and editable source.
  “Restore original values” is available beside Run cell and in the slider panel.
  It stops an active Python run and restores all baseline parameters, the Python
  source cell, and the corresponding graphs/output, with visible confirmation.
  A Stop button and time limits terminate long-running cells without blocking
  the page. The worker loads Pyodide 314.0.7 from jsDelivr only on the first Run
  cell action, following its [official worker documentation](https://pyodide.org/en/stable/usage/webworker.html).
  Ordinary browsing and sliders do not download the Python runtime. The notebook
  has copy-Python and `.ipynb` download controls, with parameter, model, result,
  and Matplotlib graph cells and Python 3 kernel metadata. Downloads preserve
  the current parameter source, including comments and arithmetic expressions.
  Continual technology growth is explicitly labeled as an extension of the paper's
  fixed-technology setup. Its income limit is `(rho/gamma) * (1+g)^(1/(1-alpha))`;
  population keeps growing, so there is no stationary population in that case.
  This lab is deterministic and is distinguished from the study's Monte Carlo
  figure. Shared motion pause, reduced motion, and offscreen/hidden-page pauses
  apply to transition playback. `npm run check` includes analytical-transition,
  equilibrium, parameter-validation, cross-language, copied-Python, and notebook
  tests in `tests/economics-lab.test.mjs`; Python 3 is required for those checks.
- Homepage scroll entrances use one restrained movement; content reveals once,
  and keyboard focus makes pending content visible immediately. The header
  keeps the motion pause control available throughout the page.
- A persistent pause control and system reduced-motion preference stop ambient motion.
  Pausing also reveals all content immediately. Hero motion pauses offscreen,
  and all content remains visible when JavaScript is disabled.
- The About section cycles between Adi’s supplied matchday photo with his dad
  and the family photo at Cerro Chirripó. Both are copied unchanged into `dist/assets/`.
  Click the photo or its caption control to switch; both controls support keyboard
  activation and the existing motion-aware fade. Handwritten notes and arrows
  link Eitan Rosenstock and Katherine Gutreiman to their LinkedIn profiles, with
  the arrows repositioned for each photo and the mom note only shown on the hike.
  Captions, dimensions, button labels, and alt text update with the photo.
  The supplied professional headshot leads the hero. The AI office portrait
  and its disclosure are not used on the homepage.
- Project pages carry the homepage’s typography, light navigation, spacing,
  button styles, reading progress, and footer. Each keeps its own accent and demo.
  Story pages use a narrow section index, readable prose, a separate facts row,
  and simpler process and decision sections. Mobile stacks these in reading order.
  The old match clock is replaced by a thin progress line with 0–100% accessible
  values. Trading sketches, validation folds, guest/host journeys, tactical
  playback, the economics walkthrough, and the executable notebook are preserved.
  TUKI’s short private teaser uses the existing wordmark and orbital language,
  without the toucan or any additional product details. The career-agent redirect
  still preserves query strings and anchors.
- Prominent Northwestern and Bloomberg hero buttons open résumé-grounded details.
  BanterBoost retains its existing website link and native detail dialog.
- Brief Intelligence, TUKI, IMC Prosperity 3, Airbnb classification, DOMUS, TikiData FC, and The Paradox of Equality
  have dedicated, shareable project pages. Homepage cards open these pages,
  with direct source/product links retained only where public. Public case studies include project context,
  approach, build details, a key decision, and references for deeper exploration.
  TUKI is a compact private-project teaser, with a contact invitation instead of a case study.
  Pages have section navigation, copy-link feedback, and links to the next project.
  Every page respects the shared motion preference and has a pause control.
  TUKI uses its wordmark and orbital branding; IMC has
  switchable strategy sketches; Airbnb illustrates five-fold validation; DOMUS
  switches between guest and host journeys; TikiData has a playable passing move.
  SVG backgrounds and page-specific palettes relate each scene to its project.
  Public case studies include a specific reading cue beside their original artifacts.
  Interactive illustrations are distinguished from actual project screenshots,
  results, and analysis figures. Content remains visible without JavaScript.
- The projects section ends with a lighter pair of public side builds: Recruiting Agent and the playable README Preview tool.
- Project cards lead with titles and visuals. The About biography is always shown. Role descriptions and leadership
  use native disclosure controls so visitors choose the depth. All toolkit tags are
  visible within their categories, with no extra disclosure controls.
- The homepage hero introduces software engineering and data science in plain
  language; experience and skills retain the finance and product details. A Reading section lists books Adi supplied; *Good to
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
- Links to other pages, project stories, documents, and full-size media open in a
  new tab, preserving the portfolio. Same-page section anchors remain in place.
  The ECON 324 paper links open the original PDF directly at
  `assets/malthusian-rebellion/The_Paradox_of_Equality.pdf`; the file is copied
  unchanged from project commit `6124b93bf4a182910daa7b60100f8433be6fcb5b`.
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
anchors. The old project route resolves directly to `/projects/tuki/` from both
the root and `/AdiRosenstock.io/` paths. This keeps existing bookmarks and shared project links working.
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
All project pages also use `dist/motion.css` and `dist/motion.js` for shared interactions.
The scene stylesheet defines each project's visual identity, illustrations,
responsive layouts, and reduced-motion behavior. There is no build step. The preview
server supports directory indexes; use `PORT=4174 npm run dev` for another port.
Run `npm run check` before publishing, then check local asset/anchor references
and affected desktop/mobile interactions in the browser.

- `projects/tuki/`: branded private AI career project teaser, with no product walkthrough or technical disclosure.
- `projects/career-agent/`: redirect to TUKI, preserving query strings and anchors.
- `projects/brief-intelligence/`: Northwestern Pritzker School of Law team project, with the public video demo, search contribution, and team pipeline attribution.
- `projects/imc-prosperity/`: team results, strategies, and the five competition rounds.
- `projects/airbnb-classification/`: methodology, result, and the existing full HTML report.
- `projects/domus/`: WildHacks team project, host/guest flows, and dependency attribution.
- `projects/tikidata-fc/`: football analyses, original figures, notebooks, and social visuals.
- `projects/malthusian-rebellion/`: ECON 324 model and simulation study, deterministic consumption curve, original Monte Carlo figure, model assumptions, and links to the paper and notebook. The homepage card and project page share `dist/economics.css`.

New content is grounded in the public project repositories. DOMUS's table artwork
comes from `public/images/hero-meal.png`. TikiData figures come from
`Expected_Goal_Premier_League_Players/premier_league_goals_vs_xg.png` and
`Hidden_Gems_Top_5_Leagues/U23_Hidden_Gems_Graph.png`; they are saved analysis
outputs, not live player statistics. TUKI uses a local brand graphic; the former
dashboard screenshot is removed from deployed assets. Trading strategy descriptions and rankings are team
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
profile, the TikiData FC write-up, and the Airbnb
classification notebook/methodology. No proficiency ratings are invented.

Twenty-one SVG logos are bundled in `dist/assets/skills/` from
[Devicon](https://github.com/devicons/devicon), pinned to revision
`7330accdbc47e2dc0c19789a48533c4a3c50fe58`. That folder contains the MIT license
and original source URLs/checksums in `sources.json`. Concepts without a suitable
brand logo keep their readable text label. `dist/toolkit.css` is scoped to this
section and its URL is versioned with its content hash.

### Automatic demos and navigation

Visual project demos start on entry: the football move loops with Replay, trading
strategies and validation folds cycle, guest/host journeys alternate, and the
economics walkthrough starts its timeline. Manual control takes over. Shared
pause, reduced motion, offscreen state, and hidden tabs suspend automatic work.
Internal portfolio pages and anchors stay in the current tab; external sites and
original documents remain separate tabs. No Python cell or external video is
started automatically.
