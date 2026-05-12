import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          🛒 RetailStore
        </Link>

        <div className="navbar-menu">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/orders" className="nav-link">Orders</Link>
          <div className="nav-user">
            <span className="user-name">Hi, {user.full_name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
