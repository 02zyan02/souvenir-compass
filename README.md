# Souvenir Compass

The country guide, product recommendations, images, source links, categories, and trip checklist are stored in PostgreSQL. The React client loads them from `GET /api/catalog`.

## Run locally

1. Copy `.env.example` to `.env` if you need a different database URL or port.
2. Start the database: `docker compose up -d db`. PostgreSQL runs the schema and seed files in `database/` on its first start.
3. Start the application: `npm run dev`.

For a production-style run, use `npm run build` followed by `npm start`.

## Free public preview

Run `docker compose up -d --build app` and then create a free Cloudflare quick tunnel:

```powershell
docker run -d --name souvenir-compass-tunnel --network souvenir-compass_default cloudflare/cloudflared:latest tunnel --url http://app:3001
docker logs souvenir-compass-tunnel
```

Copy the displayed `trycloudflare.com` URL to share the app. The URL is temporary and stays available only while Docker and the tunnel container are running. Stop it with `docker rm -f souvenir-compass-tunnel`.

## Content sources

Each seeded recommendation retains a source URL in the database. The expanded Vietnam, Thailand, and Indonesia suggestions are grounded in the Trip.com Bangkok shopping guide, KKday’s Vietnam souvenir guides, and Holafly’s Bali souvenir guide, respectively. Other country entries are curated as practical, packable local-gift suggestions and can be updated by editing the seed or through a future CMS/admin interface.
