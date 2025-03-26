import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './TaskChart.css';

const TaskChart = ({ tasks }) => {
  // Count tasks by status
  const todoCount = tasks.filter(task => task.status === 'todo').length;
  const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
  const reviewCount = tasks.filter(task => task.status === 'review').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  
  const data = [
    { name: 'To Do', value: todoCount, color: '#e74c3c' },
    { name: 'In Progress', value: inProgressCount, color: '#f39c12' },
    { name: 'Review', value: reviewCount, color: '#3498db' },
    { name: 'Completed', value: completedCount, color: '#2ecc71' }
  ];
  
  // Filter out statuses with 0 tasks
  const chartData = data.filter(item => item.value > 0);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">{`${payload[0].value} task${payload[0].value !== 1 ? 's' : ''}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="task-chart">
      {tasks.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="chart-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                <div className="legend-text">
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-value">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="chart-empty">
          <div className="empty-icon">
            <i className="fas fa-chart-pie"></i>
          </div>
          <p>No tasks to display</p>
        </div>
      )}
    </div>
  );
};

export default TaskChart;