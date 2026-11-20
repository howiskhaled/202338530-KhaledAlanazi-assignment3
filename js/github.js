/* Live GitHub repositories: fetched from the public GitHub REST API, cached,
   grouped by simple rules, then filtered and sorted by the visitor.
   Uses the shared helpers from script.js (i18n, store, motionPreference, trustedUrl). */
'use strict';

const GITHUB_USER = 'howiskhaled';
const GITHUB_REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`;
const REPO_CACHE_KEY = 'github-repos';
const REPO_CACHE_FRESH_MS = 30 * 60 * 1000; // Reuse a saved list for 30 minutes before asking GitHub again.
const REPO_TIMEOUT_MS = 10000;

// Colors GitHub uses for common languages. Unknown languages get the muted text color.
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#663399',
  Python: '#3572a5', Java: '#b07219', Swift: '#f05138', Kotlin: '#a97bff', Dart: '#00b4ab'
};

// Each sort option is a compare function for Array.prototype.sort.
// Ties fall back to the most recently updated repository, so the order is always stable.
const byUpdated = (a, b) => b.updated - a.updated;
const REPO_SORTERS = {
  updated: byUpdated,
  newest: (a, b) => b.created - a.created || byUpdated(a, b),
  oldest: (a, b) => a.created - b.created || byUpdated(a, b),
  // Sorts by the name the visitor actually sees ("Assignment 2"), not the raw repository name.
  name: (a, b) => prettyRepoName(a.name).localeCompare(prettyRepoName(b.name), i18n.language, { numeric: true, sensitivity: 'base' }),
  stars: (a, b) => b.stars - a.stars || byUpdated(a, b)
};

const isGitHubHost = (host) => host === 'github.com';
const isAnyHost = () => true;

// Groups a repository with three rules, checked in order.
function categorizeRepo(repo) {
  if (repo.fork) return 'team'; // Forks are team projects I contribute to.
  if (/assignment|coursework|swe-?\d{3}/i.test(repo.name) || repo.topics.includes('coursework')) return 'coursework';
  return 'personal';
}

// "202338530-KhaledAlanazi-assignment2" → "Assignment 2"; "course-register" → "Course register".
function prettyRepoName(name) {
  const assignment = name.match(/assignment[-_ ]?(\d+)/i);
  if (assignment) return i18n.t('repos.assignment', { number: i18n.number(Number(assignment[1])) });
  const words = name.replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// GitHub data is third-party: keep only the fields we use, with checked types and safe links.
function cleanRepo(raw) {
  if (!raw || typeof raw.name !== 'string') return null;
  const url = trustedUrl(raw.html_url, isGitHubHost);
  const created = new Date(raw.created_at);
  const updated = new Date(raw.pushed_at || raw.updated_at);
  if (!url || Number.isNaN(created.getTime()) || Number.isNaN(updated.getTime())) return null;
  const repo = {
    name: raw.name,
    description: typeof raw.description === 'string' ? raw.description.trim() : '',
    url,
    homepage: raw.homepage ? trustedUrl(raw.homepage, isAnyHost) : '',
    language: typeof raw.language === 'string' ? raw.language : '',
    stars: Number.isInteger(raw.stargazers_count) ? raw.stargazers_count : 0,
    fork: raw.fork === true,
    topics: Array.isArray(raw.topics) ? raw.topics.filter((topic) => typeof topic === 'string') : [],
    created,
    updated
  };
  repo.category = categorizeRepo(repo);
  return repo;
}

// The cache stores GitHub's own field names, so it is cleaned exactly like a live response.
function readRepoCache() {
  try {
    const saved = JSON.parse(localStorage.getItem(REPO_CACHE_KEY));
    if (!saved || !Array.isArray(saved.repos) || !Number.isFinite(saved.savedAt)) return null;
    return { savedAt: saved.savedAt, repos: saved.repos.map(cleanRepo).filter(Boolean) };
  } catch (error) {
    return null;
  }
}

function writeRepoCache(rawRepos) {
  const slim = rawRepos.map((repo) => ({
    name: repo.name, description: repo.description, html_url: repo.html_url, homepage: repo.homepage,
    language: repo.language, stargazers_count: repo.stargazers_count, fork: repo.fork, topics: repo.topics,
    created_at: repo.created_at, pushed_at: repo.pushed_at, updated_at: repo.updated_at
  }));
  try { localStorage.setItem(REPO_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), repos: slim })); } catch (error) { /* Optional. */ }
}

// An Error that also says what went wrong, so the page can show the right message.
function repoError(kind, extra = {}) {
  return Object.assign(new Error(`GitHub request failed: ${kind}`), { kind }, extra);
}

async function fetchRepos(signal) {
  let response;
  try {
    response = await fetch(GITHUB_REPOS_URL, { signal, headers: { Accept: 'application/vnd.github+json' } });
  } catch (error) {
    if (error.name === 'AbortError') throw repoError('slow');
    throw repoError(navigator.onLine ? 'failed' : 'offline');
  }
  // GitHub allows 60 requests an hour without signing in, and says when the limit resets.
  if ((response.status === 403 || response.status === 429) && response.headers.get('x-ratelimit-remaining') === '0') {
    const reset = Number(response.headers.get('x-ratelimit-reset'));
    throw repoError('rate', { resetAt: Number.isFinite(reset) && reset > 0 ? new Date(reset * 1000) : null });
  }
  if (response.status === 404) throw repoError('missing');
  if (!response.ok) throw repoError('failed');
  const data = await response.json();
  if (!Array.isArray(data)) throw repoError('failed');
  writeRepoCache(data);
  return data.map(cleanRepo).filter(Boolean);
}

function initGitHubProjects() {
  const section = document.getElementById('github');
  const chips = [...section.querySelectorAll('[data-repo-category]')];
  const sortSelect = document.getElementById('repo-sort');
  const list = document.getElementById('repo-list');
  const template = document.getElementById('repo-template');
  const summary = document.getElementById('repos-summary');
  const note = document.getElementById('repos-note');
  const panels = {
    loading: document.getElementById('repos-loading'),
    error: document.getElementById('repos-error')
  };
  const empty = document.getElementById('repos-empty');
  const view = {
    status: 'loading', // loading | error | ready
    repos: [],
    source: 'live', // live | cache | stale
    savedAt: 0,
    error: null
  };
  let requestId = 0;

  function buildCard(repo, index) {
    const item = template.content.firstElementChild.cloneNode(true);
    item.querySelector('.repo__category').textContent = i18n.t(`repos.${repo.category}`);
    item.querySelector('.repo__updated').textContent = i18n.t('repos.updated', { time: i18n.relativeTime(repo.updated) });
    item.querySelector('.repo__link').href = repo.url;
    item.querySelector('.repo__title').textContent = prettyRepoName(repo.name);
    item.querySelector('.repo__slug').textContent = `${GITHUB_USER}/${repo.name}`;
    item.querySelector('.repo__description').textContent = repo.description || i18n.t('repos.noDescription');
    item.querySelector('.repo__description').classList.toggle('is-placeholder', !repo.description);
    const language = item.querySelector('.repo__language');
    language.hidden = !repo.language;
    item.querySelector('.repo__language-name').textContent = repo.language;
    item.querySelector('.repo__dot').style.setProperty('--dot', LANGUAGE_COLORS[repo.language] || 'currentColor');
    const stars = item.querySelector('.repo__stars');
    stars.hidden = repo.stars === 0; // "0 stars" is noise, so it is only shown when there are some.
    stars.textContent = i18n.t(repo.stars === 1 ? 'repos.star' : 'repos.stars', { count: i18n.number(repo.stars) });
    const homepage = item.querySelector('.repo__homepage');
    homepage.hidden = !repo.homepage;
    if (repo.homepage) {
      homepage.href = repo.homepage;
      item.querySelector('.repo__homepage-label').textContent = i18n.t('repos.homepage');
    }
    item.style.setProperty('--enter-delay', `${index * 45}ms`);
    return item;
  }

  function renderNote() {
    if (view.status !== 'ready') { note.textContent = ''; return; }
    const time = i18n.relativeTime(new Date(view.savedAt));
    note.textContent = i18n.t(`repos.note.${view.source}`, { time });
  }

  // Step 1: count each group. Step 2: filter. Step 3: sort. Step 4: draw.
  function renderList(animate) {
    const category = store.get('repoCategory');
    const sortKey = store.get('repoSort');
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.repoCategory === category)));
    sortSelect.value = sortKey;
    if (view.status !== 'ready') return;

    const counts = { all: view.repos.length, coursework: 0, personal: 0, team: 0 };
    view.repos.forEach((repo) => { counts[repo.category] += 1; });
    section.querySelectorAll('[data-repo-count]').forEach((badge) => {
      badge.textContent = i18n.number(counts[badge.dataset.repoCount]);
    });

    const visible = view.repos
      .filter((repo) => category === 'all' || repo.category === category)
      .sort(REPO_SORTERS[sortKey]);

    list.replaceChildren(...visible.map(buildCard));
    list.hidden = visible.length === 0;
    empty.hidden = visible.length > 0;
    if (animate && !motionPreference.matches) list.querySelectorAll('.repo').forEach((item) => item.classList.add('is-entering'));
    summary.textContent = view.repos.length
      ? i18n.t('repos.summary', { count: i18n.number(visible.length), total: i18n.number(view.repos.length) })
      : '';
  }

  function renderStatus() {
    panels.loading.hidden = view.status !== 'loading';
    panels.error.hidden = view.status !== 'error';
    if (view.status !== 'ready') {
      list.hidden = true;
      empty.hidden = true;
      summary.textContent = '';
    }
    if (view.status === 'error') {
      const { kind, resetAt } = view.error;
      document.getElementById('repos-error-title').textContent = i18n.t(`repos.error.${kind}`);
      document.getElementById('repos-error-hint').textContent = kind === 'rate' && resetAt
        ? i18n.t('repos.hint.rateAt', { time: i18n.relativeTime(resetAt) })
        : i18n.t(`repos.hint.${kind}`);
    }
  }

  function render(animate = false) {
    renderStatus();
    renderList(animate);
    renderNote();
  }

  async function load() {
    const id = ++requestId;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REPO_TIMEOUT_MS);
    const saved = readRepoCache();
    if (view.status !== 'ready') { view.status = 'loading'; render(); }
    try {
      const repos = await fetchRepos(controller.signal);
      if (id !== requestId) return; // A newer request has started; ignore this answer.
      Object.assign(view, { status: 'ready', repos, source: 'live', savedAt: Date.now(), error: null });
    } catch (error) {
      if (id !== requestId) return;
      const failure = error.kind ? error : repoError('failed');
      // If GitHub fails but an older copy exists (saved, or already on screen), show it and say so.
      const fallback = saved && saved.repos.length ? saved
        : view.repos.length ? { repos: view.repos, savedAt: view.savedAt } : null;
      if (fallback) {
        Object.assign(view, { status: 'ready', repos: fallback.repos, source: 'stale', savedAt: fallback.savedAt, error: failure });
      } else {
        Object.assign(view, { status: 'error', error: failure });
      }
    } finally {
      clearTimeout(timer);
    }
    render(true);
  }

  chips.forEach((chip) => chip.addEventListener('click', () => store.set({ repoCategory: chip.dataset.repoCategory })));
  sortSelect.addEventListener('change', () => store.set({ repoSort: sortSelect.value }));
  document.getElementById('repos-show-all').addEventListener('click', () => store.set({ repoCategory: 'all' }));
  document.getElementById('repos-retry').addEventListener('click', load);
  // The filter can also be changed from the visitor panel, so the list listens to the store.
  store.subscribe((changed) => {
    if (changed.includes('repoCategory') || changed.includes('repoSort')) renderList(true);
  });
  document.addEventListener('languagechange', () => render(false));

  // A fresh saved list is shown straight away with no request at all.
  const cached = readRepoCache();
  if (cached && cached.repos.length && Date.now() - cached.savedAt < REPO_CACHE_FRESH_MS) {
    Object.assign(view, { status: 'ready', repos: cached.repos, source: 'cache', savedAt: cached.savedAt });
    render(false);
    return;
  }
  render(false);
  // Otherwise GitHub is asked only when the section is about to scroll into view.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      load();
    }, { rootMargin: '300px 0px' });
    observer.observe(section);
  } else {
    load();
  }
}

initGitHubProjects();
