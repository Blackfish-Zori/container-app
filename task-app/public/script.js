// script.js
// Vanilla JS frontend logic for the Task Manager app.
// Talks to the Express/MongoDB backend via the /api/tasks REST endpoints.

(() => {
  const API_BASE = '/api/tasks';

  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const template = document.getElementById('task-item-template');
  const emptyState = document.getElementById('empty-state');
  const statusBanner = document.getElementById('status-banner');
  const taskCount = document.getElementById('task-count');
  const filterButtons = document.querySelectorAll('.filter-btn');

  let tasks = [];
  let currentFilter = 'all';

  // ---------- API helpers ----------

  async function apiRequest(url, options = {}) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const data = await res.json();
        if (data.error) message = data.error;
      } catch (_) {
        /* ignore parse errors */
      }
      throw new Error(message);
    }

    if (res.status === 204) return null;
    return res.json();
  }

  const fetchTasks = () => apiRequest(API_BASE);
  const createTask = (title) =>
    apiRequest(API_BASE, { method: 'POST', body: JSON.stringify({ title }) });
  const updateTask = (id, updates) =>
    apiRequest(`${API_BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
  const deleteTask = (id) =>
    apiRequest(`${API_BASE}/${id}`, { method: 'DELETE' });

  // ---------- UI helpers ----------

  function showError(message) {
    statusBanner.textContent = message;
    statusBanner.hidden = false;
    clearTimeout(showError._t);
    showError._t = setTimeout(() => {
      statusBanner.hidden = true;
    }, 4000);
  }

  function getVisibleTasks() {
    if (currentFilter === 'active') return tasks.filter((t) => !t.completed);
    if (currentFilter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }

  function updateCount() {
    const activeCount = tasks.filter((t) => !t.completed).length;
    taskCount.textContent = tasks.length
      ? `${activeCount} of ${tasks.length} remaining`
      : '';
  }

  function render() {
    const visible = getVisibleTasks();
    list.innerHTML = '';

    emptyState.hidden = tasks.length !== 0;
    emptyState.textContent =
      tasks.length === 0
        ? 'No tasks yet. Add one above!'
        : 'No tasks match this filter.';
    emptyState.hidden = visible.length !== 0;

    for (const task of visible) {
      const node = template.content.firstElementChild.cloneNode(true);
      node.dataset.id = task.id;
      node.classList.toggle('is-completed', task.completed);

      const checkbox = node.querySelector('.task-item__checkbox');
      checkbox.checked = task.completed;

      const title = node.querySelector('.task-item__title');
      title.textContent = task.title;

      list.appendChild(node);
    }

    updateCount();
  }

  // ---------- Event handlers ----------

  async function handleAddTask(event) {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) return;

    const submitBtn = form.querySelector('.task-form__submit');
    submitBtn.disabled = true;

    try {
      const newTask = await createTask(title);
      tasks.unshift(newTask);
      input.value = '';
      render();
    } catch (err) {
      showError(err.message);
    } finally {
      submitBtn.disabled = false;
      input.focus();
    }
  }

  async function handleListClick(event) {
    const item = event.target.closest('.task-item');
    if (!item) return;
    const id = item.dataset.id;

    if (event.target.classList.contains('task-item__delete')) {
      item.classList.add('is-updating');
      try {
        await deleteTask(id);
        tasks = tasks.filter((t) => t.id !== id);
        render();
      } catch (err) {
        item.classList.remove('is-updating');
        showError(err.message);
      }
    }
  }

  async function handleListChange(event) {
    if (!event.target.classList.contains('task-item__checkbox')) return;
    const item = event.target.closest('.task-item');
    const id = item.dataset.id;
    const completed = event.target.checked;

    item.classList.add('is-updating');
    try {
      const updated = await updateTask(id, { completed });
      tasks = tasks.map((t) => (t.id === id ? updated : t));
      render();
    } catch (err) {
      event.target.checked = !completed;
      showError(err.message);
    } finally {
      item.classList.remove('is-updating');
    }
  }

  function handleFilterClick(event) {
    const btn = event.target.closest('.filter-btn');
    if (!btn) return;
    filterButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
    currentFilter = btn.dataset.filter;
    render();
  }

  // ---------- Init ----------

  async function init() {
    form.addEventListener('submit', handleAddTask);
    list.addEventListener('click', handleListClick);
    list.addEventListener('change', handleListChange);
    document.getElementById('filters').addEventListener('click', handleFilterClick);

    try {
      tasks = await fetchTasks();
      render();
    } catch (err) {
      showError('Could not load tasks. Is the server running?');
    }
  }

  init();
})();
