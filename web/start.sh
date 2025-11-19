#!/bin/sh
# Railway start script

# Debug: Print current directory and environment
echo "Current directory: $(pwd)"
echo "PORT environment variable: ${PORT:-not set}"
echo "Listing files in current directory:"
ls -la

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
echo "Command: serve -s dist -l $PORT"

# Start serve with SPA mode
exec serve -s dist -l $PORT

