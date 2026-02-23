async function loadDashboard() {
  try {
    const data = await fetch('/api/data').then(r => r.json());
    
    document.getElementById('version').textContent = data.version;
    
    const gatewayEl = document.getElementById('gateway-status');
    gatewayEl.textContent = data.gatewayRunning ? '🟢 Running' : '🔴 Stopped';
    gatewayEl.className = `value ${data.gatewayRunning ? 'status-active' : 'status-inactive'}`;
    
    document.getElementById('last-updated').textContent = data.lastUpdated;
    document.getElementById('workspace').textContent = data.workspace;
    
    document.getElementById('plugins-loaded').textContent = data.plugins.loaded;
    document.getElementById('plugins-disabled').textContent = data.plugins.disabled;
    document.getElementById('plugins-errors').textContent = data.plugins.errors;
    
    const pluginsList = document.getElementById('active-plugins');
    pluginsList.innerHTML = data.plugins.active
      .map(name => `<li><span class="item-name">${name}</span><span class="item-badge">Active</span></li>`)
      .join('') || '<li>No active plugins</li>';
    
    document.getElementById('skills-eligible').textContent = data.skills.eligible;
    document.getElementById('skills-missing').textContent = data.skills.missing;
    document.getElementById('skills-blocked').textContent = data.skills.blocked;
    
    const skillsList = document.getElementById('installed-skills');
    skillsList.innerHTML = data.skills.installed
      .map(name => `<li><span class="item-name">${name}</span><span class="item-badge">Installed</span></li>`)
      .join('') || '<li>No skills installed</li>';
    
    const channelsEl = document.getElementById('channels');
    channelsEl.innerHTML = data.channels.length
      ? data.channels.map(ch => `
        <div class="channel-item">
          <span class="channel-icon">${ch.icon}</span>
          <span class="channel-name">${ch.name}</span>
          <span class="channel-status enabled">✅ Configured</span>
        </div>
        <div class="channel-detail">
          DM: ${ch.config.dmPolicy || 'default'} | Groups: ${ch.config.groupPolicy || 'default'}
          ${ch.config.mediaMaxMb ? `| Max Media: ${ch.config.mediaMaxMb}MB` : ''}
          ${ch.config.streaming ? `| Streaming: ${ch.config.streaming}` : ''}
        </div>
      `).join('')
      : '<div class="channel-item"><span>No channels configured</span></div>';
    
    const modelsEl = document.getElementById('models-grid');
    modelsEl.innerHTML = data.models.length
      ? data.models.map(m => `
        <div class="model-card ${m.isPrimary ? 'primary' : ''}">
          <div class="model-name">${m.name}</div>
          <div class="model-info">
            Provider: ${m.provider} | Context: ${m.contextWindow?.toLocaleString() || 'N/A'} | 
            Max Tokens: ${m.maxTokens?.toLocaleString() || 'N/A'}
          </div>
        </div>
      `).join('')
      : '<div class="model-card">No models configured</div>';
    
    const authEl = document.getElementById('auth-grid');
    authEl.innerHTML = data.authProfiles.length
      ? data.authProfiles.map(p => `
        <div class="auth-card">
          <div class="provider">${p.provider}</div>
          <div class="mode">${p.mode}</div>
        </div>
      `).join('')
      : '<div>No auth profiles</div>';
    
    document.getElementById('last-refresh').textContent = new Date().toLocaleTimeString();
    
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

document.getElementById('refresh-btn').addEventListener('click', loadDashboard);

loadDashboard();
setInterval(loadDashboard, 30000);
