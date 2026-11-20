# Khaled Alanazi | Personal Portfolio (Assignment 3: Advanced Functionality)

My personal portfolio, built with plain **HTML, CSS and JavaScript**. This is Assignment 3 of SWE 363. It starts from my [Assignment 2 portfolio](https://github.com/howiskhaled/202338530-KhaledAlanazi-assignment2) and adds live data from the GitHub API, features with real multi-step logic, a shared state store, and a round of performance work. The site still works in English and Arabic, in light and dark mode, on phones and desktops.

**Live site:** <https://howiskhaled.github.io/202338530-KhaledAlanazi-assignment3/> (see [Deploying to GitHub Pages](#deploying-to-github-pages))

## What is new in Assignment 3

| Requirement | What I built |
| --- | --- |
| **API integration** | **Live GitHub repositories.** The *Selected work* section now lists my public repositories straight from the **GitHub REST API**, with friendly names ("Assignment 2"), descriptions, languages, stars and "Updated 3 days ago". It handles loading, offline, slow, rate-limit and failure cases with clear messages and a **Try again** button, and falls back to the last saved copy if GitHub cannot be reached. |
| **Complex logic** | The GitHub list can be **filtered** (All, Coursework, Personal, Team, with counts) **and sorted** (recently updated, newest, oldest, name, stars) at the same time. The new **visitor panel** checks a name step by step, shows a different path for a recruiter, a fellow student or a curious visitor, and has a **visit timer** that only counts time the page is visible. The **contact form** now has a required topic, spots email typos such as `gmial.com` and offers a one-click fix, shows how many fields are ready, and changes its message by topic. |
| **State management** | A small store (`js/state.js`) keeps the visitor's name, visitor type, GitHub filter and sort, visit count and total time. It saves to `localStorage`, rejects broken saved values, notifies every feature that cares, and syncs between open tabs. Choosing "fellow student" can switch the GitHub filter to *Coursework*, and a saved name appears in the greeting and the contact form. **Forget everything about me** clears it all. Theme, language and motion are still remembered too. |
| **Performance** | Fonts subset to the characters the site uses (Inter 344 KB → 103 KB, Arabic font TTF → WOFF2, about 60 KB → 17 KB each), images converted to WebP and sized for how they are shown, lazy loading, and a 30-minute cache for the GitHub list. Lighthouse on mobile went from **88 to 99** for performance and the page weight from **570 KB to 207 KB** (details below). |
| **AI integration** | Built with Claude Code. See [AI usage summary](#ai-usage-summary) and [`docs/ai-usage-report.md`](docs/ai-usage-report.md). |

Everything from Assignments 1 and 2 is still here: the light and dark themes, the English / Arabic switcher with right-to-left layout, the time-of-day greeting, the Mizanyti screenshot gallery, the searchable toolkit, the random Wikipedia article and the scroll-reveal animations.

## How to use the new features

1. **Make the visit yours.** In *About*, type your first name and press **Save**. The greeting above changes to use it. Pick **A recruiter**, **A fellow student** or **Just curious** to get suggestions, then follow a link. Watch **This visit** count up; switch to another tab and it pauses. Press **Forget everything about me** to clear it all.
2. **Explore my GitHub.** In *Selected work*, scroll to *Live from GitHub*. Press a group chip to filter and use **Sort by** to reorder. Reload the page: your choices are remembered.
3. **Try the contact form.** Type an email like `you@gmial.com`, then move to the next field: the form asks "Did you mean you@gmail.com?" and **Use it** fixes it. Pick a topic and watch the "ready" counter. Press **Preview message**; nothing is sent.
4. **Switch language or theme.** Everything new, including dates like "Updated 3 days ago", the timer and the error messages, follows the language button.

### Trying the error messages

Open the browser's developer tools, then:

- **Offline:** in the **Application** tab, delete the `github-repos` key from Local Storage and reload the page while you are still at the top. In the **Network** tab, set throttling to **Offline**, then scroll down to *Live from GitHub* (the list is only requested when you get near it). You should see "You seem to be offline." with **Try again**. Set the network back to **No throttling** and press **Try again**.
- **Saved copy:** load the list once. In the `github-repos` key, change `savedAt` to a smaller number (an older time) so the copy is no longer fresh. Reload at the top of the page, set the network to **Offline** and scroll down. The saved list appears with a note that GitHub could not be reached.
- **Wikipedia:** with the network **Offline**, press **Show me another** in *Something new to learn*.

## Tech stack

| Layer | Choice |
| --- | --- |
| Markup | HTML5 (`<template>`, `<dialog>`, `srcset`) |
| Styling | CSS3 (custom properties, Grid, Flexbox, keyframe animations, mobile-first media queries, right-to-left rules) |
| Behaviour | Vanilla JavaScript (ES2020: `fetch`, `async`/`await`, `AbortController`, `IntersectionObserver`, `Intl` formatters, a publish/subscribe store) |
| Data | [GitHub REST API](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user) and [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/), both public with no key; `localStorage` and `sessionStorage` |
| Fonts | Locally hosted, subset Inter (English) and Tajawal (Arabic), WOFF2 |

No frameworks, build tools, API keys or dependencies are needed.

## Project structure

```
.
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── i18n.js       English / Arabic text, language switcher, date and number formatting
│   ├── state.js      Shared store for visitor preferences (new)
│   ├── script.js     Shared helpers, theme, menu, gallery, toolkit, Wikipedia, contact form
│   ├── visitor.js    Visitor panel: name, visitor type, visit timer (new)
│   └── github.js     Live GitHub repositories with filter and sort (new)
├── assets/
│   ├── fonts/        Inter and Tajawal (subset WOFF2), with their licences
│   └── images/       Favicon, hero artwork, profile photo, Mizanyti screenshots (WebP)
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

## Getting started (run locally)

You need only a web browser. The GitHub and Wikipedia sections also need an internet connection.

**Option 1: open the file**

1. Download or clone this repository.
2. Double-click `index.html`.

**Option 2: run a local server** (recommended, closer to a real deployment)

```bash
git clone https://github.com/howiskhaled/202338530-KhaledAlanazi-assignment3.git
cd 202338530-KhaledAlanazi-assignment3
python3 -m http.server 8000
```

Then open <http://localhost:8000>. On Windows use `py -m http.server 8000` instead. The **Live Server** extension in VS Code works too.

**Resetting the site:** press **Forget everything about me** in the visitor panel, or clear the site data in your browser (Developer tools → Application → Storage → Clear site data).

### Deploying to GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. After a minute or two the site is live at the link at the top of this README.

## Performance results

Lighthouse 12.6, run in headless Chrome against a local server with gzip (like GitHub Pages), on the site just before and just after the performance changes. Scores were the same in two runs.

| | Performance | Accessibility | Best practices | SEO | Largest Contentful Paint | Page weight |
| --- | --- | --- | --- | --- | --- | --- |
| Mobile, before | 88 | 100 | 96 | 100 | 3.9 s | 570 KB |
| **Mobile, after** | **99** | **100** | **100** | **100** | **2.3 s** | **207 KB** |
| Desktop, before | 100 | 97 | 100 | 100 | 0.8 s | 570 KB |
| **Desktop, after** | **100** | **97** | **100** | **100** | **0.5 s** | **207 KB** |

The one desktop accessibility point is a known false positive: the header text is white over the dark hero image, but Lighthouse cannot see behind a fixed, transparent header and compares it with the cream page colour. The technical documentation explains each change.

## Browser support

Tested in Chromium, Firefox and WebKit (the engine behind Safari) at desktop and phone sizes, in English and Arabic. It works in current Chrome, Edge, Firefox and Safari (14.1 or later). If storage is blocked, nothing is remembered but everything still works. Without JavaScript, the page still shows all its content and explains which live features need it.

## AI usage summary

I used **Claude Code** (Claude Opus 5.5) for this assignment. I gave it the Assignment 3 brief and my Assignment 2 repository. It planned and built the GitHub section, the visitor panel, the shared store, the form checks and the performance work, tested them in Chromium, Firefox and WebKit and with Lighthouse, and drafted the documentation. Every AI-assisted commit has an `Assisted-by:` line. The usage log, what I changed afterwards and my declaration are in [`docs/ai-usage-report.md`](docs/ai-usage-report.md). The AI Evidence ZIP is submitted separately on Blackboard and is not part of this repository.

## Documentation

- [`docs/technical-documentation.md`](docs/technical-documentation.md): file layout, the state store, the GitHub feature, the visitor panel, form logic, performance work, compatibility and testing
- [`docs/ai-usage-report.md`](docs/ai-usage-report.md): how AI was used, the usage log and the declaration

## Author

**Khaled Alanazi** (ID 202338530), Computer Science student
GitHub: [@howiskhaled](https://github.com/howiskhaled)  
khaledfaisal.com
