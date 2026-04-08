import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const FertilizerApplicationPage = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedField, setSelectedField] = useState('');

  // Mock data for fields
  const fields = [
    { id: 1, name: 'Field A - North Section', size: 5.2, soilType: 'Loamy', crop: 'Corn', lastApplication: '2024-10-15' },
    { id: 2, name: 'Field B - South Section', size: 3.8, soilType: 'Clay', crop: 'Wheat', lastApplication: '2024-10-20' },
    { id: 3, name: 'Field C - East Section', size: 4.5, soilType: 'Sandy-loam', crop: 'Soybeans', lastApplication: '2024-10-18' },
    { id: 4, name: 'Field D - West Section', size: 6.1, soilType: 'Sandy', crop: 'Tomatoes', lastApplication: '2024-10-12' }
  ];

  // Mock data for fertilizers
  const availableFertilizers = [
    { id: 1, name: 'NPK 10-10-10', stock: 45, unit: 'bags' },
    { id: 2, name: 'Organic Compost', stock: 12, unit: 'cubic yards' },
    { id: 3, name: 'Phosphorus Booster', stock: 8, unit: 'bags' },
    { id: 4, name: 'Liquid Kelp Extract', stock: 25, unit: 'liters' }
  ];

  // Mock data for scheduled applications
  const [scheduledApplications, setScheduledApplications] = useState([
    {
      id: 1,
      fieldId: 1,
      fieldName: 'Field A - North Section',
      fertilizer: 'NPK 10-10-10',
      scheduledDate: '2024-11-05',
      dosage: 150,
      unit: 'kg/hectare',
      status: 'pending',
      weather: 'favorable',
      priority: 'high',
      notes: 'Pre-planting preparation for corn season'
    },
    {
      id: 2,
      fieldId: 3,
      fieldName: 'Field C - East Section',
      fertilizer: 'Phosphorus Booster',
      scheduledDate: '2024-11-06',
      dosage: 75,
      unit: 'kg/hectare',
      status: 'pending',
      weather: 'monitoring',
      priority: 'medium',
      notes: 'Root development enhancement for soybeans'
    },
    {
      id: 3,
      fieldId: 2,
      fieldName: 'Field B - South Section',
      fertilizer: 'Organic Compost',
      scheduledDate: '2024-11-04',
      dosage: 3,
      unit: 'cubic yards/hectare',
      status: 'completed',
      weather: 'completed',
      priority: 'low',
      notes: 'Soil conditioning completed successfully'
    }
  ]);

  // Mock data for application history
  const applicationHistory = [
    {
      id: 1,
      date: '2024-10-20',
      field: 'Field B - South Section',
      fertilizer: 'NPK 10-10-10',
      dosage: 120,
      unit: 'kg/hectare',
      weather: 'Sunny, 22°C',
      applicator: 'John Smith',
      cost: 156.00,
      effectiveness: 'excellent'
    },
    {
      id: 2,
      date: '2024-10-18',
      field: 'Field C - East Section',
      fertilizer: 'Liquid Kelp Extract',
      dosage: 3,
      unit: 'liters/hectare',
      weather: 'Cloudy, 19°C',
      applicator: 'Maria Garcia',
      cost: 67.50,
      effectiveness: 'good'
    },
    {
      id: 3,
      date: '2024-10-15',
      field: 'Field A - North Section',
      fertilizer: 'Organic Compost',
      dosage: 4,
      unit: 'cubic yards/hectare',
      weather: 'Partly cloudy, 21°C',
      applicator: 'John Smith',
      cost: 182.00,
      effectiveness: 'excellent'
    }
  ];

  const [newApplication, setNewApplication] = useState({
    fieldId: '',
    fertilizer: '',
    scheduledDate: '',
    dosage: '',
    unit: 'kg/hectare',
    priority: 'medium',
    notes: ''
  });

  const weatherForecast = {
    today: { condition: 'Sunny', temp: '24°C', humidity: '65%', wind: '5 km/h', rain: '0%' },
    tomorrow: { condition: 'Partly Cloudy', temp: '22°C', humidity: '72%', wind: '8 km/h', rain: '20%' },
    dayAfter: { condition: 'Rainy', temp: '18°C', humidity: '85%', wind: '12 km/h', rain: '80%' }
  };

  const calculateDosage = (fieldId, fertilizer) => {
    const field = fields.find(f => f.id === parseInt(fieldId));
    if (!field) return { min: 0, max: 0, recommended: 0 };

    // Dosage calculation based on soil type and crop
    const dosageRates = {
      'NPK 10-10-10': {
        'Loamy': { base: 120, cropMultiplier: { 'Corn': 1.2, 'Wheat': 1.0, 'Soybeans': 0.8, 'Tomatoes': 1.3 } },
        'Clay': { base: 100, cropMultiplier: { 'Corn': 1.1, 'Wheat': 0.9, 'Soybeans': 0.7, 'Tomatoes': 1.2 } },
        'Sandy-loam': { base: 140, cropMultiplier: { 'Corn': 1.3, 'Wheat': 1.1, 'Soybeans': 0.9, 'Tomatoes': 1.4 } },
        'Sandy': { base: 160, cropMultiplier: { 'Corn': 1.4, 'Wheat': 1.2, 'Soybeans': 1.0, 'Tomatoes': 1.5 } }
      },
      'Phosphorus Booster': {
        'Loamy': { base: 60, cropMultiplier: { 'Corn': 0.8, 'Wheat': 0.9, 'Soybeans': 1.2, 'Tomatoes': 1.1 } },
        'Clay': { base: 50, cropMultiplier: { 'Corn': 0.7, 'Wheat': 0.8, 'Soybeans': 1.1, 'Tomatoes': 1.0 } },
        'Sandy-loam': { base: 70, cropMultiplier: { 'Corn': 0.9, 'Wheat': 1.0, 'Soybeans': 1.3, 'Tomatoes': 1.2 } },
        'Sandy': { base: 80, cropMultiplier: { 'Corn': 1.0, 'Wheat': 1.1, 'Soybeans': 1.4, 'Tomatoes': 1.3 } }
      }
    };

    if (dosageRates[fertilizer] && dosageRates[fertilizer][field.soilType]) {
      const rate = dosageRates[fertilizer][field.soilType];
      const multiplier = rate.cropMultiplier[field.crop] || 1.0;
      const recommended = Math.round(rate.base * multiplier);
      
      return {
        min: Math.round(recommended * 0.8),
        max: Math.round(recommended * 1.2),
        recommended,
        totalAmount: Math.round(recommended * field.size)
      };
    }

    return { min: 0, max: 0, recommended: 0, totalAmount: 0 };
  };

  const getWeatherRecommendation = (date) => {
    const today = new Date();
    const applicationDate = new Date(date);
    const daysDiff = Math.ceil((applicationDate - today) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) return weatherForecast.today;
    if (daysDiff === 1) return weatherForecast.tomorrow;
    if (daysDiff === 2) return weatherForecast.dayAfter;

    return { condition: 'Check forecast', temp: 'N/A', rain: 'N/A' };
  };

  const handleScheduleApplication = (e) => {
    e.preventDefault();
    const field = fields.find(f => f.id === parseInt(newApplication.fieldId));
    const dosageCalc = calculateDosage(newApplication.fieldId, newApplication.fertilizer);
    
    const application = {
      id: scheduledApplications.length + 1,
      fieldId: parseInt(newApplication.fieldId),
      fieldName: field.name,
      fertilizer: newApplication.fertilizer,
      scheduledDate: newApplication.scheduledDate,
      dosage: newApplication.dosage || dosageCalc.recommended,
      unit: newApplication.unit,
      status: 'pending',
      weather: 'monitoring',
      priority: newApplication.priority,
      notes: newApplication.notes
    };

    setScheduledApplications([...scheduledApplications, application]);
    setShowScheduleModal(false);
    setNewApplication({
      fieldId: '',
      fertilizer: '',
      scheduledDate: '',
      dosage: '',
      unit: 'kg/hectare',
      priority: 'medium',
      notes: ''
    });
  };

  const markAsCompleted = (id) => {
    setScheduledApplications(applications => 
      applications.map(app => 
        app.id === id ? { ...app, status: 'completed' } : app
      )
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        );
      case 'partly cloudy':
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" />
          </svg>
        );
      case 'rainy':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/fertilizers" className="hover:text-green-600">Fertilizer Management</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Application Management</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Application Management
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Plan, schedule, and track fertilizer applications with weather monitoring
            </p>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Schedule Application
          </button>
        </div>

        {/* Weather Dashboard */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg text-white p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">3-Day Weather Forecast</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Today</span>
                {getWeatherIcon(weatherForecast.today.condition)}
              </div>
              <div className="text-2xl font-bold mb-1">{weatherForecast.today.temp}</div>
              <div className="text-sm opacity-90 mb-2">{weatherForecast.today.condition}</div>
              <div className="text-xs space-y-1">
                <div>Rain: {weatherForecast.today.rain}</div>
                <div>Humidity: {weatherForecast.today.humidity}</div>
                <div>Wind: {weatherForecast.today.wind}</div>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Tomorrow</span>
                {getWeatherIcon(weatherForecast.tomorrow.condition)}
              </div>
              <div className="text-2xl font-bold mb-1">{weatherForecast.tomorrow.temp}</div>
              <div className="text-sm opacity-90 mb-2">{weatherForecast.tomorrow.condition}</div>
              <div className="text-xs space-y-1">
                <div>Rain: {weatherForecast.tomorrow.rain}</div>
                <div>Humidity: {weatherForecast.tomorrow.humidity}</div>
                <div>Wind: {weatherForecast.tomorrow.wind}</div>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Day After</span>
                {getWeatherIcon(weatherForecast.dayAfter.condition)}
              </div>
              <div className="text-2xl font-bold mb-1">{weatherForecast.dayAfter.temp}</div>
              <div className="text-sm opacity-90 mb-2">{weatherForecast.dayAfter.condition}</div>
              <div className="text-xs space-y-1">
                <div>Rain: {weatherForecast.dayAfter.rain}</div>
                <div>Humidity: {weatherForecast.dayAfter.humidity}</div>
                <div>Wind: {weatherForecast.dayAfter.wind}</div>
              </div>
            </div>
          </div>
          
          {parseInt(weatherForecast.dayAfter.rain) > 50 && (
            <div className="mt-4 bg-yellow-500 bg-opacity-30 border border-yellow-300 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium">
                  High chance of rain in 2 days. Consider rescheduling outdoor applications.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'schedule'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Scheduled Applications
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Application History
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'fields'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Field Overview
            </button>
          </div>

          {/* Scheduled Applications Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              {scheduledApplications.map((application) => (
                <div key={application.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{application.fieldName}</h3>
                      <p className="text-gray-600">{application.fertilizer}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(application.priority)}`}>
                        {application.priority.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Scheduled Date</div>
                      <div className="text-gray-900">{new Date(application.scheduledDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Dosage</div>
                      <div className="text-gray-900">{application.dosage} {application.unit}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Weather</div>
                      <div className="flex items-center text-gray-900">
                        {getWeatherIcon(getWeatherRecommendation(application.scheduledDate).condition)}
                        <span className="ml-1 text-sm">{getWeatherRecommendation(application.scheduledDate).condition}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Rain Chance</div>
                      <div className="text-gray-900">{getWeatherRecommendation(application.scheduledDate).rain}</div>
                    </div>
                  </div>

                  {application.notes && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
                      <div className="text-gray-600 text-sm">{application.notes}</div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Field ID: {application.fieldId}
                    </div>
                    <div className="flex items-center space-x-2">
                      {application.status === 'pending' && (
                        <>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Edit Schedule
                          </button>
                          <button 
                            onClick={() => markAsCompleted(application.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm"
                          >
                            Mark Completed
                          </button>
                        </>
                      )}
                      {application.status === 'completed' && (
                        <span className="text-green-600 text-sm font-medium">✓ Completed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Application History Tab */}
          {activeTab === 'history' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Field</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Fertilizer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Dosage</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Weather</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Applicator</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cost</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Effectiveness</th>
                  </tr>
                </thead>
                <tbody>
                  {applicationHistory.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{record.date}</td>
                      <td className="py-3 px-4">{record.field}</td>
                      <td className="py-3 px-4">{record.fertilizer}</td>
                      <td className="py-3 px-4">{record.dosage} {record.unit}</td>
                      <td className="py-3 px-4 text-sm">{record.weather}</td>
                      <td className="py-3 px-4">{record.applicator}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">₹{record.cost.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.effectiveness === 'excellent' ? 'bg-green-100 text-green-800' :
                          record.effectiveness === 'good' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.effectiveness}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Fields Overview Tab */}
          {activeTab === 'fields' && (
            <div className="grid md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div key={field.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{field.name}</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Size</div>
                      <div className="text-gray-900">{field.size} hectares</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Soil Type</div>
                      <div className="text-gray-900">{field.soilType}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Current Crop</div>
                      <div className="text-gray-900">{field.crop}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">Last Application</div>
                      <div className="text-gray-900">{field.lastApplication}</div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button 
                      onClick={() => {
                        setSelectedField(field.id.toString());
                        setShowScheduleModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
                    >
                      Schedule Application
                    </button>
                    <Link 
                      to={`/fertilizers/field-history/${field.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      View History
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule Application Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">Schedule Fertilizer Application</h2>
                  <button
                    onClick={() => {
                      setShowScheduleModal(false);
                      setSelectedField('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleScheduleApplication} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Field</label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedField || newApplication.fieldId}
                      onChange={(e) => {
                        setNewApplication({...newApplication, fieldId: e.target.value});
                        setSelectedField('');
                      }}
                    >
                      <option value="">Choose a field</option>
                      {fields.map((field) => (
                        <option key={field.id} value={field.id}>
                          {field.name} ({field.size} ha, {field.soilType}, {field.crop})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fertilizer</label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newApplication.fertilizer}
                      onChange={(e) => setNewApplication({...newApplication, fertilizer: e.target.value})}
                    >
                      <option value="">Choose fertilizer</option>
                      {availableFertilizers.map((fertilizer) => (
                        <option key={fertilizer.id} value={fertilizer.name}>
                          {fertilizer.name} ({fertilizer.stock} {fertilizer.unit} available)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newApplication.scheduledDate}
                      onChange={(e) => setNewApplication({...newApplication, scheduledDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newApplication.priority}
                      onChange={(e) => setNewApplication({...newApplication, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Dosage Calculation Display */}
                {newApplication.fieldId && newApplication.fertilizer && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Recommended Dosage Calculation</h3>
                    {(() => {
                      const calculation = calculateDosage(newApplication.fieldId, newApplication.fertilizer);
                      return (
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700 font-medium">Recommended:</span>
                            <div className="text-blue-900">{calculation.recommended} kg/hectare</div>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Range:</span>
                            <div className="text-blue-900">{calculation.min}-{calculation.max} kg/hectare</div>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Total Amount:</span>
                            <div className="text-blue-900">{calculation.totalAmount} kg</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage (optional - will use recommended if empty)
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newApplication.dosage}
                      onChange={(e) => setNewApplication({...newApplication, dosage: e.target.value})}
                      placeholder="Auto-calculated"
                    />
                    <select
                      className="border-l-0 border border-gray-300 rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newApplication.unit}
                      onChange={(e) => setNewApplication({...newApplication, unit: e.target.value})}
                    >
                      <option value="kg/hectare">kg/hectare</option>
                      <option value="liters/hectare">liters/hectare</option>
                      <option value="cubic yards/hectare">cubic yards/hectare</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newApplication.notes}
                    onChange={(e) => setNewApplication({...newApplication, notes: e.target.value})}
                    placeholder="Additional notes or instructions..."
                  />
                </div>

                {/* Weather Warning */}
                {newApplication.scheduledDate && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <h3 className="font-medium text-yellow-900">Weather Forecast for Selected Date</h3>
                    </div>
                    {(() => {
                      const weather = getWeatherRecommendation(newApplication.scheduledDate);
                      return (
                        <div className="text-sm text-yellow-800">
                          <div className="flex items-center">
                            {getWeatherIcon(weather.condition)}
                            <span className="ml-2">
                              {weather.condition} - {weather.temp} - Rain: {weather.rain}
                            </span>
                          </div>
                          {parseInt(weather.rain) > 50 && (
                            <div className="mt-2 text-yellow-700 font-medium">
                              ⚠️ High chance of rain. Consider rescheduling to avoid runoff and reduced effectiveness.
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScheduleModal(false);
                      setSelectedField('');
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Schedule Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FertilizerApplicationPage;