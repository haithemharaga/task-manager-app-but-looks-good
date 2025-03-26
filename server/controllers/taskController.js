const Task = require('../models/Task');

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, tag, search } = req.query;
    
    // Base query - tasks created by or assigned to the current user
    let query = {
      $or: [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    };
    
    // Apply filters if provided
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tag) query.tags = tag;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar')
      .populate('comments.user', 'name avatar');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user has access to this task
    if (task.createdBy._id.toString() !== req.user.id && 
        (task.assignedTo && task.assignedTo._id.toString() !== req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }
    
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      assignedTo,
      subtasks
    } = req.body;
    
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      assignedTo,
      subtasks,
      createdBy: req.user.id
    });
    
    const task = await newTask.save();
    
    // Populate user data before returning
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar');
    
    res.status(201).json(populatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      assignedTo,
      subtasks
    } = req.body;
    
    // Find the task first
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is authorized to update this task
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    
    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        priority,
        dueDate,
        tags,
        assignedTo,
        subtasks
      },
      { new: true }
    )
    .populate('assignedTo', 'name avatar')
    .populate('createdBy', 'name avatar');
    
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is authorized to delete this task
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }
    
    await task.remove();
    
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment to a task
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const comment = {
      text,
      user: req.user.id
    };
    
    task.comments.unshift(comment);
    await task.save();
    
    // Populate the new comment
    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name avatar')
      .populate('comments.user', 'name avatar');
    
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};