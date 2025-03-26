import React, { createContext, useReducer, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

const initialState = {
  tasks: [],
  task: null,
  loading: true,
  error: null
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false
      };
    case 'GET_TASK':
      return {
        ...state,
        task: action.payload,
        loading: false
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        ),
        task: action.payload,
        loading: false
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        loading: false
      };
    case 'TASK_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { token } = useContext(AuthContext);
  
  // Set auth token
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }

  // Get all tasks
  const getTasks = async (filters = {}) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      // Build query string
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const res = await axios.get(`/api/tasks?${queryParams}`);
      
      dispatch({
        type: 'GET_TASKS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data.message || 'Failed to fetch tasks'
      });
    }
  };

  // Get a specific task
  const getTask = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.get(`/api/tasks/${id}`);
      
      dispatch({
        type: 'GET_TASK',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data.message || 'Failed to fetch task'
      });
    }
  };

  // Create a new task
  const addTask = async (taskData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.post('/api/tasks', taskData);
      
      dispatch({
        type: 'ADD_TASK',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data.message || 'Failed to create task'
      });
      throw err;
    }
  };

  // Update a task
  const updateTask = async (id, taskData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.put(`/api/tasks/${id}`, taskData);
      
      dispatch({
        type: 'UPDATE_TASK',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data.message || 'Failed to update task'
      });
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      await axios.delete(`/api/tasks/${id}`);
      
      dispatch({
        type: 'DELETE_TASK',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data.message || 'Failed to delete task'
      });
    }
  };

  // Add a comment to a task
  const addComment = async (taskId, text) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axios.post(`/api/tasks/${taskId}/comments`, { text });
      
      dispatch({
        type: 'UPDATE_TASK',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data.message || 'Failed to add comment'
      });
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        task: state.task,
        loading: state.loading,
        error: state.error,
        getTasks,
        getTask,
        addTask,
        updateTask,
        deleteTask,
        addComment
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};