import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import './TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTask, task, loading, updateTask, deleteTask, addComment } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  
  const [commentText, setCommentText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  
  useEffect(() => {
    getTask(id);
  }, [id, getTask]);
  
  useEffect(() => {
    if (task) {
      setEditFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags || []
      });
    }
  }, [task]);
  
  if (loading || !task) {
    return (
      <div className="task-details-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      await addComment(id, commentText);
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };
  
  const handleDeleteTask = async () => {
    try {
      await deleteTask(id);
      navigate('/board');
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };
  
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!editFormData.tags.includes(tagInput.trim())) {
        setEditFormData({
          ...editFormData,
          tags: [...editFormData.tags, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setEditFormData({
      ...editFormData,
      tags: editFormData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      await updateTask(id, editFormData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setSubmitLoading(false);
    }
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
    <div className="task-details-container">
      <div className="task-details-header">
        <Link to="/board" className="back-link">
          <i className="fas fa-arrow-left"></i> Back to Board
        </Link>
        <div className="task-actions">
          <button 
            className="btn btn-text" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="fas fa-edit"></i> Edit
          </button>
          <button 
            className="btn btn-text delete-btn" 
            onClick={() => setShowDeleteModal(true)}
          >
            <i className="fas fa-trash-alt"></i> Delete
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <div className="task-edit-form">
          <form onSubmit={handleUpdateSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Task Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={editFormData.title}
                onChange={handleEditChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={editFormData.status}
                  onChange={handleEditChange}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="priority" className="form-label">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  className="form-select"
                  value={editFormData.priority}
                  onChange={handleEditChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="form-input"
                value={editFormData.dueDate}
                onChange={handleEditChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={editFormData.description}
                onChange={handleEditChange}
                rows="6"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="tags" className="form-label">Tags</label>
              <div className="tags-input-container">
                <input
                  type="text"
                  id="tags"
                  className="form-input"
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                />
                
                <div className="tags-container">
                  {editFormData.tags.map((tag, index) => (
                    <div key={index} className={`task-tag tag-${tag.toLowerCase()}`}>
                      {tag}
                      <span className="tag-remove" onClick={() => removeTag(tag)}>
                        <i className="fas fa-times"></i>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-dark"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn"
                disabled={submitLoading}
              >
                {submitLoading ? <i className="fas fa-spinner fa-spin"></i> : ''}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="task-details-content">
          <div className="task-details-main">
            <div className="task-details-card">
              <div className="task-details-header-info">
                <div className="task-status">
                  <span className={`status-badge ${getStatusClass(task.status)}`}>
                    {getStatusText(task.status)}
                  </span>
                  <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <h2 className="task-title">{task.title}</h2>
              </div>
              
              <div className="task-meta">
                <div className="task-meta-item">
                  <i className="far fa-calendar-alt"></i>
                  <span>Created: {formatDate(task.createdAt)}</span>
                </div>
                {task.dueDate && (
                  <div className="task-meta-item">
                    <i className="fas fa-clock"></i>
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>
                )}
                {task.assignedTo && (
                  <div className="task-meta-item">
                    <i className="fas fa-user-check"></i>
                    <span>Assignee: {task.assignedTo.name}</span>
                  </div>
                )}
              </div>
              
              {task.tags && task.tags.length > 0 && (
                <div className="task-tags-list">
                  {task.tags.map((tag, index) => (
                    <span key={index} className={`task-tag tag-${tag.toLowerCase()}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="task-description">
                <h3>Description</h3>
                <p>{task.description || 'No description provided.'}</p>
              </div>
            </div>
            
            <div className="task-comments-section">
              <h3>Comments ({task.comments ? task.comments.length : 0})</h3>
              
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <div className="comment-input-container">
                  <div className="comment-avatar">
                    {user && user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user ? user.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <div className="comment-input-wrapper">
                    <textarea
                      className="comment-input"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                    ></textarea>
                    <button type="submit" className="btn comment-submit">
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="comments-list">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment, index) => (
                    <div key={index} className="comment-item">
                      <div className="comment-avatar">
                        {comment.user.avatar ? (
                          <img src={comment.user.avatar} alt={comment.user.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {comment.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">{comment.user.name}</span>
                          <span className="comment-time">{formatDateTime(comment.createdAt)}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-comments">
                    <i className="far fa-comments"></i>
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Delete Task</h3>
              <button className="modal-close-btn" onClick={() => setShowDeleteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete this task? This action cannot be undone.</p>
              <div className="task-to-delete">
                <i className="fas fa-exclamation-triangle"></i>
                <span>{task.title}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-dark" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn delete-btn" 
                onClick={handleDeleteTask}
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;