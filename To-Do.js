const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display toast message
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}

// Update localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update stats
function updateStatistics() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  document.getElementById("total-tasks").textContent = total;
  document.getElementById("completed-tasks").textContent = completed;
  document.getElementById("progress").style.width = `${progress}%`;
}

// Render all tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item";
    item.dataset.id = task.id;

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.className = "task-date";
    dateInput.value = task.dueDate || "";
    dateInput.onchange = () => {
      task.dueDate = dateInput.value;
      saveTasks();
    };

    const text = document.createElement("span");
    text.className = `task-text${task.completed ? " completed" : ""}`;
    text.textContent = task.text;

    const badge = document.createElement("div");
    badge.className = `priority-badge ${task.priority}-priority`;
    badge.onclick = () => {
      const order = ["low", "medium", "high"];
      task.priority = order[(order.indexOf(task.priority) + 1) % 3];
      saveTasks();
      renderTasks();
    };

    const edit = document.createElement("button");
    edit.className = "edit-btn";
    edit.textContent = "Edit";
    edit.onclick = () => {
      const newText = prompt("Edit task:", task.text);
      if (newText?.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    };

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "Delete";
    del.onclick = () => {
      if (confirm("Delete this task?")) {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
        showToast("Task deleted");
      }
    };

    const complete = document.createElement("button");
    complete.className = "complete-btn";
    complete.textContent = task.completed ? "Undo" : "Complete";
    complete.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    item.append(dateInput, text, badge, edit, del, complete);
    taskList.appendChild(item);
  });
  updateStatistics();
}

// Add task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return showToast("Please enter a task.");
  tasks.push({
    id: Date.now(),
    text,
    completed: false,
    dueDate: "",
    priority: "medium"
  });
  taskInput.value = "";
  saveTasks();
  renderTasks();
  showToast("Task added");
}

addBtn.addEventListener("click", addTask);
window.addEventListener("DOMContentLoaded", renderTasks);
