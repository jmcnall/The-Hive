# The Hive Website

A one-page React + Vite website for The Hive Innovation Park.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New Project**.
3. Import the GitHub repo.
4. Vercel should auto-detect Vite.
5. Build command: `npm run build`
6. Output directory: `dist`

## Site plan SVG layers

The map component expects exact SVG layer files in:

```text
public/site-plan/
```

Expected filenames:

```text
project_site.svg
power_lines.svg
sewer_lines.svg
culinary_water.svg
storm_water.svg
natural_gas.svg
fiber_optics.svg
```

If a production SVG file is missing, the site shows a fallback vector preview instead.
