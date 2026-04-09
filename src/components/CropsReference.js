import React, { useState } from 'react';
import { getAllCrops } from '../data/cropData';
import CropComparisonCharts from './CropComparisonCharts';

const CropsReference = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'charts'
  const allCrops = getAllCrops();

  // Categorize crops
  const categories = {
    'all': 'All Crops',
    'cereals': 'Cereals & Grains',
    'legumes': 'Legumes & Pulses',
    'fruits': 'Fruits',
    'cash': 'Cash Crops',
    'fiber': 'Fiber Crops'
  };

  const getCropCategory = (cropKey) => {
    if (['rice', 'wheat', 'maize'].includes(cropKey)) return 'cereals';
    if (['lentil', 'chickpea', 'kidneybeans', 'pigeonpeas', 'blackgram', 'mothbeans', 'mungbean'].includes(cropKey)) return 'legumes';
    if (['apple', 'orange', 'papaya', 'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 'pomegranate'].includes(cropKey)) return 'fruits';
    if (['cotton', 'jute', 'coconut'].includes(cropKey)) return 'fiber';
    if (['coffee', 'sugarcane'].includes(cropKey)) return 'cash';
    return 'other';
  };

  const filteredCrops = allCrops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || getCropCategory(crop.key) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-3 tracking-tight">
                  Intelligence <span className="text-emerald-300">Hub</span>
                </h2>
                <p className="text-emerald-100 text-base sm:text-xl font-medium max-w-xl">
                  Advanced cultivation insights and optimized agricultural data recommendations.
                </p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right text-white/90">
                <div className="text-4xl font-black">{allCrops.length}</div>
                <div className="text-sm font-bold uppercase tracking-wider">Varieties</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-8 border-b border-gray-200/50">
          {/* View Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 border border-gray-300 rounded-2xl p-1.5 shadow-lg">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Crop Gallery
                </button>
                <button
                  onClick={() => setViewMode('charts')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    viewMode === 'charts'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Filters (only show in grid mode) */}
          {viewMode === 'grid' && (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search crops, descriptions, or conditions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 text-gray-700 placeholder-gray-500 shadow-lg"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-72">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-6 py-4 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-300 text-gray-700 shadow-lg cursor-pointer"
                >
                  {Object.entries(categories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {viewMode === 'charts' ? (
            <CropComparisonCharts />
          ) : (
            <>
              {filteredCrops.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-300">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.75A7.5 7.5 0 717.5 14.25v.233a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V12A7.5 7.5 0 0115 6.75z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">No crops found</h3>
                  <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredCrops.map((crop) => (
                    <div key={crop.key} className="group bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-gray-300 transition-all duration-500 transform hover:-translate-y-2">
                      {/* Crop Image */}
                      <div className="h-56 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 relative overflow-hidden">
                        <img 
                          src={crop.image} 
                          alt={crop.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hidden items-center justify-center">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-lg">
                          <span className="text-sm font-semibold text-emerald-700 capitalize">
                            {categories[getCropCategory(crop.key)] || 'Other'}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Crop Info */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">{crop.name}</h3>
                        <p className="text-gray-600 leading-relaxed mb-5 line-clamp-3">
                          {crop.description}
                        </p>

                        {/* Quick Stats */}
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Temperature:</span>
                            <span className="font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-sm">{crop.conditions.temperature}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Season:</span>
                            <span className="font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-sm">{crop.conditions.season.split('(')[0].trim()}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button 
                          onClick={() => {
                            // You can add navigation logic here
                            console.log(`View details for ${crop.name}`);
                          }}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                        >
                          <span>Explore Details</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropsReference;