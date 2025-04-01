# rust-backend-web-frontend

[![build-artifacts](https://github.com/kyleect/rust-backend-web-frontend/actions/workflows/build-artifacts.yml/badge.svg)](https://github.com/kyleect/rust-backend-web-frontend/actions/workflows/build-artifacts.yml)

Template for a backend API in Rust statically serving a frontend in React.

## Getting Started

See [DEVELOPMENT.md](./DEVELOPMENT.md) for instructions on how to set up the project.

## Ideal For

- Development or testing tools

## Not Ideal For

- Most consumer apps where user friendliness is priority

## Stack

- **Backend:** Rust, Axum, Tokio
- **Frontend:** Typescript, React, Tanstack Router

## Features

- Produces a tiny single binary
- Backend for frontend provides encapsulation. There is no server side rendering
- No CORS headers required
- Shared types between backend and frontend (Rust -> Typescript type generation)
- Development mode (hot-reloading client, recompiling server & types)
- Tracing/logging in server
- E2E tests provided by Playwright

## Todo

- [ ] SQLite support (controlled with Cargo feature)
