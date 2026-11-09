# The Analytical Editorial

Harsh Patel’s portfolio brings together market research, data analytics and engineering. The site runs as static HTML, CSS and JavaScript on GitHub Pages.

## Preview locally

From the site directory, run the command below and open [the local preview](http://127.0.0.1:8000/). The archive includes the full site and assets. It requires no package installation or build step.

```sh
python -m http.server 8000 --bind 127.0.0.1
```

| File | Role |
| --- | --- |
| `index.html` | Homepage, project index, experience, about and contact |
| `work/*.html` | Four standalone case studies with shareable URLs |
| `styles.css` | Design tokens, shared components, responsive layouts and motion |
| `script.js` | Mobile navigation and the Edmonton comparison controls |
| `assets/` | Original Power BI dashboard screenshot, portfolio artwork and font licenses |
| `favicon.svg` and `og.png` | Browser icon and social preview |
| `.nojekyll` | Serves files directly from the Pages publishing branch |

## Design tokens

The custom properties at the top of `styles.css` are the source of truth. The grid, chart tracks and lighter blues support the palette supplied in the brief.

| System | Tokens and use |
| --- | --- |
| Palette | Midnight Navy `#273869` for emphasis and primary actions. Steel Navy `#405881` for figure labels. Mist Gray `#EDF1F4` for the experience section. White `#FFFFFF` for cards. |
| Supporting colours | Ink `#15243F` for type, muted `#4D5D75` for secondary copy, paper `#FBFCFE`, line `#CCD6E2`, pale blue `#E6EFFA`, dark `#172746` and focus `#255CB2`. |
| Typography | Inter variable for headings and body, Helvetica Neue and system fallbacks, Newsreader Italic with Georgia fallback for editorial accents, and system monospace for figure labels. Data labels use tabular figures. Both local fonts ship with SIL Open Font License files. |
| Type scale | Fluid homepage display at roughly 36–90 px across phone and desktop. Section headings scale from 43–82 px. Default body copy is 16 px with a 1.65 line-height. |
| Spacing | 4, 8, 12, 16, 24, 32, 48 and 64 px. Fluid outer gutters and section spacing adapt to the viewport. |
| Shape and depth | 8, 16 and 24 px radii plus pill controls. Two levels of soft shadow distinguish the figure and interactive project cards. |
| Motion and focus | 180 ms feedback for controls, visible 2 px focus indicators and a reduced-motion override. |

## Content and design decisions

- The original headline opens the site. The Edmonton research card lets visitors compare assessed-value changes by neighbourhood and property type. The citywide median stays visible as a benchmark in both views.
- Selected Work comes before Experience. Each project has a standalone page that separates the question, method, findings and takeaway. The Maven case study presents a themed web extract of the original report figures, including current-month KPIs and brand rankings.
- Experience leads with a typical JLL reporting quarter. Earlier roles highlight a concrete piece of evidence alongside the job title, dates and context. About pairs a personal introduction with a notebook of questions linked to the work. [Original portfolio](https://harshp10101.github.io/)
- The Edmonton analysis distinguishes assessed values from sale prices and describes regression results as associations. The Maven data comes from a fictional retail scenario. The market basket pricing exercises are simulations. [Edmonton analysis](https://github.com/HarshP10101/Edmonton-Property-Analysis), [Maven Market](https://github.com/HarshP10101/Maven-Market-Power-BI-Project), [ETL Breweries](https://github.com/HarshP10101/ETL-breweries), [Market Basket Analysis](https://github.com/HarshP10101/Market-Basket-Analysis)

## Verification

- Rendered the homepage in Chrome at 1440, 1024, 820, 768, 390 and 320 px. Checked horizontal overflow, asset loading and chart scale alignment on the homepage and on each case study at 1440, 390 and 320 px.
- Checked the skip link, keyboard focus, mobile menu open and close, Escape, Edmonton comparison controls, case-study navigation, notebook links, reduced motion and the no-JavaScript fallback.
- Ran axe checks for WCAG 2.0 and 2.1 A and AA across 18 page and viewport combinations. Found zero automated violations and zero browser errors. Browser coverage used Chrome with emulated touch and viewport sizes.
- Preserved all existing external destinations. The GitHub and résumé URLs returned HTTP 200. LinkedIn blocked automated access, so its inherited profile URL still needs a signed-in check.
- The themed Maven extract recreates selected views in HTML. The original dashboard screenshot and Power BI project remain linked from the case study.

## GitHub Pages release

After approval, review and merge the redesign branch into `main`. The repository documents `main` at `/ (root)` as its Pages source. Confirm that setting under **Settings → Pages** and keep the current source configuration. GitHub Pages will publish the merged static files. Check the deployment run and open the homepage and a case-study URL once it succeeds. [GitHub Pages publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
