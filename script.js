document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const taskList = document.getElementById('taskList');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        addTaskToList(task.text, task.completed);
    });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === '') return;

    addTaskToList(taskText);

    input.value = '';

    saveTaskToLocalStorage(taskText);
}

function addTaskToList(text, completed = false) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.className = 'flex items-center mb-6 p-6 border border-gray-300 rounded-lg';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.className = 'form-checkbox h-5 w-5 text-blue-600';
    checkbox.addEventListener('change', () => toggleTask(checkbox, text));

    const span = document.createElement('span');
    span.textContent = text;
    span.className = 'ml-5 flex-grow text-lg overflow-hidden';

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Eliminar';
    removeBtn.className = 'bg-red-500 hover:bg-red-700 text-white font-bold px-1 py-1 rounded ml-2';
    removeBtn.addEventListener('click', () => removeTask(li, text));

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'bg-yellow-500 hover:bg-yellow-700 text-white font-bold px-1 py-1 rounded ml-2';
    editBtn.addEventListener('click', () => editTask(span, li, text));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);
    taskList.appendChild(li);
}

function editTask(span, li, oldText) {
    if (li.querySelector('input[type="text"]')) return;

    const currentText = span.textContent;
    span.innerHTML = '';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'border rounded px-2 py-1 mr-1 flex-grow';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Guardar';
    saveBtn.className = 'bg-green-500 hover:bg-green-700 text-white font-bold px-1 py-1 rounded mr-2';
    saveBtn.addEventListener('click', () => saveTask(input, span, li, oldText));

    span.appendChild(input);
    span.appendChild(saveBtn);

    // Ocultar botones de editar y eliminar
    li.querySelector('.bg-yellow-500').style.display = 'none';
    li.querySelector('.bg-red-500').style.display = 'none';
}

function saveTask(input, span, li, oldText) {
    const newText = input.value.trim();
    if (newText === '') return;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.text === oldText) {
            task.text = newText;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    span.textContent = newText;

    // Restaurar botones de editar y eliminar
    li.querySelector('.bg-yellow-500').style.display = 'inline';
    li.querySelector('.bg-red-500').style.display = 'inline';
}

function saveTaskToLocalStorage(text) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTask(checkbox, text) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.text === text);
    task.completed = checkbox.checked;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(li, text) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.text !== text);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    li.remove();
}
