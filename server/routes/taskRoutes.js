const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Get all tasks for the current user
router.get('/', auth, taskController.getTasks);

// Get a specific task
router.get('/:id', auth, taskController.getTaskById);

// Create a new task
router.post('/', auth, taskController.createTask);

// Update a task
router.put('/:id', auth, taskController.updateTask);

// Delete a task
router.delete('/:id', auth, taskController.deleteTask);

// Add a comment to a task
router.post('/:id/comments', auth, taskController.addComment);

module.exports = router;