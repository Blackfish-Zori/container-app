const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const dummyTaskData = require("./data/data.js");

const PORT = 3000;
const MONGODB_URI =
  "mongodb+srv://zorislavsic_db_user:Alfaromeo147ts@container-app.b6xxc7r.mongodb.net/?appName=container-app&authSource=admin";
const DB_NAME = "container-app-db";
const COLLECTION_NAME = "tasks";

let db;
let collection;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).send("Backend API is running");
});

app.get("/checkdbconnection", async function (req, res) {
  if (!db) {
    return res.status(503).json({ status: "error", db: "not_connected" });
  }

  try {
    await db.command({ ping: 1 });
    res.status(200).json({ status: "ok", db: "connected" });
  } catch (err) {
    res
      .status(503)
      .json({ status: "error", db: "unreachable", message: err.message });
  }
});

app.get("/getalltasks", async function (req, res) {
  try {
    const readTasks = await collection.find({}).toArray();
    res.status(200).send(readTasks);
  } catch (error) {
    res.status(400).json({ success: false, message: err.message });
    console.log(error);
  }
});

app.post("/addtask", async function (req, res) {
  try {
    const { id, label, tag, done = false } = req.body;

    const newTask = {
      id,
      label,
      tag,
      done,
    };

    await collection.insertOne(newTask);
    res.status(201);
  } catch (error) {
    res.status(400).json({ success: false, message: err.message });
    console.log(error);
  }
});

app.post("/checktask", async function (req, res) {
  try {
    const { taskId } = req.body;
    await collection.findOneAndUpdate({ id: Number(taskId) }, [
      { $set: { done: { $not: "$done" } } },
    ]);
    res.status(201);
  } catch (error) {
    res.status(400).json({ success: false, message: err.message });
    console.log(error);
  }
});

app.post("/deletetask", async function (req, res) {
  try {
    const { taskId } = req.body;

    await collection.deleteOne({ id: taskId });
    res.status(201);
  } catch (error) {
    res.status(400).json({ success: false, message: err.message });
    console.log(error);
  }
});

// ---------- Start server after DB connects ----------

async function start() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection(COLLECTION_NAME);
    console.log(`MongoDB connected: ${MONGODB_URI}/${DB_NAME}`);

    app.listen(PORT, () =>
      console.log(`container-app backend live on http://localhost: ${PORT}`),
    );

    process.on("SIGINT", async () => {
      await client.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
}

start();
