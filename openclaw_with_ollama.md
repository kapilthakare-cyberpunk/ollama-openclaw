# OpenClaw configuration with Ollama

### Install OpenClaw

`curl -fsSL https://openclaw.ai/install.sh | bash`

### Install Ollama

`curl -fsSL https://ollama.com/install.sh | sh`

### Run a powerful model locally

`ollama run gpt-oss:20b`

### Uninstall OpenClaw (if exists)

`openclaw uninstall`

### Prepare OpenClaw config for Ollama

```json
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://localhost:11434/v1",
        "apiKey": "ollama-local",
        "api": "openai-completions",
        "models": [
          {
            "id": "gpt-oss:20b",
            "name": "gpt-oss:20b",
            "reasoning": false,
            "input": [
              "text"
            ],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 131072,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/gpt-oss:20b"
      },
      "workspace": "/Users/abhi/.openclaw/workspace",
      "maxConcurrent": 4,
      "subagents": {
        "maxConcurrent": 8
      }
    }
  },
  "tools": {
    "web": {
      "search": {
        "enabled": false
      },
      "fetch": {
        "enabled": true
      }
    }
  }
}
```

### Start OpenClaw

`openclaw onboard`

### Configure it with Telegram (optional)

Steps explained in the video.