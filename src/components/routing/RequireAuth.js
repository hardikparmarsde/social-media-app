import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user?.token) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname, message: 'Please sign in to continue.' }}
      />
    );
  }

  return children;
};

export default RequireAuth;

