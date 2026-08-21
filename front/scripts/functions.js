import { dummyTaskData } from "./constants.js";

export async function checkDbConnection() {
  try {
    const response = await fetch("http://localhost:3000/checkdbconnection");
    const data = await response.json();
    if (data.status !== "ok") {
      return false;
    }
    return true;
  } catch (err) {
    console.error("DB connection check failed", err);
  }
}

export async function getTasks() {
  try {
    const response = await fetch("http://localhost:3000/getalltasks");
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
}

export async function addTask(newTask) {
  try {
    fetch("http://localhost:3000/addtask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
  } catch (error) {
    console.log(error);
  }
}

export async function checkTask(taskId) {
  try {
    fetch("http://localhost:3000/checktask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId }),
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTask(taskId) {
  try {
    fetch("http://localhost:3000/deletetask", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId }),
    });
  } catch (error) {
    console.log(error);
  }
}
