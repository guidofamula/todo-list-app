const todos = []; // variabel array kosong sebagai default
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

// Custom event ini untuk patokan dasar jika terdapat perubahan data pada variabel todos diatas
const RENDER_EVENT = 'render-todo';
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById('todos');
  uncompletedTODOList.innerHTML = '';

  const completedTODOList = document.getElementById('completed-todos');
  completedTODOList.innerHTML = '';

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTODOList.append(todoElement);
    }
  }
});

// Menetralisir proses load javascript, agar meminimalisir error pada flow
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo();
  });
	if (isStorageExist()) {
		loadDataFromStorage();
	}
});

// Membuat fungsi generateId untuk membuat object nomor id atau urut
const generateId = () => {
  return +new Date();
};

// Membuat fungsi generateTodoObject untuk menampung argumen id, task, timestamp, isComplete.
const generateTodoObject = (id, task, timestamp, isCompleted) => {
  return {
    // dibawah ini key yg di inisialisasi sebagai object baru sesuai yg di inputkan user
    id,
    task,
    timestamp,
    isCompleted,
  };
};

// Membuat function addTodo()
const addTodo = () => {
  const textTodo = document.getElementById('title').value;
  const timestamp = document.getElementById('date').value;

  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
  todos.push(todoObject); // variabel array ini sudah di inisiasi baris teratas

  document.dispatchEvent(new Event(RENDER_EVENT)); // Variabel sudah di inisiasi pada baris paling atas
	saveData();
};

// Membuat fungsi findTodo
const findTodo = (todoId) => {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
};

// Membuat fungsi findTodoIndex
const findTodoIndex = (todoId) => {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }

  return -1;
};

// Membuat fungsi addTaskToCompleted
const addTaskToCompleted = (todoId) => {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
};

// Membuat fungsi removeTaskFromCompleted
const removeTaskFromCompleted = (todoId) => {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
};

// Membuat fungsi undoTaskFromCompleted
const undoTaskFromCompleted = (todoId) => {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
	saveData();
};

// Membuat function makeTodo untuk mengekstrak title, timestamp dan check button agar tampil ke website
const makeTodo = (todoObject) => {
  const textTitle = document.createElement('h2');
  textTitle.innerText = todoObject.task;

  const textTimeStamp = document.createElement('p');
  textTimeStamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textTimeStamp);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', 'todo-${todoObject.id}');

  // Menambahkan percabangan jika todo selesai atau completed
  if (todoObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');

    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');

    checkButton.addEventListener('click', function () {
      addTaskToCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  return container;
};

// Membuat fungsi saveData
function saveData() {
	if (isStorageExist()) {
		const parsed = JSON.stringify(todos);
		localStorage.setItem(STORAGE_KEY, parsed);
		document.dispatchEvent(new Event(SAVED_EVENT));
	}
}

// Membuat fungsi untuk mengecheck apakah browser support pada local storage
function isStorageExist() {
	if (typeof (Storage) === undefined) {
		alert('Browser kamu tidak mendukung local storage');
		return false;
	}
	return true;
}

// Membuat event listener untuk menampilkan hasil local storage ke dalam console.log 
document.addEventListener(SAVED_EVENT, function() {
	console.log(localStorage.getItem(STORAGE_KEY));
	alert('Berhasil menambahkan task!');
});

// Membuat fungsi untuk mengambil data local storage agar ditampilkan ke dalam website walau dalam keadaan refresh
function loadDataFromStorage() {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const todo of data) {
			todos.push(todo);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}
