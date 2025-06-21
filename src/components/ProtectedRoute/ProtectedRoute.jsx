import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, currentUser, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <div>Loading authentication...</div>; // Or a spinner, or null
  }

  if (!isLoggedIn) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && currentUser) {
    // Check if the user's role is allowed
    const userRoleId = currentUser.roleId;
    if (!allowedRoles.includes(userRoleId)) {
      // User is logged in but does not have the allowed role, redirect to access denied page or home
      return <Navigate to="/" replace />;
      // Alternatively, you could render an "Access Denied" message here
      // return <div className="access-denied-message">Access Denied</div>;
    }
  }

  return children;
};

export default ProtectedRoute; 