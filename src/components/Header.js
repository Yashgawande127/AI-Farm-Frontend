import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Icon components for better visual design
  const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const PredictionIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const GuideIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const SeedsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );

  const FertilizerIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );

  const MachineryIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6" />
    </svg>
  );

  const FinancialIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
  
  return (
    <>
      {/* Main Header */}
      <header className="relative mb-8">
        {/* Navigation Bar */}
        <div className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
          isScrolled ? 'shadow-lg border-gray-200' : 'border-gray-100'
        }`}>
          <div className="max-w-7xl mx-auto px-6">
            <nav className="py-4">
              <div className="flex items-center justify-between">
                {/* Navigation Links */}
                <div className="flex items-center space-x-1">
                  <Link
                    to="/"
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                      location.pathname === '/'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 transform scale-105'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <DashboardIcon />
                    Dashboard
                  </Link>
                  
                  <Link
                    to="/crop-prediction"
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                      location.pathname === '/crop-prediction'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 transform scale-105'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <PredictionIcon />
                    Prediction
                  </Link>
                  
                  <Link
                    to="/reference"
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                      location.pathname === '/reference'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 transform scale-105'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <GuideIcon />
                    Guide
                  </Link>
                  
                  <Link
                    to="/seeds"
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                      location.pathname.startsWith('/seeds')
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 transform scale-105'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <SeedsIcon />
                    Seeds
                  </Link>
                  
                  <Link
                    to="/fertilizers"
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                      location.pathname.startsWith('/fertilizers')
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 transform scale-105'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <FertilizerIcon />
                    Fertilizers
                  </Link>
                  
                  <Link
                    to="/machinery"
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                      location.pathname.startsWith('/machinery')
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 transform scale-105'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <MachineryIcon />
                    Machinery
                  </Link>
                  
                  <Link
                    to="/financial"
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 ${
                      location.pathname.startsWith('/financial')
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 transform scale-105'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <FinancialIcon />
                    Financial
                  </Link>
                </div>
                
                {/* User Actions */}
                <div className="flex items-center space-x-4">
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 rounded-xl hover:bg-emerald-50 group"
                      >
                        <div className="p-1.5 rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition-colors duration-200">
                          <UserIcon />
                        </div>
                        <span className="hidden md:block">Profile</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Link
                        to="/login"
                        className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-all duration-200 rounded-xl hover:bg-gray-50"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 font-medium shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:scale-105"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;