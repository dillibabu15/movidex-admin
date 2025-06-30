import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css"; // Import the CSS file

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Admin Panel</div>
      
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <div className="hamburger-line" />
        <div className="hamburger-line" />
        <div className="hamburger-line" />
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-nav">
          <Link 
            to="/admin/dashboard" 
            className="nav-link" 
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/add" 
            className="nav-link" 
            onClick={() => setOpen(false)}
          >
            Add Movie
          </Link>
          <Link 
            to="/admin/users" 
            className="nav-link" 
            onClick={() => setOpen(false)}
          >
            User Management
          </Link>
          <div className="nav-divider" />
          <button
            onClick={() => { setOpen(false); handleLogout(); }}
            className="nav-logout"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}