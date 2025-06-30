import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./styles.css";

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("sessionToken");
  const navigate = useNavigate();

  const fetchMovies = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/movies", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();
    setMovies(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    await fetch(`http://localhost:5000/api/movies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    fetchMovies();
  };

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Admin Dashboard</h2>
          <button
            onClick={() => navigate("/admin/add")}
            className="add-movie-btn"
          >
            + Add Movie
          </button>
        </div>
        
        {loading ? (
          <p className="loading-text">Loading movies...</p>
        ) : (
          <table className="movies-table">
            <thead className="table-header">
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id} className="table-row">
                  <td className="table-cell">{movie.title}</td>
                  <td className="table-cell">{movie.genre}</td>
                  <td className="table-cell">{movie.rating}</td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/admin/edit/${movie._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(movie._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}