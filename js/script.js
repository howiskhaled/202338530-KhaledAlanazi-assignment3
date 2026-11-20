'use strict';

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
// Shared by every feature file. i18n.js and state.js load before this file;
// visitor.js and github.js load after it and reuse these names.
const i18n = window.portfolioI18n;
const store = window.portfolioState;
i18n.init();

function initThemeToggle() {
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  const update = () => {
    const dark = root.dataset.theme === 'dark';
    button.setAttribute('aria-label', i18n.t(dark ? 'theme.light' : 'theme.dark'));
    button.setAttribute('aria-pressed', String(dark));
    document.querySelector('meta[name="theme-color"]').content = getComputedStyle(root).getPropertyValue('--bg').trim();
  };
  button.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (error) { /* Storage is optional. */ }
    update();
  });
  document.addEventListener('languagechange', update);
  update();
}

function getGreeting(hour) {
  if (hour >= 5 && hour < 12) return 'greeting.morning';
  if (hour >= 12 && hour < 17) return 'greeting.afternoon';
  if (hour >= 17 && hour < 22) return 'greeting.evening';
  return 'greeting.night';
}

// The greeting depends on two things: the time of day and whether the visitor saved a name.
function initGreeting() {
  const update = () => {
    const key = getGreeting(new Date().getHours());
    const name = store.get('name');
    document.getElementById('greeting').textContent = name
      ? i18n.t(`${key}Named`, { name: `\u2068${i18n.language === 'ar' ? name : name.toLocaleUpperCase()}\u2069` })
      : i18n.t(key);
    ['year', 'hero-year'].forEach((id) => {
      document.getElementById(id).textContent = i18n.number(new Date().getFullYear());
    });
  };
  document.addEventListener('languagechange', update);
  store.subscribe((changed) => { if (changed.includes('name')) update(); });
  update();
}

function initMotion() {
  const button = document.getElementById('motion-toggle');
  const label = document.getElementById('motion-label');
  const hero = document.querySelector('.hero');
  let paused = false;
  try { paused = localStorage.getItem('motion-paused') === 'true'; } catch (error) { /* Optional preference. */ }
  const update = () => {
    const reduced = motionPreference.matches;
    const stopped = paused || reduced;
    document.documentElement.classList.toggle('motion-paused', stopped);
    button.setAttribute('aria-pressed', String(stopped));
    button.disabled = reduced;
    label.textContent = i18n.t(reduced ? 'motion.reduced' : paused ? 'motion.play' : 'motion.pause');
    button.querySelector('.motion-toggle__icon').textContent = stopped ? '▷' : 'Ⅱ';
  };
  button.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('motion-paused', String(paused)); } catch (error) { /* Optional preference. */ }
    update();
  });
  motionPreference.addEventListener('change', update);
  document.addEventListener('languagechange', update);
  update();

  // Compositor animations stop when the atmosphere leaves the viewport.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => hero.classList.toggle('is-offscreen', !entry.isIntersecting)).observe(hero);
  }
}

function initScrollReveal() {
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending');
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.reveal').forEach((item) => {
    // Content is visible by default, including when JavaScript is unavailable.
    item.classList.add('is-pending');
    observer.observe(item);
  });
  document.addEventListener('focusin', (event) => {
    const item = event.target.closest('.reveal');
    if (item) {
      item.classList.remove('is-pending');
      observer.unobserve(item);
    }
  });
}

function syncScrollLock() {
  document.body.classList.toggle('no-scroll', Boolean(document.querySelector('dialog[open]')));
}

function initHeader() {
  const header = document.querySelector('.site-header');
  let scheduled = false;
  const update = () => {
    const behind = document.elementFromPoint(window.innerWidth / 2, 48);
    const dark = behind && behind.closest('.hero, .skills-section, .portfolio-visual');
    header.classList.toggle('is-on-paper', !dark);
    scheduled = false;
  };
  const schedule = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('languagechange', schedule);
  update();
}

function initMobileMenu() {
  const dialog = document.getElementById('mobile-menu');
  const trigger = document.getElementById('menu-toggle');
  if (typeof dialog.showModal !== 'function') return;
  document.documentElement.classList.add('menu-ready');
  trigger.addEventListener('click', () => {
    dialog.showModal();
    trigger.setAttribute('aria-expanded', 'true');
    syncScrollLock();
  });
  document.getElementById('menu-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
    syncScrollLock();
  });
  dialog.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      dialog.close();
      syncScrollLock();
      // Move keyboard focus to the destination, not back to the menu toggle.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: motionPreference.matches ? 'instant' : 'smooth' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', (event) => {
    if (event.matches && dialog.open) dialog.close();
  });
}

const mizanytiSlides = [
  { src: 'assets/images/mizanyti-overview-en.jpg' },
  { src: 'assets/images/mizanyti-activity-en.jpg' },
  { src: 'assets/images/mizanyti-insights-en.jpg' },
  { src: 'assets/images/mizanyti-plan-en.jpg' },
  { src: 'assets/images/mizanyti-overview-ar.jpg' },
  { src: 'assets/images/mizanyti-overview-ar-dark.jpg' },
  { src: 'assets/images/mizanyti-activity-ar-dark.jpg' }
];

function initGallery() {
  const dialog = document.getElementById('gallery');
  if (typeof dialog.showModal !== 'function') return;
  const image = document.getElementById('gallery-image');
  const caption = document.getElementById('gallery-caption');
  const counter = document.getElementById('gallery-counter');
  const figure = dialog.querySelector('.lightbox__figure');
  let current = 0;

  function renderLabels() {
    image.alt = i18n.t(`gallery.alt${current}`);
    caption.textContent = i18n.t(`gallery.caption${current}`);
    counter.textContent = i18n.t('gallery.counter', { current: i18n.number(current + 1), total: i18n.number(mizanytiSlides.length) });
    document.getElementById('gallery-prev').textContent = i18n.language === 'ar' ? '→' : '←';
    document.getElementById('gallery-next').textContent = i18n.language === 'ar' ? '←' : '→';
  }

  function show(index) {
    current = (index + mizanytiSlides.length) % mizanytiSlides.length;
    const slide = mizanytiSlides[current];
    image.src = slide.src;
    renderLabels();
    new Image().src = mizanytiSlides[(current + 1) % mizanytiSlides.length].src;
  }

  document.querySelectorAll('[data-gallery-open]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const picture = event.target.closest('[data-slide]');
      show(picture ? Number(picture.dataset.slide) : 0);
      dialog.showModal();
      syncScrollLock();
    });
  });
  document.getElementById('gallery-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('gallery-next').addEventListener('click', () => show(current + 1));
  dialog.querySelector('[data-gallery-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const direction = i18n.language === 'ar' ? -1 : 1;
      show(current + (event.key === 'ArrowLeft' ? -1 : 1) * direction);
    }
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  let touchStart = null;
  figure.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  figure.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    touchStart = null;
    const direction = i18n.language === 'ar' ? -1 : 1;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1) * direction);
  });
  figure.addEventListener('touchcancel', () => { touchStart = null; });
  dialog.addEventListener('close', syncScrollLock);
  document.addEventListener('languagechange', renderLabels);
  renderLabels();
}

// Plays the entrance animation again each time an element becomes visible.
function playEntrance(element, order = 0) {
  if (motionPreference.matches) return;
  element.style.setProperty('--enter-delay', `${order * 45}ms`);
  element.classList.remove('is-entering');
  void element.offsetWidth; // Restart the CSS animation if it was still running.
  element.classList.add('is-entering');
  element.addEventListener('animationend', () => element.classList.remove('is-entering'), { once: true });
}

function initToolkit() {
  const search = document.getElementById('toolkit-search');
  const chips = [...document.querySelectorAll('[data-filter]')];
  const rows = [...document.querySelectorAll('.skill-row')];
  const tools = [...document.querySelectorAll('.tool-list li')];
  const count = document.getElementById('toolkit-count');
  const empty = document.getElementById('toolkit-empty');
  const emptyTitle = document.getElementById('toolkit-empty-title');
  const state = { category: 'all', query: '' };
  const normalize = (value) => value.trim().toLocaleLowerCase();

  // A tool matches on its visible text or on its hidden aliases (e.g. "js", "ios", "terminal").
  const matches = (tool) => !state.query
    || normalize(`${tool.textContent} ${tool.dataset.keywords || ''}`).includes(state.query);

  function setVisible(element, visible, order) {
    const wasHidden = element.hidden;
    element.hidden = !visible;
    if (visible && wasHidden) playEntrance(element, order);
  }

  function render() {
    let shown = 0;
    let order = 0;
    rows.forEach((row) => {
      const inCategory = state.category === 'all' || row.dataset.category === state.category;
      let rowHasMatch = false;
      row.querySelectorAll('.tool-list li').forEach((tool) => {
        const visible = inCategory && matches(tool);
        tool.hidden = !visible;
        if (visible) { rowHasMatch = true; shown += 1; }
      });
      setVisible(row, rowHasMatch, order);
      if (rowHasMatch) order += 1;
    });
    const filtered = state.category !== 'all' || state.query;
    count.textContent = shown === 0 ? '' : i18n.t(filtered ? 'toolkit.showing' : 'toolkit.showingAll', {
      count: i18n.number(shown),
      total: i18n.number(tools.length)
    });
    emptyTitle.textContent = i18n.t('toolkit.emptyTitle', { query: `⁨${search.value.trim()}⁩` });
    setVisible(empty, shown === 0, 0);
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.filter === state.category)));
  }

  search.addEventListener('input', () => {
    state.query = normalize(search.value);
    render();
  });
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && search.value) {
      event.preventDefault();
      search.value = '';
      state.query = '';
      render();
    }
  });
  chips.forEach((chip) => chip.addEventListener('click', () => {
    state.category = chip.dataset.filter;
    render();
  }));
  document.getElementById('toolkit-reset').addEventListener('click', () => {
    search.value = '';
    state.query = '';
    state.category = 'all';
    render();
    search.focus();
  });
  // Tool names change with the language, so matching and the count text are redone.
  document.addEventListener('languagechange', render);
  render();
}

// Wikipedia content is third-party data: it is only ever written with textContent,
// and links and images are accepted only from Wikipedia's own hosts.
const FACT_STORAGE_KEY = 'curiosity-fact';
const FACT_TIMEOUT_MS = 10000;
const FACT_MIN_EXTRACT = 80;

function trustedUrl(value, isAllowedHost) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && isAllowedHost(url.hostname) ? url.href : '';
  } catch (error) {
    return '';
  }
}
const isWikipediaHost = (host) => host === 'wikipedia.org' || host.endsWith('.wikipedia.org');
const isWikimediaMediaHost = (host) => host === 'upload.wikimedia.org';

// Returns a clean fact object, or null when the candidate is missing or unsafe.
function cleanFact(candidate) {
  if (!candidate || typeof candidate.title !== 'string' || typeof candidate.extract !== 'string') return null;
  const extract = candidate.extract.trim();
  const url = trustedUrl(candidate.url, isWikipediaHost);
  if (extract.length < FACT_MIN_EXTRACT || !url) return null;
  return {
    title: candidate.title,
    description: typeof candidate.description === 'string' ? candidate.description : '',
    extract,
    image: trustedUrl(candidate.image, isWikimediaMediaHost),
    url,
    lang: candidate.lang === 'ar' ? 'ar' : 'en',
    dir: candidate.dir === 'rtl' ? 'rtl' : 'ltr'
  };
}

// Maps the Wikipedia REST "summary" response to our own shape.
function factFromSummary(summary) {
  if (!summary || summary.type === 'disambiguation') return null;
  return cleanFact({
    title: summary.title,
    description: summary.description,
    extract: summary.extract,
    image: summary.thumbnail && summary.thumbnail.source,
    url: summary.content_urls && summary.content_urls.desktop && summary.content_urls.desktop.page,
    lang: summary.lang,
    dir: summary.dir
  });
}

async function fetchRandomFact(language, signal) {
  // Some random pages are stubs or disambiguation pages, so try a few times.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(`https://${language}.wikipedia.org/api/rest_v1/page/random/summary`, {
      signal,
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`Wikipedia answered with HTTP ${response.status}`);
    const fact = factFromSummary(await response.json());
    if (fact) return fact;
  }
  throw new Error('No suitable article found');
}

function initCuriosity() {
  const card = document.getElementById('fact');
  const panels = {
    loading: document.getElementById('fact-loading'),
    error: document.getElementById('fact-error'),
    ready: document.getElementById('fact-content')
  };
  const errorTitle = document.getElementById('fact-error-title');
  const figure = document.getElementById('fact-figure');
  const image = document.getElementById('fact-image');
  const button = document.getElementById('fact-next');
  const buttonLabel = document.getElementById('fact-next-label');
  const note = document.getElementById('fact-note');
  let fact = null;
  let fromSavedVisit = false;
  let status = 'loading';
  let errorKind = 'failed';
  let requestId = 0;

  try { fact = cleanFact(JSON.parse(localStorage.getItem(FACT_STORAGE_KEY))); } catch (error) { /* No saved article. */ }
  if (fact) {
    status = 'ready';
    fromSavedVisit = true;
  }

  function render() {
    Object.entries(panels).forEach(([name, panel]) => {
      const visible = name === status;
      if (panel.hidden === visible) {
        panel.hidden = !visible;
        if (visible && name === 'ready') playEntrance(panel);
      }
    });
    card.setAttribute('aria-busy', String(status === 'loading'));
    button.setAttribute('aria-disabled', String(status === 'loading'));
    buttonLabel.textContent = i18n.t(status === 'loading' ? 'curiosity.finding' : status === 'error' ? 'curiosity.retry' : 'curiosity.next');
    if (status === 'error') {
      errorTitle.textContent = i18n.t({ offline: 'curiosity.errorOffline', slow: 'curiosity.errorSlow' }[errorKind] || 'curiosity.errorFailed');
    }
    if (status === 'ready' && fact) {
      panels.ready.lang = fact.lang;
      panels.ready.dir = fact.dir;
      document.getElementById('fact-title').textContent = fact.title;
      document.getElementById('fact-description').textContent = fact.description;
      document.getElementById('fact-extract').textContent = fact.extract;
      document.getElementById('fact-link').href = fact.url;
      figure.hidden = !fact.image;
      panels.ready.classList.toggle('fact__content--text', !fact.image);
      if (fact.image && image.getAttribute('src') !== fact.image) image.src = fact.image;
      note.textContent = fromSavedVisit
        ? i18n.t('curiosity.noteSaved')
        : i18n.t('curiosity.noteLive', { lang: i18n.t(`curiosity.lang.${fact.lang}`) });
    } else {
      note.textContent = '';
    }
  }

  async function load() {
    if (status === 'loading' && requestId > 0) return;
    const id = ++requestId;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FACT_TIMEOUT_MS);
    status = 'loading';
    render();
    try {
      const next = await fetchRandomFact(i18n.language, controller.signal);
      if (id !== requestId) return;
      fact = next;
      fromSavedVisit = false;
      status = 'ready';
      try { localStorage.setItem(FACT_STORAGE_KEY, JSON.stringify(fact)); } catch (error) { /* Saving is optional. */ }
    } catch (error) {
      if (id !== requestId) return;
      errorKind = !navigator.onLine ? 'offline' : error.name === 'AbortError' ? 'slow' : 'failed';
      status = 'error';
    } finally {
      clearTimeout(timer);
      if (id === requestId) { requestId = 0; render(); }
    }
  }

  image.addEventListener('error', () => { figure.hidden = true; panels.ready.classList.add('fact__content--text'); });
  button.addEventListener('click', () => { if (status !== 'loading') load(); });
  document.addEventListener('languagechange', render);
  render();

  // Without a saved article, fetch the first one only when the section nears the viewport.
  if (!fact) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        load();
      }, { rootMargin: '200px 0px' });
      observer.observe(card);
    } else {
      load();
    }
  }
}

// Each validator returns '' when the value is fine, or the key of the error message.
const validators = {
  name: (value) => value.length >= 2 ? '' : 'error.name',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? '' : 'error.email',
  topic: (value) => value ? '' : 'error.topic',
  message: (value) => value.length >= 10 ? '' : 'error.message'
};

// Domains we can suggest, and other real domains that should never trigger a suggestion.
const EMAIL_SUGGESTIONS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'live.com', 'kfupm.edu.sa'];
const KNOWN_EMAIL_DOMAINS = new Set([...EMAIL_SUGGESTIONS, 'mail.com', 'me.com', 'msn.com', 'ymail.com', 'aol.com', 'gmx.com', 'proton.me', 'protonmail.com', 'hotmail.co.uk', 'yahoo.co.uk']);

// Levenshtein distance: the fewest single-letter edits that turn one word into the other.
function editDistance(a, b) {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const substitution = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, substitution);
    }
    previous = current;
  }
  return previous[b.length];
}

// "sara@gmial.com" → "sara@gmail.com". Returns '' when the domain looks right or nothing is close.
function suggestEmail(value) {
  const at = value.lastIndexOf('@');
  if (at < 1) return '';
  const domain = value.slice(at + 1).toLowerCase();
  if (!domain || KNOWN_EMAIL_DOMAINS.has(domain)) return '';
  let best = '';
  let bestDistance = 3; // Only 1 or 2 typos count as "close".
  EMAIL_SUGGESTIONS.forEach((candidate) => {
    const distance = editDistance(domain, candidate);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  });
  return best ? `${value.slice(0, at + 1)}${best}` : '';
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const progress = document.getElementById('form-progress');
  const fieldNames = Object.keys(validators);
  const field = (fieldName) => document.getElementById(fieldName);
  let hasPreview = false;

  // The success message changes with the topic the visitor picked.
  function renderPreview() {
    const name = field('name').value.trim().split(/\s+/)[0];
    status.textContent = i18n.t(`form.success.${field('topic').value}`, { name: `⁨${name}⁩` });
  }

  // Counts the fields that already pass, without showing errors the visitor has not earned yet.
  function renderProgress() {
    const ready = fieldNames.filter((fieldName) => !validators[fieldName](field(fieldName).value.trim())).length;
    progress.textContent = ready === 0 ? ''
      : ready === fieldNames.length ? i18n.t('form.progressDone')
      : i18n.t('form.progress', { ready: i18n.number(ready), total: i18n.number(fieldNames.length) });
  }

  // A live hint tells the visitor how far the message is from the minimum length.
  const messageInput = field('message');
  const messageHint = document.getElementById('message-hint');
  const MIN_MESSAGE = 10;
  function renderMessageHint() {
    const typed = messageInput.value.trim().length;
    messageHint.textContent = typed === 0 ? ''
      : typed < MIN_MESSAGE ? i18n.t('form.hintMore', { count: i18n.number(MIN_MESSAGE - typed) })
      : i18n.t('form.hintOk');
  }
  messageInput.addEventListener('input', renderMessageHint);

  // Email typo check: only offered once the address is valid, and never blocks sending.
  const emailInput = field('email');
  const suggestion = document.getElementById('email-suggestion');
  let suggestedEmail = '';
  function renderSuggestion() {
    const value = emailInput.value.trim();
    suggestedEmail = validators.email(value) ? '' : suggestEmail(value);
    suggestion.hidden = !suggestedEmail;
    document.getElementById('email-suggestion-text').textContent = suggestedEmail
      ? i18n.t('form.suggestion', { email: `⁦${suggestedEmail}⁩` }) : '';
  }
  emailInput.addEventListener('blur', renderSuggestion);
  document.getElementById('email-suggestion-apply').addEventListener('click', () => {
    emailInput.value = suggestedEmail;
    renderSuggestion();
    validateField('email');
    renderProgress();
    emailInput.focus();
  });

  function validateField(fieldName) {
    const input = field(fieldName);
    const message = validators[fieldName](input.value.trim());
    document.getElementById(`${fieldName}-error`).textContent = message ? i18n.t(message) : '';
    input.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }
  fieldNames.forEach((fieldName) => {
    const input = field(fieldName);
    input.addEventListener('blur', () => { if (input.value.trim()) validateField(fieldName); });
    input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => {
      status.textContent = '';
      hasPreview = false;
      if (input.getAttribute('aria-invalid') === 'true' || input.tagName === 'SELECT') validateField(fieldName);
      if (fieldName === 'email' && !suggestion.hidden) renderSuggestion();
      renderProgress();
    });
  });

  // Submitting runs every check in order; the first field with a problem gets focus.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    hasPreview = false;
    const results = fieldNames.map((fieldName) => ({ fieldName, valid: validateField(fieldName) }));
    const invalid = results.find((result) => !result.valid);
    if (invalid) {
      field(invalid.fieldName).focus();
      return;
    }
    renderSuggestion();
    hasPreview = true;
    renderPreview();
  });

  // A name saved in the visitor panel fills the empty name field.
  function prefillName() {
    const nameInput = field('name');
    if (!nameInput.value.trim() && store.get('name')) {
      nameInput.value = store.get('name');
      renderProgress();
    }
  }
  store.subscribe((changed) => { if (changed.includes('name')) prefillName(); });

  document.addEventListener('languagechange', () => {
    fieldNames.forEach(fieldName => {
      if (field(fieldName).getAttribute('aria-invalid') === 'true') validateField(fieldName);
    });
    if (hasPreview) renderPreview();
    renderMessageHint();
    renderSuggestion();
    renderProgress();
  });
  prefillName();
  renderProgress();
  form.classList.add('is-ready');
}

initThemeToggle();
initGreeting();
initHeader();
initMotion();
initMobileMenu();
initGallery();
initToolkit();
initCuriosity();
initContactForm();
initScrollReveal();
