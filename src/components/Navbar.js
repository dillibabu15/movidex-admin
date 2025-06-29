import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("sessionToken");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={{
      background: "#222",
      color: "#fff",
      padding: "12px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div>
        <Link to="/admin/dashboard" style={{ color: "#fff", textDecoration: "none", marginRight: 24, fontWeight: 600 }}>
          Dashboard
        </Link>
        <Link to="/admin/add" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>
          Add Movie
        </Link>
      </div>
      <button
        onClick={handleLogout}
        style={{
          background: "#e74c3c",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "6px 18px",
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        Logout
      </button>
    </nav>
  );
}