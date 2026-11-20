# AI Usage Report

**Student:** Khaled Alanazi (202338530)
**Assignment:** Assignment 3: Advanced Functionality

---

## 1. Usage Log

One row per AI conversation (`C01`, `C02`, ...) or AI-generated artifact (`A01`, `A02`, ...).

| ID | Tool (model) | Date | Purpose | Files affected | What you changed and how you verified it |
|----|--------------|------|---------|----------------|------------------------------------------|
| C01 | Claude Code (Claude Opus 5.5) | 2026-11-20 | I gave it the Assignment 3 brief and my Assignment 2 repository and asked it to complete the assignment. It planned and built the shared state store, the visitor panel (name, visitor type, visit timer), the live GitHub repositories with filter and sort, the contact form additions, the font and image optimisation, the English and Arabic text for all of it, and drafted the README, technical documentation and this report. | `index.html`, `css/styles.css`, `js/i18n.js`, `js/state.js`, `js/script.js`, `js/visitor.js`, `js/github.js`, `assets/fonts/*`, `assets/images/*`, `.gitignore`, `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | While testing, Claude found and fixed its own problems: the "Name, A to Z" sort used the raw repository name instead of the title shown on the card; a failed refresh could hide a list that was already on screen; and the scroll button's accessible name did not match its visible text. It verified the work with scripted checks in the Claude desktop app's browser, Lighthouse before and after (mobile and desktop), and the same feature test in Chromium, Firefox and WebKit (full list in `docs/technical-documentation.md`, *Verification*). My own edits and checks are in section 5. |
| A01 | Claude Code (Claude Opus 5.5) | 2026-11-20 | Optimised copies of my existing assets, generated with tools Claude ran: subset WOFF2 fonts (`fonttools`) and WebP images (`sharp`). | `assets/fonts/Inter-Latin.woff2`, `assets/fonts/Tajawal-*.woff2`, `assets/images/*.webp` | These are not new content: they are smaller versions of the same fonts, screenshots and photo from Assignment 2. Checked by viewing the site in light and dark mode, English and Arabic, and by Lighthouse. |

The full conversation and the first versions of each file go in the AI Evidence ZIP (see section 8).

I did not use any other AI tool for this assignment.

---

## 2. Tools Used & Use Cases

| Tool | How it was used |
| --- | --- |
| **Claude Code** (Claude Opus 5.5) | Reading the brief and my Assignment 2 code, choosing and building the features, running tools (Lighthouse, font subsetting, image conversion, cross-browser tests), testing in a browser, explaining the code, and drafting the documentation |

**Use cases**

1. **Planning from the brief and my existing code.** Claude read the Assignment 3 brief and cloned my Assignment 2 repository first. Because the site already had a theme toggle, a language switcher and an API feature, it chose features that are clearly new: a second API (GitHub), a shared store, and logic that crosses sections.
2. **API integration.** It built `js/github.js`: fetching my repositories, cleaning the data as untrusted input, a 30-minute cache because GitHub allows only 60 requests an hour, and different messages for offline, timeout, rate limit, missing profile and other failures.
3. **Complex logic.** Filtering and sorting together, grouping repositories with rules, a step-by-step name check, a path that depends on the visitor type, a visit timer that pauses in background tabs, and email typo detection with edit distance.
4. **State management.** It designed `js/state.js` as a small publish/subscribe store, so one feature (the visitor panel) can change another (the GitHub filter) without calling it directly.
5. **Performance.** It ran Lighthouse first to measure, found that the 344 KB font was delaying the largest headline on phones, then subset the fonts, converted images to WebP, added `srcset`, and measured again.
6. **Testing.** It tested every feature with scripts in the browser, faked GitHub failures (rate limit, network error, server error) to see each error message, checked phone width, dark mode and Arabic, and ran the same test in Chromium, Firefox and WebKit.
7. **Documentation.** It drafted the README, the technical documentation and this report.

### Decisions made while building

These were made by the AI during the conversation, and I reviewed them (see section 5):

- **GitHub** as the API, because a live list of my repositories fits a portfolio and needs no key.
- **Three repository groups** (coursework, personal, team) chosen by simple name rules, because GitHub has no "category" field.
- **A visitor panel in the About section**, combining the brief's examples (visitor name, different content by choice, a timer) in one place.
- **Classic scripts instead of ES modules**, so that double-clicking `index.html` still works (modules do not load from `file://`).
- **Not minifying CSS and JavaScript**, so the code stays readable for marking; GitHub Pages compresses it anyway.
- **Theme and language keep their own storage keys**, because the theme must be applied before the CSS loads.
- **Small branches** (`feature/visitor-state`, `feature/github-projects`, `feature/form-checks`, `perf/assets-and-cleanup`, `docs/assignment-3`) merged into `main`, with an `Assisted-by:` line in each AI-assisted commit.

---

## 3. Benefits & Challenges

### Benefits

- Claude read my Assignment 2 code first, so the new features reuse its structure (the `languagechange` event, `playEntrance()`, `trustedUrl()`, the CSS tokens and chips) instead of looking like a separate project.
- It **measured before optimising**. The Lighthouse report showed exactly what was slow (the font behind the hero headline), so the work went where it mattered: mobile performance went from 88 to 99.
- It tested things I would not have known how to test, such as faking a GitHub rate limit, and running the site in Firefox and WebKit without having those browsers set up.
- It explained ideas that were new to me: why saved data should be treated as untrusted, why the timer adds to the total instead of overwriting it, and what edit distance is.

### Challenges and limitations

- **I did not write this code myself.** The AI wrote almost all of it, so the most important work for me is understanding it (section 6). Some parts, such as `editDistance()` and the store's `subscribe()`, are new concepts for me.
- **Real devices are still to do.** Claude tested browser engines on a computer, not a real iPhone or Android phone.
- **Some results depend on GitHub.** The rate limit, and repositories I add later, can change what the section shows. The name rules for grouping may need a `coursework` topic on a repository with an unusual name.
- **One Lighthouse point** (desktop accessibility) is a false positive about the header that the tool cannot measure correctly; Claude explained it but could not make the tool see it.

---

## 4. How the AI output was checked

- Claude tested each feature and recorded the results in `docs/technical-documentation.md` (*Verification*).
- Lighthouse was run twice before and twice after the performance changes; the numbers are in the README.
- The features can be tried again by following "How to use the new features" and "Trying the error messages" in the README.
- Every commit that contains AI-assisted code names the tool in an `Assisted-by:` line.

---

## 5. What I changed after the AI draft

> **Khaled: fill this in yourself before submitting.** Read the code and the site, decide what you want to change (wording, colours, a feature detail), and list each change here. If you ask Claude to type an edit for you, say that you chose it and Claude typed it, as in Assignment 2. If you changed nothing, say so honestly.

| File | What I changed | Why |
| --- | --- | --- |
| | | |

My own checks:

- [ ] I opened the site on my phone and used every new feature.
- [ ] I ran the offline test from the README and saw the friendly error.
- [ ] I opened the site in Safari or Firefox myself.

---

## 6. Understanding checklist

I should be able to explain each of these without the AI:

| Topic | Where to look |
| --- | --- |
| How `get`, `set`, `subscribe` and `reset` work, and why `set()` only notifies about keys that really changed | `js/state.js` |
| Why every saved value is checked against a rule when it is loaded | `schema` and `fromSaved()` in `js/state.js` |
| How choosing "fellow student" changes the GitHub filter without the two features calling each other | `VISITOR_PATHS` in `js/visitor.js`, `store.subscribe` in `js/github.js` |
| How `fetchRepos()` turns each failure into an error `kind`, and how the rate-limit reset time is read | `js/github.js` |
| Why the GitHub data is cleaned (`cleanRepo()`) and written only with `textContent` | `js/github.js` |
| How the cache decides between "fresh", "live" and "saved copy" | `readRepoCache()`, `load()` and the end of `initGitHubProjects()` |
| The four steps of `renderList()`: count, filter, sort, draw; and what a compare function returns | `REPO_SORTERS` and `renderList()` |
| How the name check works step by step, and what `\p{L}` means | `checkVisitorName()` in `js/visitor.js` |
| Why the timer skips hidden tabs, why visits use `sessionStorage`, and why the total is added rather than overwritten | `initVisitTimer()` |
| What edit distance is and how it finds `gmail.com` from `gmial.com` | `editDistance()` and `suggestEmail()` in `js/script.js` |
| What font subsetting, WebP and `srcset`/`sizes` do, and how Lighthouse showed the font was the problem | README *Performance results*, technical documentation *Performance work* |
| Why the scripts load in a fixed order with `defer`, and why they are not ES modules | technical documentation *Script loading order* |

---

## 7. Learning Outcomes

> **Khaled: write this section in your own words before submitting.** The brief asks what *you* learned. Some prompts: Which part was hardest to understand (the store? `fetch` and error kinds? edit distance?) and what helped? What did measuring with Lighthouse first teach you about performance? What did you learn about treating API and saved data as untrusted? How was working with AI different from Assignment 2?

---

## 8. Declaration

AI evidence: the full, unedited conversation(s) and the first versions of the AI-written files are in `202338530-KhaledAlanazi-assignment3-ai-evidence.zip` (`conversations/` and `artifacts/`), submitted on Blackboard with the repository link. They are not committed to this repository.

> I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

**Name:** Khaled Alanazi
**ID:** 202338530
**Date:** 2026-11-20
