import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

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
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("sessionToken");

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setForm({
        title: data.title || "",
        genre: data.genre || "",
        rating: data.rating || "",
        image: data.image || "",
        description: data.description || ""
      });
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
    const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        rating: Number(form.rating)
      })
    });
    if (res.ok) {
      setMessage("Movie updated successfully!");
      setTimeout(() => navigate("/admin/dashboard"), 1200);
    } else {
      const data = await res.json();
      setMessage(data.message || "Failed to update movie.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 480, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: 32 }}>
        <h2>Edit Movie</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
          <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
          <input name="rating" type="number" min="1" max="10" step="0.1" placeholder="Rating" value={form.rating} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
          <input name="image" placeholder="Image filename or URL" value={form.image} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", minHeight: 80 }} />
          <button type="submit" style={{ background: "#007bff", color: "#fff", border: "none", borderRadius: 6, padding: "10px 0", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>
            Update Movie
          </button>
        </form>
        {message && <p style={{ marginTop: 16, color: "#27ae60", textAlign: "center" }}>{message}</p>}
      </div>
    </>
  );
}