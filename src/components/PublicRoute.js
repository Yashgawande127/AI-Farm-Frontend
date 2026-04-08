import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      // Check if user data exists in localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Parse user data and check if it has a token
      const user = JSON.parse(userData);
      if (user.access_token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Authentication check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center items-center min-h-64 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg mx-auto text-center">
              <div className="mb-8">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading</h3>
              <p className="text-gray-600 leading-relaxed">
                Loading...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, show the public page (login/signup)
  return children;
};

export default PublicRoute;