# Portfolio maintenance

- This is Adi Rosenstock’s personal portfolio. Preserve the current résumé-grounded
  facts and distinguish team results from individual accomplishments.
- Check the current live BanterBoost website before updating its screenshots or
  product descriptions. Do not reuse the old repository screenshots.
- Commit and push to the GitHub origin at coherent milestones, including after
  completed edits. The user explicitly requested frequent pushes.
- GitHub Pages is the live hosting provider, as explicitly requested by the user.
  Push completed changes to `main`; the Pages workflow deploys `dist/` automatically.
  Preserve the unused Sites identity in `.openai/hosting.json`; do not deploy there.
- Keep the personal, playful motion in the hero and provide a motion pause control.
- Northwestern education and Bloomberg experience lead the hero. Football is a
  personal interest, not the whole identity. Keep the overview short and title-led;
  put longer stories and role descriptions behind explicit detail controls.
- Use the football/tech visual direction: pitch markings, passing routes, and data
  points. The user rejected the travel/sky background. Reveal content as it enters
  the viewport; keep content visible with reduced motion or when JavaScript is off.
- The original résumé is a source document, not a bundled public asset.
- This is a dependency-free static site. Run `node --check dist/script.js`, check
  changed local asset references, and verify affected interactions in the browser.
- The stylesheet and script URLs include content-hash query strings to avoid stale
  browser caches. Refresh those hashes in every affected HTML page when a shared
  stylesheet or script changes, including `dist/index.html` and project pages.
