import { dummyTaskData } from "./constants.js";

export async function checkDbConnection() {
  try {
    const response = await fetch("http://localhost:3000/checkdbconnection");
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
    const response = await fetch("http://localhost:3000/getalltasks");
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function addTask(newTask) {
  try {
    const response = await fetch("http://localhost:3000/addtask", {
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
    const response = await fetch("http://localhost:3000/edittask", {
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
    const response = await fetch("http://localhost:3000/checktask", {
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
    const response = await fetch("http://localhost:3000/deletetask", {
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
