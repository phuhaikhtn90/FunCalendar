# Fun Study Planner

A static web page for managing a child’s daily study plan.

## Quick start

Open [index.html](/Users/haile/Documents/github/FunCalendar/index.html) in a browser.

## Structure

- [index.html](/Users/haile/Documents/github/FunCalendar/index.html): UI markup
- [styles.css](/Users/haile/Documents/github/FunCalendar/styles.css): styling and animation
- [app.js](/Users/haile/Documents/github/FunCalendar/app.js): calendar logic, summaries, and editing
- [data/study-data.js](/Users/haile/Documents/github/FunCalendar/data/study-data.js): separate study data source

## Editing data

- Update frequency, task names, notes, and links in [study-data.js](/Users/haile/Documents/github/FunCalendar/data/study-data.js)
- The page stores done states and quick edits in your browser `localStorage`
- To reset check marks and personal edits, remove the `fun-calendar-state-v1` key in DevTools

## Schedule notes

- Keep each day to 3-4 tasks
- Prioritize one language task, one thinking task, and one creative or relaxed learning task
- English includes Peppa Pig, Cambridge, Gemini conversation, and dubbing practice
- Chinese appears 5 times per week with listening, speaking, recognition, and review
- Reading and discovery appear 2-3 times per week with monthly themes
