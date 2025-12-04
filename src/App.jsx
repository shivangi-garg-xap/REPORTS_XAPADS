import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./components/LoginPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/main.scss";

import Layout from "./components/Layout";
import { useAuth } from './utils/AuthContext';

function App() {
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/" replace />;
  }

  const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/home" replace /> : children;
  }

  const Logout = () => {
    const { logout } = useAuth();
    logout();

    return <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/home" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
