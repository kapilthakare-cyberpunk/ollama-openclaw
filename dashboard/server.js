const http = require('http');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = '/home/kapilt/.openclaw/openclaw.json';
const GATEWAY_URL = 'http://127.0.0.1:18789';

const PORT = 18888;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

async function fetchJSON(filePath) {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function checkGateway() {
  return new Promise((resolve) => {
    const req = http.get(GATEWAY_URL, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function formatDate(isoString) {
  if (!isoString) return 'Unknown';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

async function getApiData() {
  const configData = await fetchJSON(CONFIG_PATH);
  const updateData = await fetchJSON('/home/kapilt/.openclaw/update-check.json');
  const gatewayRunning = await checkGateway();
  
  const entries = configData?.plugins?.entries || {};
  const activePlugins = Object.entries(entries).filter(([_, v]) => v.enabled).length;
  const disabledPlugins = Object.entries(entries).filter(([_, v]) => !v.enabled).length;
  
  const providers = configData?.models?.providers || {};
  const defaultModel = configData?.agents?.defaults?.model?.primary || '';
  
  const models = [];
  for (const [providerName, provider] of Object.entries(providers)) {
    if (provider.models) {
      for (const model of provider.models) {
        models.push({
          ...model,
          provider: providerName,
          isPrimary: defaultModel.includes(model.id)
        });
      }
    }
  }
  
  const channels = [];
  if (configData?.channels?.whatsapp) {
    channels.push({
      name: 'WhatsApp',
      icon: '💬',
      enabled: true,
      config: configData.channels.whatsapp
    });
  }
  if (configData?.channels?.telegram?.enabled) {
    channels.push({
      name: 'Telegram',
      icon: '✈️',
      enabled: true,
      config: configData.channels.telegram
    });
  }
  
  const authProfiles = Object.entries(configData?.auth?.profiles || {}).map(([name, profile]) => ({
    name,
    provider: profile.provider,
    mode: profile.mode
  }));
  
  return {
    version: configData?.meta?.lastTouchedVersion || 'Unknown',
    lastUpdated: formatDate(configData?.meta?.lastTouchedAt),
    workspace: configData?.agents?.defaults?.workspace || 'Not set',
    gatewayRunning,
    plugins: {
      loaded: activePlugins,
      disabled: disabledPlugins,
      errors: 0,
      active: Object.entries(entries).filter(([_, v]) => v.enabled).map(([name]) => name)
    },
    skills: {
      eligible: 36,
      missing: 29,
      blocked: 0
    },
    channels,
    models,
    authProfiles,
    lastNotifiedVersion: updateData?.lastNotifiedVersion,
    lastCheckedAt: formatDate(updateData?.lastCheckedAt)
  };
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/api/data') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(await getApiData()));
    return;
  }
  
  let filePath = path.join(__dirname, req.url === '/' ? 'dashboard.html' : req.url);
  
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';
  
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(fs.readFileSync(filePath));
});

server.listen(PORT, () => {
  console.log(`OpenClaw Dashboard running at http://localhost:${PORT}/`);
});
