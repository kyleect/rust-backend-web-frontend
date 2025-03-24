use std::sync::Arc;

use axum::Router;

use clap::Parser;
#[cfg(not(feature = "development_mode"))]
use include_dir::{Dir, include_dir};
use server::Error;
#[cfg(feature = "development_mode")]
use tower_http::services::ServeDir;
#[cfg(not(feature = "development_mode"))]
use tower_serve_static::ServeDir as StaticServeDir;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let args = Args::parse();

    // Get port or default to a random port
    let port = args.port.unwrap_or(0);

    // Dynamically serve the static directory for development
    #[cfg(feature = "development_mode")]
    let static_dir = {
        eprintln!("App starting in development mode");
        ServeDir::new(format!("{}/static", env!("CARGO_MANIFEST_DIR")))
    };

    // Package the files in static inside built binary
    #[cfg(not(feature = "development_mode"))]
    let static_dir = {
        eprintln!("App starting in production mode");
        static ASSETS_DIR: Dir<'static> = include_dir!("$CARGO_MANIFEST_DIR/static");
        StaticServeDir::new(&ASSETS_DIR)
    };

    let state = Arc::new(AppState {});

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await?;
    let addr = listener.local_addr()?;
    let url = format!("http://{addr}");

    eprintln!("App is running: {url}");

    if webbrowser::Browser::is_available() {
        webbrowser::open(&url)?;
    }

    let app = Router::new()
        .fallback_service(static_dir.clone())
        .with_state(state);

    axum::serve(listener, app).await?;

    Ok(())
}

#[derive(Parser)]
struct Args {
    /// Set which port to use (default: random)
    #[arg(long)]
    port: Option<u16>,
}

#[derive(Clone)]
struct AppState {}
