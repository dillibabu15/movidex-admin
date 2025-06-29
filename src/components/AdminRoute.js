import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const userStr = sessionStorage.getItem("user");
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }

  if (user && user.role === "admin") {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
}