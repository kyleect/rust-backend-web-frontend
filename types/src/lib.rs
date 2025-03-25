use std::fmt::Display;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

/// A key value pair
#[derive(TS, Clone, Debug, PartialEq, Serialize, Deserialize)]
#[ts(export)]
pub struct KeyValue {
    pub key: Key,
    pub value: Value,
}

impl KeyValue {
    pub fn new(key: impl Into<Key>, value: impl Into<Value>) -> Self {
        KeyValue {
            key: key.into(),
            value: value.into(),
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
        Value(s.to_string())
    }
}
