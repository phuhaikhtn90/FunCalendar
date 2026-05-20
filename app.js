(function () {
  const STORAGE_KEY = "fun-calendar-state-v2";
  const calendarEl = document.getElementById("calendar");
  const rangeLabelEl = document.getElementById("rangeLabel");
  const rangeSubLabelEl = document.getElementById("rangeSubLabel");
  const summaryDoneEl = document.getElementById("summaryDone");
  const summaryTotalEl = document.getElementById("summaryTotal");
  const summaryRateEl = document.getElementById("summaryRate");
  const weeklyGradePillEl = document.getElementById("weeklyGradePill");
  const weeklyInsightEl = document.getElementById("weeklyInsight");
  const heroWeekLabelEl = document.getElementById("heroWeekLabel");
  const heroScoreEl = document.getElementById("heroScore");
  const heroRankEl = document.getElementById("heroRank");
  const themeCardEl = document.getElementById("themeCard");
  const resourceListEl = document.getElementById("resourceList");
  const taskDialog = document.getElementById("taskDialog");
  const weekDialog = document.getElementById("weekDialog");
  const dialogTitleEl = document.getElementById("dialogTitle");
  const dialogTasksEl = document.getElementById("dialogTasks");
  const weekDialogTitleEl = document.getElementById("weekDialogTitle");
  const taskTitleInput = document.getElementById("taskTitleInput");
  const taskSubjectInput = document.getElementById("taskSubjectInput");
  const taskNoteInput = document.getElementById("taskNoteInput");
  const taskLinkInput = document.getElementById("taskLinkInput");
  const taskScopeInput = document.getElementById("taskScopeInput");
  const weekFocusInput = document.getElementById("weekFocusInput");
  const weekAdjustmentInput = document.getElementById("weekAdjustmentInput");
  const exportStateBtn = document.getElementById("exportStateBtn");
  const importStateInput = document.getElementById("importStateInput");
  const syncStatusText = document.getElementById("syncStatusText");

  const state = {
    view: "day",
    currentDate: startOfDay(new Date()),
    selectedDate: null,
    selectedTaskId: null,
    storage: loadState()
  };

  populateSubjectOptions();
  attachEvents();
  initializeCloudSync();
  render();

  function attachEvents() {
    document.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => {
        state.view = button.dataset.view;
        document
          .querySelectorAll("[data-view]")
          .forEach((node) => node.classList.toggle("active", node === button));
        render();
      });
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
      state.currentDate =
        state.view === "day"
          ? addDays(state.currentDate, -1)
          : state.view === "week"
          ? addDays(state.currentDate, -7)
          : addMonths(state.currentDate, -1);
      render();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
      state.currentDate =
        state.view === "day"
          ? addDays(state.currentDate, 1)
          : state.view === "week"
          ? addDays(state.currentDate, 7)
          : addMonths(state.currentDate, 1);
      render();
    });

    document.getElementById("todayBtn").addEventListener("click", () => {
      state.currentDate = startOfDay(new Date());
      render();
    });

    document.getElementById("saveTaskBtn").addEventListener("click", saveTaskChanges);
    document.getElementById("addTaskBtn").addEventListener("click", addTaskForSelectedDay);
    document.getElementById("weeklyPlanBtn").addEventListener("click", openWeekDialog);
    document.getElementById("saveWeekBtn").addEventListener("click", saveWeekNote);
    exportStateBtn.addEventListener("click", exportState);
    importStateInput.addEventListener("change", importState);
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        completions: {},
        dayOverrides: {},
        seriesOverrides: [],
        weekNotes: {}
      };
    } catch (error) {
      return {
        completions: {},
        dayOverrides: {},
        seriesOverrides: [],
        weekNotes: {}
      };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.storage));
    if (window.FunCalendarCloud) {
      window.FunCalendarCloud.saveState(state.storage);
    }
  }

  function render() {
    const range =
      state.view === "day"
        ? { start: state.currentDate, end: state.currentDate }
        : state.view === "week"
        ? getWeekRange(state.currentDate)
        : getMonthRange(state.currentDate);
    const dates =
      state.view === "day"
        ? [state.currentDate]
        : state.view === "week"
        ? getDatesBetween(range.start, range.end)
        : getMonthCalendarDates(state.currentDate);
    calendarEl.className = `calendar-grid ${state.view}`;
    calendarEl.innerHTML = "";

    rangeLabelEl.textContent =
      state.view === "day"
        ? `Today plan · ${formatLongDate(state.currentDate)}`
        : state.view === "week"
        ? `Week ${formatShortDate(range.start)} - ${formatShortDate(range.end)}`
        : `Month ${state.currentDate.getMonth() + 1}/${state.currentDate.getFullYear()}`;
    rangeSubLabelEl.textContent =
      state.view === "day"
        ? "Today shows up to 3 balanced tasks so the plan stays calm, clear, and finishable."
        : "Each day is capped at 3 balanced tasks with language, thinking, and creative variety across the week.";

    dates.forEach((date) => {
      const dayCard = buildDayCard(date, range);
      calendarEl.appendChild(dayCard);
    });

    renderWeeklySummary(getWeekRange(state.currentDate));
    renderMonthlyTheme(state.currentDate);
    renderResources();
  }

  async function initializeCloudSync() {
    if (!window.FunCalendarCloud) {
      return;
    }

    window.FunCalendarCloud.onStatusChange((message) => {
      if (syncStatusText) {
        syncStatusText.textContent = message;
      }
    });

    await window.FunCalendarCloud.initialize();
    const remoteState = await window.FunCalendarCloud.loadState();
    if (remoteState) {
      state.storage = {
        completions: remoteState.completions || {},
        dayOverrides: remoteState.dayOverrides || {},
        seriesOverrides: remoteState.seriesOverrides || [],
        weekNotes: remoteState.weekNotes || {}
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.storage));
      render();
    }
  }

  function buildDayCard(date, activeRange) {
    const dayKey = formatDateKey(date);
    const tasks = getTasksForDate(date);
    const dayCard = document.createElement("article");
    const outsideMonth = state.view === "month" && date.getMonth() !== state.currentDate.getMonth();
    dayCard.className = `day-column ${state.view === "month" ? "month-cell" : ""} ${
      isSameDay(date, new Date()) ? "today" : ""
    } ${outsideMonth ? "faded" : ""}`;

    const completedCount = tasks.filter((task) => isTaskDone(dayKey, task.id)).length;
    const heading = document.createElement("div");
    heading.className = "day-header";
    heading.innerHTML = `
      <div>
        <div class="day-title">${formatWeekday(date)}</div>
        <div class="day-subtitle">${formatShortDate(date)}</div>
      </div>
      <button class="secondary-btn day-edit-btn" type="button">Edit</button>
    `;
    heading.querySelector("button").addEventListener("click", () => openTaskDialog(date));
    dayCard.appendChild(heading);

    const taskList = document.createElement("div");
    taskList.className = "task-list";

    if (!tasks.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "This day is intentionally lighter. You can add one free-choice activity if you want.";
      taskList.appendChild(empty);
    } else {
      const visibleTasks = state.view === "month" ? tasks.slice(0, 2) : tasks;
      visibleTasks.forEach((task) => {
        taskList.appendChild(buildTaskCard(dayKey, task));
      });
      if (state.view === "month" && tasks.length > visibleTasks.length) {
        const more = document.createElement("div");
        more.className = "more-tasks";
        more.textContent = `+${tasks.length - visibleTasks.length} more tasks`;
        taskList.appendChild(more);
      }
    }

    const footer = document.createElement("div");
    footer.className = "day-subtitle";
    footer.textContent = `${completedCount}/${tasks.length} tasks completed`;

    dayCard.appendChild(taskList);
    dayCard.appendChild(footer);
    return dayCard;
  }

  function buildTaskCard(dayKey, task) {
    const subject = STUDY_DATA.subjects[task.subject] || { label: task.subject, className: "" };
    const card = document.createElement("div");
    card.className = `task-card ${isTaskDone(dayKey, task.id) ? "done" : ""} ${
      state.view === "month" ? "compact" : state.view === "day" ? "day-focus" : ""
    }`;
    const links = [];
    if (task.link) {
      links.push(
        `<a href="${task.link}" target="_blank" rel="noreferrer">${
          state.view === "month" ? "Open" : "Open learning link"
        }</a>`
      );
    }
    card.innerHTML = `
      <div class="task-card-header">
        <div>
          <div class="task-name">${task.title}</div>
          <div class="task-tags">
            <span class="chip ${subject.className}">${subject.label}</span>
          </div>
        </div>
        <input class="task-check" type="checkbox" ${isTaskDone(dayKey, task.id) ? "checked" : ""} aria-label="Mark as done" />
      </div>
      <p>${task.note || ""}</p>
      <div class="task-links">${links.join("")}</div>
    `;
    card.querySelector(".task-check").addEventListener("change", (event) => {
      setTaskDone(dayKey, task.id, event.target.checked);
      render();
    });
    return card;
  }

  function renderWeeklySummary(range) {
    const dates = getDatesBetween(range.start, range.end);
    const tasks = dates.flatMap((date) => {
      const dayKey = formatDateKey(date);
      return getTasksForDate(date).map((task) => ({ dayKey, task }));
    });
    const total = tasks.length;
    const done = tasks.filter(({ dayKey, task }) => isTaskDone(dayKey, task.id)).length;
    const rate = total ? Math.round((done / total) * 100) : 0;
    const grade = getGrade(rate);
    const weekKey = formatDateKey(range.start);
    const note = state.storage.weekNotes[weekKey] || {};

    summaryDoneEl.textContent = String(done);
    summaryTotalEl.textContent = String(total);
    summaryRateEl.textContent = `${rate}%`;
    weeklyGradePillEl.textContent = grade.label;
    weeklyGradePillEl.style.background = grade.background;
    weeklyInsightEl.textContent =
      note.focus || note.adjustment
        ? `Priority: ${note.focus || "Not added yet"}${note.adjustment ? ` | Adjustment: ${note.adjustment}` : ""}`
        : grade.message;
    heroWeekLabelEl.textContent = `Week of ${formatShortDate(range.start)}`;
    heroScoreEl.textContent = `${rate}%`;
    heroRankEl.textContent = grade.label;
  }

  function renderMonthlyTheme(date) {
    const monthData = STUDY_DATA.monthlyThemes[date.getMonth() + 1];
    themeCardEl.innerHTML = `
      <article>
        <h4>${monthData.title}</h4>
        <p>${monthData.focus}</p>
        <ul>${monthData.ideas.map((idea) => `<li>${idea}</li>`).join("")}</ul>
      </article>
    `;
  }

  function renderResources() {
    resourceListEl.innerHTML = STUDY_DATA.resourceLibrary
      .map(
        (item) => `
          <article class="resource-item">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <a href="${item.url}" target="_blank" rel="noreferrer">Open resource</a>
          </article>
        `
      )
      .join("");
  }

  function getTasksForDate(date) {
    const dayKey = formatDateKey(date);
    const baseTasks = STUDY_DATA.recurringTemplates
      .filter((task) => task.weekday === date.getDay())
      .map((task) => applySeriesOverrides(task, dayKey));
    const overrides = state.storage.dayOverrides[dayKey];
    return overrides ? overrides.tasks : baseTasks;
  }

  function applySeriesOverrides(task, dateKey) {
    const matchedOverrides = state.storage.seriesOverrides
      .filter((override) => override.templateId === task.id && override.startDate <= dateKey)
      .sort((left, right) => left.startDate.localeCompare(right.startDate));
    return matchedOverrides.reduce((current, override) => ({ ...current, ...override.patch }), { ...task });
  }

  function isTaskDone(dayKey, taskId) {
    return Boolean(state.storage.completions[`${dayKey}::${taskId}`]);
  }

  function setTaskDone(dayKey, taskId, done) {
    state.storage.completions[`${dayKey}::${taskId}`] = done;
    saveState();
  }

  function openTaskDialog(date) {
    state.selectedDate = startOfDay(date);
    state.selectedTaskId = null;
    const dayKey = formatDateKey(date);
    dialogTitleEl.textContent = `Edit plan for ${formatShortDate(date)}`;
    renderDialogTaskList(dayKey);
    hydrateTaskEditor(dayKey);
    taskDialog.showModal();
  }

  function renderDialogTaskList(dayKey) {
    const tasks = getTasksForDate(parseDateKey(dayKey));
    dialogTasksEl.innerHTML = tasks
      .map(
        (task) => `
          <button class="dialog-task-chip ${task.id === state.selectedTaskId ? "active" : ""}" type="button" data-task-id="${task.id}">
            ${task.title}
          </button>
        `
      )
      .join("");

    if (!state.selectedTaskId && tasks[0]) {
      state.selectedTaskId = tasks[0].id;
    }

    Array.from(dialogTasksEl.querySelectorAll("[data-task-id]")).forEach((button) => {
      button.classList.toggle("active", button.dataset.taskId === state.selectedTaskId);
      button.addEventListener("click", () => {
        state.selectedTaskId = button.dataset.taskId;
        hydrateTaskEditor(dayKey);
        renderDialogTaskList(dayKey);
      });
    });
  }

  function hydrateTaskEditor(dayKey) {
    const tasks = getTasksForDate(parseDateKey(dayKey));
    const task = tasks.find((item) => item.id === state.selectedTaskId) || tasks[0];
    if (!task) {
      state.selectedTaskId = null;
      taskTitleInput.value = "";
      taskSubjectInput.value = "english";
      taskNoteInput.value = "";
      taskLinkInput.value = "";
      return;
    }
    state.selectedTaskId = task.id;
    taskTitleInput.value = task.title || "";
    taskSubjectInput.value = task.subject || "english";
    taskNoteInput.value = task.note || "";
    taskLinkInput.value = task.link || "";
    taskScopeInput.value = "day";
  }

  function saveTaskChanges() {
    if (!state.selectedDate || !state.selectedTaskId) {
      return;
    }
    const dayKey = formatDateKey(state.selectedDate);
    const scope = taskScopeInput.value;
    const patch = {
      title: taskTitleInput.value.trim(),
      subject: taskSubjectInput.value,
      note: taskNoteInput.value.trim(),
      link: taskLinkInput.value.trim()
    };

    if (scope === "series") {
      const templateId = state.selectedTaskId;
      state.storage.seriesOverrides.push({
        templateId,
        startDate: dayKey,
        patch
      });
      delete state.storage.dayOverrides[dayKey];
    } else {
      const tasks = getTasksForDate(state.selectedDate).map((task) =>
        task.id === state.selectedTaskId ? { ...task, ...patch } : task
      );
      state.storage.dayOverrides[dayKey] = { tasks };
    }

    saveState();
    render();
    openTaskDialog(state.selectedDate);
  }

  function addTaskForSelectedDay() {
    if (!state.selectedDate) {
      return;
    }
    const dayKey = formatDateKey(state.selectedDate);
    const newTaskId = `custom-${dayKey}-${Math.random().toString(36).slice(2, 7)}`;
    const tasks = getTasksForDate(state.selectedDate).slice();
    tasks.push({
      id: newTaskId,
      subject: taskSubjectInput.value || "reading",
      title: taskTitleInput.value.trim() || "Extra activity",
      note: taskNoteInput.value.trim() || "Additional task for this day.",
      link: taskLinkInput.value.trim()
    });
    state.storage.dayOverrides[dayKey] = { tasks };
    state.selectedTaskId = newTaskId;
    saveState();
    render();
    openTaskDialog(state.selectedDate);
  }

  function openWeekDialog() {
    const range = getWeekRange(state.currentDate);
    const weekKey = formatDateKey(range.start);
    const note = state.storage.weekNotes[weekKey] || {};
    weekDialogTitleEl.textContent = `Week notes ${formatShortDate(range.start)} - ${formatShortDate(range.end)}`;
    weekFocusInput.value = note.focus || "";
    weekAdjustmentInput.value = note.adjustment || "";
    weekDialog.showModal();
  }

  function saveWeekNote() {
    const range = getWeekRange(state.currentDate);
    const weekKey = formatDateKey(range.start);
    state.storage.weekNotes[weekKey] = {
      focus: weekFocusInput.value.trim(),
      adjustment: weekAdjustmentInput.value.trim()
    };
    saveState();
    render();
    weekDialog.close();
  }

  function exportState() {
    const blob = new Blob([JSON.stringify(state.storage, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fun-calendar-state-${formatDateKey(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importState(event) {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        state.storage = {
          completions: parsed.completions || {},
          dayOverrides: parsed.dayOverrides || {},
          seriesOverrides: parsed.seriesOverrides || [],
          weekNotes: parsed.weekNotes || {}
        };
        saveState();
        render();
      } catch (error) {
        window.alert("Invalid JSON file.");
      } finally {
        importStateInput.value = "";
      }
    };
    reader.readAsText(file);
  }

  function populateSubjectOptions() {
    taskSubjectInput.innerHTML = Object.entries(STUDY_DATA.subjects)
      .map(([value, subject]) => `<option value="${value}">${subject.label}</option>`)
      .join("");
  }

  function getGrade(rate) {
    if (rate >= 90) {
      return { label: "Excellent", message: "The rhythm looks great. You can keep the current workload.", background: "#cfeec9" };
    }
    if (rate >= 80) {
      return { label: "Very good", message: "This is going well. If energy feels low, shorten one task instead of adding more.", background: "#d8eefc" };
    }
    if (rate >= 70) {
      return { label: "Good", message: "A slightly lighter plan or smaller task steps may help the child finish more confidently.", background: "#fff0bb" };
    }
    return { label: "Needs support", message: "Reduce the target and focus on 3 truly important tasks each day.", background: "#ffd8d8" };
  }

  function getWeekRange(date) {
    const base = startOfDay(date);
    const diff = (base.getDay() + 6) % 7;
    const start = addDays(base, -diff);
    return { start, end: addDays(start, 6) };
  }

  function getMonthRange(date) {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start: first, end: last };
  }

  function getMonthCalendarDates(date) {
    const monthRange = getMonthRange(date);
    const calendarStart = getWeekRange(monthRange.start).start;
    const calendarEnd = getWeekRange(monthRange.end).end;
    return getDatesBetween(calendarStart, calendarEnd);
  }

  function getDatesBetween(start, end) {
    const result = [];
    let cursor = startOfDay(start);
    while (cursor <= end) {
      result.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return result;
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date, amount) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  }

  function addMonths(date, amount) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
  }

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDateKey(dateKey) {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function formatShortDate(date) {
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function formatLongDate(date) {
    return `${formatWeekday(date)}, ${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  }

  function formatWeekday(date) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
  }

  function isSameDay(left, right) {
    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  }
})();
