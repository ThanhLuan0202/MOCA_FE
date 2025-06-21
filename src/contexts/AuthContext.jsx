import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';
import apiClient from '../services/api'; // Import apiClient

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // New loading state

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    if (token) {
      setIsLoadingAuth(true); // Set loading to true when starting auth process
      const { userId, roleId } = authService.getUserInfoFromToken(token); // Get userId and roleId from token
      
      if (userId) {
        // Fetch full user profile data
        apiClient.get(`/api/User/${userId}`)
          .then(userProfile => {
            console.log("AuthContext init - user profile fetched:", userProfile);
            // userProfile is already response.data from apiClient
            // Ensure the roleId from the token is used, as it's the source of truth for role mapping.
            userProfile.roleId = roleId; 
            setCurrentUser(userProfile);
          })
          .catch(error => {
            console.error("Error fetching user profile in AuthContext (init):", error);
            setCurrentUser(null);
            // Optionally log out if profile fetch fails
            // authService.logout();
            // setIsLoggedIn(false);
          })
          .finally(() => {
            setIsLoadingAuth(false); // Set loading to false when auth process finishes
          });
      } else {
        console.error("AuthContext init - UserId not found in token.");
        setCurrentUser(null);
        authService.logout(); // Logout if token is invalid or missing userId
        setIsLoggedIn(false);
        setIsLoadingAuth(false); // Set loading to false if userId not found
      }
    } else {
      setIsLoadingAuth(false); // Set loading to false if no token exists
    }
    console.log("AuthContext init - isLoggedIn:", !!token);
    console.log("AuthContext init - currentUser:", currentUser);
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
    setIsLoadingAuth(true); // Set loading to true on login
    const { userId, roleId } = authService.getUserInfoFromToken(token);
    if (userId) {
      apiClient.get(`/api/User/${userId}`)
        .then(userProfile => {
          console.log("AuthContext login - user profile fetched:", userProfile);
          // userProfile is already response.data from apiClient
          // Ensure the roleId from the token is used.
          userProfile.roleId = roleId;
          setCurrentUser(userProfile);
        })
        .catch(error => {
          console.error("Error fetching user profile after login:", error);
          setCurrentUser(null);
        })
        .finally(() => {
          setIsLoadingAuth(false); // Set loading to false after login process finishes
        });
    } else {
      console.error("AuthContext login - UserId not found after login.");
      setCurrentUser(null);
      setIsLoadingAuth(false); // Set loading to false if userId not found on login
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsLoadingAuth(false); // Set loading to false on logout
    console.log("AuthContext - logged out.");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 