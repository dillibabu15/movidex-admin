import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import EditUserModal from "./EditUserModal"; 
import Navbar from "./Navbar";

const API_URL = "http://localhost:5000/api/users";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = sessionStorage.getItem("sessionToken");
      const res = await fetch(`${API_URL}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.status === 401 || res.status === 403) {
        navigate("/");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Error fetching users");
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateUser = async (updatedUser) => {
    try {
      const token = sessionStorage.getItem("sessionToken");
      const res = await fetch(`${API_URL}/${updatedUser._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: updatedUser.username,
          role: updatedUser.role,
        }),
      });
      if (res.status === 401 || res.status === 403) {
        navigate("/");
        return;
      }
      if (!res.ok) throw new Error("Failed to update user");
      
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? {...u, ...updatedUser} : u))
      );
      setEditingUser(null);
    } catch (err) {
      alert("Error updating user");
    }
  };

  return (
    <>
      <Navbar />
       <button className="back-button" onClick={() => navigate("/admin/dashboard")}>
        &larr; Back to Dashboard
      </button>
      <div className="user-management-container">
        <h2>User Management</h2>
        {loading ? (
          <p className="loading-text">Loading users...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="users-table">
            <thead className="users-table-header">
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Watchlist</th>
                <th>Reviews</th>
                <th>Ratings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <React.Fragment key={user._id}>
                  <tr className="users-table-row">
                    <td className="users-table-cell">{user.username}</td>
                    <td className="users-table-cell">{user.role}</td>
                    <td className="users-table-cell">
                      {user.watchlist.length}{" "}
                      {user.watchlist.length > 0 && (
                        <button
                          className="expand-btn"
                          onClick={() => setExpanded(expanded === `w${idx}` ? null : `w${idx}`)}
                        >
                          {expanded === `w${idx}` ? "Hide" : "Show"}
                        </button>
                      )}
                    </td>
                    <td className="users-table-cell">
                      {user.reviews.length}{" "}
                      {user.reviews.length > 0 && (
                        <button
                          className="expand-btn"
                          onClick={() => setExpanded(expanded === `r${idx}` ? null : `r${idx}`)}
                        >
                          {expanded === `r${idx}` ? "Hide" : "Show"}
                        </button>
                      )}
                    </td>
                    <td className="users-table-cell">
                      {user.ratings.length}{" "}
                      {user.ratings.length > 0 && (
                        <button
                          className="expand-btn"
                          onClick={() => setExpanded(expanded === `t${idx}` ? null : `t${idx}`)}
                        >
                          {expanded === `t${idx}` ? "Hide" : "Show"}
                        </button>
                      )}
                    </td>
                    <td className="users-table-cell">
                      <button
                        className="user-edit-btn"
                        onClick={() => setEditingUser(user)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                  {expanded === `w${idx}` && (
                    <tr>
                      <td colSpan={6} className="expanded-row">
                        <b>Watchlist:</b>{" "}
                        {user.watchlist.map((m) => m.title).join(", ")}
                      </td>
                    </tr>
                  )}
                  {expanded === `r${idx}` && (
                    <tr>
                      <td colSpan={6} className="expanded-row">
                        <b>Reviews:</b>
                        <ul>
                          {user.reviews.map((r, i) => (
                            <li key={i}>
                              <b>{r.movieTitle}</b>: {r.text}{" "}
                              <span className="review-date">
                                ({new Date(r.date).toLocaleString()})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                  {expanded === `t${idx}` && (
                    <tr>
                      <td colSpan={6} className="expanded-row">
                        <b>Ratings:</b>
                        <ul>
                          {user.ratings.map((r, i) => (
                            <li key={i}>
                              <b>{r.movieTitle}</b>: {r.value}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleUpdateUser}
          />
        )}
      </div>
    </>
  );
}