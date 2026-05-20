# FunCalendar

A static web app for planning a child-friendly daily study schedule.

## Features

- `Day`, `Week`, and `Month` calendar views
- `Day` view opens by default and focuses on today
- Maximum `3 tasks per day`, balanced across the week
- Task completion tracking with weekly performance summary
- Easy editing for a single day or for future recurring weeks
- Direct learning links for YouTube, Gemini, Micro:bit, and more
- Browser-based backup with JSON export and import

## Project structure

- `index.html`: app layout and dialogs
- `styles.css`: visual design, responsive layout, and animations
- `app.js`: calendar rendering, editing logic, summaries, and local storage
- `data/study-data.js`: editable schedule data, subjects, resources, and monthly themes
- `data/sync-config.js`: simple cloud sync settings
- `apps-script-sync.js`: Google Apps Script sync client
- `apps-script/Code.gs`: server code for the Apps Script web app

## How to use

1. Open `index.html` in a browser.
2. Use the `Day`, `Week`, or `Month` tabs to switch views.
3. Check tasks as completed after each study session.
4. Click `Edit` to adjust one day, or apply updates to future recurring weeks.
5. Use `Export JSON` to back up your personal progress and edits.

## Customizing the schedule

- Edit `data/study-data.js` to change subjects, recurring tasks, links, monthly themes, and learning notes.
- The app stores completion state and quick edits in browser `localStorage` under the key `fun-calendar-state-v2`.
- If you want a clean reset, remove that key from browser DevTools.
- To sync across devices in a simpler way, deploy `apps-script/Code.gs` as a Google Apps Script Web App.
- Then fill in `data/sync-config.js` with your web app URL and a private `accessKey`, and set `enabled: true`.
- Use `Sync now` to push local progress to the cloud and `Load cloud` to pull the latest saved data.
- The app still works normally if cloud sync is not configured.

## Simple cloud sync setup

1. Go to [script.google.com](https://script.google.com/) and create a new Apps Script project.
2. Paste the contents of `apps-script/Code.gs` into the project.
3. In `Project Settings` or from code, set a script property named `FUN_CALENDAR_ACCESS_KEY`.
4. Deploy the script as a `Web app`.
5. In the deployment settings:
   - Execute as: `Me`
   - Who has access: `Anyone`
6. Copy the web app URL into `data/sync-config.js`.
7. Put the same private access key into `data/sync-config.js`.
8. Set `enabled: true`.

## Study design notes

- Each day is capped at `3 tasks`.
- The weekly plan is evenly distributed at `3 tasks x 7 days`.
- The schedule mixes language practice, thinking skills, and creative exploration.
- English includes Peppa Pig listening, Cambridge practice, Gemini speaking, and dubbing.
- Chinese appears `5 times per week`.
- Math appears `2 times per week`.
- Chess appears `3 times per week`.
- Micro:bit appears `2 times per week`.
- Reading and discovery are spread across lighter and theme-based sessions.
