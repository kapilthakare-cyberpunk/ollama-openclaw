#!/bin/bash
set -e

echo "=== OpenClaw + Ollama Setup Script ==="

# Detect OS
OS="$(uname -s)"
echo "Detected OS: $OS"

# Check if running as root for system-wide install
if [ "$EUID" -eq 0 ] && [ "$OS" = "Linux" ]; then
    echo "Running as root - will install system-wide"
    SUDO=""
else
    SUDO="sudo"
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "--- Step 1: Install Ollama ---"
if command_exists ollama; then
    echo "Ollama already installed"
    ollama --version
else
    echo "Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

echo ""
echo "--- Step 2: Pull the model ---"
echo "Pulling gpt-oss:20b model (this may take a while)..."
ollama pull gpt-oss:20b

echo ""
echo "--- Step 3: Start Ollama server ---"
# Check if Ollama is already running
if curl -s http://localhost:11434/api/version >/dev/null 2>&1; then
    echo "Ollama server already running"
else
    echo "Starting Ollama server in background..."
    export OLLAMA_HOST=0.0.0.0:11434
    nohup ollama serve > /tmp/ollama.log 2>&1 &
    sleep 3
    echo "Ollama server started"
fi

echo ""
echo "--- Step 4: Install OpenClaw ---"
if command_exists openclaw; then
    echo "OpenClaw already installed"
else
    echo "Installing OpenClaw..."
    curl -fsSL https://openclaw.ai/install.sh | bash
fi

echo ""
echo "--- Step 5: Configure OpenClaw with Ollama ---"
# Create config directory
mkdir -p ~/.openclaw

# Copy config file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cp "$PROJECT_ROOT/config/openclaw-ollama.json" ~/.openclaw/config.json

echo "Configuration installed to ~/.openclaw/config.json"

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To start OpenClaw, run:"
echo "  openclaw onboard"
echo ""
echo "To test Ollama connection:"
echo "  curl http://localhost:11434/api/version"
