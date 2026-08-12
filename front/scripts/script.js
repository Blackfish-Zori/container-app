import { dummyTaskData, routes } from "./constants.js";

import { getTasks } from "./functions.js";

let visibleTasks = [];
let taskData = [];
let currentFilter = "all";

window.addEventListener("hashchange", navigate);
document.getElementById("nav").addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    location.hash = e.target.dataset.route;
  }
});

init();

function init() {
  taskData = getTasks();
  navigate();
}

function navigate() {
  const route = getRoute();
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document.getElementById("view-" + route).classList.add("active");
  document.querySelectorAll("#nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
  render();
}

function getRoute() {
  const hash = location.hash.replace("#", "");
  return routes.includes(hash) ? hash : "tasks";
}

function render() {
  const route = getRoute();
  if (route === "tasks") renderTasks();
  if (route === "stats") renderStats();
}

function renderTasks() {
  const list = document.getElementById("task-list");
  const empty = document.getElementById("empty-state");
  visibleTasks = taskData.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  list.innerHTML = "";
  empty.style.display = visibleTasks.length ? "none" : "block";

  visibleTasks.forEach((t) => {
    const li = document.createElement("li");
    li.className = t.done ? "done" : "";
    li.innerHTML = `
        <span class="check" data-id="${t.id}"></span>
        <span class="label">${escapeHtml(t.label)}</span>
        <span class="tag">${t.tag}</span>
        <button class="ghost" data-remove="${t.id}">✕</button>
      `;
    list.appendChild(li);
  });
}

function renderStats() {
  const total = taskData.length;
  const done = taskData.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-pct").textContent = pct + "%";

  const tags = ["work", "home", "general"];
  const breakdown = document.getElementById("tag-breakdown");
  breakdown.innerHTML =
    '<div class="stat-label" style="margin-bottom:.75rem;">By category</div>';
  tags.forEach((tag) => {
    const count = taskData.filter((t) => t.tag === tag).length;
    const width = total ? Math.round((count / total) * 100) : 0;
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
        <span style="width:60px; text-transform:capitalize;">${tag}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${width}%"></span></span>
        <span style="width:24px; text-align:right; color:var(--muted);">${count}</span>
      `;
    breakdown.appendChild(row);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Events ----------
document.getElementById("add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("task-input");
  const tagSelect = document.getElementById("task-tag");
  const text = input.value.trim();
  if (!text) return;

  taskData.push({
    id: Math.random().toString(36).slice(2, 6),
    label: text,
    tag: tagSelect.value,
    done: false,
  });
  input.value = "";
  render();
});

document.getElementById("task-list").addEventListener("click", (e) => {
  const checkId = e.target.dataset.id;
  const removeId = e.target.dataset.remove;
  if (checkId) {
    const t = visibleTasks.find((t) => t.id == checkId);
    if (t) t.done = !t.done;
    render();
  }
  if (removeId) {
    taskData = taskData.filter((t) => t.id != removeId);
    render();
  }
});

document.getElementById("filters").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  currentFilter = e.target.dataset.filter;
  document
    .querySelectorAll("#filters button")
    .forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");
  renderTasks();
});
