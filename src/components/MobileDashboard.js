import React, { useState } from 'react';

const MobileDashboard = ({ dashboardData, weatherForecast, marketAnalysis }) => {
  const [activeCard, setActiveCard] = useState('financial');

  const cards = [
    {
      id: 'financial',
      title: 'Financial',
      icon: '💰',
      value: `₹${dashboardData.financial.currentBalance.toLocaleString('en-IN')}`,
      subtitle: `${dashboardData.financial.profitMargin}% margin`,
      color: 'green'
    },
    {
      id: 'weather',
      title: 'Weather',
      icon: '🌡️',
      value: `${dashboardData.weather.temperature}°C`,
      subtitle: dashboardData.weather.description,
      color: 'blue'
    },
    {
      id: 'inventory',
      title: 'Inventory',
      icon: '📦',
      value: 'View Status',
      subtitle: 'Multiple alerts',
      color: 'yellow'
    },
    {
      id: 'market',
      title: 'Market',
      icon: '📈',
      value: marketAnalysis.trend || 'Loading',
      subtitle: `${marketAnalysis.changePercent || '0'}%`,
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[color] || colors.green;
  };

  return (
    <div className="lg:hidden space-y-4">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => setActiveCard(card.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              activeCard === card.id 
                ? getColorClasses(card.color) 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-sm font-medium text-gray-600">{card.title}</div>
            <div className="text-lg font-bold text-gray-800">{card.value}</div>
            <div className="text-xs text-gray-500">{card.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Detailed View */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        {activeCard === 'financial' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Income</span>
                <span className="font-semibold text-green-600">
                  ₹{dashboardData.financial.monthlyIncome.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expenses</span>
                <span className="font-semibold text-red-600">
                  ₹{dashboardData.financial.monthlyExpenses.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Net Profit</span>
                <span className="font-bold text-blue-600">
                  ₹{(dashboardData.financial.monthlyIncome - dashboardData.financial.monthlyExpenses).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeCard === 'weather' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Humidity</span>
                <span className="font-semibold">{dashboardData.weather.humidity}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Wind Speed</span>
                <span className="font-semibold">{dashboardData.weather.windSpeed || '8'} km/h</span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-sm text-gray-600 block mb-2">3-Day Forecast</span>
                <div className="grid grid-cols-3 gap-2">
                  {weatherForecast.slice(1, 4).map((day, index) => (
                    <div key={index} className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-xs text-gray-600">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-sm font-semibold">
                        {Math.round(day.temp_max)}°/{Math.round(day.temp_min)}°
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCard === 'inventory' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Status</h3>
            <div className="space-y-3">
              {Object.entries(dashboardData.inventory).map(([item, data]) => (
                <div key={item} className="flex justify-between items-center">
                  <span className="capitalize text-gray-600">{item}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{data.level}%</span>
                    <span className={`w-3 h-3 rounded-full ${
                      data.status === 'critical' ? 'bg-red-500' :
                      data.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeCard === 'market' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Analysis</h3>
            {marketAnalysis.trend ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trend</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    marketAnalysis.trend === 'bullish' ? 'bg-green-100 text-green-800' :
                    marketAnalysis.trend === 'bearish' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {marketAnalysis.trend}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recommendation</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    marketAnalysis.recommendation === 'buy' ? 'bg-blue-100 text-blue-800' :
                    marketAnalysis.recommendation === 'sell' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {marketAnalysis.recommendation}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-sm text-gray-600 block mb-2">Key Prices</span>
                  <div className="space-y-1">
                    {Object.entries(dashboardData.marketPrices).slice(0, 3).map(([crop, price]) => (
                      <div key={crop} className="flex justify-between text-sm">
                        <span className="capitalize">{crop}</span>
                        <span className="font-medium">₹{typeof price === 'number' ? price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <span className="text-2xl block mb-2">📊</span>
                <p className="text-sm">Loading market data...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-2">
          <span>🎯</span>
          <span className="font-medium">Predict Crop</span>
        </button>
        <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2">
          <span>📊</span>
          <span className="font-medium">View Analytics</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {dashboardData.activities.slice(0, 3).map(activity => (
            <div key={activity.id} className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm">
                  {activity.type === 'planting' ? '🌱' : 
                   activity.type === 'fertilizer' ? '🧪' : '🔧'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium capitalize">{activity.type}</p>
                <p className="text-gray-600 text-xs">
                  {activity.crop && `${activity.crop} - `}
                  {activity.area || activity.amount || activity.equipment}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                activity.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboard;