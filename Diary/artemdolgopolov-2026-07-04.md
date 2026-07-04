# 2026-07-04

## What I worked on

Today I worked on the RS School task for our online store project. The main goals were:

- set up CI/CD with GitHub Actions
- deploy the app to GitHub Pages
- improve accessibility (Lighthouse A11y ≥ 95%)
- improve performance (Lighthouse Performance +15 points)

## What I did

**CI/CD**

- Created workflows for branch name check, lint/test/build, and deploy to GitHub Pages
- Set up branch protection on `main` with required status checks
- Configured webpack and router for GitHub Pages (`PUBLIC_PATH=/feature-ci-cd/`)
- Added `404.html` copy in deploy so SPA routing works better on GitHub Pages
- Opened a PR from `feature/ci-cd` to `main`

**Accessibility**

- Added `aria-label` to buttons and inputs that had no text
- Fixed color contrast (grey text was too light)
- Made touch targets at least 44px for sort/layout buttons
- Fixed heading order (h1 → h2 → h3)
- Added labels for form fields in the purchase modal

**Performance**

- Removed Google Fonts and switched to system fonts
- Added lazy loading for product images
- Added LCP image preload in webpack
- Fixed CLS with min-heights and a grid layout for the main content area
- Found a bug: CSS was loaded through JavaScript in production (style-loader). Fixed webpack config so CSS is extracted to a separate file

## Where I got stuck

1. **Deploy failed** — GitHub Pages sometimes returned "Deployment failed, try again later". Re-running the workflow usually helped.

2. **Lighthouse score was different every time** — sometimes 67, sometimes 75, sometimes 100. I was confused because I thought my fixes did not work.

3. **404 warning in Lighthouse** — when I tested `/catalog?stock=...`, GitHub Pages showed a 404 page first. Testing the root URL `https://artemdolgopolov.github.io/feature-ci-cd/` worked better.

4. **Production vs local** — I got 100 in Lighthouse Viewer from one report, but on the live site it was still ~75. The reason was that CSS was inside the JS bundle on production, so styles applied late and caused layout shift.

## How I worked through it

- Read Lighthouse reports carefully and looked at CLS, LCP, and render-blocking resources
- Googled errors like "GitHub Pages deployment failed" and "webpack MiniCssExtractPlugin"
- Re-ran deploy when it failed
- Used the root URL instead of deep links with query params
- Changed webpack config to use a function export so `--mode production` actually extracts CSS
- Asked for help in chat when scores did not match what I expected

## Decisions made

- Split CI into separate jobs (lint, test, build) so each can be a required check in branch protection
- Use GitHub Actions as the source for GitHub Pages (not "Deploy from branch")
- Set `PUBLIC_PATH=/feature-ci-cd/` because the repo name is `feature-ci-cd`
- Use inline critical CSS in `index.html` for grid layout to reduce CLS before JS loads
- Hide promo and footer with `visibility: hidden` until JS adds `app-ready` class (reserves space, less shift)
- Keep the diary simple and honest about what was hard

## Open questions

- Will the performance score stay stable after the CSS extraction fix is deployed?
- Is the fixed grid height (5200px) too hacky? It works for CLS but feels not very "clean"
- Should I merge to `main` only after mentor review, or when all checks are green?
- Do I need a "before" screenshot for A11y if I only have "after" ≥ 95%?

## Time spent

About 6–8 hours total for this day (not exact):

- CI/CD setup and debugging deploy: ~2–3 h
- Accessibility fixes and Lighthouse checks: ~2 h
- Performance optimization and webpack debugging: ~2–3 h