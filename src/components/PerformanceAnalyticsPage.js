import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import seedsService from '../services/seedsService';

const PerformanceAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [fieldPerformance, setFieldPerformance] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('roi');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [analyticsData, fields] = await Promise.all([
        seedsService.getPerformanceAnalytics(),
        seedsService.getAllFields()
      ]);
      
      setAnalytics(analyticsData);

      // Load field performance data
      const fieldPromises = fields.map(field => 
        seedsService.calculateFieldPerformance(field.id)
      );
      const fieldResults = await Promise.all(fieldPromises);
      
      const fieldPerf = fields.map((field, index) => ({
        ...field,
        performance: fieldResults[index]
      }));
      
      setFieldPerformance(fieldPerf);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopPerformers = () => {
    if (!analytics) return [];
    return analytics.seedVarietyROI
      .filter(variety => variety.roi > 0)
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 5);
  };

  const getWorstPerformers = () => {
    if (!analytics) return [];
    return analytics.seedVarietyROI
      .filter(variety => variety.roi > 0)
      .sort((a, b) => a.roi - b.roi)
      .slice(0, 3);
  };

  const getTotalInvestment = () => {
    if (!analytics) return 0;
    return analytics.seedVarietyROI.reduce((sum, variety) => sum + variety.totalInvestment, 0);
  };

  const getTotalRevenue = () => {
    if (!analytics) return 0;
    return analytics.seedVarietyROI.reduce((sum, variety) => sum + variety.totalRevenue, 0);
  };

  const getAverageROI = () => {
    if (!analytics) return 0;
    const validVarieties = analytics.seedVarietyROI.filter(v => v.roi > 0);
    if (validVarieties.length === 0) return 0;
    return validVarieties.reduce((sum, variety) => sum + variety.roi, 0) / validVarieties.length;
  };

  const getSuccessRate = () => {
    if (!analytics) return 0;
    const validVarieties = analytics.seedVarietyROI.filter(v => v.successRate > 0);
    if (validVarieties.length === 0) return 0;
    return validVarieties.reduce((sum, variety) => sum + variety.successRate, 0) / validVarieties.length;
  };

  const getROIColor = (roi) => {
    if (roi >= 200) return 'text-green-600';
    if (roi >= 100) return 'text-blue-600';
    if (roi >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROIBadge = (roi) => {
    if (roi >= 200) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (roi >= 100) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (roi >= 50) return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Poor', color: 'bg-red-100 text-red-800' };
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
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Please wait while we load your performance analytics...
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
      <div className="container mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <Link
              to="/seeds"
              className="group w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-800 group-hover:-translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-gray-600 bg-clip-text text-transparent">
                  Performance Analytics
                </h1>
              </div>
              <p className="text-lg text-gray-600 ml-14">Advanced ROI analysis, yield optimization, and predictive insights</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={selectedTimeFrame}
                onChange={(e) => setSelectedTimeFrame(e.target.value)}
                className="appearance-none px-6 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-gray-700 bg-white cursor-pointer font-medium"
              >
                <option value="all">All Time</option>
                <option value="1year">Last Year</option>
                <option value="6months">Last 6 Months</option>
                <option value="3months">Last 3 Months</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">₹{(getTotalRevenue() / 100000).toFixed(1)}L</p>
                <p className="text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{getAverageROI().toFixed(1)}%</p>
                <p className="text-gray-600">Average ROI</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{getSuccessRate().toFixed(1)}%</p>
                <p className="text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💹</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">₹{((getTotalRevenue() - getTotalInvestment()) / 100000).toFixed(1)}L</p>
                <p className="text-gray-600">Net Profit</p>
              </div>
            </div>
          </div>
        </div>

        {/* ROI by Seed Variety */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">ROI by Seed Variety</h2>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="roi">ROI %</option>
              <option value="revenue">Total Revenue</option>
              <option value="profit">Net Profit</option>
              <option value="yield">Average Yield</option>
            </select>
          </div>

          <div className="space-y-4">
            {analytics?.seedVarietyROI?.map((variety, index) => {
              const roiBadge = getROIBadge(variety.roi);
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{variety.variety}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${roiBadge.color}`}>
                          {roiBadge.label}
                        </span>
                        {variety.status && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {variety.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getROIColor(variety.roi)}`}>
                        {variety.roi.toFixed(1)}% ROI
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Investment:</span>
                      <p className="font-medium text-gray-800">₹{variety.totalInvestment.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Revenue:</span>
                      <p className="font-medium text-green-600">₹{variety.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Net Profit:</span>
                      <p className="font-medium text-blue-600">
                        ₹{(variety.totalRevenue - variety.totalInvestment).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Success Rate:</span>
                      <p className="font-medium text-purple-600">{variety.successRate}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg. Yield:</span>
                      <p className="font-medium text-orange-600">{variety.averageYield} Q/acre</p>
                    </div>
                  </div>

                  {/* ROI Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">ROI Progress</span>
                      <span className="text-xs text-gray-600">{variety.roi.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          variety.roi >= 200 ? 'bg-green-500' :
                          variety.roi >= 100 ? 'bg-blue-500' :
                          variety.roi >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(variety.roi / 2, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top and Worst Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🏆</span>
              <h2 className="text-xl font-bold text-gray-800">Top Performers</h2>
            </div>
            <div className="space-y-4">
              {getTopPerformers().map((variety, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                  <div>
                    <p className="font-semibold text-gray-800">{variety.variety}</p>
                    <p className="text-sm text-gray-600">
                      Investment: ₹{variety.totalInvestment.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{variety.roi.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Opportunities */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl font-bold text-gray-800">Improvement Opportunities</h2>
            </div>
            <div className="space-y-4">
              {getWorstPerformers().map((variety, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-gray-800">{variety.variety}</p>
                    <p className="text-sm text-gray-600">
                      Success Rate: {variety.successRate}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{variety.roi.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Activity Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {analytics?.monthlyTrends?.map((month, index) => (
              <div key={index} className="text-center">
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-20 flex flex-col justify-end overflow-hidden">
                    <div 
                      className="bg-green-500 rounded-full transition-all duration-500"
                      style={{ 
                        height: `${Math.max((month.planting / Math.max(...analytics.monthlyTrends.map(m => m.planting))) * 100, 5)}%` 
                      }}
                    />
                    <div 
                      className="bg-orange-500 rounded-full transition-all duration-500"
                      style={{ 
                        height: `${Math.max((month.harvesting / Math.max(...analytics.monthlyTrends.map(m => m.harvesting))) * 100, 5)}%` 
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-700">{month.month}</p>
                <p className="text-xs text-gray-500">P: {month.planting}</p>
                <p className="text-xs text-gray-500">H: {month.harvesting}</p>
                <p className="text-xs text-gray-500">₹{(month.revenue / 1000).toFixed(0)}k</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-600">Planting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span className="text-gray-600">Harvesting</span>
            </div>
          </div>
        </div>

        {/* Field Performance Comparison */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Field Performance Comparison</h2>
          <div className="space-y-4">
            {fieldPerformance.map((field, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{field.name}</h3>
                    <p className="text-sm text-gray-600">{field.area} {field.unit} • {field.soilType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {field.performance.averageROI > 0 ? `${field.performance.averageROI}%` : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Average ROI</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Revenue:</span>
                    <p className="font-medium text-green-600">₹{field.performance.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Cost:</span>
                    <p className="font-medium text-red-600">₹{field.performance.totalCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Net Profit:</span>
                    <p className="font-medium text-blue-600">₹{field.performance.totalProfit.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Harvests:</span>
                    <p className="font-medium text-gray-800">{field.performance.totalHarvests}</p>
                  </div>
                </div>

                {field.performance.totalRevenue > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((field.performance.averageROI / Math.max(...fieldPerformance.map(f => f.performance.averageROI))) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💡</span>
            <h2 className="text-2xl font-bold text-gray-800">Insights & Recommendations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Key Insights</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">📈</span>
                  <div>
                    <p className="font-medium text-blue-800">Best ROI Crop</p>
                    <p className="text-blue-700 text-sm">
                      {getTopPerformers()[0]?.variety} shows the highest ROI at {getTopPerformers()[0]?.roi?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">🎯</span>
                  <div>
                    <p className="font-medium text-green-800">Success Rate</p>
                    <p className="text-green-700 text-sm">
                      Overall success rate of {getSuccessRate().toFixed(1)}% indicates good farming practices
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-orange-600 text-xl">⚠️</span>
                  <div>
                    <p className="font-medium text-orange-800">Areas for Improvement</p>
                    <p className="text-orange-700 text-sm">
                      Focus on improving yields for {getWorstPerformers()[0]?.variety} variety
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Recommendations</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-green-600">✓</span>
                  <p className="text-sm text-gray-700">
                    Increase allocation for high-ROI varieties like {getTopPerformers()[0]?.variety}
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-blue-600">📊</span>
                  <p className="text-sm text-gray-700">
                    Monitor seasonal patterns to optimize planting schedules
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-purple-600">🔄</span>
                  <p className="text-sm text-gray-700">
                    Consider crop rotation to improve soil health and yields
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-orange-600">💡</span>
                  <p className="text-sm text-gray-700">
                    Invest in quality seeds and proper storage for better returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsPage;