# Hostinger Node.js deployment

Use these settings for `antalyarentacar.rent`:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Root directory | Repository root |
| Framework | Nitro |
| Node.js | 22.x (22.12 or newer) |
| Package manager | npm |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `.output` |
| Start command | `npm start` |
| Entry file, if requested | `.output/server/index.mjs` |

The production server uses Hostinger's `PORT` environment variable. No database
or application secrets are needed for the public website. Keep the complete
`.output` directory: `server` contains the Node entry and `public` contains the
client JavaScript, styles, fonts and videos.

`npm run test:production` starts the built server on an available local port and
checks server-rendered content, CSS/JavaScript, video byte ranges and missing
files. Run it after `npm run build`.

Local packages use their `0.0.0` workspace versions so npm links them from
`packages/*` without the unsupported `workspace:` protocol. Commit both
`package-lock.json` and `bun.lock` when dependencies change. Bun remains available
for development and the existing tests (`bun run test`).

The default build produces Nitro's Node output. The original Cloudflare Worker
build remains available with `npm run build:worker`; the GitHub Pages workflow
continues to use `vite.pages.config.ts`.
