# Myna-Hokkien project page

A compact, listening-first research note for **Myna-Hokkien**, iNLP Lab's
Singapore-Hokkien speech model. The main page presents the release facts, one
clearly scoped five-model listening example, ten selected Myna-Hokkien demos,
run instructions, next steps, and citation details. The other model outputs
for each selected demo remain inside collapsed comparison tables. The
standalone comparison page remains available as an archive.

## Preview locally

The site is dependency-free. Serve the repository with any static file server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Editing the showcase

The examples are written directly in `index.html`. Audio files are stored in
`assets/showcase/`, with one numbered directory per use case. The main page
shows `input.wav` and `native.wav` by default; the other model outputs use
`preload="none"` and appear only when a reader opens the disclosure.

## Deployment

The repository is configured for GitHub Pages through
`.github/workflows/pages.yml`. Every push to `master` deploys the latest site.
