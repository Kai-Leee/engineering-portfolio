# Kai Lee — AI Systems Builder

Agent workflows and developer tools, grounded in backend engineering, QA and applied machine-learning experiments.

- [Portfolio](https://kai-leee.github.io/engineering-portfolio/)
- [English](https://kai-leee.github.io/engineering-portfolio/?lang=en) · [한국어](https://kai-leee.github.io/engineering-portfolio/?lang=ko)
- [GitHub profile](https://github.com/Kai-Leee) · [Project evidence and retrospectives](https://github.com/Kai-Leee/competition-portfolio) · [Pointsman](https://github.com/Kai-Leee/pointsman)

## Contents

The portfolio covers Agent Loadout, Pointsman (Jev + dependency DAG routing), audio detection, financial disclosure review, wind forecasting, microstructure prediction, IBK Securities, SoyNet and vessel matching. A separate expandable workbench holds prototypes, local changes, coursework and research at their recorded stages. Experience and Background cover Timepercent, education, UNCG research, military service and community leadership.

Use the color-only Amber, Ocean and Paper buttons and the direct English / 한국어 buttons at the top right. Language is encoded in the URL; theme resets when the page is reopened. Contact links open GitHub, Gmail, telephone and LinkedIn directly.

## Build and host

```sh
npm ci
npm run build
```

`build.mjs` bundles the React application and its CSS into `index.html`. The page runs without a build server or external runtime CDN. Keep `social-card.png` beside `index.html` for link previews. GitHub Pages serves the `main` branch at the repository root. `.nojekyll` preserves static hosting.

`social-card-source.html` is the 1200×630 design source for the generated preview image. Recreate the image by capturing it at that viewport without page scaling.

The design was created in MagicPath and inspired by [codewithsadee/vcard-personal-portfolio](https://github.com/codewithsadee/vcard-personal-portfolio). React, React DOM and Scheduler license notices are in `THIRD_PARTY_NOTICES.txt`.

Private source notes, application drafts and internal experiment evidence are not included in this repository.
