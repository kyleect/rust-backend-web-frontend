use std::sync::Arc;

use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    routing::get,
};

use clap::Parser;
#[cfg(not(feature = "development_mode"))]
use include_dir::{Dir, include_dir};
use server::Error;
#[cfg(feature = "development_mode")]
use tower_http::services::ServeDir;
#[cfg(not(feature = "development_mode"))]
use tower_serve_static::ServeDir as StaticServeDir;
use types::KeyValue;

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

    let state = Arc::new(AppState {
        data: vec![
            KeyValue::new("test-key", "test value"),
            KeyValue::new("test-key2", "test value 2"),
            KeyValue::new("test-key3", "test value 3"),
            KeyValue::new("test-key4", "test value 4"),
            KeyValue::new("test-key5", "test value 5"),
            KeyValue::new("test-key6", "test value 6"),
            KeyValue::new("test-key7", "test value 7"),
            KeyValue::new("test-key8", "test value 8"),
            KeyValue::new("test-keyb", "test valueb"),
            KeyValue::new("test-keyb2", "test valueb 2"),
            KeyValue::new("test-keyb3", "test valueb 3"),
            KeyValue::new("test-keyb4", "test valueb 4"),
            KeyValue::new("test-keyb5", "test valueb 5"),
            KeyValue::new("test-keyb6", "test valueb 6"),
            KeyValue::new("test-keyb7", "test valueb 7"),
            KeyValue::new("test-keyb8", "test valueb 8"),
            KeyValue::new("test-kecy", "test valuec"),
            KeyValue::new("test-keyc2", "test valuec 2"),
            KeyValue::new("test-keyc3", "test valuec 3"),
            KeyValue::new("test-keyc4", "test valuec 4"),
            KeyValue::new("test-keyc5", "test valuec 5"),
            KeyValue::new("test-keyc6", "test valuec 6"),
            KeyValue::new("test-keyc7", "test valuec 7"),
            KeyValue::new("test-keyc8", "test valuec 8"),
            KeyValue::new("test-keyd", "test valued"),
            KeyValue::new("test-keyd2", "test valued 2"),
            KeyValue::new("test-keyd3", "test valued 3"),
            KeyValue::new("test-keyd4", "test valued 4"),
            KeyValue::new("test-keyd5", "test valued 5"),
            KeyValue::new("test-keyd6", "test valued 6"),
            KeyValue::new("test-keyd7", "test valued 7"),
            KeyValue::new("test-keyd8", "test valued 8"),
        ],
    });

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await?;
    let addr = listener.local_addr()?;
    let url = format!("http://{addr}");

    eprintln!("App is running: {url}");

    if webbrowser::Browser::is_available() {
        webbrowser::open(&url)?;
    }

    let app = Router::new()
        .route("/api/values", get(get_values))
        .route("/api/values/{key}", get(get_value))
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
struct AppState {
    data: Vec<KeyValue>,
}

async fn get_values(State(state): State<Arc<AppState>>) -> (StatusCode, Json<Vec<KeyValue>>) {
    (StatusCode::OK, Json(state.data.clone()))
}

async fn get_value(
    State(state): State<Arc<AppState>>,
    Path(key): Path<String>,
) -> (StatusCode, Json<KeyValue>) {
    let result = state
        .data
        .clone()
        .into_iter()
        .find(|x| x.key == key.as_str().into())
        .expect("No value with specified key found");

    (StatusCode::OK, Json(result))
}
