import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, RadialBarChart, RadialBar
} from 'recharts';

const AdvancedAnalytics = ({ selectedTimeframe, onExport }) => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('profitability');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setAnalyticsData(generateMockAnalyticsData(selectedTimeframe));
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [selectedTimeframe]);

  const generateMockAnalyticsData = (timeframe) => {
    const periods = timeframe === 'yearly' ? 5 : timeframe === 'monthly' ? 12 : 30;
    const profitabilityData = [];
    const efficiencyData = [];
    const resourceUsage = [];
    const cropPerformance = [];
    const costAnalysis = [];

    for (let i = 0; i < periods; i++) {
      const date = getDateForPeriod(timeframe, i);
      
      profitabilityData.push({
        period: date,
        revenue: 1245000 + Math.random() * 830000,  // ₹12,45,000 + random ₹8,30,000
        costs: 664000 + Math.random() * 415000,     // ₹6,64,000 + random ₹4,15,000
        profit: 581000 + Math.random() * 415000,    // ₹5,81,000 + random ₹4,15,000
        margin: 30 + Math.random() * 20
      });

      efficiencyData.push({
        period: date,
        yieldPerAcre: 80 + Math.random() * 40,
        resourceEfficiency: 70 + Math.random() * 25,
        costPerUnit: 1.2 + Math.random() * 0.8,
        timeToHarvest: 90 + Math.random() * 30
      });

      resourceUsage.push({
        period: date,
        water: 200 + Math.random() * 100,
        fertilizer: 50 + Math.random() * 30,
        fuel: 80 + Math.random() * 40,
        labor: 120 + Math.random() * 60
      });
    }

    // Crop performance data
    const crops = ['Wheat', 'Rice', 'Corn', 'Barley', 'Soybeans'];
    crops.forEach(crop => {
      cropPerformance.push({
        crop,
        currentYield: 70 + Math.random() * 50,
        projectedYield: 75 + Math.random() * 45,
        profitability: 60 + Math.random() * 40,
        sustainability: 50 + Math.random() * 50,
        marketDemand: 40 + Math.random() * 60
      });
    });

    // Cost breakdown analysis
    const costCategories = [
      { category: 'Seeds', amount: 25000, percentage: 30, trend: 5.2 },
      { category: 'Fertilizers', amount: 18000, percentage: 22, trend: -2.1 },
      { category: 'Machinery', amount: 15000, percentage: 18, trend: 8.7 },
      { category: 'Labor', amount: 12000, percentage: 15, trend: 3.4 },
      { category: 'Fuel', amount: 8000, percentage: 10, trend: -1.8 },
      { category: 'Others', amount: 4000, percentage: 5, trend: 2.3 }
    ];

    return {
      profitabilityData,
      efficiencyData,
      resourceUsage,
      cropPerformance,
      costAnalysis
    };
  };

  const getDateForPeriod = (timeframe, index) => {
    const now = new Date();
    if (timeframe === 'yearly') {
      return `${now.getFullYear() - 4 + index}`;
    } else if (timeframe === 'monthly') {
      const month = new Date(now.getFullYear(), now.getMonth() - 11 + index);
      return month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      const date = new Date(now);
      date.setDate(now.getDate() - 29 + index);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const renderProfitabilityAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue vs Costs Analysis</h3>
        <div className="h-[300px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData.profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" fontSize={10} tick={{fill: '#6B7280'}} />
              <YAxis fontSize={10} tick={{fill: '#6B7280'}} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.7} />
              <Area type="monotone" dataKey="costs" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.7} />
              <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Margin Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData.profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Margin']} />
              <Line type="monotone" dataKey="margin" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analyticsData.costAnalysis}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="percentage"
              >
                {analyticsData.costAnalysis?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(index)} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderEfficiencyAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Operational Efficiency Metrics</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={analyticsData.efficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="yieldPerAcre" fill="#10B981" name="Yield per Acre" />
            <Bar dataKey="resourceEfficiency" fill="#3B82F6" name="Resource Efficiency %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resource Utilization</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={[
              { name: 'Water', value: 85, fill: '#3B82F6' },
              { name: 'Fertilizer', value: 72, fill: '#10B981' },
              { name: 'Fuel', value: 68, fill: '#F59E0B' },
              { name: 'Labor', value: 91, fill: '#EF4444' }
            ]}>
              <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background dataKey="value" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Efficiency Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData.efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value.toFixed(2)}`, 'Cost per Unit']} />
              <Line type="monotone" dataKey="costPerUnit" stroke="#EF4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderCropAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Performance Matrix</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart data={analyticsData.cropPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="profitability" name="Profitability" unit="%" />
            <YAxis type="number" dataKey="currentYield" name="Current Yield" unit="%" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter dataKey="marketDemand" fill="#10B981" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {analyticsData.cropPerformance?.map((crop, index) => (
          <div key={crop.crop} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-3">{crop.crop}</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Yield</span>
                <span className="font-medium">{crop.currentYield.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${crop.currentYield}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Profit: {crop.profitability.toFixed(1)}%</span>
                <span className="text-gray-600">Demand: {crop.marketDemand.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResourceAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resource Consumption Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={analyticsData.resourceUsage}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="water" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
            <Area type="monotone" dataKey="fertilizer" stackId="1" stroke="#10B981" fill="#10B981" />
            <Area type="monotone" dataKey="fuel" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
            <Area type="monotone" dataKey="labor" stackId="1" stroke="#EF4444" fill="#EF4444" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {['Water', 'Fertilizer', 'Fuel', 'Labor'].map((resource, index) => (
          <div key={resource} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">{resource}</h4>
              <span className={`text-sm ${index % 2 === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {index % 2 === 0 ? '↓' : '↑'} {(Math.random() * 10).toFixed(1)}%
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {(Math.random() * 100 + 50).toFixed(0)} 
              <span className="text-sm font-normal text-gray-600 ml-1">
                {resource === 'Water' ? 'gal' : resource === 'Labor' ? 'hrs' : 'lbs'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getCategoryColor = (index) => {
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Analytics Navigation */}
      <div className="flex space-x-2 overflow-x-auto bg-white rounded-lg p-1 shadow-sm">
        {[
          { id: 'profitability', label: 'Profitability', icon: '💰' },
          { id: 'efficiency', label: 'Efficiency', icon: '⚡' },
          { id: 'crops', label: 'Crop Analysis', icon: '🌾' },
          { id: 'resources', label: 'Resources', icon: '🔧' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedMetric(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition duration-200 flex items-center justify-center gap-2 min-w-fit ${
              selectedMetric === tab.id
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Analytics Content */}
      <div className="min-h-96">
        {selectedMetric === 'profitability' && renderProfitabilityAnalysis()}
        {selectedMetric === 'efficiency' && renderEfficiencyAnalysis()}
        {selectedMetric === 'crops' && renderCropAnalysis()}
        {selectedMetric === 'resources' && renderResourceAnalysis()}
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onExport(selectedMetric)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
        >
          <span>📊</span>
          Export {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Report
        </button>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;