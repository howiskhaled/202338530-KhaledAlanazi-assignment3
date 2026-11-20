/* Visitor panel: a remembered name, a suggested path for each kind of visitor,
   and a timer that counts how long someone has actually been looking at the page.
   Uses the shared helpers from script.js (i18n, store, playEntrance), which loads first. */
'use strict';

// Letters (any alphabet, so Arabic names work) separated by single spaces, hyphens or apostrophes.
const VISITOR_NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '’-][\p{L}\p{M}]+)*$/u;
const VISITOR_NAME_MAX = 30;
const TIMER_SAVE_EVERY = 15; // seconds between saves of the total time

// What each kind of visitor is pointed to. An action may also set the GitHub list filter.
const VISITOR_PATHS = {
  recruiter: [
    { key: 'path.recruiter.action1', href: '#projects' },
    { key: 'path.recruiter.action2', href: '#github', repoCategory: 'personal' }
  ],
  student: [
    { key: 'path.student.action1', href: '#github', repoCategory: 'coursework' },
    { key: 'path.student.action2', href: '#contact' }
  ],
  curious: [
    { key: 'path.curious.action1', href: '#curiosity' },
    { key: 'path.curious.action2', href: '#skills' }
  ]
};

// Checks a name step by step and returns either { name } or { error } with a message key.
function checkVisitorName(raw) {
  const name = raw.trim().replace(/\s+/g, ' ');
  if (!name) return { error: 'visitor.error.empty' };
  if (name.length < 2) return { error: 'visitor.error.short' };
  if (name.length > VISITOR_NAME_MAX) return { error: 'visitor.error.long' };
  if (/\p{N}/u.test(name)) return { error: 'visitor.error.digits' };
  if (!VISITOR_NAME_PATTERN.test(name)) return { error: 'visitor.error.characters' };
  return { name };
}

// Unicode isolation marks keep a Latin name inside Arabic text (and the reverse) in the right order.
const isolate = (text) => `⁨${text}⁩`;

function initVisitorName() {
  const form = document.getElementById('visitor-form');
  const input = document.getElementById('visitor-name');
  const error = document.getElementById('visitor-name-error');
  const known = document.getElementById('visitor-known');
  const hello = document.getElementById('visitor-hello');
  const change = document.getElementById('visitor-change');
  let editing = false;

  function showError(key) {
    error.textContent = key ? i18n.t(key) : '';
    input.setAttribute('aria-invalid', String(Boolean(key)));
  }

  function render() {
    const name = store.get('name');
    const showForm = editing || !name;
    form.hidden = !showForm;
    known.hidden = showForm;
    if (!showForm) {
      // A returning visitor gets a different line from a first-time visitor.
      const key = store.get('visits') > 1 ? 'visitor.helloBack' : 'visitor.helloNew';
      hello.textContent = i18n.t(key, { name: isolate(name) });
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = checkVisitorName(input.value);
    if (result.error) {
      showError(result.error);
      input.focus();
      return;
    }
    showError('');
    editing = false;
    store.set({ name: result.name });
    render();
    playEntrance(known);
    change.focus();
  });
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') showError(checkVisitorName(input.value).error || '');
  });
  change.addEventListener('click', () => {
    editing = true;
    input.value = store.get('name');
    render();
    input.focus();
    input.select();
  });

  store.subscribe((changed) => {
    if (changed.includes('name') || changed.includes('visits')) {
      if (!store.get('name')) { input.value = ''; editing = false; }
      render();
    }
  });
  document.addEventListener('languagechange', () => {
    if (input.getAttribute('aria-invalid') === 'true') showError(checkVisitorName(input.value).error || '');
    render();
  });
  render();
}

function initVisitorRole() {
  const chips = [...document.querySelectorAll('[data-role]')];
  const path = document.getElementById('visitor-path');
  const title = document.getElementById('visitor-path-title');
  const text = document.getElementById('visitor-path-text');
  const actions = document.getElementById('visitor-path-actions');

  function render(animate) {
    const role = store.get('role');
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.role === role)));
    title.textContent = i18n.t(role ? `path.${role}.title` : 'path.none.title');
    text.textContent = role ? i18n.t(`path.${role}.text`) : '';
    actions.replaceChildren(...(VISITOR_PATHS[role] || []).map((action) => {
      const link = document.createElement('a');
      link.className = 'pill';
      link.href = action.href;
      const label = document.createElement('span');
      label.textContent = i18n.t(action.key);
      const arrow = document.createElement('span');
      arrow.className = 'directional-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↘';
      link.append(label, arrow);
      // The link both scrolls to the section and prepares what the visitor will find there.
      if (action.repoCategory) {
        link.addEventListener('click', () => store.set({ repoCategory: action.repoCategory }));
      }
      return link;
    }));
    if (animate) playEntrance(path);
  }

  chips.forEach((chip) => chip.addEventListener('click', () => {
    // Pressing the selected chip again clears the choice.
    store.set({ role: store.get('role') === chip.dataset.role ? '' : chip.dataset.role });
  }));
  store.subscribe((changed) => { if (changed.includes('role')) render(true); });
  document.addEventListener('languagechange', () => render(false));
  render(false);
}

function initVisitTimer() {
  const timer = document.getElementById('visit-timer');
  const count = document.getElementById('visit-count');
  const total = document.getElementById('visit-total');
  let visitSeconds = 0;
  let unsavedSeconds = 0;

  // A visit is counted once per browser session, so reloading the page does not add one.
  try {
    if (!sessionStorage.getItem('visit-counted')) {
      store.set({ visits: store.get('visits') + 1 });
      sessionStorage.setItem('visit-counted', 'true');
    }
  } catch (error) { /* Without storage every visit looks like the first one. */ }

  function render() {
    timer.textContent = i18n.clock(visitSeconds);
    count.textContent = i18n.number(Math.max(store.get('visits'), 1));
    const allSeconds = store.get('secondsSpent') + unsavedSeconds;
    total.textContent = allSeconds < 60 ? i18n.t('visitor.underMinute') : i18n.minutes(Math.floor(allSeconds / 60));
  }

  // Adds the new seconds to the saved total instead of overwriting it, so two open tabs both count.
  function save() {
    if (!unsavedSeconds) return;
    const seconds = unsavedSeconds;
    unsavedSeconds = 0;
    store.set({ secondsSpent: store.get('secondsSpent') + seconds });
  }

  setInterval(() => {
    if (document.hidden) return; // Only time spent looking at the page counts.
    visitSeconds += 1;
    unsavedSeconds += 1;
    if (unsavedSeconds >= TIMER_SAVE_EVERY) save();
    render();
  }, 1000);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  window.addEventListener('pagehide', save);
  store.subscribe((changed) => {
    if (changed.includes('visits') || changed.includes('secondsSpent')) render();
  });
  document.addEventListener('languagechange', render);
  render();

  return { forgetUnsaved() { unsavedSeconds = 0; } };
}

function initVisitor() {
  initVisitorName();
  initVisitorRole();
  const visitTimer = initVisitTimer();
  const status = document.getElementById('visitor-status');
  let forgotten = false;

  document.getElementById('visitor-forget').addEventListener('click', () => {
    visitTimer.forgetUnsaved();
    store.reset();
    store.set({ visits: 1 }); // This visit is still happening.
    forgotten = true;
    status.textContent = i18n.t('visitor.forgotten');
  });
  // The confirmation disappears as soon as the visitor makes a new choice.
  store.subscribe((changed) => {
    if (forgotten && (changed.includes('name') || changed.includes('role'))) {
      forgotten = false;
      status.textContent = '';
    }
  });
  document.addEventListener('languagechange', () => { if (forgotten) status.textContent = i18n.t('visitor.forgotten'); });
}

initVisitor();
