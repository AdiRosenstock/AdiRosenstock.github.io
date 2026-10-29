# Portfolio maintenance

- This is Adi Rosenstock’s personal portfolio. Preserve the current résumé-grounded
  facts and distinguish team results from individual accomplishments.
- Keep TUKI as a confident, brief private-project teaser. Do not publish its product
  mechanics, architecture, stack, integrations, roadmap, or dashboard screenshots
  in pages, scripts, assets, metadata, README, or other public documentation.
  Use broad AI career positioning, honest private-development status, and contact links.
- Check the current live BanterBoost website before updating its screenshots or
  product descriptions. Do not reuse the old repository screenshots.
- Keep BanterBoost's preview as the actual live iframe, with working analytics and
  mini-league controls. Preserve it when restyling the portfolio; do not replace it
  with screenshots. BanterBoost permits framing only from
  `https://adirosenstock.github.io`, so a blocked localhost frame is expected:
  verify the live embed on the published portfolio. Sign-in opens the full
  BanterBoost page in a new tab.
- Commit and push to the GitHub origin at coherent milestones, including after
  completed edits. The user explicitly requested frequent pushes.
- GitHub Pages is the live hosting provider, as explicitly requested by the user.
  The origin is `AdiRosenstock/AdiRosenstock.github.io` and the live URL is
  `https://adirosenstock.github.io/`. Push completed changes to `main`; the Pages
  workflow copies `dist/` into `.pages/` with `npm run prepare:pages` and deploys it.
  Keep redirects from the previous `/AdiRosenstock.io/` paths, including project
  pages, query strings, and section anchors. `.pages/` is generated and ignored.
  Preserve the unused Sites identity in `.openai/hosting.json`; do not deploy there.
- The opening leads with Adi’s real professional portrait and an approachable,
  plain-language introduction. Adi rejected the code/terminal hero because it was
  hard for nontechnical visitors to understand. Keep the pitch as a faint static
  backdrop. Chiqui, the moving hero football, kick control, and match clock were
  removed at Adi’s request. Keep a shared motion pause control for project previews.
  TUKI remains the separate private career project; preserve its branding.
- Keep the Northwestern education card purple; the general site palette uses ink and teal.
- Northwestern education and Bloomberg experience lead the hero. Football is a
  personal interest, not the whole identity. Keep the overview short and title-led;
  show brief project summaries and put deeper stories and role descriptions
  behind explicit detail controls. Keep
  the About me biography visible without opening a disclosure.
- Use white, ink, teal, and quiet sage surfaces. Keep consistent typography,
  spacing, and visible project summaries across the homepage. The pitch stays
  subtle and static. Keep content visible with reduced motion or JavaScript off.
- Project pages use `project-design.css` for the same readable DM Sans type,
  light navigation, spacing, story layout, and progress line as the homepage.
  Keep individual project palettes and interactive demos. TUKI stays a brief
  private teaser with its wordmark and orbital branding; the toucan is removed.
  Preserve the old career-agent redirect and all original artifact links.
- Adi requested a public résumé link in the hero. Keep the supplied PDF bundled
  in `dist/assets/` and linked from the homepage; preserve its contents.
- This is a dependency-free static site. Run `node --check dist/script.js`, check
  changed local asset references, and verify affected interactions in the browser.
- Open links to other pages, documents, repositories, and full-size media in a
  new tab with `target="_blank"` and `rel="noopener noreferrer"`, so the portfolio
  stays available. Same-page section anchors and interactive controls stay in place.
  Paper links must open the bundled PDF directly, rather than a GitHub file page.
- The stylesheet and script URLs include content-hash query strings to avoid stale
  browser caches. Refresh those hashes in every affected HTML page when a shared
  stylesheet or script changes, including `dist/index.html` and project pages.

- The contact form delivers to Adi’s Northwestern inbox through FormSubmit. Keep
  direct email as a fallback, required labels/validation, the honeypot, and
  accessible send/error states. Preserve visitor text after failed delivery,
  prevent duplicate submissions, and never commit email or API credentials.
  An activation-required response is a failure, not a sent message.

- Keep the user’s design direction: smooth, spacious, and personal, inspired by
  David Wei (https://dawei25.github.io/davidwei/), Jose Vergara
  (https://www.joseavergara.com/), Rauno Freiberg (https://rauno.me/), and Emil
  Kowalski (https://emilkowal.ski/). The opening leads with software, financial
  data, and economics in plain language, alongside the professional portrait.
  Family photos and the personal football story live in About; preserve the
  photo switch and parent links. Avoid a code-heavy or terminal-themed opening.
- The Reading section includes real book covers, current-reading and favorite
  markers, and the user’s two favorite podcasts: How to Take Over the World
  (Ben Wilson) and Founders (David Senra), linked to the supplied Spotify shows.
