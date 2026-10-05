# Adi Rosenstock’s portfolio

A static, responsive portfolio with selected projects, experience, interests,
and skills. Inspired by the flow of David Wei’s portfolio; typography,
composition, colors, content, and interactions are original to this site.

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
- Scroll entrances vary by content: project previews open from opposite sides,
  cards settle in sequence, experience follows a growing timeline, and toolkit
  tags appear in groups. Reveals happen once, with keyboard-focus visibility.
- A small football tracks reading progress along the navigation bar.
- A persistent pause control and system reduced-motion preference stop ambient motion.
  Pausing also reveals all content immediately. Hero motion pauses offscreen,
  and all content remains visible when JavaScript is disabled.
- The portrait button switches between the existing football portrait and GitHub avatar.
- Prominent Northwestern and Bloomberg hero buttons open résumé-grounded details.
  Four project stories use the same native dialogs, with keyboard dismissal and focus return.
- Project cards lead with titles and visuals. About, role descriptions, leadership,
  and extra toolkit tags use native disclosure controls so visitors choose the depth.
- The BanterBoost preview switches between current analytics and mini-league screenshots.
- Mobile navigation opens and closes with an accessible toggle and Escape.
- Email opens the visitor’s mail app; copy reports clipboard success or a usable fallback.
- Navigation highlights the section in view; reduced motion disables smooth scrolling.

## Hosting

Hosted on [GitHub Pages](https://adirosenstock.github.io/AdiRosenstock.io/).
Every push to `main` runs `.github/workflows/pages.yml`, checks the JavaScript,
and publishes the static files in `dist/`. Relative asset paths support the Pages
project URL and a future custom domain without changes.

The unused Sites identity in `.openai/hosting.json` is retained for continuity.
GitHub Pages is the live provider. Do not store credentials in files.
