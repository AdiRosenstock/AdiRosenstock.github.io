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

Internship results are résumé-reported. The portfolio does not claim that FPL’s
manager population is BanterBoost’s customer count. Trading results are team results.
The original résumé file is not bundled in the published site.

## Interactions

- The portrait button switches between the existing football portrait and GitHub avatar.
- Four project stories use native modal dialogs with keyboard dismissal and focus return.
- The BanterBoost preview switches between current analytics and mini-league screenshots.
- Mobile navigation opens and closes with an accessible toggle and Escape.
- Email opens the visitor’s mail app; copy reports clipboard success or a usable fallback.
- Navigation highlights the section in view; reduced motion disables smooth scrolling.

## Hosting

The private Sites identity and static output directory are in `.openai/hosting.json`.
Keep that identity when publishing further changes. Do not store credentials in files.
