import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./components/AdminDashboard";
import AddMovie from "./components/AddMovie";
import EditMovie from "./components/EditMovie";
import LoginPage from "./components/LoginPage"; // Replace with your actual login component
import UserManagement from "./components/UserManagement";
// import NotFound from "./components/NotFound"; // Optional

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/add"
        element={
          <AdminRoute>
            <AddMovie />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/edit/:id"
        element={
          <AdminRoute>
            <EditMovie />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        }
      />
      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* Or: <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}