import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user || !user.token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return children;
}
