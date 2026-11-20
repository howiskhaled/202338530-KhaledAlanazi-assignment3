/* One small store for everything the site remembers about a visitor.
   Features read values with get(), change them with set(), and react to
   changes with subscribe(). The store saves itself to localStorage. */
'use strict';

window.portfolioState = (() => {
  const STORAGE_KEY = 'portfolio-visitor';
  const ROLES = ['recruiter', 'student', 'curious'];
  const REPO_CATEGORIES = ['all', 'coursework', 'personal', 'team'];
  const REPO_SORTS = ['updated', 'newest', 'oldest', 'name', 'stars'];
  const isCount = (value) => Number.isInteger(value) && value >= 0;

  // Every key has a default and a rule. Saved data is treated as untrusted:
  // anything that breaks a rule (edited by hand, old format) falls back to the default.
  const schema = {
    name: { fallback: '', valid: (value) => typeof value === 'string' && value.length <= 30 },
    role: { fallback: '', valid: (value) => value === '' || ROLES.includes(value) },
    repoCategory: { fallback: 'all', valid: (value) => REPO_CATEGORIES.includes(value) },
    repoSort: { fallback: 'updated', valid: (value) => REPO_SORTS.includes(value) },
    visits: { fallback: 0, valid: isCount },
    secondsSpent: { fallback: 0, valid: isCount }
  };
  const listeners = new Set();

  // Builds a full state object from saved values, keeping only the ones that pass their rule.
  function fromSaved(saved) {
    const result = {};
    Object.entries(schema).forEach(([key, rule]) => {
      result[key] = rule.valid(saved[key]) ? saved[key] : rule.fallback;
    });
    return result;
  }

  function load() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (error) { /* Start fresh. */ }
    return fromSaved(saved);
  }

  let state = load();

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* Works without storage. */ }
  }

  function notify(changedKeys) {
    if (changedKeys.length) listeners.forEach((listener) => listener(changedKeys, state));
  }

  function get(key) {
    return state[key];
  }

  // Applies only the valid, actually-changed values, then saves once and notifies once.
  function set(patch) {
    const changed = Object.keys(patch).filter((key) => schema[key] && schema[key].valid(patch[key]) && state[key] !== patch[key]);
    if (!changed.length) return;
    state = { ...state };
    changed.forEach((key) => { state[key] = patch[key]; });
    save();
    notify(changed);
  }

  function reset() {
    const before = state;
    state = fromSaved({});
    try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* Nothing saved. */ }
    notify(Object.keys(schema).filter((key) => before[key] !== state[key]));
  }

  // Returns a function that stops listening.
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  // Keeps two open tabs in sync: a change saved in one tab updates the other.
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    const before = state;
    state = load();
    notify(Object.keys(schema).filter((key) => before[key] !== state[key]));
  });

  return { get, set, reset, subscribe, ROLES, REPO_CATEGORIES, REPO_SORTS };
})();
