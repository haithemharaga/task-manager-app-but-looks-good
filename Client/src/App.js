import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import TaskBoard from './pages/TaskBoard';
import TaskDetails from './pages/TaskDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Statistics from './pages/Statistics';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="app-container">
              <Sidebar />
              <main className="app-main">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/board" element={<PrivateRoute><TaskBoard /></PrivateRoute>} />
                  <Route path="/task/:id" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/statistics" element={<PrivateRoute><Statistics /></PrivateRoute>} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}
