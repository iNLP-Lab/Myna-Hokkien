# Myna-Hokkien project page

A listening-first research note for **Myna-Hokkien**, iNLP Lab's native
Qwen3-Omni conversational Singapore-Hokkien model. The main page compares the
release with four external voice models across ten everyday use cases, then
documents possible applications, limitations, and next releases.

## Preview locally

The site is dependency-free. Serve the repository with any static file server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Editing the showcase

Comparison metadata lives in the `showcaseSamples` array near the top of
`script.js`. Audio files are stored in `assets/showcase/`, with one numbered
directory per use case and one input plus the five model outputs.

The standalone `compare.html` page remains available as an archive. The current
five-model comparison is now on the main page.

## Deployment

The repository is configured for GitHub Pages through
`.github/workflows/pages.yml`. Every push to `master` deploys the latest site.
