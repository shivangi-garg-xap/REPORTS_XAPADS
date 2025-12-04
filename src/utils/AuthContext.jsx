import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  });

  const [token, setToken] = useState(() => {
    const token = Cookies.get('token');
    return token || null;
  });

  const isAuthenticated = !!token;

  // Helper function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      return Date.now() >= decodedToken.exp * 1000; // Check expiry date
    } catch (e) {
      return true;
    }
  };

  const login = (token, userData) => {
    const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    // const expiryTime = new Date(Date.now() + 20 * 1000); // 30sec hours from now
    Cookies.set('token', token, { expires: expiryTime });
    Cookies.set('user', JSON.stringify(userData), { expires: expiryTime });
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setToken(null);
    setUser(null);
  };

  const handleUnauthorized = (error) => {
    const status = error?.response?.status;
  
    if (status === 401) {
      logout();
    }
  };

//   useEffect(() => {
//     // Check if the token is expired when the app loads
//     if (token && isTokenExpired(token)) {
//       logout(); // Log the user out if the token is expired
//     }
//   }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout, handleUnauthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);