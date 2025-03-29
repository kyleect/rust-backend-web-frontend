app-name := "rust-web-app"

default:
    @just --list

# Delete build artifacts for server and client
clean:
    cd server && just clean
    cd types && just clean
    cd client && just clean

# Build the code
build:
    cd types && just build
    just build-client
    just build-server

# Build the server
[private]
build-server:
    cd server && just build

# Build the client
[private]
build-client:
    cd client && just build

# Build the code for release
build-release:
    cd types && just build-release
    just build-client-release
    just build-server-release

# Build the server for release
[private]
build-server-release:
    cd server && just build-release

# Build the client for release
[private]
build-client-release:
    cd client && just build-release

# Watch the client for changes and rebuild
[private]
watch-client:
    cd client && just watch

# Watch the server for changes and rebuild
[private]
watch-server:
    cd server && just watch

# Watch the types for changes and rebuild
[private]
watch-types:
    cd types && just watch

[unix]
install: build
    cp target/debug/server ~/.cargo/bin/{{app-name}}

[windows]
install: build
    cp target/debug/server.exe ~/.cargo/bin/{{app-name}}.exe

[unix]
install-release: build-release
    cp target/release/server ~/.cargo/bin/{{app-name}}

[windows]
install-release: build-release
    cp target/release/server.exe ~/.cargo/bin/{{app-name}}.exe

# Start the server and client in development mode
watch: build
  #!/usr/bin/env -S parallel --shebang --ungroup --jobs {{ num_cpus() }}
  just watch-types
  just watch-client
  just watch-server

[private]
run-server-dev port:
    cargo run -F development_mode --bin server -- --port {{port}} --open false

# Check linters against code
lint:
    cd server && just lint
    cd client && just lint

# Automatically fix linting errors in code
lint-fix:
    cd server && just lint-fix
    cd client && just lint-fix

# Format code
format:
    cd server && just format
    cd client && just format

# Check that the code is formatted correctly
format-check:
    cd server && just format-check
    cd client && just format-check

# Run all non-test checks against code
check:
    cd types && just build
    cd server && just check
    cd client && just check

# Run all checks, tests, and build the code
verify:
    cd types && just build
    cd server && just verify
    cd client && just verify

# Run all tests
test:
    cd types && just build
    cd server && just test
    cd client && just test

# Remove local branches that have been merged upstream
clean-git-branches:
    git branch -d $(git branch --merged=main | grep -v main) && git fetch --prune