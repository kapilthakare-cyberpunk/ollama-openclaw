#!/bin/bash
set -e

echo "=== Starting OpenClaw with Ollama ==="

# Start Ollama if not running
if curl -s http://localhost:11434/api/version >/dev/null 2>&1; then
    echo "Ollama is already running"
else
    echo "Starting Ollama server..."
    export OLLAMA_HOST=0.0.0.0:11434
    nohup ollama serve > /tmp/ollama.log 2>&1 &
    sleep 3
    echo "Ollama started"
fi

# Verify model is available
echo "Checking available models..."
ollama list

echo ""
echo "Starting OpenClaw..."
openclaw onboard
