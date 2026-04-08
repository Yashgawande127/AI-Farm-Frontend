import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import CropsReference from './CropsReference';

const ReferencePage = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-green-500/3 to-blue-500/3 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-8">
        <Header />
        
        {/* Navigation */}
        <nav className="mb-12">
          <div className="flex justify-between items-center">
            <Link 
              to="/"
              className="inline-flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Analysis
            </Link>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-gray-800">
                  Agricultural Knowledge Base
                </h2>
              </div>
              <p className="text-gray-600 text-xl">
                Comprehensive cultivation guides and crop intelligence
              </p>
            </div>
            
            <div className="w-48"></div> {/* Spacer for alignment */}
          </div>
        </nav>

        <main>
          <CropsReference />
        </main>

        <footer className="mt-20 text-center">
          <div className="border-t border-gray-200 pt-8">
            <p className="text-gray-600 text-sm font-medium">
              &copy; 2025 AI Farm - Advanced Agricultural Intelligence Platform
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ReferencePage;