const form = document.querySelector('#form');
const textInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const btnAdd = document.querySelector('#btnAdd');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(task => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
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

  // зберігаємо список задач в сховище браузера LocalStorege
  saveToLocalStorage();

  renderTask(newTask);

  taskInput.value = '';
  taskInput.focus();
  checkEmptyList();
}

function deleteTask(e) {
  if (e.target.dataset.action !== 'delete') return;

  const parenNode = e.target.closest('.list-group-item');

  const id = Number(parenNode.id);

  // const index = tasks.findIndex(task => task.id === id); знаходимо індекс задач в масиві

  // tasks.splice(index, 1); видаляємо задачу з масиву із задачами

  tasks = tasks.filter(task => task.id !== id);

  saveToLocalStorage();

  parenNode.remove();

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
       <div class="empty-list-title">Список дел пуст</div>
    </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

  const taskHTML = `
        <li id="${task.id}" class="list-group-item">
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
