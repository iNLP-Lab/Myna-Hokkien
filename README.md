# Myna-Hokkien project page

A compact, listening-first research note for **Myna-Hokkien**, iNLP Lab's
Singapore-Hokkien speech model. The main page presents the release facts, one
clearly scoped five-model listening example, twelve selected Myna-Hokkien demos,
run instructions, next steps, and citation details. The other model outputs
for the original first three demos remain inside collapsed comparison tables. The
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
shows `input.wav` and `native.wav` by default; the other model outputs for
samples 01–03 use `preload="none"` and appear only when a reader opens the
disclosure.

Samples 05–13 come from `release_data/demo_outputs.zip`, using these paired
audio/text variants: `audio_in/Jul 16 at 10-46 PM/v3`, `10-48 PM (1)/v1`,
`10-49 PM/v1`, `10-50 PM (1)/v3`, `10-50 PM (2)/v3`, `10-51 PM (1)/v2`,
`11-01 PM/v2`, `text_en/01/v3`, and `text_zh/05/v3`.

## Deployment

The repository is configured for GitHub Pages through
`.github/workflows/pages.yml`. Every push to `master` deploys the latest site.
