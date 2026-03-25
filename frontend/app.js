const API = 'http://localhost:3000/api'; // Change to your Render URL before deploying

let token    = localStorage.getItem('sz_token')    || null;
let userId   = localStorage.getItem('sz_userId')   || null;
let username = localStorage.getItem('sz_username') || null;

document.addEventListener('DOMContentLoaded', () => {
  if (token && userId) showApp();
  else showAuth();
  bindEvents();
});

function showAuth() {
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('appScreen').classList.add('hidden');
  document.querySelector('.navbar').classList.add('hidden');
}

function showApp() {
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('appScreen').classList.remove('hidden');
  document.querySelector('.navbar').classList.remove('hidden');
  loadDashboard();
}

async function apiPost(endpoint, body, withAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (withAuth) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${endpoint}`, { method: 'POST', headers, body: JSON.stringify(body) });
  return res.json();
}

async function apiGet(endpoint) {
  const res = await fetch(`${API}${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.json();
}

async function apiDelete(endpoint) {
  const res = await fetch(`${API}${endpoint}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

function bindEvents() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const which = tab.dataset.tab;
      document.getElementById('loginForm').classList.toggle('hidden', which !== 'login');
      document.getElementById('registerForm').classList.toggle('hidden', which !== 'register');
    });
  });

  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = await apiPost('/auth/login', {
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value,
    });
    if (data.token) {
      token = data.token; userId = data.userId; username = data.username;
      localStorage.setItem('sz_token', token);
      localStorage.setItem('sz_userId', userId);
      localStorage.setItem('sz_username', username);
      showApp();
    } else {
      document.getElementById('loginError').textContent = data.error || 'Login failed';
    }
  });

  document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = await apiPost('/auth/register', {
      username: document.getElementById('regUsername').value,
      email:    document.getElementById('regEmail').value,
      password: document.getElementById('regPassword').value,
    });
    if (data.token) {
      token = data.token; userId = data.userId; username = data.username;
      localStorage.setItem('sz_token', token);
      localStorage.setItem('sz_userId', userId);
      localStorage.setItem('sz_username', username);
      showApp();
    } else {
      document.getElementById('registerError').textContent = data.error || 'Registration failed';
    }
  });

  document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); showSection(link.dataset.section); });
  });

  document.getElementById('logoutBtn').addEventListener('click', e => {
    e.preventDefault();
    token = userId = username = null;
    localStorage.clear();
    showAuth();
  });

  document.getElementById('portfolioForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = await apiPost('/portfolio', {
      title:       document.getElementById('portfolioTitle').value,
      description: document.getElementById('portfolioDesc').value,
      customURL:   document.getElementById('customURL').value || username,
    }, true);
    if (data._id) {
      alert('Portfolio saved!');
      if (data.customURL) updatePortfolioURL(data.customURL);
    } else alert(data.error || 'Save failed');
  });

  document.getElementById('addProjectBtn').addEventListener('click', () => {
    document.getElementById('projectForm').reset();
    document.getElementById('projectModal').classList.remove('hidden');
  });
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('projectModal').classList.add('hidden');
  });
  document.getElementById('projectModal').addEventListener('click', e => {
    if (e.target === document.getElementById('projectModal'))
      document.getElementById('projectModal').classList.add('hidden');
  });

  document.getElementById('projectForm').addEventListener('submit', async e => {
    e.preventDefault();
    const tags = document.getElementById('projTags').value;
    const data = await apiPost('/projects', {
      title:       document.getElementById('projTitle').value,
      description: document.getElementById('projDesc').value,
      type:        document.getElementById('projType').value,
      tags:        tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      link:        document.getElementById('projLink').value,
      github:      document.getElementById('projGithub').value,
      featured:    document.getElementById('projFeatured').checked,
    }, true);
    if (data._id) {
      document.getElementById('projectModal').classList.add('hidden');
      loadProjects();
    } else alert(data.error || 'Failed to add project');
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(btn.dataset.filter);
    });
  });

  document.getElementById('addYoutubeBtn').addEventListener('click', async () => {
    const url = document.getElementById('youtubeLink').value.trim();
    if (!url) return alert('Please enter a URL');
    const data = await apiPost('/interests/youtube', { url }, true);
    if (data._id) {
      document.getElementById('youtubeLink').value = '';
      renderYoutube(data.youtubeLinks);
    } else alert(data.error || 'Failed');
  });
}

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'projects')  loadProjects();
  if (id === 'interests') loadInterests();
}

async function loadDashboard() {
  const [portfolio, projects] = await Promise.all([
    apiGet(`/portfolio/user/${userId}`),
    apiGet(`/projects/user/${userId}`),
  ]);
  document.getElementById('projectCount').textContent = projects.length || 0;
  if (portfolio._id) {
    document.getElementById('viewCount').textContent = portfolio.viewCount || 0;
    document.getElementById('portfolioTitle').value  = portfolio.title || '';
    document.getElementById('portfolioDesc').value   = portfolio.description || '';
    document.getElementById('customURL').value       = portfolio.customURL || '';
    if (portfolio.customURL) updatePortfolioURL(portfolio.customURL);
  }
  renderSuggestions(portfolio, projects);
  renderProjects(projects);
}

function updatePortfolioURL(slug) {
  const url = `${window.location.origin}/portfolio/${slug}`;
  const el  = document.getElementById('portfolioURL');
  el.textContent = url;
  el.onclick = () => {
    navigator.clipboard.writeText(url);
    el.textContent = 'Copied!';
    setTimeout(() => el.textContent = url, 2000);
  };
}

async function loadProjects() {
  const projects = await apiGet(`/projects/user/${userId}`);
  document.getElementById('projectCount').textContent = projects.length;
  renderProjects(projects);
}

function renderProjects(projects) {
  const container = document.getElementById('projectsList');
  if (!projects.length) {
    container.innerHTML = '<p style="color:#999;padding:2rem 0;">No projects yet — add your first one!</p>';
    return;
  }
  container.innerHTML = projects.map(p => `
    <div class="project-card" data-type="${p.type}">
      <span class="type-badge">${p.type}</span>
      ${p.featured ? '<span class="featured-star" title="Featured">&#9733;</span>' : ''}
      <h3>${p.title}</h3>
      ${p.description ? `<p class="project-desc">${p.description}</p>` : ''}
      ${p.tags?.length ? `<div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
      <div class="project-links">
        ${p.link   ? `<a href="${p.link}"   target="_blank">View live</a>` : ''}
        ${p.github ? `<a href="${p.github}" target="_blank">GitHub</a>`    : ''}
      </div>
      <div class="project-actions">
        <button class="btn btn-sm btn-danger" onclick="deleteProject('${p._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  await apiDelete(`/projects/${id}`);
  loadProjects();
}

function filterProjects(filter) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.display = (filter === 'all' || card.dataset.type === filter) ? '' : 'none';
  });
}

async function loadInterests() {
  const data = await apiGet(`/interests/${userId}`);
  if (data.youtubeLinks) renderYoutube(data.youtubeLinks);
}

function renderYoutube(links) {
  const list = document.getElementById('youtubeList');
  if (!links.length) { list.innerHTML = '<p style="color:#999;">No videos added yet.</p>'; return; }
  list.innerHTML = links.map(url => `
    <div class="interest-item">
      <a href="${url}" target="_blank" rel="noopener">${url}</a>
    </div>
  `).join('');
}

function renderSuggestions(portfolio, projects) {
  const s = [];
  if (!portfolio?.description || portfolio.description.length < 50)
    s.push({ priority: 'high',   message: 'Write a detailed bio (50+ words) to tell your story.' });
  if (!projects?.length)
    s.push({ priority: 'high',   message: 'Add your first project to start building your portfolio.' });
  if (projects?.length && !projects.some(p => p.featured))
    s.push({ priority: 'medium', message: 'Mark your best work as featured so it stands out.' });
  if (!portfolio?.customURL)
    s.push({ priority: 'medium', message: 'Set a custom URL so your portfolio link looks professional.' });
  if (projects?.filter(p => p.type === 'writing').length > 3)
    s.push({ priority: 'low',    message: 'Great writing samples — consider starting a Substack or blog.' });
  if (projects?.filter(p => p.type === 'art').length > 2)
    s.push({ priority: 'low',    message: 'Solid art portfolio — consider selling prints or commissions.' });
  if (!s.length)
    s.push({ priority: 'low',    message: 'Portfolio looks great! Keep adding new work regularly.' });

  document.getElementById('suggestionsList').innerHTML = s.map(item => `
    <div class="suggestion-card ${item.priority}">${item.message}</div>
  `).join('');
}
