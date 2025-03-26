// Client/src/pages/Statistics.js
import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskChart from '../components/charts/TaskChart';
import './Statistics.css';

const Statistics = () => {
  const { tasks, getTasks, loading } = useContext(TaskContext);
  const [chartData, setChartData] = useState({
    statusData: [],
    priorityData: []
  });

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      calculateChartData();
    }
  }, [tasks]);

  const calculateChartData = () => {
    // Status distribution
    const todoCount = tasks.filter(task => task.status === 'todo').length;
    const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
    const reviewCount = tasks.filter(task => task.status === 'review').length;
    const completedCount = tasks.filter(task => task.status === 'completed').length;

    // Priority distribution
    const highPriority = tasks.filter(task => task.priority === 'high').length;
    const mediumPriority = tasks.filter(task => task.priority === 'medium').length;
    const lowPriority = tasks.filter(task => task.priority === 'low').length;

    setChartData({
      statusData: [
        { name: 'To Do', value: todoCount, color: '#e74c3c' },
        { name: 'In Progress', value: inProgressCount, color: '#f39c12' },
        { name: 'Review', value: reviewCount, color: '#3498db' },
        { name: 'Completed', value: completedCount, color: '#2ecc71' }
      ],
      priorityData: [
        { name: 'High', value: highPriority, color: '#e74c3c' },
        { name: 'Medium', value: mediumPriority, color: '#f39c12' },
        { name: 'Low', value: lowPriority, color: '#2ecc71' }
      ]
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-container">
      <h1>Task Statistics</h1>
      
      <div className="statistics-grid">
        <div className="stat-card">
          <h2>Task Status Distribution</h2>
          <div className="chart-container">
            <TaskChart tasks={tasks} />
          </div>
        </div>
        
        <div className="stat-card">
          <h2>Tasks by Priority</h2>
          <div className="chart-container">
            {tasks.length > 0 ? (
              <div className="priority-stats">
                {chartData.priorityData.map((item, index) => (
                  <div key={index} className="priority-stat-item">
                    <div className="priority-bar-container">
                      <div 
                        className="priority-bar" 
                        style={{ 
                          width: `${(item.value / tasks.length) * 100}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                    <div className="priority-label">
                      <span>{item.name}</span>
                      <span>{item.value} tasks ({Math.round((item.value / tasks.length) * 100)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="chart-empty">
                <div className="empty-icon">
                  <i className="fas fa-chart-pie"></i>
                </div>
                <p>No tasks to display</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="stat-card">
          <h2>Task Completion Rate</h2>
          <div className="chart-container">
            {tasks.length > 0 ? (
              <div className="completion-stats">
                <div className="completion-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle"
                      strokeDasharray={`${(chartData.statusData[3]?.value / tasks.length) * 100}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">{Math.round((chartData.statusData[3]?.value / tasks.length) * 100)}%</text>
                  </svg>
                </div>
                <div className="completion-info">
                  <p>{chartData.statusData[3]?.value} of {tasks.length} tasks completed</p>
                </div>
              </div>
            ) : (
              <div className="chart-empty">
                <div className="empty-icon">
                  <i className="fas fa-tasks"></i>
                </div>
                <p>No tasks to display</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="stat-card">
          <h2>Task Summary</h2>
          <div className="chart-container">
            <div className="task-summary">
              <div className="summary-item">
                <div className="summary-icon">
                  <i className="fas fa-tasks"></i>
                </div>
                <div className="summary-info">
                  <h3>Total Tasks</h3>
                  <p>{tasks.length}</p>
                </div>
              </div>
              
              <div className="summary-item">
                <div className="summary-icon">
                  <i className="fas fa-spinner"></i>
                </div>
                <div className="summary-info">
                  <h3>In Progress</h3>
                  <p>{chartData.statusData[1]?.value || 0}</p>
                </div>
              </div>
              
              <div className="summary-item">
                <div className="summary-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="summary-info">
                  <h3>High Priority</h3>
                  <p>{chartData.priorityData[0]?.value || 0}</p>
                </div>
              </div>
              
              <div className="summary-item">
                <div className="summary-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="summary-info">
                  <h3>Completed</h3>
                  <p>{chartData.statusData[3]?.value || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;