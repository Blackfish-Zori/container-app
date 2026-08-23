const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const dummyTaskData = require("./data/data.js");

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

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
    return res.status(503).json({ success: false, db: "not_connected" });
  }

  try {
    await db.command({ ping: 1 });
    res.status(200).json({ success: true, db: "connected" });
  } catch (error) {
    res
      .status(503)
      .json({ success: false, db: "unreachable", message: error.message });
  }
});

app.get("/getalltasks", async function (req, res) {
  try {
    const readTasks = await collection.find({}).toArray();
    res.status(200).send(readTasks);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error);
  }
});

app.post("/checktask", async function (req, res) {
  try {
    const { taskId } = req.body;
    await collection.findOneAndUpdate({ id: taskId }, [
      { $set: { done: { $not: "$done" } } },
    ]);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error);
  }
});

app.post("/deletetask", async function (req, res) {
  try {
    const { taskId } = req.body;
    await collection.deleteOne({ id: taskId });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(204).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
