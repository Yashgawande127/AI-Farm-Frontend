import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WelcomePage from '../components/WelcomePage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center items-center min-h-64 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg mx-auto text-center">
              <div className="mb-8">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Authenticating</h3>
              <p className="text-gray-600 leading-relaxed">
                Verifying authentication...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <WelcomePage />;
  }

  return children;
};

export default ProtectedRoute;