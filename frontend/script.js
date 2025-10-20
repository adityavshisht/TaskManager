const apiUrl = "http://localhost:3000/api/tasks";
const usersUrl = "http://localhost:3000/api/users";

let defaultUserId = 1;
let currentFilter = "all"; // all | open | done

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.chip[data-filter]');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentFilter = btn.dataset.filter;
    fetchTasks();
  });
});

async function initDefaultUser() {
  try {
    const res = await fetch(usersUrl);
    const users = await res.json();
    if (Array.isArray(users) && users.length) {
      defaultUserId = users[0].id;
    } else {
      const created = await fetch(usersUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "demo@example.com", name: "Demo" })
      }).then(r => r.json());
      defaultUserId = created.id;
    }
  } catch (e) {
    console.error("Failed to init default user", e);
  }
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  taskInput.disabled = true;
  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, userId: defaultUserId })
    });
    taskInput.value = '';
    await fetchTasks();
  } finally {
    taskInput.disabled = false;
  }
});

async function fetchTasks() {
  taskList.replaceChildren();
  const res = await fetch(apiUrl);
  let tasks = await res.json();

  if (currentFilter === "open") tasks = tasks.filter(t => !t.isDone);
  if (currentFilter === "done") tasks = tasks.filter(t => t.isDone);

  if (!tasks.length) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.isDone) li.classList.add('done');

    const titleWrap = document.createElement('div');
    titleWrap.className = 'item-title';
    const badge = document.createElement('span');
    badge.className = `badge ${task.isDone ? 'ok' : 'mute'}`;
    badge.textContent = task.isDone ? 'done' : 'open';
    const title = document.createElement('span');
    title.textContent = task.title;
    titleWrap.appendChild(badge);
    titleWrap.appendChild(title);

    const actions = document.createElement('div');
    actions.className = 'actions';

    // ✅ MARK DONE / UNDONE
    const doneBtn = document.createElement('button');
    doneBtn.className = 'icon-btn icon-done';
    doneBtn.textContent = task.isDone ? 'Mark Undone' : 'Mark Done';
    doneBtn.onclick = async () => {
      await updateTask(task.id, { isDone: !task.isDone });
      fetchTasks();
    };

    // ✅ INLINE EDIT
    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn icon-edit';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = task.title;
      input.className = 'edit-input';
      titleWrap.replaceChild(input, title);
      input.focus();

      let alreadySaved = false; // prevent double reload

      async function save(newTitle) {
        if (alreadySaved) return;
        alreadySaved = true;
        if (newTitle && newTitle.trim() !== task.title) {
          await updateTask(task.id, { title: newTitle.trim() });
        }
        fetchTasks();
      }

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') save(input.value);
        if (e.key === 'Escape') {
          alreadySaved = true;
          fetchTasks();
        }
      });

      input.addEventListener('blur', () => save(input.value));
    };

    // ✅ DELETE
    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn icon-del';
    delBtn.textContent = 'Delete';
    delBtn.onclick = async () => {
      await deleteTask(task.id);
      fetchTasks();
    };

    actions.appendChild(doneBtn);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(titleWrap);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

async function updateTask(id, data) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

async function deleteTask(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
}

(async function start() {
  await initDefaultUser();
  fetchTasks();
})();
