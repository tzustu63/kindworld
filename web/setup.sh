#!/bin/bash

# KindWorld Web Application Setup Script
# This script will install dependencies and start the development server

echo "🌟 KindWorld Web Application Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if we're in the web directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    echo "Please run this script from the web directory"
    exit 1
fi

echo "📦 Installing dependencies..."
echo ""
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Installation failed"
    exit 1
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 Starting development server..."
echo ""
echo "The app will open at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
