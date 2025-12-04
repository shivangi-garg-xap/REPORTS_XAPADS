import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./components/LoginPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/main.scss";

import XiaomiRTBReport from "./components/XiaomiRTBReport";
import FraudAnalyticsReport from "./components/FraudAnalyticsReport";
import { useAuth } from './utils/AuthContext';
import TopHeader from "./components/TopHeader";

function App() {
  const { isAuthenticated } = useAuth();
  console.log("isAuthenticated", isAuthenticated);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" replace />;
  };

  const PublicRoute = ({ children }) => {
    return isAuthenticated ? <Navigate to="/rtb-report" replace /> : children;
  };

    const Logout = () => {
    const { logout } = useAuth();
    logout();

    return <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <div className={isAuthenticated ? "reports-layout" : ""}>
      {isAuthenticated && <TopHeader />}
        <Routes>
          <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/rtb-report" element={<ProtectedRoute><XiaomiRTBReport /></ProtectedRoute>} />
          <Route path="/fraud-report" element={<ProtectedRoute><FraudAnalyticsReport /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/rtb-report" : "/"} replace />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
