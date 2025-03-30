use std::sync::{Arc, Mutex};

use axum::{
    Json, Router,
    extract::{MatchedPath, Path, Request, State},
    http::StatusCode,
    routing::get,
};

use clap::Parser;
#[cfg(not(feature = "development_mode"))]
use include_dir::{Dir, include_dir};
use server::Error;
#[cfg(feature = "development_mode")]
use tower_http::services::ServeDir;
use tower_http::{compression::CompressionLayer, trace::TraceLayer};
#[cfg(not(feature = "development_mode"))]
use tower_serve_static::ServeDir as StaticServeDir;
use tracing::info_span;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use types::{KeyValue, UpdateKeyValue};

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                // axum logs rejections from built-in extractors with the `axum::rejection`
                // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
                format!(
                    "{}=debug,tower_http=debug,axum::rejection=trace",
                    env!("CARGO_CRATE_NAME")
                )
                .into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

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

    let state = Arc::new(Mutex::new(AppState {
        data: vec![
            KeyValue::new("test-key", "\"test value\"", None),
            KeyValue::new_secret(
                "test-key2",
                "[1, 2, 3]",
                Some(r#"{"type": "array", "items": ["number"]}"#),
            ),
            KeyValue::new("test-key3", "\"test value 3\"", None),
            KeyValue::new("test-key4", "\"test value 4\"", None),
            KeyValue::new("test-key5", "\"test value 5\"", None),
            KeyValue::new("test-key6", "\"test value 6\"", None),
            KeyValue::new("test-key7", "\"test value 7\"", None),
            KeyValue::new("test-key8", "\"test value 8\"", None),
            KeyValue::new("test-keyb", "\"test valueb\"", None),
            KeyValue::new("test-keyb2", "\"test valueb 2\"", None),
            KeyValue::new("test-keyb3", "\"test valueb 3\"", None),
            KeyValue::new("test-keyb4", "\"test valueb 4\"", None),
            KeyValue::new("test-keyb5", "\"test valueb 5\"", None),
            KeyValue::new("test-keyb6", "\"test valueb 6\"", None),
            KeyValue::new("test-keyb7", "\"test valueb 7\"", None),
            KeyValue::new("test-keyb8", "\"test valueb 8\"", None),
            KeyValue::new("test-kecy", "\"test valuec\"", None),
            KeyValue::new("test-keyc2", "\"test valuec 2\"", None),
            KeyValue::new("test-keyc3", "\"test valuec 3\"", None),
            KeyValue::new("test-keyc4", "\"test valuec 4\"", None),
            KeyValue::new("test-keyc5", "\"test valuec 5\"", None),
            KeyValue::new("test-keyc6", "\"test valuec 6\"", None),
            KeyValue::new("test-keyc7", "\"test valuec 7\"", None),
            KeyValue::new("test-keyc8", "\"test valuec 8\"", None),
            KeyValue::new("test-keyd", "\"test valued\"", None),
            KeyValue::new("test-keyd2", "\"test valued 2\"", None),
            KeyValue::new("test-keyd3", "\"test valued 3\"", None),
            KeyValue::new("test-keyd4", "\"test valued 4\"", None),
            KeyValue::new("test-keyd5", "\"test valued 5\"", None),
            KeyValue::new("test-keyd6", "\"test valued 6\"", None),
            KeyValue::new("test-keyd7", "\"test valued 7\"", None),
            KeyValue::new("test-keyd8", "\"test valued 8\"", None),
        ],
    }));

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await?;
    let addr = listener.local_addr()?;
    let url = format!("http://{addr}");

    eprintln!("App is running: {url}");

    tracing::debug!("listening on {}", url);

    if args.open.unwrap_or(true) && webbrowser::Browser::is_available() {
        webbrowser::open(&url)?;
    }

    let compression_layer: CompressionLayer =
        CompressionLayer::new().br(true).deflate(true).gzip(true);

    let app = Router::new()
        .route("/api/data", get(get_values).post(create_key_value))
        .route(
            "/api/data/{key}",
            get(get_value).put(update_value).delete(delete_value),
        )
        .fallback_service(static_dir.clone())
        .with_state(state)
        .layer(compression_layer)
        .layer(
            TraceLayer::new_for_http().make_span_with(|request: &Request<_>| {
                let matched_path = request
                    .extensions()
                    .get::<MatchedPath>()
                    .map(MatchedPath::as_str);

                info_span!(
                    "http_request",
                    method = ?request.method(),
                    matched_path,
                    some_other_field = tracing::field::Empty,
                )
            }),
        );

    axum::serve(listener, app).await?;

    Ok(())
}

#[derive(Parser)]
struct Args {
    /// Set which port to use (default: random)
    #[arg(long)]
    port: Option<u16>,
    /// Open the URL in a browser after starting the server (default: true)
    #[arg(long)]
    open: Option<bool>,
}

#[derive(Clone)]
struct AppState {
    data: Vec<KeyValue>,
}

async fn create_key_value(
    State(state): State<Arc<Mutex<AppState>>>,
    Json(body): Json<KeyValue>,
) -> (StatusCode, Json<KeyValue>) {
    let state = state.clone();
    let mut state = state.lock().unwrap();

    state.data.push(body.clone());

    (StatusCode::CREATED, Json(body))
}

async fn get_values(
    State(state): State<Arc<Mutex<AppState>>>,
) -> (StatusCode, Json<Vec<KeyValue>>) {
    let state = state.clone();
    let state = state.lock().unwrap();

    (StatusCode::OK, Json(state.data.clone()))
}

async fn get_value(
    State(state): State<Arc<Mutex<AppState>>>,
    Path(key): Path<String>,
) -> Result<(StatusCode, Json<KeyValue>), (StatusCode, String)> {
    let state = state.clone();
    let state = state.lock().unwrap();

    let result = state
        .data
        .clone()
        .into_iter()
        .find(|x| x.key == key.as_str().into());

    match result {
        Some(result) => Ok((StatusCode::OK, Json(result))),
        None => Err((StatusCode::NOT_FOUND, "Value not found".into())),
    }
}

async fn update_value(
    State(state): State<Arc<Mutex<AppState>>>,
    Path(key): Path<String>,
    Json(body): Json<UpdateKeyValue>,
) -> Result<(StatusCode, Json<KeyValue>), (StatusCode, String)> {
    let state = state.clone();
    let mut state = state.lock().unwrap();

    let result = state
        .data
        .clone()
        .into_iter()
        .position(|x| x.key == key.as_str().into());

    match result {
        Some(result) => {
            state.data[result].value = body.clone().value;
            state.data[result].schema = body.clone().schema;

            Ok((StatusCode::OK, Json(state.data[result].clone())))
        }
        None => Err((StatusCode::NOT_FOUND, "Value not found".into())),
    }
}

async fn delete_value(
    State(state): State<Arc<Mutex<AppState>>>,
    Path(key): Path<String>,
) -> (StatusCode, ()) {
    let state = state.clone();
    let mut state = state.lock().unwrap();

    let result = state
        .data
        .clone()
        .into_iter()
        .position(|x| x.key == key.as_str().into());

    match result {
        Some(result) => {
            state.data.remove(result);
            (StatusCode::NO_CONTENT, ())
        }
        None => (StatusCode::NOT_FOUND, ()),
    }
}
