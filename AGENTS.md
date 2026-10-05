# Portfolio maintenance

- This is Adi Rosenstock’s personal portfolio. Preserve the current résumé-grounded
  facts and distinguish team results from individual accomplishments.
- Check the current live BanterBoost website before updating its screenshots or
  product descriptions. Do not reuse the old repository screenshots.
- Commit and push to the GitHub origin at coherent milestones, including after
  completed edits. The user explicitly requested frequent pushes.
- Keep the Sites project identity in `.openai/hosting.json`. Publish edits to the
  same private Site unless the user requests a different audience.
- The original résumé is a source document, not a bundled public asset.
- This is a dependency-free static site. Run `node --check dist/script.js`, check
  changed local asset references, and verify affected interactions in the browser.
