#!/bin/bash
set -e

echo "=== Stopping OpenClaw services ==="

# Stop OpenClaw if running
if command -v openclaw >/dev/null 2>&1; then
    echo "Stopping OpenClaw..."
    pkill -f "openclaw" || true
fi

# Optionally stop Ollama (uncomment if you want to stop it too)
# echo "Stopping Ollama..."
# pkill -f "ollama" || true

echo "Services stopped"
