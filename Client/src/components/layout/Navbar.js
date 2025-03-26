import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-tasks"></i>
          <span>Task<span className="highlight">Flow</span></span>
        </Link>

        <div className="navbar-search">
          <div className="search-input-wrapper">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search tasks..." className="search-input" />
          </div>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <button className="navbar-button">
                <i className="fas fa-bell"></i>
                <div className="notification-badge">3</div>
              </button>
              <div className="user-dropdown">
                <button className="user-button" onClick={toggleDropdown}>
                  <div className="avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="user-name">{user.name}</span>
                  <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      <i className="fas fa-user"></i> Profile
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      <i className="fas fa-cog"></i> Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={logout} className="dropdown-item">
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-text">Login</Link>
              <Link to="/register" className="btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;