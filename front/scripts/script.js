/**
 * Imports
 */
import {
  checkDbConnection,
  getTasks,
  addTask,
  deleteTask,
  checkTask,
} from "./functions.js";
import { routes } from "./constants.js";

/**
 * Global vars
 */
const appTasks = [];
//const visibleApptasks = [];
let currentFilter = "all";
const tags = ["work", "home", "general"];

/**
 * Element selectors
 */
const list = document.getElementById("task-list");
const empty = document.getElementById("empty-state");
const statTotal = document.getElementById("stat-total");
const statDone = document.getElementById("stat-done");
const statPct = document.getElementById("stat-pct");
const breakdown = document.getElementById("tag-breakdown");
const form = document.getElementById("add-form");
const input = document.getElementById("task-input");
const tagSelect = document.getElementById("task-tag");
const taskList = document.getElementById("task-list");
const filters = document.getElementById("filters");

/**
 * Event listeners
 */
form.addEventListener("submit", submitForm);
taskList.addEventListener("click", checkDeleteTask);
filters.addEventListener("click", filterTasks);

/**
 * Functions
 */

// Navigate to selected page
function navigate() {
  // get url fragment
  const route = getRoute();

  // Hide all sections
  document
    .querySelectorAll(".view")
    .forEach((section) => section.classList.remove("active"));

  // Show section with selected fragment
  document.getElementById("view-" + route).classList.add("active");

  // Indicate active a element
  document.querySelectorAll("#nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === route);
  });
  render();
}

function getRoute() {
  const hash = location.hash.replace("#", "");
  return routes.includes(hash) ? hash : "tasks";
}

// Display selected page data
async function render() {
  const dbTasks = await getTasks();
  appTasks.length = 0;
  appTasks.push(...dbTasks);
  const route = getRoute();
  if (route === "tasks") renderTasks();
  if (route === "stats") renderStats();
}

// Display tasks page data
function renderTasks() {
  list.replaceChildren();
  const visibleTasks = appTasks.filter((task) => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  list.innerHTML = "";
  empty.style.display = visibleTasks.length ? "none" : "block";

  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";
    li.innerHTML = `
        <span class="check" data-id="${task.id}"></span>
        <span class="label">${escapeHtml(task.label)}</span>
        <span class="tag">${task.tag}</span>
        <button class="ghost" data-remove="${task.id}">✕</button>
      `;
    list.appendChild(li);
  });
}

// Display stats page data
function renderStats() {
  const total = appTasks.length;
  const done = appTasks.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  statTotal.textContent = total;
  statDone.textContent = done;
  statPct.textContent = pct + "%";
  breakdown.innerHTML =
    '<div class="stat-label" style="margin-bottom:.75rem;">By category</div>';
  tags.forEach((tag) => {
    const count = appTasks.filter((task) => task.tag === tag).length;
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

// Submit form
async function submitForm(event) {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const newTask = {
    id: Math.random().toString(36).slice(2, 6),
    label: text,
    tag: tagSelect.value,
    done: false,
  };
  await addTask(newTask);
  input.value = "";
  navigate();
}

// Check or delete task
async function checkDeleteTask(event) {
  const checkId = event.target.dataset.id;
  const removeId = event.target.dataset.remove;
  if (checkId) {
    await checkTask(checkId);
    navigate();
  }
  if (removeId) {
    await deleteTask(removeId);
    navigate();
  }
}

// Filter tasks view
function filterTasks(event) {
  if (event.target.tagName !== "BUTTON") return;
  currentFilter = event.target.dataset.filter;
  document
    .querySelectorAll("#filters button")
    .forEach((button) => button.classList.remove("active"));
  event.target.classList.add("active");
  navigate();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Script starting point
 */
main();

async function main() {
  console.log("Starting app...");
  // Check DB connection
  const dbconnection = await checkDbConnection();
  // If connected to DB
  if (dbconnection) {
    // If url fragment changed call navigate
    window.addEventListener("hashchange", navigate);
    document.getElementById("nav").addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        // Change url fragment
        location.hash = event.target.dataset.route;
      }
    });
    navigate();
  } else {
    document.getElementById("view-no-conn").classList.add("active");
    console.log("Cannot connect to database");
  }
}
