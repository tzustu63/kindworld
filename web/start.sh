#!/bin/sh
# Railway start script

# Debug: Print current directory and environment
echo "Current directory: $(pwd)"
echo "PORT environment variable: ${PORT:-not set}"
echo "NODE_ENV: ${NODE_ENV:-not set}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "ERROR: node_modules not found!"
  exit 1
fi

# Check if serve is installed
if [ ! -f "node_modules/.bin/serve" ]; then
  echo "ERROR: serve binary not found in node_modules/.bin/"
  echo "Checking node_modules:"
  ls -la node_modules/.bin/ | grep serve || echo "serve not found"
  exit 1
fi

echo "serve binary found"

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "ERROR: dist directory not found!"
  echo "Current directory contents:"
  ls -la
  echo "Please ensure the build completed successfully."
  exit 1
fi

echo "dist directory exists. Contents:"
ls -la dist/ | head -20

# Use PORT environment variable, fallback to 3000
PORT=${PORT:-3000}

echo "Starting serve on port $PORT..."
echo "Serving from: $(pwd)/dist"
echo "Command: node_modules/.bin/serve -s dist -l $PORT"
echo "Note: serve defaults to listening on 0.0.0.0 (all interfaces)"

# Start serve with SPA mode using absolute path
# serve defaults to listening on 0.0.0.0, so we only need to specify the port
exec node_modules/.bin/serve -s dist -l $PORT

