# Technical documentation

## Overview

A static, single-page portfolio built with HTML, CSS and vanilla JavaScript. There is no framework, build step, backend or analytics. Open `index.html` directly or serve the project with a local HTTP server.

Assignment 3 builds on the Assignment 2 site (which built on Assignment 1). The new work is described in [What is new in Assignment 3](#what-is-new-in-assignment-3). The Assignment 2 features are documented after it and still work the same way.

| File | Purpose |
| --- | --- |
| `index.html` | Semantic page structure, project content, the visitor panel, the GitHub list, the form and native dialogs |
| `css/styles.css` | Design tokens, responsive layouts, theme, motion and focus styles |
| `js/i18n.js` | English/Arabic translations, the language switcher, and number, date and time formatting |
| `js/state.js` | **New.** The shared store for visitor preferences (`window.portfolioState`) |
| `js/script.js` | Shared helpers, navigation, theme, motion, greeting, gallery, toolkit explorer, Wikipedia feature and contact form |
| `js/visitor.js` | **New.** Visitor panel: saved name, path by visitor type, visit timer and counter |
| `js/github.js` | **New.** Live GitHub repositories: fetch, cache, group, filter and sort |
| `assets/images/*.webp` | Profile photo and Mizanyti screenshots in WebP, plus 240 px versions for the phone collage |
| `assets/images/liquid-light.svg` | Original vector atmosphere with displaced gradients and soft flowing folds |
| `assets/fonts/Inter-Latin.woff2` | Inter variable font, subset to Latin characters, with its SIL Open Font License in `OFL.txt` |
| `assets/fonts/Tajawal-Regular.woff2`, `Tajawal-Light.woff2` | Arabic font, subset to Arabic and Latin characters, with its SIL Open Font License in `Tajawal-OFL.txt` |

### Script loading order

All scripts use `defer`, so they run in this order after the HTML is parsed and never block the first paint:

1. `i18n.js` defines `window.portfolioI18n`.
2. `state.js` defines `window.portfolioState`.
3. `script.js` sets up the shared names `i18n`, `store`, `motionPreference`, `playEntrance()` and `trustedUrl()`, then starts the Assignment 1 and 2 features.
4. `visitor.js` and `github.js` each start their own feature and reuse the shared names from `script.js`.

The site uses classic scripts instead of ES modules on purpose: modules do not load from `file://`, and the README promises that double-clicking `index.html` works.

## Visual system

The September 2026 redesign retains the supplied Monopo Saigon reference's large light-weight headlines, spacious editorial layout, sharp image edges and 75px pill actions. Following the user's color update, the canvas combines warm cream, pale sage, deep green and peach, with terracotta accents and a plum portfolio showcase. Project screenshots retain their original colors, and the portfolio preview reuses the colorful hero artwork. Only the childhood portrait uses `filter: grayscale(1)`, in both themes.

The centered content area is capped at 1078px. The hero and inverse skills section extend across the viewport. Desktop sections use asymmetric columns and single-column project presentations. At 700px and below, content becomes a vertical layout and an accessible mobile menu replaces the desktop navigation. A 1000px breakpoint adjusts spacing for tablets.

The default theme is light. A saved dark preference is respected on subsequent visits. The dark option uses deep green and burgundy surfaces with peach accents and warm light text. Initial theme selection runs before CSS to avoid a flash. The fixed transparent header changes foreground between white and the current text color according to the content behind it. The browser theme color is read from the CSS background token.

## Page structure

1. `#home`: atmospheric hero, display headline, scroll cue and motion toggle.
2. `#about`: introduction, time-based greeting, original profile photo and the **visitor panel** (`#visitor`).
3. `#projects`: Mizanyti screenshot composition, portfolio preview and the **live GitHub list** (`#github`).
4. `#skills`: the toolkit, with a live search box, category chips and four editorial rows of tools.
5. `#curiosity`: a random Wikipedia article loaded from a public API.
6. `#contact`: GitHub link, local demo form and footer.
7. `#mobile-menu` and `#gallery`: native modal dialogs.

## Behavior

| Function | Responsibility |
| --- | --- |
| `initThemeToggle()` | Switches light/dark color palettes, saves the preference and updates the accessible label and browser theme color. |
| `initGreeting()` | Adds a local-time greeting (with the visitor's saved name, if any) and the current year. |
| `initHeader()` | Uses a scheduled animation frame on scroll/resize to select the header's foreground color. |
| `initMotion()` | Handles the pause control, saved motion preference, reduced-motion changes and pausing offscreen hero animations. |
| `initScrollReveal()` | Reveals content as it enters the viewport. Keyboard focus also reveals its parent immediately. |
| `initMobileMenu()` | Opens/closes the navigation dialog, updates expanded state and moves focus to the chosen section. Closes on a desktop resize. |
| `initGallery()` | Displays seven original screenshots with captions, wrapping navigation, arrow keys, horizontal swipe and next-image preloading. |
| `initToolkit()` | Filters the toolkit while typing and by category, updates the count, shows the empty state. |
| `initCuriosity()` | Loads, shows, saves and restores a random Wikipedia article, with loading and error states. |
| `playEntrance()` | Replays the entrance animation on an element each time it becomes visible again. |
| `syncScrollLock()` | Keeps background scrolling locked while a dialog is open. |
| `initContactForm()` | Validates fields, suggests email typo fixes, counts ready fields, focuses the first invalid field and displays a topic-specific local-preview confirmation. Retains the visitor's draft. |
| `initVisitor()` *(visitor.js)* | Starts the name form, the visitor-type path, the visit timer and the "Forget everything" button. |
| `initGitHubProjects()` *(github.js)* | Loads, caches and shows the GitHub repositories, with filter, sort, loading, error and empty states. |

## What is new in Assignment 3

| Requirement | Where it is met |
| --- | --- |
| API integration | GitHub REST API: my public repositories, live (`js/github.js`) |
| Complex logic | Filter **and** sort the repositories; group them with rules; step-by-step name checks; a path that changes with the visitor type; a visit timer that only counts visible time; email typo detection with edit distance; a ready-fields counter and topic-specific messages in the form |
| State management | One store (`js/state.js`) that saves, validates and broadcasts the visitor's name, visitor type, filter, sort, visit count and total time, synced across tabs; theme and language preferences as before |
| Performance | Subset WOFF2 fonts, WebP images, responsive `srcset`, lazy loading, a 30-minute API cache, no request until a section is near the screen |
| AI integration | See [`ai-usage-report.md`](ai-usage-report.md) |

### Shared state store (`js/state.js`)

Before Assignment 3, each feature saved its own `localStorage` key in its own way. The new store gives the visitor-related data one home with one set of rules:

| Method | What it does |
| --- | --- |
| `get(key)` | Returns the current value. |
| `set(patch)` | Takes an object such as `{ repoSort: 'name' }`. Keeps only keys that exist, pass their rule and actually changed. If anything changed, it saves once and calls every listener once with the list of changed keys. |
| `subscribe(listener)` | Registers `listener(changedKeys, state)` and returns a function that unsubscribes. |
| `reset()` | Puts every key back to its default and deletes the saved copy. |

| Key | Default | Rule | Used by |
| --- | --- | --- | --- |
| `name` | `''` | string, at most 30 characters | greeting, visitor panel, contact form |
| `role` | `''` | `''`, `recruiter`, `student` or `curious` | visitor panel |
| `repoCategory` | `all` | `all`, `coursework`, `personal` or `team` | GitHub list, visitor panel links |
| `repoSort` | `updated` | `updated`, `newest`, `oldest`, `name` or `stars` | GitHub list |
| `visits` | `0` | whole number ≥ 0 | visitor panel |
| `secondsSpent` | `0` | whole number ≥ 0 | visitor panel |

Design decisions:

- **Saved data is untrusted.** Anyone can edit `localStorage` in the developer tools. When the store loads, each value must pass its rule or it is replaced by the default, so a broken value can never crash a feature.
- **Features never talk to each other directly.** The visitor panel's "Open my coursework" link only calls `store.set({ repoCategory: 'coursework' })`. The GitHub list is subscribed to the store and redraws itself. The greeting and the contact form react to `name` changes the same way.
- **Tabs stay in sync.** The browser fires a `storage` event in other tabs when one tab saves. The store reloads and notifies its listeners, so a name saved in one tab appears in the other.
- **Theme, language and motion keep their own keys** (`theme`, `language`, `motion-paused`). The theme must be read by a tiny inline script in `<head>` before the CSS paints, to avoid a flash of the wrong theme, so it cannot wait for `state.js`.

### Visitor panel (`js/visitor.js`)

**Name.** The name form checks the input in order and stops at the first problem: empty → shorter than 2 characters → longer than 30 → contains a digit → contains anything other than letters separated by single spaces, hyphens or apostrophes. The letter test uses the Unicode pattern `\p{L}`, so Arabic names are accepted. Each step has its own message in both languages. A passing name is saved with a capital letter at the start of each part (`sara al-otaibi` → `Sara Al-Otaibi`); only first letters change, so `McDonald` stays as typed. After saving, the form is replaced by a greeting that is different for a first visit ("Nice to meet you, Sara.") and a return visit ("Welcome back, Sara."). The name also appears in the About greeting ("GOOD EVENING, SARA. I’M KHALED.") and fills an empty name field in the contact form.

**Visitor type.** Three chips (`aria-pressed`) choose a path: recruiter, fellow student or just curious. Each path has its own title, text and two links, built from the `VISITOR_PATHS` object. Some links also change the state of another section: "Open my coursework" filters the GitHub list to coursework before scrolling there, and "My personal projects" filters it to personal projects. Pressing the selected chip again clears the choice.

**Visit timer and counter.**

1. A visit is counted once per browser session: a `sessionStorage` flag stops reloads from adding visits.
2. A one-second interval adds a second only when `document.hidden` is false, so time in a background tab does not count.
3. The total across visits is saved every 15 seconds, when the tab is hidden and on `pagehide`. It saves by **adding** the new seconds to the stored total rather than overwriting it, so two open tabs both count.
4. The display uses `i18n.clock()` (`4:07`, `١:٠٤:٠٧`) and `i18n.minutes()` (`12 minutes`, `١٢ دقيقة`), which use `Intl` formatters so plurals and digits are right in both languages. The timer element has `role="timer"`, which screen readers do not announce every second.

**Forget everything.** Resets the store (name, type, GitHub filter and sort, visit history), keeps counting the current visit, and confirms in a `role="status"` message.

### Live GitHub repositories (`js/github.js`)

`GET https://api.github.com/users/howiskhaled/repos?per_page=100&sort=pushed` returns my public repositories. It needs no key and allows cross-origin requests.

**Flow**

1. **Start.** If a saved list in `localStorage` (`github-repos`) is less than 30 minutes old, it is shown immediately and no request is made. Otherwise the loading skeleton shows and the request waits until the section is 300 px from the screen (`IntersectionObserver`).
2. **Fetch.** `fetchRepos()` uses a 10-second `AbortController` timeout and turns every failure into an error with a `kind`: `offline`, `slow`, `rate` (HTTP 403/429 with `x-ratelimit-remaining: 0`), `missing` (404) or `failed`.
3. **Clean.** `cleanRepo()` keeps only the fields the page uses, checks their types, accepts the repository link only if it is `https://github.com/…`, and accepts a homepage only if it is `https:`. Text is only ever written with `textContent`. The cached copy is cleaned the same way when read back.
4. **Group.** `categorizeRepo()` applies three rules in order: a fork is a **team** project; a name containing `assignment`, `coursework` or a course code such as `swe363`, or a `coursework` topic, is **coursework**; everything else is **personal**.
5. **Show.** Each card is cloned from a `<template>`: group, "Updated 3 days ago" (`Intl.RelativeTimeFormat`, so it is also correct in Arabic), a friendly title (`202338530-KhaledAlanazi-assignment2` becomes "Assignment 2"), the real repository name, the description, the language with its GitHub colour, stars (hidden when there are none) and a "Live site" link when the repository has a homepage.

**Filter and sort.** `renderList()` works in four steps: count the repositories in each group (the counts appear in the chips), keep the ones in the selected group, sort them with the selected compare function, then draw them.

| Sort | Compare function |
| --- | --- |
| Recently updated | newest `pushed_at` first |
| Newest first | newest `created_at` first, ties by last update |
| Oldest first | oldest `created_at` first, ties by last update |
| Name, A to Z | the title the visitor sees, with `localeCompare` and `numeric: true` so "Assignment 2" comes before "Assignment 10" |
| Most stars | most stars first, ties by last update |

Both choices are saved in the store, so they survive a reload and can be set from the visitor panel.

**Errors**

| Situation | What the visitor sees |
| --- | --- |
| Loading | Three shimmering placeholder cards |
| Offline | "You seem to be offline." with a hint and "Try again" |
| No answer in 10 s | "GitHub is taking too long to answer." |
| Rate limit reached | "GitHub needs a short break." and when it will answer again ("in 25 minutes", from `x-ratelimit-reset`) |
| Profile not found | "That GitHub profile couldn’t be found." and a pointer to the GitHub link |
| Any other failure | "Couldn’t load my repositories just now." |
| Failure, but an older list exists | The older list, with a note: "GitHub couldn’t be reached, so this is the copy saved 1 hour ago." |
| Group with no repositories | "Nothing in this group yet." and a "Show all repositories" button |
| JavaScript disabled | A `<noscript>` message pointing to the GitHub link |

A `requestId` counter ignores a late answer from an older request, the same way as in the Wikipedia section.

### Contact form additions

| Addition | How it works |
| --- | --- |
| Topic (required) | A `<select>` with four topics. The success message is different for each topic. |
| Email typo check | After a valid email loses focus, `suggestEmail()` compares its domain with common domains using `editDistance()` (Levenshtein distance). If one is 1 or 2 edits away, the form shows "Did you mean sara@gmail.com?" with a **Use it** button. Real domains that look similar (`mail.com`, `ymail.com`, …) are on an allow list, so they are never "corrected". Short forms in `EMAIL_SHORT_FORMS` are compared too, so `kfupm.edu` (and typos of it) suggests `kfupm.edu.sa`. The suggestion never blocks sending. |
| Progress | "2 of 4 ready" updates as the visitor types, without showing errors they have not earned yet, and becomes "All set" when every field passes. |
| Saved name | A name saved in the visitor panel fills an empty name field. |

Submitting still checks every field in order and focuses the first one with a problem; only when all four pass does the preview message appear.

### Performance work

See [Performance results](#performance-results) for the numbers.

| Change | Why |
| --- | --- |
| Inter subset from 344 KB to 103 KB (Latin, punctuation, arrows and the few symbols the site uses; both variable axes kept) | Inter is preloaded and draws the hero headline, the page's largest element, so it was the main cause of the slow LCP on mobile |
| Tajawal converted from TTF to subset WOFF2 (about 60 KB → 17 KB per weight) | The Arabic font, also used by the "العربية" button on every page |
| JPG → WebP for all photos and screenshots (quality 80) | About 55 % smaller with no visible difference |
| 240 px versions of the three screenshots in the phone collage, chosen with `srcset` and `sizes` | The collage shows them at about 100–220 px, so phones no longer download the 393 px files |
| Profile photo resized from 400 px to 360 px (twice its 180 px display size) | Sharp on high-density screens without extra bytes |
| Gallery image marked `loading="lazy"` | It sits in a closed dialog, so it is only fetched when the gallery opens |
| GitHub list cached for 30 minutes and requested only near the screen | Fewer requests, faster repeat visits, and GitHub's 60 requests per hour limit is rarely reached |
| Scroll-cue ring redrawn at twice the SVG coordinates | Same picture, but its text now has a legible computed size, which fixed Lighthouse's "legible font sizes" check |
| Removed unused files and code | Old JPG and TTF files, four unused colour tokens and an unused translation |

Scripts are `defer`red, images have `width` and `height` so nothing jumps while loading, and animation uses only `transform` and `opacity`. The CSS and JavaScript are not minified on purpose so they stay readable for marking; GitHub Pages compresses them with gzip, which removes most of the difference.

### Compatibility

The features use standard web APIs with long support: `fetch`, `AbortController`, `IntersectionObserver`, `Intl.RelativeTimeFormat`, Unicode property escapes in regular expressions (`\p{L}`), `<template>`, `<dialog>` and WebP. They are all supported by current Chrome, Edge, Firefox and Safari (Safari 14.1 or later). Where a feature can be missing, the page falls back: without `IntersectionObserver`, data loads immediately; without storage, nothing is remembered but everything works; without JavaScript, `<noscript>` messages explain what is missing.

## What is new in Assignment 2

| Requirement | Where it is met |
| --- | --- |
| Dynamic content | Toolkit explorer: live search and category filter (`initToolkit()`) |
| Data handling | Wikipedia public API (`initCuriosity()`); `localStorage` for theme, language, motion, and the last article |
| Animation and transitions | Entrance animation when filtered items reappear, fade/slide of new messages, hover lift on chips and tool tags, skeleton shimmer while loading |
| Error handling and user feedback | Loading indicator, three friendly API errors with retry, an empty state, live form hints and errors |
| AI enhancement | See [`ai-usage-report.md`](ai-usage-report.md) |

### Toolkit explorer

The four skill rows from Assignment 1 are now lists of individual tools (`<ul class="tool-list">`). Each `<article class="skill-row">` has a `data-category` (`web`, `mobile`, `code`, `foundation`) and each `<li>` can have a `data-keywords` attribute with extra search words (for example `js`, `ios`, `terminal`).

State is a small object, `{ category, query }`, and one `render()` function recomputes everything from it, so the search box, the chips and the reset button can never disagree:

1. A tool is visible when its row matches the selected category **and** its text plus keywords contain the query (case-insensitive, after trimming).
2. A row is visible when at least one of its tools is.
3. The status line (`role="status"`) says "Showing 3 of 10 tools" or "Showing all 10 tools".
4. When nothing matches, an empty state says what was searched and offers a "Show everything" button that clears the search, resets the category and returns focus to the search box.

The Escape key clears the search box. Chips are buttons with `aria-pressed`. The search runs on every `input` event, which is fast enough for ten items, so no debounce is needed. The visitor's query is only ever written with `textContent`. Changing the language re-runs `render()`, because the tool names (for example "Security fundamentals") and the status text change.

### Curiosity section (Wikipedia API)

`GET https://{en|ar}.wikipedia.org/api/rest_v1/page/random/summary` returns a random article summary. The site uses the Wikipedia that matches the page language. The endpoint needs no key and allows cross-origin requests, so the browser can call it directly.

Flow:

1. **Start.** If a valid article was saved in `localStorage` (`curiosity-fact`), it is shown straight away, with a note saying it is from the last visit. Otherwise the section shows a loading skeleton and fetches the first article only when the section is about to scroll into view (`IntersectionObserver`), so visitors who never scroll that far make no request.
2. **Fetch.** `fetchRandomFact()` asks for an article and accepts it only if it is not a disambiguation page and has an extract of at least 80 characters. Otherwise it asks again, up to three times. A 10-second `AbortController` timeout covers the whole attempt.
3. **Show.** The title, short description and extract are written with `textContent`. The block gets the article's own `lang` and `dir`, so an Arabic article is right-to-left even on an English page. The image, if there is one, is decorative (`alt=""`) because the title is next to it.
4. **Save.** The cleaned article is stored in `localStorage` so it can be restored next time.

The button is always the same element. Its label changes ("Show me another", "Finding…", "Try again") and it uses `aria-disabled` while loading instead of `disabled`, so keyboard focus is never lost. A request counter (`requestId`) ignores any response that arrives after a newer request started.

| Situation | What the visitor sees |
| --- | --- |
| Loading | Shimmering skeleton and "Finding something worth knowing…"; the card has `aria-busy="true"` |
| Offline (`navigator.onLine` is false) | "You seem to be offline." and a hint to check the connection and press "Try again" |
| No answer within 10 s | "Wikipedia is taking too long to answer." and the same hint |
| HTTP error, bad data or no suitable article after three tries | "Couldn’t fetch an article just now." and the same hint |
| `localStorage` unavailable | Nothing visible; the article simply is not saved |
| Image fails to load | The image column is hidden and the text uses the full width |
| JavaScript disabled | A `<noscript>` message |

**Treating third-party data as untrusted.** The response is not trusted just because Wikipedia sent it. `cleanFact()` checks the types, rebuilds the object with only the fields the page uses, and accepts links only if they are `https:` on `wikipedia.org` and images only if they are `https:` on `upload.wikimedia.org`. A `javascript:` link, for example, makes the article invalid. The same function validates the copy read back from `localStorage`, because visitors (or other scripts on the same origin) can edit it. No article text is ever inserted as HTML.

The note under the card says the article is random and "I did not choose or check it", because Wikipedia's random pages are not curated.

### Form feedback

The form is still a local demo. New in Assignment 2: the message field shows a live hint ("8 more characters to go." / "That’s enough to get started."), error messages slide in, and the success message is a highlighted box with a check mark that fades in. Messages follow the language switcher.

### Animation

| Where | Effect | Implementation |
| --- | --- | --- |
| Filtered rows, tools and the empty state | Rise and fade in when they reappear, staggered by 45 ms | `.is-entering` class added by `playEntrance()`; `@keyframes enter-up` |
| New Wikipedia article | Same rise and fade | `playEntrance()` on the content block |
| Loading | Shimmer on the skeleton lines | `@keyframes shimmer` |
| Form errors and success | Slide down and fade in | `@keyframes message-in` on `.field__error` and `.form__status`, which replay because those elements switch from `display: none` to visible |
| Chips and tool tags | Lift by 4 px and change border colour on hover | `transition` on `transform` and `border-color` |

Only `opacity` and `transform` are animated, apart from the shimmer, which moves a background. With `prefers-reduced-motion: reduce`, the existing global rule disables all animations, and `playEntrance()` returns early.

### Data kept in the browser

| Key | Storage | Value | Why |
| --- | --- | --- | --- |
| `theme` | `localStorage` | `light` or `dark` | Remember the theme |
| `language` | `localStorage` | `en` or `ar` | Remember the language |
| `motion-paused` | `localStorage` | `true` or `false` | Remember the pause control |
| `curiosity-fact` | `localStorage` | The last Wikipedia article | Show something immediately on the next visit |
| `portfolio-visitor` | `localStorage` | The store: name, visitor type, GitHub filter and sort, visits, seconds spent | Assignment 3 state management |
| `github-repos` | `localStorage` | The last GitHub list and when it was saved | 30-minute cache and offline fallback |
| `visit-counted` | `sessionStorage` | `true` | Count a visit once per session |

The only personal value is the first name a visitor chooses to type, which never leaves the browser and is removed by "Forget everything about me". The contact form saves nothing. Every read and write is wrapped in `try/catch`, so the site works with storage blocked.

## Gallery

`mizanytiSlides` is an ordered array of `{ src, alt, caption }` entries. `data-slide` on a preview image identifies which slide opens. The separate “View all 7 screens” button starts at the first image.

The browser's native `dialog.showModal()` supplies focus containment, Escape closing and focus restoration. Buttons and arrow keys navigate with wraparound. Swipes require at least 50px of horizontal movement and must be more horizontal than vertical, so ordinary vertical gestures do not change slides. Clicking outside the dialog closes it.

## Language (English / Arabic)

A toggle in the header (and in the mobile menu) switches the whole site between English and Arabic. English is the default, and the visitor's choice is saved in `localStorage`.

**How it works** (`js/i18n.js`, exposed as `window.portfolioI18n`):

| Piece | What it does |
| --- | --- |
| `data-i18n="key"` | Marks an element whose text is translatable. `data-i18n-aria-label`, `data-i18n-alt` and `data-i18n-placeholder` do the same for those attributes. |
| `messages` | A dictionary with an `en` and an `ar` object. The English text is not retyped: `init()` copies it from the HTML, so the page itself is the English source and the HTML works as the fallback. |
| `t(key, values)` | Looks the key up in the current language, falls back to English, then to the key itself. `{name}`-style placeholders are filled from `values`. |
| `number(value)` | Formats numbers with `Intl.NumberFormat`, which gives Arabic-Indic digits (٠١٢…) in Arabic. |
| `setLanguage(lang)` | Sets `<html lang>` (`ar-SA` or `en`) and `dir` (`rtl` or `ltr`), rewrites every bound element, updates the page title and meta description, updates the toggle buttons, saves the choice, and announces the change through a `role="status"` element for screen readers. It then fires a `languagechange` event. |

Text that JavaScript creates while the page runs cannot be marked in the HTML, so `script.js` listens for `languagechange` and re-renders it: the theme and motion button labels, the greeting and year, the gallery caption, alt text, counter and arrows, any visible form error, hint or success message, the toolkit count and empty-state text, and the Wikipedia button label, note and error title. The text of a Wikipedia article is not translated: it stays in the language it was fetched in and carries its own `lang` and `dir`.

**Right-to-left details**

- `html[dir="rtl"]` rules in the CSS switch to the Tajawal font, remove letter-spacing (it breaks the joining of Arabic letters) and increase line height.
- In the gallery the previous/next arrows swap, and the arrow keys and swipe direction reverse, so "forward" still points the way the text reads.
- A visitor's name inside an Arabic sentence is wrapped in Unicode isolation marks (`⁨ … ⁩`), so a Latin name cannot scramble the order of the Arabic words around it.
- The language button is `hidden` in the HTML and revealed by JavaScript, so it does not appear when it could not work.
- Tajawal (Regular and Light, about 17 KB each after subsetting) loads with `font-display: swap`.

## Contact form

This is explicitly a **local demo**. No data is submitted, stored or sent to an external service. The main contact route is the real GitHub profile link.

- Name requires two characters after trimming.
- Email must match a simple email pattern.
- Message requires ten characters after trimming.
- Errors appear beside the corresponding fields and use `aria-describedby`, `aria-live` and `aria-invalid`.
- Validation checks all fields, then focuses the first invalid one.
- Successful validation uses `textContent`, keeps the draft and confirms that nothing was sent.
- The submit control is enabled visually only after its JavaScript handler is installed. Without JavaScript, the form explains that its preview needs JavaScript and provides the GitHub alternative.

Connecting a real delivery service is separate work; do not change the form's confirmation to imply delivery until a backend actually returns success.

## Accessibility and performance

- Semantic landmarks, section headings, labelled controls and a skip link.
- Visible keyboard focus and 44px or larger main navigation/dialog controls.
- The toolkit search has a visible label, the chips use `aria-pressed`, and the result count is announced through a `role="status"` region. The Wikipedia card is an `aria-live="polite"` region with `aria-busy` while loading.
- Content stays visible if JavaScript or IntersectionObserver is unavailable.
- The desktop link list remains available on mobile if the dialog initializer cannot run.
- `prefers-reduced-motion` disables animation and smooth scrolling; a separate pause control handles continuous decorative motion.
- Animation uses transforms and opacity with `cubic-bezier(.19, 1, .22, 1)` easing. Hero motion pauses offscreen.
- Images have explicit dimensions, and below-fold project/profile images load lazily.
- The only requests to other sites are the GitHub and Wikipedia API calls, made only when those sections are reached.

## Verification

**Assignment 3 checks.** Run by Claude Code with scripts in the Claude desktop app's built-in browser (Chromium), served locally, in English and Arabic, light and dark mode, at 1280 px and 375 px.

- Store: values survive a reload; a hand-edited invalid value falls back to its default; "Forget everything about me" clears name, visitor type, filter, sort and history, and the confirmation disappears after the next choice.
- Visitor name: empty, 1 letter, `Sara2` and `Sa--ra` each show their own message; `  sara   al-otaibi ` is saved as `sara al-otaibi`; the About greeting becomes "GOOD AFTERNOON, SARA AL-OTAIBI. I’M KHALED." and the Arabic greeting keeps the Latin name in the right place.
- Visitor type: each chip shows its own title, text and links; pressing it again clears it; "Open my coursework" sets the GitHub filter to Coursework (2 of 4) and scrolls there.
- Timer: counts up each second, the visit counter does not change on reload in the same session, and the total is saved every 15 seconds.
- GitHub: the list loads live (4 repositories: Assignment 1, Assignment 2, Course register, Team8 mall hub, grouped 2 coursework, 1 personal, 1 team); all five sort orders give the expected order; filter and sort survive a reload; a faked rate limit shows "GitHub needs a short break." and "It will answer again in 25 minutes."; a faked network error shows the failure message; "Try again" recovers; a faked HTTP 500 with an older saved list shows that list with the "copy saved 1 hour ago" note.
- Form: an empty submit shows four errors and focuses the name; `gmial.com` and `outlok.com` get suggestions and **Use it** fixes the address; `mail.com`, `ymail.com` and `company.sa` get none; the counter goes from "1 of 4 ready" to "All set"; the success message matches the topic; everything switches to Arabic.
- Assignment 2 features still work: toolkit search, empty state and reset; gallery navigation with WebP screenshots; Wikipedia article loading; theme toggle.
- Layout: no horizontal scrolling at 375 px; dark mode colours checked on the new sections.
- Lighthouse 12.6 (mobile): performance 99, accessibility 100, best practices 100, SEO 100. Desktop: 100, 97, 100, 100 (see README *Performance results*).

**Cross-browser test (live GitHub Pages site).** One Playwright script ran the same steps in **Google Chrome 157** and **WebKit 18.4** (Safari's engine): save the name "Sara" and check the greeting; choose "A fellow student" and follow "Open my coursework" (3 coursework repositories shown); sort by name (Assignment 1, 2, 3, Course register, Team8 mall hub); watch the timer advance; type `sara@gmial.com` and get the `gmail.com` suggestion; submit the form (topic and message errors shown, name prefilled with "Sara"); open the gallery (WebP image decoded at 393 px); switch to Arabic (`dir="rtl"`, Arabic greeting, Arabic relative date); resize to 375 px (no horizontal overflow). Both browsers passed every step with no console errors or page errors. A Firefox run was planned, but the Firefox download failed repeatedly on this network, so Firefox has not been tested automatically.


**Assignment 2 checks.** These were run by Claude Code in the Claude desktop app's built-in browser (a Chromium-based browser), served with `python3 -m http.server`. I have not yet tested other browsers, and a real phone is still to do.

- Toolkit: all 10 tools shown at first; "js" shows only JavaScript; "zzz" shows the empty state; the reset button restores everything and focuses the search box; the Mobile chip shows React Native and Expo; "git" finds Git & GitHub; in Arabic, searching "أمن" and the English alias "security" both find the security tool; the count text is translated.
- Wikipedia: first article loads when the section is reached and is saved; a simulated network failure shows the error state with "Try again"; the next click recovers; a response with a `javascript:` link is rejected; an HTTP 503 shows the friendly error; an Arabic article loads in Arabic mode with `dir="rtl"`; a portrait-shaped thumbnail no longer stretches the card.
- Form: empty submit shows three errors and focuses the first field; the message hint counts down and then reads "That’s enough to get started."; valid input shows the animated success message; the hint and message switch to Arabic.
- Layout: no horizontal scrolling at 320 px in English or Arabic, including a very long search with no results; the mobile menu lists Work, About, Toolkit, Curiosity and Contact; the browser console showed no errors.

**Carried over from Assignment 1.** Arabic mode was checked in a browser by Claude Code: switching to Arabic and back restores all translated elements to their exact English text; the saved language survives a reload; the gallery shows Arabic numerals and reversed arrows and keys; form errors and the success message appear in Arabic and re-translate when the language changes; the mobile menu works; and there is no horizontal scrolling at 320, 375 and 1280px.

Browser smoke checks for Assignment 1 covered 320, 375, 390, 700, 768, 1024, 1440 and 1920px widths, all seven gallery screens, arrow-key navigation, Escape closing, mobile menu focus, form validation, saved theme, motion controls and a JavaScript-disabled fallback.

## Known limits

- The GitHub list depends on GitHub's public API, which allows 60 requests per hour per network without signing in. The cache and the saved-copy fallback make this rare, and the page explains it when it happens.
- Repository groups come from simple name rules. A future repository with an unusual name may need a `coursework` topic on GitHub to be grouped correctly.
- The visit timer counts seconds with `setInterval`, so it can drift by a second or two over a long visit. That is fine for a friendly display.
- The Wikipedia feature needs an internet connection and depends on a service I do not control. If Wikipedia changes its API, the section shows its error state instead of breaking the page.
- Random Wikipedia articles are not curated, so occasionally one may be obscure or sensitive.
- Toolkit search matches plain substrings, with no fuzzy matching and no special handling of Arabic diacritics.
- The contact form is still a demo and sends nothing.
