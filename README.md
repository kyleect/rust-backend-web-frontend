# rust-backend-web-frontend

Template for a backend API in Rust statically serving a frontend in React.

## Ideal For

- Ok to run on `localhost:{port}`
- Writing development or testing tools

## Not Ideal For

- Most consumer apps (not user friendly)

## Stack

- **Backend:** Rust, Axum, Tokio
- **Frontend:** Typescript, React, Tanstack Router

## Features

- Produces a tiny single binary
- Backend for frontend provides encapsulation. There is no server side rendering
- No CORS headers required
- Shared types between backend and frontend
- Development mode

## Todo

- [ ] Add hot reloading to development mode
- [ ] SQLite support (controlled with Cargo feature)
