import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

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
      <div style={{ padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2>Admin Dashboard</h2>
          <button
            onClick={() => navigate("/admin/add")}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            + Add Movie
          </button>
        </div>
        {loading ? (
          <p>Loading movies...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#222", color: "#fff" }}>
                <th style={{ padding: 8 }}>Title</th>
                <th style={{ padding: 8 }}>Genre</th>
                <th style={{ padding: 8 }}>Rating</th>
                <th style={{ padding: 8 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={{ padding: 8 }}>{movie.title}</td>
                  <td style={{ padding: 8 }}>{movie.genre}</td>
                  <td style={{ padding: 8 }}>{movie.rating}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      style={{ marginRight: 8 }}
                      onClick={() => navigate(`/admin/edit/${movie._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        color: "white",
                        background: "#e74c3c",
                        border: "none",
                        borderRadius: 4,
                        padding: "4px 12px",
                        cursor: "pointer"
                      }}
                      onClick={() => handleDelete(movie._id)}
                    >
                      Delete
                    </button>
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