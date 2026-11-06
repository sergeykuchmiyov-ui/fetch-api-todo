const API_URL = "https://6aeccbd0fc3b911e6fd595c5.mockapi.io/tasks";

async function getTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Помилка завантаження задач");
        }

        const tasks = await response.json();

        console.log(tasks);

    } catch (error) {
        console.error(error);
    }
}