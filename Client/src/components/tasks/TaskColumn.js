import React from 'react';
import TaskCard from './TaskCard';
import './TaskColumn.css';

const TaskColumn = ({ title, tasks, status, icon, color }) => {
  return (
    <div className="task-column">
      <div className="column-header" style={{ borderBottomColor: color }}>
        <div className="column-icon">
          <i className={`fas fa-${icon}`} style={{ color }}></i>
        </div>
        <h3 className="column-title">{title}</h3>
        <div className="column-count">{tasks.length}</div>
      </div>
      
      <div className="column-content">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard key={task._id} task={task} />
          ))
        ) : (
          <div className="empty-column">
            <p>No tasks</p>
            <div className="empty-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <p className="empty-text">Drag tasks here or add a new task</p>
          </div>
        )}
      </div>
      
      <div className="column-footer">
        <button className="btn btn-text btn-sm">
          <i className="fas fa-plus"></i>
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
};

export default TaskColumn;