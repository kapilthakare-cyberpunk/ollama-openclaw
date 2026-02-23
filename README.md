# OpenClaw with Ollama

Local AI coding agent with Ollama LLM integration.

## Quick Start

### Docker (Recommended)

```bash
cd deploy
docker-compose up -d
docker exec -it openclaw-ollama ollama pull gpt-oss:20b
```

### Manual

```bash
./scripts/install.sh
./scripts/start.sh
```

## Project Structure

```
.
├── config/
│   └── openclaw-ollama.json    # OpenClaw configuration
├── scripts/
│   ├── install.sh              # Full installation script
│   ├── start.sh                # Start services
│   └── stop.sh                 # Stop services
├── deploy/
│   ├── docker-compose.yml      # Docker Compose deployment
│   └── Dockerfile.ollama       # Custom Ollama image
└── docs/
    └── deployment.md           # Detailed deployment guide
```

## Configuration

Edit `config/openclaw-ollama.json` to change:
- Model (`gpt-oss:20b`)
- Context window (131072)
- Max tokens (8192)
- Workspace path

## Usage

```bash
# Start
./scripts/start.sh

# Stop
./scripts/stop.sh
```

## Docs

See [docs/deployment.md](docs/deployment.md) for detailed instructions.
