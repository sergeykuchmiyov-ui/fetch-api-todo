const API_URL = "https://6aeccbd0fc3b911e6fd595c5.mockapi.io/tasks";

async function getTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Помилка завантаження задач");
        }

        const tasks = await response.json();

        renderTasks(tasks);

    } catch (error) {
        console.error(error);
    }
}
function renderTasks(tasks) {
    const taskList = document.getElementById("taskList");

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
}
async function addTask() {
    const taskInput = document.getElementById("taskInput");

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Введіть назву задачі!");
        return;
    }

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

        getTasks();

    } catch (error) {
        console.error(error);
        alert("Не вдалося додати задачу!");
    }
}
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Помилка видалення задачі");
        }

        getTasks();

    } catch (error) {
        console.error(error);
        alert("Не вдалося видалити задачу!");
    }
}
async function updateTask(id, completed) {
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

        getTasks();

    } catch (error) {
        console.error(error);
        alert("Не вдалося оновити задачу!");
    }
}

getTasks();

const addButton = document.getElementById("addTask");

addButton.addEventListener("click", addTask);