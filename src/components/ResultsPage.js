import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ResultDisplay from './ResultDisplay';
import ModelComparison from './ModelComparison';
import Header from './Header';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prediction, inputData } = location.state || {};

  // If no prediction data, redirect to home
  if (!prediction) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-8">
          <Header />
          
          <div className="max-w-2xl mx-auto text-center mt-20">
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">No Analysis Found</h2>
              </div>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Start your agricultural journey by providing soil and environmental data for our AI-powered crop recommendation system.
              </p>
              <Link 
                to="/"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Begin Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/3 to-blue-500/3 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-8">
        <Header />
        
        {/* Navigation */}
        <nav className="mb-8 sm:mb-12 px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <Link 
              to="/"
              className="inline-flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-md sm:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Analysis</span>
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                to="/"
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="text-emerald-500">🎯</span>
                New Analysis
              </Link>
              <Link 
                to="/reference"
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="text-blue-500">📚</span>
                Crops Guide
              </Link>
            </div>
          </div>
        </nav>

        {/* Results Section */}
        <main className="px-2 sm:px-4">
          <div className="mb-10 sm:mb-12">
            <div className="text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg transform sm:rotate-3">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                  Analysis Complete
                </h2>
              </div>
              <p className="text-gray-600 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
                Our AI has analyzed your data to provide optimal crop recommendations
              </p>
            </div>
          </div>

          <div className="w-full">
            <ResultDisplay prediction={prediction} inputData={inputData} />
          </div>

          {/* Model Comparison Section */}
          {prediction && prediction.data && prediction.data.ensemble_data && (
            <div className="w-full">
              <ModelComparison 
                ensembleData={prediction.data.ensemble_data} 
                predictedCrop={prediction.data.predicted_crop}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-16 text-center space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Run New Analysis
              </button>
              
              <button
                onClick={() => window.print()}
                className="bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Export Report
              </button>
            </div>
          </div>
        </main>

        <footer className="mt-20 text-center">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 text-sm font-medium">
              &copy; 2025 AI Farm - Intelligent Agricultural Analytics Platform
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ResultsPage;