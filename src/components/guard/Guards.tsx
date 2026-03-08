import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';


export const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  const location = useLocation();

  if (!token || !user) {
    // Redirect to login, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // Allows access to the child routes (Dashboard, etc.)
};


export const PublicRoute = () => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    // If already logged in, send them to the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />; // Allows access to Login/Register
};