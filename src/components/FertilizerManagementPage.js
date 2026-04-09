import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const FertilizerManagementPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const modules = [
    {
      id: 'inventory',
      title: 'Inventory Management',
      description: 'Track fertilizer stock, composition, and compatibility',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      link: '/fertilizers/inventory',
      color: 'green'
    },
    {
      id: 'application',
      title: 'Application Management',
      description: 'Plan, schedule, and track fertilizer applications',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      link: '/fertilizers/application',
      color: 'blue'
    },
    {
      id: 'analytics',
      title: 'Cost Analytics',
      description: 'Analyze costs, efficiency, and optimization opportunities',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: '/fertilizers/analytics',
      color: 'purple'
    },
    {
      id: 'compliance',
      title: 'Compliance Tracking',
      description: 'Monitor organic certification and chemical usage',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      link: '/fertilizers/compliance',
      color: 'orange'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'application',
      message: 'Applied NPK 10-10-10 to Field A (North Section)',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'inventory',
      message: 'Low stock alert: Organic Compost (12 bags remaining)',
      timestamp: '4 hours ago',
      status: 'warning'
    },
    {
      id: 3,
      type: 'compliance',
      message: 'Organic certification report submitted',
      timestamp: '1 day ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'analytics',
      message: 'Monthly cost analysis completed',
      timestamp: '2 days ago',
      status: 'info'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: 'Apply Phosphorus fertilizer to Field C',
      dueDate: 'Tomorrow',
      priority: 'high',
      weather: 'Favorable (No rain expected)'
    },
    {
      id: 2,
      task: 'Soil pH test for Field B',
      dueDate: '3 days',
      priority: 'medium',
      weather: 'Monitoring required'
    },
    {
      id: 3,
      task: 'Inventory check - Micronutrient supplements',
      dueDate: '1 week',
      priority: 'low',
      weather: 'N/A'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Fertilizer Management
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600">
                Scientific approach to fertilizer optimization and application management
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-[100px] bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-600">12</div>
                <div className="text-xs sm:text-sm text-gray-500">Active Fields</div>
              </div>
              <div className="flex-1 min-w-[100px] bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">8</div>
                <div className="text-xs sm:text-sm text-gray-500">Fertilizer Types</div>
              </div>
              <div className="flex-1 min-w-[100px] bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">94%</div>
                <div className="text-xs sm:text-sm text-gray-500">Efficiency Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {modules.map((module) => (
            <Link
              key={module.id}
              to={module.link}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className={`w-12 h-12 bg-${module.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                <div className={`text-${module.color}-600`}>
                  {module.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              <div className={`flex items-center text-${module.color}-600 font-medium`}>
                <span className="text-sm">Manage</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                      activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      activity.status === 'success' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'application' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {activity.type === 'inventory' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                      {activity.type === 'compliance' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )}
                      {activity.type === 'analytics' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-gray-500 text-sm">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Tasks</h2>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">{task.dueDate}</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">{task.task}</p>
                    <p className="text-sm text-gray-600">{task.weather}</p>
                  </div>
                ))}
              </div>
              
              <Link
                to="/fertilizers/application"
                className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
              >
                View All Tasks
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Weather Alert */}
            <div className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="font-semibold">Weather Alert</h3>
              </div>
              <p className="text-sm opacity-90">
                Rain expected in 48 hours. Consider rescheduling outdoor fertilizer applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FertilizerManagementPage;