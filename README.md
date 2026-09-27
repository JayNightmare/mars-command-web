# Mars Command Web

A responsive Mars Command colony status site built with React, TypeScript, Vite, and Tailwind CSS v4. The desktop Tauri launcher is maintained separately in `mars-command-client`.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, copy the example with `Copy-Item .env.example .env.local`. The example connects to the live MCStatus.io API. To show clearly marked simulated status during development instead, set `VITE_USE_MOCK_STATUS=true` in `.env.local`. The mock defaults to online with zero personnel. Production always uses the API provider.

Useful commands:

- `npm run dev` starts the Vite development server.
- `npm test` runs status parsing and copy tests.
- `npm run lint` runs Oxlint.
- `npm run build` type-checks and produces the production bundle in `dist/`.
- `npm run preview` serves the production bundle locally.

## Environment

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_STATUS_API_URL` | MCStatus.io Java status API base URL, or same-origin proxy prefix | dev: `/api/mcstatus`; production: direct MCStatus.io URL |
| `VITE_LAUNCHER_DOWNLOAD_URL` | Real launcher artifact URL; must be HTTP(S) | unset, download disabled |
| `VITE_CLIENT_VERSION` | Launcher version displayed on the page | `0.1.2` |
| `VITE_SERVER_ADDRESS` | Public Minecraft server host | `play.nexusgit.info` |
| `VITE_VOICE_ADDRESS` | Public voice host | `voice.nexusgit.info` |
| `VITE_USE_MOCK_STATUS` | Development-only mock switch; ignored in production | `false` |
| `BASE_PATH` | Vite deployment path, such as `/mars/` | `/` |

Vite `VITE_*` values are embedded in the public browser bundle. Never put tokens, webhooks, Minecraft credentials, or other secrets in them.

## Status API

The frontend requests the configured API base plus the encoded `VITE_SERVER_ADDRESS` immediately on page load and again every 15 seconds. In development, `/api/mcstatus` is proxied by Vite to `https://api.mcstatus.io/v2/status/java`, avoiding browser cross-origin/network restrictions. Production defaults to MCStatus.io directly unless `VITE_STATUS_API_URL` points at a same-origin proxy. Requests are serialized so slow responses cannot overlap; the refresh control runs the same guarded request. A five-second client timeout applies. Network errors, non-2xx responses, invalid JSON, and invalid required fields become a safe offline result. Optional/missing telemetry is rendered as an em dash and never as `undefined`, `null`, or `NaN`.

MCStatus.io's response is mapped into the site's `ServerStatus` shape. Player counts come from `players.online` and `players.max`; version and MOTD use their `name_clean` and `clean` fields. `retrieved_at` supplies the last-check time. MCStatus.io does not return server ping latency, so latency remains unavailable rather than showing the browser's connection time to the API.

The service currently documents a 60-second response cache and a limit of five requests per second per client IP. The page's 15-second polling therefore may receive cached results between upstream checks. For higher-traffic deployment, route requests through a shared server/edge cache so each visitor does not independently poll the public API. MCStatus.io returns plain text for non-2xx errors; the client reports these as a safe offline status without exposing raw response bodies.

The mapped client-side status type is:

```ts
type ServerStatus = {
  online: boolean
  host: string
  port: number
  playersOnline: number | null
  playersMax: number | null
  latencyMs: number | null
  motd: string | null
  versionName: string | null
  checkedAt: string
  error: string | null
}
```

The web project does not speak the Minecraft protocol from the browser; it consumes MCStatus.io's public read-only HTTP API, which performs the status query. If MCStatus.io is unavailable, or if traffic needs shared caching or rate limiting, replace `VITE_STATUS_API_URL` with a compatible server-side proxy and keep any upstream credentials there.

## Launcher release

Until `VITE_LAUNCHER_DOWNLOAD_URL` contains a real HTTP(S) artifact URL, the download control is disabled and says “LAUNCHER DOWNLOAD COMING SOON.” The page identifies the launcher channel as a preview and does not claim client synchronization is implemented. Configure the artifact URL only when a real release is available; publish `VITE_CLIENT_VERSION` alongside it.

The current five-step install guide is informational. The future Tauri release system can connect by publishing versioned launcher artifacts and a signed manifest, then setting the public download URL/version at deployment. Add authenticated release management and client update verification in the launcher/backend, not in this public site.

## Deployment

GitHub Pages deploys automatically when changes are pushed to `main`, or manually from the Actions tab with **Deploy to GitHub Pages**. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The workflow builds and publishes `dist/` for the custom domain `https://mars.nexusgit.info/`, with `BASE_PATH=/` and the domain CNAME included in the artifact.

To build locally for the custom domain in PowerShell, set `$env:BASE_PATH="/"` before running `npm run build`. Configure `VITE_LAUNCHER_DOWNLOAD_URL` and other public `VITE_*` values in the workflow if needed; GitHub Pages cannot provide a server-side proxy, so the status API uses its public MCStatus.io endpoint directly. Never put secrets in `VITE_*` values.
