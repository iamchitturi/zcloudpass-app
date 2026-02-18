<div align="center">
  <img src="https://raw.githubusercontent.com/zcloudpass/zcloudpass/main/assets/rounded/logo.png" alt="zCloudPass Logo" width="200"/>
  <h1>zCloudPass App</h1>
</div>

A client-side encrypted vault/password manager desktop app built with React + Vite + Tailwind and packaged with Tauri (Rust).

This repository contains the frontend application (TypeScript + React) and the Tauri Rust glue in `src-tauri` that builds the native desktop app. The backend API used by the app is expected to be a separate service (see `src/lib/api.ts` for the default API URL).

This project is intended as a reference/dev scaffold — encryption, key management and vault operations are performed client-side; the server stores an opaque `encrypted_vault` blob per user.

## Quick overview

- Language & frameworks: TypeScript, React, Vite, Tailwind CSS, Tauri (Rust).
- Purpose: provide a local desktop client that authenticates against a backend, fetches/stores an opaque `encrypted_vault` string, and performs all encryption locally.
- Important folders/files:
  - `src/` — React app and UI components (`src/components`, `src/lib`, assets).
  - `src-tauri/` — Tauri Rust project (Rust glue, `Cargo.toml`, `tauri.conf.json`).
  - `src/lib/api.ts` — API client; default base URL is `http://localhost:3000/api/v1`.
  - `package.json` — scripts: `dev`, `build`, `preview`, `tauri`.

## Minimal quick start (developer)

Prerequisites:

- Node.js (16+ recommended) and npm
- Rust toolchain (`rustup`, `cargo`) for Tauri
- Tauri system deps (platform-specific, see notes below)

Install and run in development mode:

```bash
# from repo root
npm install
# start the app with live reload (this runs the web dev server then launches Tauri)
npx tauri dev
```

Build production bundles (on the target OS):

```bash
npx tauri build
```

Notes:

- You can also run the frontend separately during development with `npm run dev` and then in another terminal run `npx tauri dev` to attach.
- The app expects a backend API. See `src/lib/api.ts` for the API base URL and available endpoints (default: `http://localhost:3000/api/v1`).

## API summary (expected by the client)

- POST `/api/v1/auth/register` — register a user (see `src/lib/api.ts` request shape).
- POST `/api/v1/auth/login` — create a session; returns a `session_token`.
- GET `/api/v1/vault` — returns `{ "encrypted_vault": "<string|null>" }` for the authenticated user.
- PUT `/api/v1/vault` — accepts `{ "encrypted_vault": "<string>" }` and stores it for the authenticated user.
- POST `/api/v1/auth/change-password` — change account password (used by client flow).
- GET `/api/v1/auth/health` — health check endpoint used by client check.

All vault endpoints require an `Authorization: Bearer <session_token>` header; the client stores the token in `localStorage`.

## Platform prerequisites (summary)

- macOS: Xcode Command Line Tools (`xcode-select --install`), Rust toolchain. Notarization/signing requires an Apple developer account.
- Windows: Visual Studio with "Desktop development with C++" (MSVC) toolchain, WebView2 runtime; use MSVC Rust toolchain target.
- Linux: system packages for WebKitGTK (e.g., `libwebkit2gtk-4.0-dev`), `pkg-config`, `libssl-dev`.

For more detailed platform steps see the Tauri docs: https://tauri.app

## Security notes

- The client performs encryption/decryption of vault data. The server only stores an opaque `encrypted_vault` string — do not decrypt on the server.
- The default API client and sample backend implementations are minimal and intended for development. Implement proper authentication, rate limiting, and validation before production use.

## Deployment

This application is deployed on **[Vercel](https://vercel.com)**. The deployment configuration is defined in `vercel.json` at the project root.

- **Live URL**: Hosted on Vercel (auto-deployed from the `master` branch).
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Framework**: Vite
- **SPA rewrites**: All routes are rewritten to `/index.html` for client-side routing.

## Contributing

PRs and issues welcome. Keep changes small and focused.

## License

This repository is licensed under the MIT License — see `LICENSE`.
