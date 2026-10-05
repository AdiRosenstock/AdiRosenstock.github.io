# Portfolio maintenance

- This is Adi Rosenstock’s personal portfolio. Preserve the current résumé-grounded
  facts and distinguish team results from individual accomplishments.
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
- Keep the personal, playful motion in the hero and provide a motion pause control.
- Keep the Northwestern education card purple; the general site palette uses ink and teal.
- Northwestern education and Bloomberg experience lead the hero. Football is a
  personal interest, not the whole identity. Keep the overview short and title-led;
  put project stories and role descriptions behind explicit detail controls. Keep
  the About me biography visible without opening a disclosure.
- Use the football/tech visual direction: pitch markings, passing routes, and data
  points. The user rejected the travel/sky background. Reveal content as it enters
  the viewport; keep content visible with reduced motion or when JavaScript is off.
- The original résumé is a source document, not a bundled public asset.
- This is a dependency-free static site. Run `node --check dist/script.js`, check
  changed local asset references, and verify affected interactions in the browser.
- The stylesheet and script URLs include content-hash query strings to avoid stale
  browser caches. Refresh those hashes in every affected HTML page when a shared
  stylesheet or script changes, including `dist/index.html` and project pages.

- The contact form delivers to Adi’s Northwestern inbox through FormSubmit. Keep
  direct email as a fallback, required labels/validation, the honeypot, and
  accessible send/error states. Preserve visitor text after failed delivery,
  prevent duplicate submissions, and never commit email or API credentials.
  An activation-required response is a failure, not a sent message.

- Keep the user’s design direction: smooth, spacious, and personal, inspired by
  David Wei (https://dawei25.github.io/davidwei/) and Jose Vergara
  (https://www.joseavergara.com/). The opening should show a soccer passing
  animation immediately on desktop and mobile. Preserve soccer motion when
  simplifying the page, along with the pause and reduced-motion behavior.
- The Reading section includes real book covers, current-reading and favorite
  markers, and the user’s two favorite podcasts: How to Take Over the World
  (Ben Wilson) and Founders (David Senra), linked to the supplied Spotify shows.
