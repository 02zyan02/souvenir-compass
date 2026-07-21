# Souvenir Compass

The country guide, product recommendations, images, source links, categories and trip checklist are maintained as static JSON. Each country has its own `data/catalog-<country>.json` file, and `data/catalog-index.json` joins the catalogue for the app.

## Run locally

1. Start the application: `npm run dev`.

For a production-style run, use `npm run build` followed by `npm start`.

## Static catalogue maintenance

Edit the relevant `data/catalog-<country>.json` file to update products or country details. The build copies the catalogue to the public site automatically. Travel spots remain in `data/travel-spots-<country>.json`, and customs data remains in `data/country.json`.

## Free deployment

GitHub Pages hosts the complete static site; no API URL, backend host or database host is needed. In repository **Settings > Pages**, choose **GitHub Actions** as the source. Each push to `main` deploys to `https://02zyan02.github.io/souvenir-compass/`.

The optional `render.yaml` can still deploy a static-server copy, but it is not required for GitHub Pages.

## Free public preview

Run `docker compose up -d --build app` and then create a free Cloudflare quick tunnel:

```powershell
docker run -d --name souvenir-compass-tunnel --network souvenir-compass_default cloudflare/cloudflared:latest tunnel --url http://app:3001
docker logs souvenir-compass-tunnel
```

Copy the displayed `trycloudflare.com` URL to share the app. The URL is temporary and stays available only while Docker and the tunnel container are running. Stop it with `docker rm -f souvenir-compass-tunnel`.

## Content sources

Each product retains a source URL in its country catalogue JSON. The expanded Vietnam, Thailand and Indonesia suggestions are grounded in the Trip.com Bangkok shopping guide, KKday’s Vietnam souvenir guides and Holafly’s Bali souvenir guide, respectively. Other country entries are curated as practical, packable local-gift suggestions and can be updated directly in their JSON file.
