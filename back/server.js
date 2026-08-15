const express = require("express");
const cors = require("cors");
const dummyTaskData = require("./data/data.js");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).send("Backend API is running");
});

app.get("/getalltasks", function (req, res) {
  res.status(200).send(dummyTaskData);
});

app.post("/addtask", function (req, res) {
  const newTask = req.body;
  dummyTaskData.push(newTask);
  res.sendStatus(200);
});

app.post("/checktask", function (req, res) {
  const { taskId } = req.body;
  const targetTask = dummyTaskData.find((task) => task.id == taskId);
  if (targetTask) {
    targetTask.done = !targetTask.done;
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.post("/deletetask", function (req, res) {
  const { taskId } = req.body;
  const targetTask = dummyTaskData.find((task) => task.id == taskId);
  if (targetTask) {
    const taskIndex = dummyTaskData.indexOf(targetTask);
    if (taskIndex !== -1) {
      dummyTaskData.splice(taskIndex, 1);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
