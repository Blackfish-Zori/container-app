// server.js
// Single-file Node.js / Express backend for the Task Manager app.
// Uses the official MongoDB driver directly (no Mongoose).
//
// Setup:
//   npm install
//   Set MONGODB_URI (and optionally PORT) in a .env file or your environment.
//   npm start
//
// Env vars:
//   MONGODB_URI  - MongoDB connection string (default: mongodb://127.0.0.1:27017)
//   DB_NAME      - Database name (default: taskapp)
//   PORT         - Server port (default: 3000)

require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'taskapp';
const PORT = process.env.PORT || 3000;
const COLLECTION = 'tasks';

let db;

async function start() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`Connected to MongoDB at ${MONGODB_URI}, database "${DB_NAME}"`);

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Serve the static frontend (index.html, style.css, script.js) from /public
  app.use(express.static(path.join(__dirname, 'public')));

  const tasksCollection = () => db.collection(COLLECTION);

  // Helper to turn a Mongo document into a clean JSON task object
  function toTaskJSON(doc) {
    return {
      id: doc._id.toString(),
      title: doc.title,
      completed: !!doc.completed,
      createdAt: doc.createdAt,
    };
  }

  // ---------- API routes ----------

  // GET /api/tasks -> list all tasks, newest first
  app.get('/api/tasks', async (req, res) => {
    try {
      const docs = await tasksCollection()
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.json(docs.map(toTaskJSON));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  // POST /api/tasks -> create a new task { title }
  app.post('/api/tasks', async (req, res) => {
    try {
      const title = (req.body.title || '').trim();
      if (!title) {
        return res.status(400).json({ error: 'Task title is required' });
      }

      const newTask = {
        title,
        completed: false,
        createdAt: new Date(),
      };

      const result = await tasksCollection().insertOne(newTask);
      newTask._id = result.insertedId;

      res.status(201).json(toTaskJSON(newTask));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // PATCH /api/tasks/:id -> update a task (e.g. toggle completed, edit title)
  app.patch('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid task id' });
      }

      const update = {};
      if (typeof req.body.completed === 'boolean') {
        update.completed = req.body.completed;
      }
      if (typeof req.body.title === 'string' && req.body.title.trim()) {
        update.title = req.body.title.trim();
      }

      if (Object.keys(update).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      const result = await tasksCollection().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(toTaskJSON(result));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // DELETE /api/tasks/:id -> remove a task
  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid task id' });
      }

      const result = await tasksCollection().deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Task app server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
