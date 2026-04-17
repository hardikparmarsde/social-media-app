import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicOnly = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (user?.token) {
    return <Navigate to="/feed" replace />;
  }

  return children;
};

export default PublicOnly;

