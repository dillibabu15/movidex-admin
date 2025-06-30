import React, { useState, useEffect } from "react";

export default function EditUserModal({ user, onClose, onSave }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...user, username, role });
    setSaving(false);
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
      >
        <h3>Edit User</h3>
        <label className="modal-label">
          Username:
          <input
            className="modal-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="modal-label">
          Role:
          <select
            className="modal-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <div className="modal-buttons">
          <button
            type="submit"
            className="modal-save-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}