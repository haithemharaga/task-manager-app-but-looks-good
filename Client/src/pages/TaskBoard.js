import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskModal from '../components/tasks/TaskModal';
import './TaskBoard.css';

const TaskBoard = () => {
  const { tasks, getTasks, loading } = useContext(TaskContext);
  const [newTaskModal, setNewTaskModal] = useState(false);
  
  useEffect(() => {
    getTasks();
  }, []);
  
  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const reviewTasks = tasks.filter(task => task.status === 'review');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  // Toggle new task modal
  const toggleNewTaskModal = () => {
    setNewTaskModal(!newTaskModal);
  };

  return (
    <div className="task-board-container">
      <div className="board-header">
        <h1>Task Board</h1>
        <button className="btn" onClick={toggleNewTaskModal}>
          <i className="fas fa-plus"></i>
          <span>New Task</span>
        </button>
      </div>
      
      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <div className="task-board">
          <TaskColumn 
            title="To Do" 
            tasks={todoTasks} 
            status="todo"
            icon="circle"
            color="var(--status-todo)"
          />
          
          <TaskColumn 
            title="In Progress" 
            tasks={inProgressTasks} 
            status="in-progress"
            icon="spinner"
            color="var(--status-in-progress)"
          />
          
          <TaskColumn 
            title="Review" 
            tasks={reviewTasks} 
            status="review"
            icon="eye"
            color="var(--status-review)"
          />
          
          <TaskColumn 
            title="Completed" 
            tasks={completedTasks} 
            status="completed"
            icon="check-circle"
            color="var(--status-completed)"
          />
        </div>
      )}
      
      {newTaskModal && (
        <TaskModal onClose={toggleNewTaskModal} />
      )}
    </div>
  );
};

export default TaskBoard;