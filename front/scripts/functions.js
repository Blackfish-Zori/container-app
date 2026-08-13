import { dummyTaskData } from "./constants.js";

export function getTasks() {
  return dummyTaskData;
}

export function addTask(newTask) {
  dummyTaskData.push(newTask);
}

export function checkTask(taskId) {
  const targetTask = dummyTaskData.find((task) => task.id == taskId);
  if (targetTask) targetTask.done = !targetTask.done;
}

export function deleteTask(taskId) {
  const targetTask = dummyTaskData.find((task) => task.id == taskId);
  if (targetTask) {
    const taskIndex = dummyTaskData.indexOf(targetTask);
    if (taskIndex !== -1) dummyTaskData.splice(taskIndex, 1);
  }
}
