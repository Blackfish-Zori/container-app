import { dummyTaskData } from "./constants.js";

const BACKEND_URL = "http://192.168.49.2:30002";

export async function checkDbConnection() {
  try {
    const response = await fetch(`${BACKEND_URL}/checkdbconnection`);
    const responseData = await response.json();
    if (!responseData.success) {
      return false;
    }
    return true;
  } catch (err) {
    console.error("DB connection check failed", err);
  }
}

export async function getTasks() {
  try {
    const response = await fetch(`${BACKEND_URL}/getalltasks`);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function addTask(newTask) {
  try {
    const response = await fetch(`${BACKEND_URL}/addtask`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function editTask(updatedTask) {
  try {
    const response = await fetch(`${BACKEND_URL}/edittask`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function checkTask(taskId) {
  try {
    const response = await fetch(`${BACKEND_URL}/checktask`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId }),
    });
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTask(taskId) {
  try {
    const response = await fetch(`${BACKEND_URL}/deletetask`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId }),
    });
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
