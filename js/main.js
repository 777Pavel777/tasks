const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const btnAdd = document.querySelector('#btnAdd');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(task => renderTask(task));
}

toggleButtonState();
checkEmptyList();

form.addEventListener('submit', addTask);
taskInput.addEventListener('input', toggleButtonState);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  renderTask(newTask);

  taskInput.value = '';
  taskInput.focus();

  checkEmptyList();
  saveToLocalStorage();
  toggleButtonState();
}

function deleteTask(e) {
  if (e.target.dataset.action !== 'delete') return;

  const parenNode = e.target.closest('.list-group-item');
  const id = Number(parenNode.id);

  tasks = tasks.filter(task => task.id !== id);

  parenNode.remove();

  saveToLocalStorage();

  checkEmptyList();
}

function doneTask(e) {
  if (e.target.dataset.action !== 'done') return;
  const parenNode = e.target.closest('.list-group-item');
  const id = Number(parenNode.id);

  const task = tasks.find(task => task.id === id);
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parenNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
          <li id="emptyList" class="list-group-item empty-list">
          <img src="./image/writing-reports-128.png" alt="img" width="32" heigth="32" />
            <div class="empty-list-title">The to-do list is empty</div>
          </li>`;

    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyList = document.querySelector('#emptyList');
    emptyList ? emptyList.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

  const taskHTML = `
         <li id= "${task.id}" class="list-group-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item-buttons">
              <button type="button" data-action="done" class="btn-action">
                <img src="./image/done.png" alt="Done" width="18" height="18" />
              </button>
              <button type="button" data-action="delete" class="btn-action">
                <img
                  src="./image/delete.png"
                  alt="Delete"
                  width="18"
                  height="18"
                />
              </button>
            </div>
          </li>`;

  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

function toggleButtonState() {
  const taskValue = taskInput.value.trim();
  const btnDisabled = (btnAdd.disabled = taskValue === '');

  btnDisabled
    ? btnAdd.classList.remove('btn-enabled')
    : btnAdd.classList.add('btn-enabled');
}
