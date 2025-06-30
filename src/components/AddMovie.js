import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./styles.css"; // Import the CSS file

export default function AddMovie() {
  const [form, setForm] = useState({
    title: "",
    genre: "",
    rating: "",
    image: "",
    description: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("sessionToken");

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
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/movies", {
        method: "POST",
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
        setMessage("Movie added successfully!");
        setTimeout(() => navigate("/admin/dashboard"), 1200);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to add movie.");
      }
    } catch (err) {
      setError("Server error");
    }
    setLoading(false);
  };

  return (
    <>
    
      <Navbar />
        <button className="back-button" onClick={() => navigate("/admin/dashboard")}>
        &larr; Back to Dashboard
      </button>
      <div className="form-container">
        <h2>Add New Movie</h2>
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
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Movie'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </>
  );
}