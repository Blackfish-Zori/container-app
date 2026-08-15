import { dummyTaskData } from "./constants.js";

export async function getTasks() {
  try {
    const response = await fetch("http://localhost:3000/getalltasks");
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    alert(error);
  }
}

export function addTask(newTask) {
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
    alert(error);
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
    alert(error);
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
    alert(error);
  }
}
