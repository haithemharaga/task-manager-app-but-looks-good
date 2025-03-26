import React from 'react';
import { Link } from 'react-router-dom';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  const { _id, title, description, priority, dueDate, tags, assignedTo } = task;
  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getTagClass = (tag) => {
    const tagMap = {
      'work': 'tag-work',
      'personal': 'tag-personal',
      'urgent': 'tag-urgent',
      'feature': 'tag-feature',
      'bug': 'tag-bug'
    };
    
    return tagMap[tag.toLowerCase()] || 'tag-default';
  };
  
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      default: return '';
    }
  };

  return (
    <div className="task-card" draggable="true">
      <div className="task-card-header">
        <span className={`task-priority ${getPriorityClass(priority)}`}>
          {priority}
        </span>
        {dueDate && (
          <span className="task-due-date">
            <i className="far fa-calendar"></i> {formatDate(dueDate)}
          </span>
        )}
        <button className="task-menu-btn">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>
      
      <Link to={`/task/${_id}`} className="task-card-title">
        {title}
      </Link>
      
      {description && (
        <div className="task-card-description">
          {description.length > 100 
            ? `${description.substring(0, 100)}...` 
            : description}
        </div>
      )}
      
      {tags && tags.length > 0 && (
        <div className="task-card-tags">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className={`task-tag ${getTagClass(tag)}`}>
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="task-tag-more">+{tags.length - 3}</span>
          )}
        </div>
      )}
      
      <div className="task-card-footer">
        {assignedTo && (
          <div className="task-assigned">
            <div className="avatar" title={assignedTo.name}>
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
        
        <div className="task-actions">
          <button className="task-action-btn" title="Add comment">
            <i className="far fa-comment"></i>
          </button>
          <button className="task-action-btn" title="Add attachment">
            <i className="fas fa-paperclip"></i>
          </button>
          <button className="task-action-btn" title="Add subtask">
            <i className="fas fa-tasks"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;