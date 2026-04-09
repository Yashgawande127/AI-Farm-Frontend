import React, { useState, useEffect } from 'react';
import Header from './Header';
import AdvancedAnalytics from './AdvancedAnalytics';
import MobileDashboard from './MobileDashboard';
import apiService from '../services/apiService';
import weatherService from '../services/weatherService';
import marketDataService from '../services/marketDataService';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    financial: {
      currentBalance: 10375000, // ₹1,03,75,000 (125000 USD * 83)
      monthlyIncome: 3735000,   // ₹37,35,000 (45000 USD * 83)
      monthlyExpenses: 2656000, // ₹26,56,000 (32000 USD * 83)
      profitMargin: 28.9
    },
    inventory: {
      seeds: { level: 85, status: 'sufficient' },
      fertilizers: { level: 23, status: 'critical' },
      machinery: { level: 67, status: 'sufficient' },
      fuel: { level: 45, status: 'low' }
    },
    weather: {
      temperature: 24,
      humidity: 65,
      rainfall: 12,
      forecast: 'Sunny with chance of light rain',
      advisories: []
    },
    marketPrices: {
      wheat: 203.35,      // ₹203.35 per kg (2.45 USD * 83)
      rice: 156.87,       // ₹156.87 per kg (1.89 USD * 83)
      corn: 146.08,       // ₹146.08 per kg (1.76 USD * 83)
      fertilizer: 3784.80, // ₹3,784.80 per kg (45.60 USD * 83)
      machineryRental: 12450 // ₹12,450 per day (150 USD * 83)
    },
    activities: [
      { id: 1, type: 'planting', crop: 'Wheat', area: '25 acres', date: '2025-11-01', status: 'completed' },
      { id: 2, type: 'fertilizer', amount: '500kg', crop: 'Rice', date: '2025-11-02', status: 'in-progress' },
      { id: 3, type: 'maintenance', equipment: 'Tractor XL-200', date: '2025-11-03', status: 'scheduled' }
    ]
  });
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [marketAnalysis, setMarketAnalysis] = useState({});

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [activityFilter, setActivityFilter] = useState('all');

  // Sample data for charts (converted to Indian Rupees)
  const monthlyFinancials = [
    { month: 'Jan', income: 3486000, expenses: 2324000, profit: 1162000 },
    { month: 'Feb', income: 3154000, expenses: 2490000, profit: 664000 },
    { month: 'Mar', income: 3735000, expenses: 2656000, profit: 1079000 },
    { month: 'Apr', income: 4316000, expenses: 2905000, profit: 1411000 },
    { month: 'May', income: 3984000, expenses: 2739000, profit: 1245000 },
    { month: 'Jun', income: 3735000, expenses: 2656000, profit: 1079000 }
  ];

  const cropYieldData = [
    { crop: 'Wheat', current: 85, predicted: 92, lastYear: 78 },
    { crop: 'Rice', current: 78, predicted: 85, lastYear: 82 },
    { crop: 'Corn', current: 92, predicted: 88, lastYear: 85 },
    { crop: 'Barley', current: 76, predicted: 82, lastYear: 79 }
  ];

  const expenseBreakdown = [
    { name: 'Seeds', value: 35, color: '#10B981' },
    { name: 'Fertilizers', value: 28, color: '#3B82F6' },
    { name: 'Machinery', value: 20, color: '#F59E0B' },
    { name: 'Labor', value: 12, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#8B5CF6' }
  ];

  const seasonalComparison = [
    { season: '2023', yield: 78, profit: 10375000, efficiency: 72 },
    { season: '2024', yield: 85, profit: 12035000, efficiency: 78 },
    { season: '2025 (Est)', yield: 92, profit: 13695000, efficiency: 84 }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch weather data
        const [currentWeather, forecast] = await Promise.all([
          weatherService.getCurrentWeather(),
          weatherService.getWeatherForecast()
        ]);
        
        const advisories = weatherService.getAgriculturalAdvisory(currentWeather, forecast);
        
        // Fetch market data
        const [cropPrices, fertilizerPrices, machineryRates] = await Promise.all([
          marketDataService.getCropPrices(),
          marketDataService.getFertilizerPrices(),
          marketDataService.getMachineryRates()
        ]);
        
        // Get market analysis for wheat (example)
        const analysis = await marketDataService.getMarketAnalysis('wheat');
        
        setDashboardData(prev => ({
          ...prev,
          weather: {
            ...currentWeather,
            advisories
          },
          marketPrices: {
            ...cropPrices,
            fertilizer: fertilizerPrices.nitrogen,
            machineryRental: machineryRates.tractor_large
          }
        }));
        
        setWeatherForecast(forecast);
        setMarketAnalysis(analysis);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use mock data on error
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes for real-time data
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'sufficient': return 'text-green-600 bg-green-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'planting': return '🌱';
      case 'fertilizer': return '🧪';
      case 'maintenance': return '🔧';
      case 'harvest': return '🌾';
      default: return '📋';
    }
  };

  const exportData = (format, section = 'all') => {
    const data = {
      financial: dashboardData.financial,
      inventory: dashboardData.inventory,
      weather: dashboardData.weather,
      marketPrices: dashboardData.marketPrices,
      marketAnalysis: marketAnalysis,
      weatherForecast: weatherForecast,
      exportDate: new Date().toISOString(),
      timeframe: selectedTimeframe
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `farm-dashboard-${section}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } else if (format === 'csv') {
      let csv = 'Category,Metric,Value,Unit\n';
      csv += `Financial,Current Balance,${data.financial.currentBalance},INR\n`;
      csv += `Financial,Monthly Income,${data.financial.monthlyIncome},INR\n`;
      csv += `Financial,Monthly Expenses,${data.financial.monthlyExpenses},INR\n`;
      csv += `Financial,Profit Margin,${data.financial.profitMargin},%\n`;
      
      Object.entries(data.inventory).forEach(([key, value]) => {
        csv += `Inventory,${key},${value.level},%\n`;
        csv += `Inventory,${key} Status,${value.status},status\n`;
      });
      
      csv += `Weather,Temperature,${data.weather.temperature},°C\n`;
      csv += `Weather,Humidity,${data.weather.humidity},%\n`;
      csv += `Weather,Description,${data.weather.description},text\n`;
      
      Object.entries(data.marketPrices).forEach(([key, value]) => {
        if (typeof value === 'number') {
          csv += `Market,${key},${value.toFixed(2)},INR\n`;
        }
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `farm-dashboard-${section}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header />
        <div className="flex justify-center items-center min-h-64 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg mx-auto text-center">
            <div className="mb-8">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Dashboard</h3>
            <p className="text-gray-600 leading-relaxed">
              Please wait while we load your dashboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Mobile Dashboard */}
        <div className="lg:hidden mb-8">
          <MobileDashboard 
            dashboardData={dashboardData}
            weatherForecast={weatherForecast}
            marketAnalysis={marketAnalysis}
          />
        </div>

        {/* Desktop Dashboard Header */}
        <div className="hidden lg:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Farm Dashboard</h1>
            <p className="text-gray-600">Real-time insights and analytics for your farm operations</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 shadow-sm text-sm font-medium"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            
            <div className="relative">
              <button
                onClick={() => document.getElementById('export-menu').classList.toggle('hidden')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Export Data ↓
              </button>
              <div id="export-menu" className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <button
                  onClick={() => exportData('json')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => exportData('csv')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden lg:flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'financial', label: 'Financial', icon: '💰' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'inventory', label: 'Inventory', icon: '📦' },
            { id: 'activities', label: 'Activities', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Desktop Dashboard Content */}
        <div className="hidden lg:block">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Current Balance</h3>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  ₹{dashboardData.financial.currentBalance.toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-green-600 mt-1">↗ +12.5% from last month</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Profit Margin</h3>
                  <span className="text-2xl">📈</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {dashboardData.financial.profitMargin}%
                </div>
                <p className="text-sm text-green-600 mt-1">↗ +2.3% from last month</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Weather</h3>
                  <span className="text-2xl">☀️</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {dashboardData.weather.temperature}°C
                </div>
                <p className="text-sm text-gray-600 mt-1">{dashboardData.weather.forecast}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Inventory Status</h3>
                  <span className="text-2xl">📦</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(dashboardData.inventory).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{key}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value.status)}`}>
                        {value.level}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Financial Trends */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyFinancials}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} />
                    <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Crop Yield Comparison */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Yield Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cropYieldData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="crop" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#10B981" name="Current Yield" />
                    <Bar dataKey="predicted" fill="#3B82F6" name="Predicted" />
                    <Bar dataKey="lastYear" fill="#F59E0B" name="Last Year" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weather and Market Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weather Advisories */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agricultural Advisories</h3>
                {dashboardData.weather.advisories && dashboardData.weather.advisories.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.weather.advisories.map((advisory, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        advisory.priority === 'high' ? 'border-red-500 bg-red-50' :
                        advisory.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}>
                        <div className="flex items-start space-x-2">
                          <span className="text-lg">{advisory.icon}</span>
                          <div>
                            <h4 className={`font-semibold capitalize ${
                              advisory.priority === 'high' ? 'text-red-800' :
                              advisory.priority === 'medium' ? 'text-yellow-800' :
                              'text-blue-800'
                            }`}>
                              {advisory.type} Advisory
                            </h4>
                            <p className={`text-sm ${
                              advisory.priority === 'high' ? 'text-red-700' :
                              advisory.priority === 'medium' ? 'text-yellow-700' :
                              'text-blue-700'
                            }`}>
                              {advisory.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl block mb-2">☀️</span>
                    <p>No weather advisories at this time</p>
                    <p className="text-sm">Conditions are favorable for farming</p>
                  </div>
                )}
              </div>

              {/* Market Analysis */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Intelligence</h3>
                {marketAnalysis.trend ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Market Trend</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        marketAnalysis.trend === 'bullish' ? 'bg-green-100 text-green-800' :
                        marketAnalysis.trend === 'bearish' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {marketAnalysis.trend}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Recommendation</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        marketAnalysis.recommendation === 'buy' ? 'bg-blue-100 text-blue-800' :
                        marketAnalysis.recommendation === 'sell' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {marketAnalysis.recommendation}
                      </span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium block mb-2">Price Change</span>
                      <span className={`text-lg font-bold ${
                        parseFloat(marketAnalysis.changePercent) > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {marketAnalysis.changePercent}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium block">Market Factors:</span>
                      {marketAnalysis.factors?.slice(0, 3).map((factor, index) => (
                        <p key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="text-green-600 mr-2">•</span>
                          {factor}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl block mb-2">📈</span>
                    <p>Loading market analysis...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">7-Day Weather Forecast</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {weatherForecast.slice(0, 7).map((day, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-2xl mb-2">
                      {day.icon ? (
                        <img 
                          src={`https://openweathermap.org/img/w/${day.icon}.png`} 
                          alt={day.description}
                          className="w-8 h-8 mx-auto"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="12" font-size="12">☀️</text></svg>';
                          }}
                        />
                      ) : '☀️'}
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-800">
                        {Math.round(day.temp_max)}°
                      </div>
                      <div className="text-gray-600">
                        {Math.round(day.temp_min)}°
                      </div>
                    </div>
                    {day.rainfall > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        {day.rainfall.toFixed(1)}mm
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Income</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ₹{dashboardData.financial.monthlyIncome.toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-gray-600">+8.2% from last month</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Expenses</h3>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  ₹{dashboardData.financial.monthlyExpenses.toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-gray-600">+3.1% from last month</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Net Profit</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₹{(dashboardData.financial.monthlyIncome - dashboardData.financial.monthlyExpenses).toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-gray-600">+15.7% from last month</p>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Prices</h3>
                <div className="space-y-4">
                  {Object.entries(dashboardData.marketPrices).map(([item, price]) => (
                    <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium capitalize">{item.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{typeof price === 'number' ? price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : price}
                        {item === 'machineryRental' ? '/day' : '/kg'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <AdvancedAnalytics 
            selectedTimeframe={selectedTimeframe}
            onExport={(section) => exportData('json', section)}
          />
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Inventory Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(dashboardData.inventory).map(([item, data]) => (
                <div key={item} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold capitalize text-gray-800">{item}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.status)}`}>
                      {data.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Stock Level</span>
                      <span className="text-sm font-medium">{data.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          data.status === 'critical' ? 'bg-red-500' :
                          data.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${data.level}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 text-sm">
                    Manage {item}
                  </button>
                </div>
              ))}
            </div>

            {/* Inventory Alerts */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-red-500 mr-3">🚨</span>
                  <div>
                    <p className="font-medium text-red-800">Critical: Fertilizer Stock Low</p>
                    <p className="text-sm text-red-600">Only 23% remaining. Recommend immediate restocking.</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-yellow-500 mr-3">⚠️</span>
                  <div>
                    <p className="font-medium text-yellow-800">Warning: Fuel Level Low</p>
                    <p className="text-sm text-yellow-600">45% remaining. Consider refueling soon.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-6">
            {/* Activity Filter */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Activities</option>
                <option value="planting">Planting</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="maintenance">Maintenance</option>
                <option value="harvest">Harvest</option>
              </select>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.activities
                    .filter(activity => activityFilter === 'all' || activity.type === activityFilter)
                    .map(activity => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition duration-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800 capitalize">
                              {activity.type} {activity.crop && `- ${activity.crop}`}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {activity.area && `Area: ${activity.area}`}
                              {activity.amount && `Amount: ${activity.amount}`}
                              {activity.equipment && `Equipment: ${activity.equipment}`}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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

export default DashboardPage;