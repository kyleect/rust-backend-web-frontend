use std::fmt::Display;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

/// A key value
#[derive(TS, Clone, Debug, PartialEq, Serialize, Deserialize)]
#[ts(export)]
pub struct KeyValue {
    pub key: Key,
    pub value: Value,
    pub schema: String,
    pub is_secret: bool,
}

impl KeyValue {
    /// Create a new key value
    pub fn new(key: impl Into<Key>, value: impl Into<Value>, schema: Option<&str>) -> Self {
        Self {
            key: key.into(),
            value: value.into(),
            schema: schema.unwrap_or(r#"{"type": "string"}"#).to_string(),
            is_secret: false,
        }
    }

    /// Create a new key value desecret
    pub fn new_secret(key: impl Into<Key>, value: impl Into<Value>, schema: Option<&str>) -> Self {
        Self {
            key: key.into(),
            value: value.into(),
            schema: schema.unwrap_or(r#"{"type": "string"}"#).to_string(),
            is_secret: true,
        }
    }
}

/// Update the value of a key value
#[derive(TS, Clone, Debug, PartialEq, Serialize, Deserialize)]
#[ts(export)]
pub struct UpdateKeyValue {
    pub value: Value,
    pub schema: String,
}

impl UpdateKeyValue {
    pub fn new(value: impl Into<Value>, schema: &str) -> Self {
        Self {
            value: value.into(),
            schema: schema.to_string(),
        }
    }
}

/// String key value
#[derive(TS, Clone, Debug, PartialEq, Serialize, Deserialize)]
#[ts(export)]
pub struct Key(String);

impl Display for Key {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl From<&str> for Key {
    fn from(s: &str) -> Self {
        Self(s.to_string())
    }
}

/// String value
#[derive(TS, Clone, Debug, PartialEq, Serialize, Deserialize)]
#[ts(export)]
pub struct Value(String);

impl Display for Value {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}
impl From<&str> for Value {
    fn from(s: &str) -> Self {
        let result = serde_json::from_str::<serde_json::Value>(s).expect("should be valid json");
        Value(result.to_string())
    }
}
