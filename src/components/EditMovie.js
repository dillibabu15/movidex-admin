import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./styles.css"; // Import the CSS file

export default function EditMovie() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    genre: "",
    rating: "",
    image: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("sessionToken");

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch movie');
        const data = await res.json();
        setForm({
          title: data.title || "",
          genre: data.genre || "",
          rating: data.rating || "",
          image: data.image || "",
          description: data.description || ""
        });
      } catch (err) {
        setError("Error loading movie data");
      }
      setLoading(false);
    };
    fetchMovie();
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const ratingNum = Number(form.rating);
    if (ratingNum < 1 || ratingNum > 10) {
      setError("Rating must be between 1 and 10");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          rating: ratingNum
        })
      });
      if (res.ok) {
        setMessage("Movie updated successfully!");
        setTimeout(() => navigate("/admin/dashboard"), 1200);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update movie.");
      }
    } catch (err) {
      setError("Server error");
    }
    setSaving(false);
  };

  if (loading) return <div className="loading-container">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="form-container">
        <h2>Edit Movie</h2>
        <form onSubmit={handleSubmit} className="form-vertical">
          <input 
            name="title" 
            placeholder="Title" 
            value={form.title} 
            onChange={handleChange} 
            required 
            className="form-input" 
          />
          <input 
            name="genre" 
            placeholder="Genre" 
            value={form.genre} 
            onChange={handleChange} 
            required 
            className="form-input" 
          />
          <input 
            name="rating" 
            type="number" 
            min="1" 
            max="10" 
            step="0.1" 
            placeholder="Rating" 
            value={form.rating} 
            onChange={handleChange} 
            required 
            className="form-input" 
          />
          <input 
            name="image" 
            placeholder="Image filename or URL" 
            value={form.image} 
            onChange={handleChange} 
            required 
            className="form-input" 
          />
          <textarea 
            name="description" 
            placeholder="Description" 
            value={form.description} 
            onChange={handleChange} 
            required 
            className="form-textarea" 
          />
          <button 
            type="submit" 
            className="form-button" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Update Movie'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </>
  );
}