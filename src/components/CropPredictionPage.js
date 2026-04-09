import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CropPredictionForm from './CropPredictionForm';
import Header from './Header';
import apiService from '../services/apiService';

const CropPredictionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.predictCropEnsemble(formData);
      // Navigate to results page with prediction data
      navigate('/results', { 
        state: { 
          prediction: result, 
          inputData: formData 
        } 
      });
    } catch (err) {
      setError(err.message || 'An error occurred while making the prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <main className="space-y-12">
          {/* Page Header */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Crop Prediction Analysis
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Enter your soil and environmental conditions to get AI-powered crop recommendations
                tailored to your specific farming needs.
              </p>
            </div>

            {user && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-8 inline-block">
                <p className="text-sm">
                  Welcome back, <span className="font-semibold">{user.firstName || user.email}</span>!
                </p>
              </div>
            )}
          </div>

          {/* Prediction Form */}
          <div className="w-full">
            <CropPredictionForm onSubmit={handleFormSubmit} onReset={handleReset} />
          </div>

          {/* Loading and Error States */}
          <div className="w-full">
            {loading && (
              <div className="flex justify-center items-center min-h-64 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg mx-auto text-center">
                  <div className="mb-8">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Processing Analysis</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our ensemble AI models are analyzing your environmental data to determine the optimal crop recommendation and provide comparative insights.
                  </p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl shadow-sm animate-fade-in max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold">Error</h3>
                </div>
                <p className="text-red-700 ml-8">{error}</p>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Tips for Accurate Predictions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Soil Testing</h4>
                      <p className="text-gray-600 text-sm">Get your soil tested for accurate NPK values and pH levels for precise analysis.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Weather Data</h4>
                      <p className="text-gray-600 text-sm">Use recent local weather patterns for temperature and rainfall inputs.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Crop Rotation</h4>
                      <p className="text-gray-600 text-sm">Consider previous crops grown in the field to maintain soil health.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Regular Monitoring</h4>
                      <p className="text-gray-600 text-sm">Run predictions regularly as environmental conditions change over time.</p>
                    </div>
                  </div>
                </div>
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

export default CropPredictionPage;