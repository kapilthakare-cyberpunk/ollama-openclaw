# OpenClaw with Ollama - Deployment Guide

## Prerequisites

- Docker & Docker Compose (for containerized deployment)
- OR curl (for manual installation)

---

## Method 1: Docker Compose (Recommended)

### Quick Start

```bash
cd deploy
docker-compose up -d
```

### First Run - Pull Model

The model needs to be pulled on first run:

```bash
docker exec -it openclaw-ollama ollama pull gpt-oss:20b
```

### Verify Services

```bash
# Check Ollama
curl http://localhost:11434/api/version

# Check OpenClaw
curl http://localhost:8080/health
```

### Stop Services

```bash
docker-compose down
```

---

## Method 2: Manual Installation

### Step 1: Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Run Ollama

```bash
export OLLAMA_HOST=0.0.0.0:11434
ollama serve
```

### Step 3: Pull Model

In another terminal:

```bash
ollama pull gpt-oss:20b
```

### Step 4: Install OpenClaw

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### Step 5: Configure OpenClaw

```bash
mkdir -p ~/.openclaw
cp config/openclaw-ollama.json ~/.openclaw/config.json
```

### Step 6: Start OpenClaw

```bash
openclaw onboard
```

---

## Configuration

Edit `config/openclaw-ollama.json` to customize:

- Model ID (`gpt-oss:20b`)
- Context window size
- Max tokens
- Web tools (search/fetch)
- Workspace path

---

## Troubleshooting

### Ollama not responding

```bash
docker logs openclaw-ollama
# or
tail /tmp/ollama.log
```

### Model not found

```bash
docker exec -it openclaw-ollama ollama list
```

### Reset configuration

```bash
rm ~/.openclaw/config.json
cp config/openclaw-ollama.json ~/.openclaw/config.json
```
