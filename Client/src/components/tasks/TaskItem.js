import React from 'react';
import { Link } from 'react-router-dom';
import './TaskItem.css';

const TaskItem = ({ task }) => {
  const { _id, title, status, priority, dueDate, tags, assignedTo } = task;
  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'todo': return 'status-todo';
      case 'in-progress': return 'status-in-progress';
      case 'review': return 'status-review';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };
  
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      default: return '';
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'review': return 'Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className="task-item">
      <div className="task-status">
        <span className={`status-dot ${getStatusClass(status)}`}></span>
      </div>
      
      <div className="task-content">
        <Link to={`/task/${_id}`} className="task-title">{title}</Link>
        
        <div className="task-details">
          <div className="task-tags">
            {tags && tags.map((tag, index) => (
              <span key={index} className={`task-tag tag-${tag.toLowerCase()}`}>
                {tag}
              </span>
            ))}
          </div>
          
          <div className="task-meta">
            <span className={`task-priority ${getPriorityClass(priority)}`}>
              {priority}
            </span>
            <span className="task-due-date">
              <i className="far fa-calendar"></i> {formatDate(dueDate)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="task-actions">
        {assignedTo && (
          <div className="task-assigned">
            <div className="avatar">
              {assignedTo.avatar ? (
                <img src={assignedTo.avatar} alt={assignedTo.name} />
              ) : (
                <div className="avatar-placeholder">
                  {assignedTo.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        )}
        
        <button className="task-menu-btn">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;