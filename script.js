const API_URL = "https://6aeccbd0fc3b911e6fd595c5.mockapi.io/tasks";

const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const taskCounter = document.getElementById("taskCounter");

function showLoading(value) {
    loading.hidden = !value;
}

function showError(message = "") {
    errorMessage.textContent = message;
    errorMessage.hidden = message === "";
}

async function getTasks() {
    showLoading(true);
    showError("");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Помилка завантаження задач");
        }

        const tasks = await response.json();

        renderTasks(tasks);

    } catch (error) {
        console.error(error);
        showError("Не вдалося завантажити задачі!");
    } finally {
        showLoading(false);
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            updateTask(task.id, checkbox.checked);
        });

        const taskName = document.createElement("span");
        taskName.textContent = task.name;

        if (task.completed) {
            taskName.style.textDecoration = "line-through";
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Видалити";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(taskName);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    const completedCount = tasks.filter(task => task.completed).length;
    const activeCount = tasks.length - completedCount;

    taskCounter.textContent =
        `Усього: ${tasks.length} | Активні: ${activeCount} | Виконані: ${completedCount}`;
}

async function addTask() {
    const taskName = taskInput.value.trim();

    if (taskName === "") {
        showError("Введіть назву задачі!");
        return;
    }

    addButton.disabled = true;
    showError("");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: taskName,
                completed: false
            })
        });

        if (!response.ok) {
            throw new Error("Помилка додавання задачі");
        }

        taskInput.value = "";

        await getTasks();

    } catch (error) {
        console.error(error);
        showError("Не вдалося додати задачу!");
    } finally {
        addButton.disabled = false;
    }
}

async function deleteTask(id) {
    showError("");

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Помилка видалення задачі");
        }

        await getTasks();

    } catch (error) {
        console.error(error);
        showError("Не вдалося видалити задачу!");
    }
}

async function updateTask(id, completed) {
    showError("");
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: completed
            })
        });

        if (!response.ok) {
            throw new Error("Помилка оновлення задачі");
        }

        await getTasks();

    } catch (error) {
        console.error(error);
        showError("Не вдалося оновити задачу!");
    }
}

addButton.addEventListener("click", addTask);

getTasks();