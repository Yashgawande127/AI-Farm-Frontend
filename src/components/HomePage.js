import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import apiService from '../services/apiService';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        
        {/* Hero Section */}
        <main className="space-y-10 sm:space-y-16">
          <div className="text-center max-w-5xl mx-auto py-10 sm:py-16">
            <div className="mb-6 sm:mb-10">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">AI Farm</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto px-4">
                Harness the power of artificial intelligence to make smarter farming decisions. 
                Get personalized crop recommendations based on your soil conditions, climate, and local environment.
              </p>
            </div>

            {/* User Welcome */}
            {user && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 sm:p-6 rounded-2xl mb-8 inline-block shadow-sm">
                <p className="text-base sm:text-lg">
                  Welcome back, <span className="font-bold">{user.first_name || user.firstName || user.email}</span>!
                </p>
              </div>
            )}

            {/* CTA Button */}
            <div className="mb-10 sm:mb-16">
              <Link
                to="/crop-prediction"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white text-base sm:text-lg font-bold rounded-xl hover:from-green-600 hover:to-blue-700 transition duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Crop Analysis
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-10 sm:mb-12">
              Powerful Features for Smart Farming
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-2xl transition duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI Predictions</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Advanced machine learning algorithms analyze soil composition and weather patterns to recommend crops.
                </p>
                <Link 
                  to="/crop-prediction"
                  className="text-green-600 hover:text-green-700 font-bold flex items-center text-sm"
                >
                  Try Prediction
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-2xl transition duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Detailed Analysis</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Get comprehensive reports with confidence scores and detailed explanations for each recommendation.
                </p>
                <Link 
                  to="/reference"
                  className="text-blue-600 hover:text-blue-700 font-bold flex items-center text-sm"
                >
                  View Reference
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-2xl transition duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fertilizers</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Scientific approach to fertilizer optimization with inventory tracking and application scheduling.
                </p>
                <Link 
                  to="/fertilizers"
                  className="text-purple-600 hover:text-purple-700 font-bold flex items-center text-sm"
                >
                  Manage Fertilizers
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-2xl transition duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Machinery</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Comprehensive equipment lifecycle management with inventory tracking and performance analytics.
                </p>
                <Link 
                  to="/machinery"
                  className="text-orange-600 hover:text-orange-700 font-bold flex items-center text-sm"
                >
                  Manage Equipment
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 sm:p-12 max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-10 sm:mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Input Data</h3>
                <p className="text-gray-600 text-sm px-4">Enter your soil conditions, climate data, and environment factors</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600 text-sm px-4">Our model processes your data and analyzes agricultural patterns</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Get Results</h3>
                <p className="text-gray-600 text-sm px-4">Receive personalized crop recommendations with confidence scores</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Make Decisions</h3>
                <p className="text-gray-600 text-sm px-4">Use insights to optimize your farming strategy and maximize yield</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-16 sm:mt-24 text-center">
          <div className="border-t border-gray-200 pt-8 sm:pt-10">
            <p className="text-gray-500 text-sm font-semibold">
              &copy; 2025 AI Farm - Intelligent Crop Recommendation System
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;