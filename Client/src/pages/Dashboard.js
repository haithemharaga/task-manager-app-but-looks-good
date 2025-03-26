import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import TaskItem from '../components/tasks/TaskItem';
import TaskChart from '../components/charts/TaskChart';
import './Dashboard.css';

const Dashboard = () => {
  const { tasks } = useContext(TaskContext);
  const [activeTab, setActiveTab] = useState('today');

  // Filter tasks based on active tab
  const filterTasks = () => {
    if (activeTab === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      });
    } else if (activeTab === 'upcoming') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      return tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate > today && dueDate <= nextWeek;
      });
    } else if (activeTab === 'important') {
      return tasks.filter(task => task.priority === 'high');
    }
    return [];
  };

  const filteredTasks = filterTasks();
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const completionRate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn">
          <i className="fas fa-plus"></i>
          <span>New Task</span>
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Tasks</p>
            <h3 className="stat-value">{tasks.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-spinner"></i>
          </div>
          <div className="stat-content">
            <p className="stat-title">In Progress</p>
            <h3 className="stat-value">{tasks.filter(task => task.status === 'in-progress').length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <p className="stat-title">Completed</p>
            <h3 className="stat-value">{completedCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="stat-content">
            <p className="stat-title">Completion Rate</p>
            <h3 className="stat-value">{completionRate.toFixed(1)}%</h3>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-tasks">
          <div className="content-header">
            <h2>My Tasks</h2>
            <div className="tab-navigation">
              <button 
                className={`tab-button ${activeTab === 'today' ? 'active' : ''}`}
                onClick={() => setActiveTab('today')}
              >
                Today
              </button>
              <button 
                className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </button>
              <button 
                className={`tab-button ${activeTab === 'important' ? 'active' : ''}`}
                onClick={() => setActiveTab('important')}
              >
                Important
              </button>
            </div>
          </div>

          <div className="task-list">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem key={task._id} task={task} />
              ))
            ) : (
              <div className="empty-tasks">
                <div className="empty-icon">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <p>No tasks found for this filter</p>
                <button className="btn btn-text">
                  <i className="fas fa-plus"></i>
                  <span>Add a task</span>
                </button>
              </div>
            )}
          </div>

          <div className="view-all">
            <Link to="/board" className="btn btn-text">
              View All Tasks
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="chart-card">
            <h3>Task Status</h3>
            <TaskChart tasks={tasks} />
          </div>

          <div className="card recent-activity">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <div className="activity-content">
                  <p>You created a new task <span className="highlight">Website Redesign</span></p>
                  <p className="activity-time">2 hours ago</p>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="activity-content">
                  <p>You completed <span className="highlight">API Integration</span></p>
                  <p className="activity-time">Yesterday at 4:30 PM</p>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="activity-content">
                  <p>You assigned <span className="highlight">Database Setup</span> to Alex</p>
                  <p className="activity-time">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;