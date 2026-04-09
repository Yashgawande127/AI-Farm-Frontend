import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import seedsService from '../services/seedsService';

const SeedCatalogPage = () => {
  const [loading, setLoading] = useState(true);
  const [seedVarieties, setSeedVarieties] = useState([]);
  const [filteredSeeds, setFilteredSeeds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAddForm, setShowAddForm] = useState(false);
  const [qualityReport, setQualityReport] = useState(null);
  const [costAnalysis, setCostAnalysis] = useState(null);

  useEffect(() => {
    loadSeedData();
  }, []);

  useEffect(() => {
    filterAndSortSeeds();
  }, [seedVarieties, searchTerm, categoryFilter, sortBy]);

  const loadSeedData = async () => {
    try {
      setLoading(true);
      const [varieties, quality, cost] = await Promise.all([
        seedsService.getAllSeedVarieties(),
        seedsService.getQualityReport(),
        seedsService.getCostAnalysis()
      ]);
      
      setSeedVarieties(varieties);
      setQualityReport(quality);
      setCostAnalysis(cost);
    } catch (error) {
      console.error('Error loading seed data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSeeds = () => {
    let filtered = [...seedVarieties];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(seed =>
        seed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seed.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seed.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seed.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(seed => seed.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'price':
          return a.costInfo.pricePerKg - b.costInfo.pricePerKg;
        case 'germination':
          return b.qualityInfo.germinationRate - a.qualityInfo.germinationRate;
        case 'yield':
          return parseFloat(b.characteristics.yieldPerAcre) - parseFloat(a.characteristics.yieldPerAcre);
        default:
          return 0;
      }
    });

    setFilteredSeeds(filtered);
  };

  const getUniqueCategories = () => {
    return [...new Set(seedVarieties.map(seed => seed.category))];
  };

  const getQualityBadge = (germinationRate) => {
    if (germinationRate >= 95) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (germinationRate >= 90) return { label: 'Very Good', color: 'bg-blue-100 text-blue-800' };
    if (germinationRate >= 85) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Fair', color: 'bg-red-100 text-red-800' };
  };

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    return expiry <= sixMonthsFromNow;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
        <Header />
        <div className="container mx-auto px-6 py-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex justify-center items-center min-h-64 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg mx-auto text-center">
                <div className="mb-8">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Seed Catalog</h3>
                <p className="text-gray-600 leading-relaxed">
                  Please wait while we load the seed catalog...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <Link
              to="/seeds"
              className="group w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-gray-800 group-hover:-translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-slate-800 to-gray-600 bg-clip-text text-transparent">
                  Seed Catalog
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-600">Comprehensive varieties with quality requirements</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="group w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-bold">Add New Variety</span>
          </button>
        </div>

        {/* Quality & Cost Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-12">
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{qualityReport?.averageGerminationRate}%</p>
                <p className="text-gray-600 font-medium">Avg. Germination Rate</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{qualityReport?.averagePurity}%</p>
                <p className="text-gray-600 font-medium">Avg. Purity</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">₹{costAnalysis?.averageCostPerKg}</p>
                <p className="text-gray-600 font-medium">Avg. Cost/Kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {qualityReport?.qualityAlert && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-amber-800 text-lg mb-1">Quality Alert</h3>
                <p className="text-amber-700 leading-relaxed">{qualityReport.qualityAlert}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Search & Filter</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search seeds by name, variety, category, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none px-6 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-700 bg-white cursor-pointer"
              >
                <option value="all">All Categories</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-6 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-gray-700 bg-white cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
                <option value="price">Sort by Price</option>
                <option value="germination">Sort by Germination Rate</option>
                <option value="yield">Sort by Yield</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Seeds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSeeds.map((seed) => {
            const qualityBadge = getQualityBadge(seed.qualityInfo.germinationRate);
            const expiringSoon = isExpiringSoon(seed.qualityInfo.expiryDate);
            
            return (
              <div
                key={seed.id}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedSeed(seed)}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-900 to-transparent rounded-full -mr-16 -mt-16"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                          {seed.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 font-medium mb-1">{seed.variety}</p>
                      <p className="text-sm text-gray-500">{seed.supplier}</p>
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-xl ${qualityBadge.color}`}>
                      {qualityBadge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Category</p>
                      <p className="font-semibold text-slate-800">{seed.category}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Maturity</p>
                      <p className="font-semibold text-slate-800">{seed.characteristics.maturityDays} days</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Yield/Acre</p>
                      <p className="font-semibold text-slate-800">{seed.characteristics.yieldPerAcre}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Germination</p>
                      <p className="font-semibold text-slate-800">{seed.qualityInfo.germinationRate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-t border-gray-100 mb-4">
                    <div>
                      <p className="text-2xl font-bold text-slate-800">₹{seed.costInfo.pricePerKg}</p>
                      <p className="text-sm text-gray-500">per kg</p>
                      {seed.costInfo.bulkDiscountAvailable && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs text-emerald-600 font-medium">Bulk discount available</span>
                        </div>
                      )}
                    </div>
                    {expiringSoon && (
                      <div className="bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                        <span className="text-xs font-bold text-red-700">Expiring Soon</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Planting Seasons:</p>
                    <div className="flex flex-wrap gap-2">
                      {seed.seasonalInfo.plantingSeasons.map((season) => (
                        <span key={season} className="px-3 py-1.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200">
                          {season}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSeeds.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No seed varieties found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search terms or filters to find what you're looking for</p>
          </div>
        )}

        {/* Seed Detail Modal */}
        {selectedSeed && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-8 flex items-center justify-between rounded-t-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">{selectedSeed.name}</h2>
                    <p className="text-gray-600">{selectedSeed.variety}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSeed(null)}
                  className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all duration-200 group"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Basic Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Variety:</span>
                        <span className="font-medium">{selectedSeed.variety}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedSeed.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Supplier:</span>
                        <span className="font-medium">{selectedSeed.supplier}</span>
                      </div>
                    </div>
                  </div>

                  {/* Characteristics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Characteristics
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maturity Days:</span>
                        <span className="font-medium">{selectedSeed.characteristics.maturityDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Yield/Acre:</span>
                        <span className="font-medium">{selectedSeed.characteristics.yieldPerAcre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Planting Depth:</span>
                        <span className="font-medium">{selectedSeed.characteristics.plantingDepth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spacing:</span>
                        <span className="font-medium">{selectedSeed.characteristics.spacing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Water Requirement:</span>
                        <span className="font-medium">{selectedSeed.characteristics.waterRequirement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Soil Type:</span>
                        <span className="font-medium">{selectedSeed.characteristics.soilType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Growing Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Growing Requirements
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temperature:</span>
                        <span className="font-medium">{selectedSeed.growingRequirements.temperature}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rainfall:</span>
                        <span className="font-medium">{selectedSeed.growingRequirements.rainfall}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Humidity:</span>
                        <span className="font-medium">{selectedSeed.growingRequirements.humidity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunlight:</span>
                        <span className="font-medium">{selectedSeed.growingRequirements.sunlight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">pH Range:</span>
                        <span className="font-medium">{selectedSeed.growingRequirements.pH}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quality Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Quality Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Germination Rate:</span>
                        <span className="font-medium">{selectedSeed.qualityInfo.germinationRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purity:</span>
                        <span className="font-medium">{selectedSeed.qualityInfo.purity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Batch Number:</span>
                        <span className="font-medium">{selectedSeed.qualityInfo.batchNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Test Date:</span>
                        <span className="font-medium">{new Date(selectedSeed.qualityInfo.testDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expiry Date:</span>
                        <span className={`font-medium ${isExpiringSoon(selectedSeed.qualityInfo.expiryDate) ? 'text-red-600' : ''}`}>
                          {new Date(selectedSeed.qualityInfo.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Cost Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per Kg:</span>
                        <span className="font-medium">₹{selectedSeed.costInfo.pricePerKg}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Purchase:</span>
                        <span className="font-medium">{new Date(selectedSeed.costInfo.lastPurchaseDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity Purchased:</span>
                        <span className="font-medium">{selectedSeed.costInfo.quantityPurchased} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Cost:</span>
                        <span className="font-medium">₹{selectedSeed.costInfo.totalCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bulk Discount:</span>
                        <span className={`font-medium ${selectedSeed.costInfo.bulkDiscountAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedSeed.costInfo.bulkDiscountAvailable ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seasonal Information */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Seasonal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Planting Seasons:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeed.seasonalInfo.plantingSeasons.map((season) => (
                            <span key={season} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                              {season}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Best Planting Months:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeed.seasonalInfo.bestMonths.map((month) => (
                            <span key={month} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                              {month}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Harvest Months:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeed.seasonalInfo.harvestMonths.map((month) => (
                            <span key={month} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                              {month}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedCatalogPage;