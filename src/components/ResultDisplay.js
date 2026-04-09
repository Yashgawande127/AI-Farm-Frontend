import React, { useState } from 'react';
import { getCropData } from '../data/cropData';
import CropConditionsGuide from './CropConditionsGuide';

const ResultDisplay = ({ prediction, inputData }) => {
  const [showGuide, setShowGuide] = useState(false);

  if (!prediction || !prediction.data) {
    return null;
  }

  const { 
    predicted_crop = 'unknown', 
    confidence = 0, 
    recommendations = [] 
  } = prediction.data || {};
  
  const cropInfo = getCropData(predicted_crop);

  // Crop image component
  const getCropImage = (crop) => {
    if (cropInfo && cropInfo.image) {
      return (
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 backdrop-blur-sm">
            <img 
              src={cropInfo.image} 
              alt={cropInfo.name}
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl hidden items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-lg opacity-30 -z-10"></div>
        </div>
      );
    }
    
    // Fallback icon if no crop data
    return (
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/30">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-lg opacity-30 -z-10"></div>
      </div>
    );
  };

  const getConfidenceColorClass = (confidence) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConfidenceBgClass = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.8) return 'High Confidence';
    if (confidence >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Results Card */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Crop Information Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-10">
            {/* Crop Image & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
              <div className="relative transform hover:rotate-3 transition-transform duration-300">
                {getCropImage(predicted_crop)}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white animate-pulse">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="text-white">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 capitalize tracking-tight leading-tight">
                  {cropInfo ? cropInfo.name : predicted_crop}
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
                  <span className="px-4 py-1 bg-white/20 border border-white/30 rounded-full text-sm font-bold backdrop-blur-md shadow-inner">
                    Optimal Match
                  </span>
                  {cropInfo && (
                    <span className="px-4 py-1 bg-emerald-500/30 border border-emerald-400/30 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider">
                      Premium Quality
                    </span>
                  )}
                </div>
                {cropInfo && cropInfo.description && (
                  <p className="text-emerald-50 font-medium leading-relaxed max-w-lg text-base sm:text-lg opacity-90">
                    {cropInfo.description}
                  </p>
                )}
              </div>
            </div>

            {/* Confidence Display */}
            <div className="w-full lg:w-auto mt-4 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                <div className="text-white text-center lg:text-left mb-4">
                  <span className="text-xs sm:text-sm font-bold opacity-80 uppercase tracking-widest block mb-1">AI Confidence Score</span>
                  <span className="text-4xl sm:text-5xl font-black tracking-tighter">
                    {Math.round(confidence * 100)}<span className="text-2xl sm:text-3xl opacity-60 ml-1">%</span>
                  </span>
                </div>
                <div className="w-full lg:w-48 bg-black/20 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                    style={{ width: `${confidence * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-100">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold text-sm tracking-wide lowercase first-letter:uppercase">
                    {getConfidenceLabel(confidence)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Soil Compatibility */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-emerald-800">Soil Match</h4>
              </div>
              <div className="text-3xl font-bold text-emerald-700 mb-2">Excellent</div>
              <p className="text-emerald-600 text-sm">Optimal conditions detected</p>
            </div>

            {/* Climate Suitability */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h4 className="font-bold text-blue-800">Climate Fit</h4>
              </div>
              <div className="text-3xl font-bold text-blue-700 mb-2">Perfect</div>
              <p className="text-blue-600 text-sm">Weather conditions ideal</p>
            </div>

            {/* Yield Potential */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-bold text-purple-800">Yield Potential</h4>
              </div>
              <div className="text-3xl font-bold text-purple-700 mb-2">High</div>
              <p className="text-purple-600 text-sm">Expected strong returns</p>
            </div>
          </div>

          {/* Recommendations Section */}
          {recommendations && recommendations.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-200 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-indigo-800">Smart Recommendations</h4>
                  <p className="text-indigo-600">AI-powered cultivation insights</p>
                </div>
              </div>
              <div className="grid gap-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="flex-1 leading-relaxed text-indigo-800 font-medium">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Crop Conditions Guide Button */}
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-lg">
                {showGuide ? 'Hide Guide' : 'Crop Guide'}
              </span>
              <svg 
                className={`w-5 h-5 text-white transition-transform duration-300 ${showGuide ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Learn More Button */}
            <button
              onClick={() => {
                const searchQuery = cropInfo ? cropInfo.name : predicted_crop;
                window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' cultivation farming guide')}`, '_blank');
              }}
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg">Learn More</span>
              <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>

          {/* Crop Conditions Guide Display */}
          {showGuide && (
            <div className="mb-8 animate-fadeIn">
              <CropConditionsGuide cropName={predicted_crop} />
            </div>
          )}

          {/* Expert Notice */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-amber-800 mb-2 text-lg">Professional Consultation Recommended</h5>
                <p className="text-amber-700 leading-relaxed">
                  This AI-powered recommendation is based on advanced analysis of your soil and environmental data. 
                  For optimal results, please consult with local agricultural experts and consider regional farming practices, 
                  market conditions, and seasonal variations before implementing these suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;