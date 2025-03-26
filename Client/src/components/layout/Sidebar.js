import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { TaskContext } from '../../context/TaskContext';
import './Sidebar.css';

const Sidebar = () => {
  const { tasks } = useContext(TaskContext);
  
  // Task counts by status
  const todoCount = tasks.filter(task => task.status === 'todo').length;
  const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
  const reviewCount = tasks.filter(task => task.status === 'review').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Main Menu</h3>
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/" className="sidebar-link" end>
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/board" className="sidebar-link">
                <i className="fas fa-columns"></i>
                <span>Board View</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/calendar" className="sidebar-link">
                <i className="fas fa-calendar"></i>
                <span>Calendar</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/statistics" className="sidebar-link">
                <i className="fas fa-chart-bar"></i>
                <span>Statistics</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-heading">Tasks</h3>
          <ul className="sidebar-nav">
            <li>
              <NavLink to="/tasks?status=todo" className="sidebar-link">
                <i className="fas fa-circle status-circle status-todo"></i>
                <span>To Do</span>
                <span className="task-count">{todoCount}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks?status=in-progress" className="sidebar-link">
                <i className="fas fa-circle status-circle status-in-progress"></i>
                <span>In Progress</span>
                <span className="task-count">{inProgressCount}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks?status=review" className="sidebar-link">
                <i className="fas fa-circle status-circle status-review"></i>
                <span>Review</span>
                <span className="task-count">{reviewCount}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks?status=completed" className="sidebar-link">
                <i className="fas fa-circle status-circle status-completed"></i>
                <span>Completed</span>
                <span className="task-count">{completedCount}</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-heading">Tags</h3>
          <div className="tag-list">
            <div className="tag tag-work">Work</div>
            <div className="tag tag-personal">Personal</div>
            <div className="tag tag-urgent">Urgent</div>
            <div className="tag tag-feature">Feature</div>
            <div className="tag tag-bug">Bug</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-add-task">
            <button className="btn btn-full">
              <i className="fas fa-plus"></i>
              <span>Add New Task</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;