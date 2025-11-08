#!/bin/bash
echo "========================================"
echo "Starting AuraFit Backend Server"
echo "========================================"
echo ""
echo "Make sure MongoDB is running!"
echo ""
cd "$(dirname "$0")"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
echo ""
echo "Starting server on http://localhost:5001"
echo "Press Ctrl+C to stop"
echo ""
npm start

