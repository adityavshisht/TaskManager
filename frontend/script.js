const apiUrl = "http://localhost:3000/tasks"; // change to your backend URL if needed

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Fetch and display tasks
async function fetchTasks() {
    taskList.innerHTML = '';
    const res = await fetch(apiUrl);
    const tasks = await res.json();
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.title} ${task.done ? "(Done)" : ""}`;

        // Update button
        const updateBtn = document.createElement('button');
        updateBtn.textContent = task.done ? "Undo" : "Mark Done";
        updateBtn.onclick = () => updateTask(task.id, !task.done);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTask(task.id);

        li.appendChild(updateBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Add a new task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, done: false })
    });

    taskInput.value = '';
    fetchTasks();
});

// Update task
async function updateTask(id, done) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done })
    });
    fetchTasks();
}

// Delete task
async function deleteTask(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fetchTasks();
}

// Load tasks on page load
fetchTasks();
