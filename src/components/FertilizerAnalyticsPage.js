import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const FertilizerAnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedField, setSelectedField] = useState('all');

  // Mock data for analytics
  const costData = {
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      costs: [1250, 980, 1450, 1680, 2100, 2450, 2200, 1980, 1750, 1920, 1650, 1380],
      applications: [8, 6, 9, 11, 14, 16, 15, 13, 12, 13, 11, 9]
    },
    quarterly: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      costs: [3680, 6230, 5930, 4950],
      applications: [23, 41, 40, 33]
    },
    yearly: {
      labels: ['2022', '2023', '2024'],
      costs: [18500, 22100, 20790],
      applications: [125, 148, 137]
    }
  };

  const efficiencyMetrics = {
    costPerHectare: 425.60,
    costPerApplication: 152.80,
    averageYield: 8.5,
    costPerTon: 50.12,
    roi: 340,
    fertilizer_efficiency: 87
  };

  const fertilizerCostBreakdown = [
    { name: 'NPK 10-10-10', cost: 6240, percentage: 30, applications: 45, efficiency: 92 },
    { name: 'Organic Compost', cost: 4320, percentage: 21, applications: 28, efficiency: 88 },
    { name: 'Phosphorus Booster', cost: 3680, percentage: 18, applications: 32, efficiency: 85 },
    { name: 'Liquid Kelp Extract', cost: 2890, percentage: 14, applications: 22, efficiency: 90 },
    { name: 'Nitrogen Booster', cost: 2100, percentage: 10, applications: 15, efficiency: 86 },
    { name: 'Micronutrient Mix', cost: 1450, percentage: 7, applications: 12, efficiency: 89 }
  ];

  const fieldPerformance = [
    { 
      id: 1, 
      name: 'Field A - North', 
      size: 5.2, 
      totalCost: 2810, 
      costPerHa: 540.38, 
      applications: 18, 
      yield: 9.2, 
      roi: 380,
      efficiency: 94,
      trend: 'up'
    },
    { 
      id: 2, 
      name: 'Field B - South', 
      size: 3.8, 
      totalCost: 1920, 
      costPerHa: 505.26, 
      applications: 14, 
      yield: 8.8, 
      roi: 350,
      efficiency: 88,
      trend: 'stable'
    },
    { 
      id: 3, 
      name: 'Field C - East', 
      size: 4.5, 
      totalCost: 2340, 
      costPerHa: 520.00, 
      applications: 16, 
      yield: 8.1, 
      roi: 315,
      efficiency: 82,
      trend: 'down'
    },
    { 
      id: 4, 
      name: 'Field D - West', 
      size: 6.1, 
      totalCost: 3280, 
      costPerHa: 537.70, 
      applications: 22, 
      yield: 8.9, 
      roi: 365,
      efficiency: 90,
      trend: 'up'
    }
  ];

  const bulkPurchaseAnalysis = [
    {
      fertilizer: 'NPK 10-10-10',
      currentPrice: 25.50,
      bulkPrice: 22.95,
      savings: 2.55,
      minQuantity: 100,
      currentStock: 45,
      recommendedOrder: 120,
      potentialSavings: 306
    },
    {
      fertilizer: 'Organic Compost',
      currentPrice: 35.00,
      bulkPrice: 31.50,
      savings: 3.50,
      minQuantity: 50,
      currentStock: 12,
      recommendedOrder: 60,
      potentialSavings: 210
    },
    {
      fertilizer: 'Phosphorus Booster',
      currentPrice: 42.00,
      bulkPrice: 37.80,
      savings: 4.20,
      minQuantity: 75,
      currentStock: 8,
      recommendedOrder: 80,
      potentialSavings: 336
    }
  ];

  const seasonalTrends = {
    spring: { cost: 6850, efficiency: 92, applications: 38 },
    summer: { cost: 7200, efficiency: 88, applications: 42 },
    autumn: { cost: 4100, efficiency: 85, applications: 28 },
    winter: { cost: 2640, efficiency: 82, applications: 18 }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        );
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return 'text-green-600 bg-green-100';
    if (efficiency >= 80) return 'text-blue-600 bg-blue-100';
    if (efficiency >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/fertilizers" className="hover:text-purple-600">Fertilizer Management</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Cost Analytics</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Cost Analytics
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Comprehensive analysis of fertilizer costs, efficiency, and optimization opportunities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="monthly">Monthly View</option>
              <option value="quarterly">Quarterly View</option>
              <option value="yearly">Yearly View</option>
            </select>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{efficiencyMetrics.costPerHectare}</div>
            <div className="text-sm text-gray-600">Cost per Hectare</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{efficiencyMetrics.costPerApplication}</div>
            <div className="text-sm text-gray-600">Cost per Application</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{efficiencyMetrics.averageYield}</div>
            <div className="text-sm text-gray-600">Avg Yield (tons/ha)</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{efficiencyMetrics.costPerTon}</div>
            <div className="text-sm text-gray-600">Cost per Ton</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{efficiencyMetrics.roi}%</div>
            <div className="text-sm text-gray-600">Return on Investment</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{efficiencyMetrics.fertilizer_efficiency}%</div>
            <div className="text-sm text-gray-600">Efficiency Score</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cost Overview
            </button>
            <button
              onClick={() => setActiveTab('fertilizer')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'fertilizer'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fertilizer Breakdown
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'fields'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Field Performance
            </button>
            <button
              onClick={() => setActiveTab('optimization')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'optimization'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Optimization
            </button>
          </div>

          {/* Cost Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Cost Trend Chart Placeholder */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Cost Trends
                </h3>
                <div className="grid grid-cols-12 gap-2 h-64 items-end">
                  {costData[selectedPeriod].costs.map((cost, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-gradient-to-t from-purple-500 to-purple-300 rounded-t w-full mb-2 flex items-end justify-center"
                        style={{ height: `${(cost / Math.max(...costData[selectedPeriod].costs)) * 200}px` }}
                      >
                        <span className="text-xs text-white font-medium mb-1">${cost}</span>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {costData[selectedPeriod].labels[index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasonal Analysis */}
              <div className="grid md:grid-cols-4 gap-6">
                {Object.entries(seasonalTrends).map(([season, data]) => (
                  <div key={season} className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{season}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Cost:</span>
                        <span className="font-medium text-gray-900">₹{data.cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applications:</span>
                        <span className="font-medium text-gray-900">{data.applications}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Efficiency:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getEfficiencyColor(data.efficiency)}`}>
                          {data.efficiency}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fertilizer Breakdown Tab */}
          {activeTab === 'fertilizer' && (
            <div className="space-y-6">
              <div className="grid gap-4">
                {fertilizerCostBreakdown.map((fertilizer, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{fertilizer.name}</h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-purple-600">₹{fertilizer.cost}</span>
                        <span className="text-gray-600">({fertilizer.percentage}%)</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                        style={{ width: `${fertilizer.percentage}%` }}
                      ></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Applications:</span>
                        <div className="font-medium text-gray-900">{fertilizer.applications}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Cost/Application:</span>
                        <div className="font-medium text-gray-900">₹{(fertilizer.cost / fertilizer.applications).toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Efficiency:</span>
                        <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getEfficiencyColor(fertilizer.efficiency)}`}>
                          {fertilizer.efficiency}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Field Performance Tab */}
          {activeTab === 'fields' && (
            <div className="space-y-6">
              <div className="grid gap-6">
                {fieldPerformance.map((field) => (
                  <div key={field.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{field.name}</h3>
                        <p className="text-gray-600">{field.size} hectares</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(field.trend)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEfficiencyColor(field.efficiency)}`}>
                          {field.efficiency}% efficiency
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-6 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">₹{field.totalCost}</div>
                        <div className="text-sm text-gray-600">Total Cost</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">₹{field.costPerHa}</div>
                        <div className="text-sm text-gray-600">Cost/Hectare</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{field.applications}</div>
                        <div className="text-sm text-gray-600">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{field.yield}</div>
                        <div className="text-sm text-gray-600">Yield (t/ha)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{field.roi}%</div>
                        <div className="text-sm text-gray-600">ROI</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">₹{(field.totalCost / field.yield / field.size).toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Cost/Ton</div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link 
                        to={`/fertilizers/field-analytics/${field.id}`}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                      >
                        Detailed Analysis
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimization Tab */}
          {activeTab === 'optimization' && (
            <div className="space-y-8">
              {/* Bulk Purchase Analysis */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Bulk Purchase Opportunities</h3>
                <div className="grid gap-6">
                  {bulkPurchaseAnalysis.map((item, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-green-900">{item.fertilizer}</h4>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${item.potentialSavings}</div>
                          <div className="text-sm text-green-700">Potential Savings</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium text-green-700">Current Price</div>
                          <div className="text-green-900">${item.currentPrice}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-green-700">Bulk Price</div>
                          <div className="text-green-900">${item.bulkPrice}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-green-700">Savings/Unit</div>
                          <div className="text-green-900">${item.savings}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-green-700">Min Quantity</div>
                          <div className="text-green-900">{item.minQuantity} units</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-green-700">Current Stock</div>
                          <div className="text-green-900">{item.currentStock} units</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-green-700">Recommended order: </span>
                          <span className="font-medium text-green-900">{item.recommendedOrder} units</span>
                        </div>
                        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                          Create Purchase Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimization Recommendations */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Optimization Recommendations</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900">Application Timing</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>• Schedule NPK applications 2 weeks before planting for optimal uptake</li>
                      <li>• Apply organic compost in early spring for best soil conditioning</li>
                      <li>• Avoid applications 24 hours before expected rain</li>
                      <li>• Consider split applications for nitrogen-heavy fertilizers</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-yellow-900">Cost Reduction</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-yellow-800">
                      <li>• Switch to bulk purchasing to save $852 annually</li>
                      <li>• Reduce Field C applications by 15% based on soil tests</li>
                      <li>• Consider organic alternatives for 20% cost reduction</li>
                      <li>• Implement precision application to reduce waste by 12%</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-purple-900">Efficiency Improvements</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-purple-800">
                      <li>• Field C shows 18% below average efficiency - investigate soil conditions</li>
                      <li>• Increase micronutrient applications in sandy soils</li>
                      <li>• Consider soil pH adjustment in Field B for better uptake</li>
                      <li>• Monitor weather patterns for optimal application windows</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-green-900">Sustainability</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li>• Increase organic matter applications by 25% for soil health</li>
                      <li>• Implement cover crops to reduce nitrogen requirements</li>
                      <li>• Consider precision agriculture for targeted applications</li>
                      <li>• Track carbon footprint and optimize for environmental impact</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FertilizerAnalyticsPage;