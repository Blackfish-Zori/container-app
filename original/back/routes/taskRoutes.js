const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /getAllTasks - returns every task in the collection
router.get('/getAllTasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /checkTask - marks a task as checked (completed) by id
// body: { "id": "<taskId>", "checked": true }  (checked is optional, defaults to true)
router.post('/checkTask', async (req, res) => {
  try {
    const { id, checked } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Task id is required' });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { checked: checked === undefined ? true : checked },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /deleteTask - deletes a task by id
// body: { "id": "<taskId>" }
router.delete('/deleteTask', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Task id is required' });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted', data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /createTask - bonus endpoint to make it easy to add tasks for testing
// body: { "title": "...", "description": "..." }
router.post('/createTask', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const task = await Task.create({ title, description });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
