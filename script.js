const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const filterSelect = document.getElementById('filter-select');
const taskList = document.getElementById('task-list');

taskForm.addEventListener('submit', addTask);
taskList.addEventListener('change', handleTaskStatusChange);
filterSelect.addEventListener('change', filterTasks);

// Retrieve tasks from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach((task) => {
    createTaskElement(task.text, task.priority, task.completed);
  });
});

function addTask(e) {
  e.preventDefault();
  const task = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (task !== '') {
    createTaskElement(task, priority, false);
    taskInput.value = '';
  }
}

function createTaskElement(task, priority, completed) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = task;

  if (completed) {
    li.classList.add('completed-task');
  }

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', deleteTask);

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', editTask);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.addEventListener('change', handleTaskStatusChange);

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editButton);
  li.appendChild(deleteButton);
  taskList.appendChild(li);

  saveTasks();
}

function deleteTask(e) {
  const li = e.target.parentNode;
  taskList.removeChild(li);
  saveTasks();
}

function editTask(e) {
  const li = e.target.parentNode;
  const span = li.querySelector('span');
  const taskText = span.textContent;

  const editedTask = prompt('Edit Task:', taskText);

  if (editedTask !== null && editedTask.trim() !== '') {
    span.textContent = editedTask;
    saveTasks();
  }
}

function handleTaskStatusChange(e) {
  const checkbox = e.target;
  const li = checkbox.parentNode;
  const span = li.querySelector('span');

  if (checkbox.checked) {
    li.classList.add('completed-task');
  } else {
    li.classList.remove('completed-task');
  }

  saveTasks();
}

function filterTasks() {
  const selectedFilter = filterSelect.value;
  const taskItems = taskList.querySelectorAll('li');

  taskItems.forEach((item) => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const isCompleted = checkbox.checked;

    switch (selectedFilter) {
      case 'all':
        item.style.display = 'flex';
        break;
      case 'completed':
        item.style.display = isCompleted ? 'flex' : 'none';
        break;
      case 'incomplete':
        item.style.display = isCompleted ? 'none' : 'flex';
        break;
    }
  });
}

function saveTasks() {
  const taskItems = Array.from(taskList.querySelectorAll('li'));

  const tasks = taskItems.map((item) => {
    const span = item.querySelector('span');
    const checkbox = item.querySelector('input[type="checkbox"]');
    return {
      text: span.textContent,
      priority: item.dataset.priority,
      completed: checkbox.checked,
    };
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}