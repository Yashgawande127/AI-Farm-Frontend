import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import seedsService from '../services/seedsService';

const SeedsManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalVarieties: 0,
    totalFields: 0,
    activePlantings: 0,
    totalHarvests: 0,
    recentActivities: [],
    upcomingTasks: [],
    performanceSummary: {}
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [varieties, fields, harvests, analytics] = await Promise.all([
        seedsService.getAllSeedVarieties(),
        seedsService.getAllFields(),
        seedsService.getAllHarvestRecords(),
        seedsService.getPerformanceAnalytics()
      ]);

      const activePlantings = fields.reduce((count, field) => {
        return count + field.sections.filter(section => 
          section.status && section.status !== 'Harvested' && section.status !== 'Planned'
        ).length;
      }, 0);

      const upcomingHarvests = fields.reduce((tasks, field) => {
        field.sections.forEach(section => {
          if (section.expectedHarvest && section.status !== 'Harvested') {
            const harvestDate = new Date(section.expectedHarvest);
            const today = new Date();
            const daysUntil = Math.ceil((harvestDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysUntil <= 30 && daysUntil > 0) {
              tasks.push({
                type: 'harvest',
                fieldName: field.name,
                sectionId: section.id,
                crop: section.currentCrop,
                daysUntil,
                date: section.expectedHarvest
              });
            }
          }
        });
        return tasks;
      }, []);

      const recentActivities = harvests
        .sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate))
        .slice(0, 5)
        .map(harvest => ({
          type: 'harvest_completed',
          description: `Harvested ${harvest.quantityHarvested} ${harvest.unit} of ${harvest.cropVariety}`,
          date: harvest.harvestDate,
          field: `Field ${harvest.fieldId}, Section ${harvest.sectionId}`
        }));

      setDashboardData({
        totalVarieties: varieties.length,
        totalFields: fields.length,
        activePlantings,
        totalHarvests: harvests.length,
        recentActivities,
        upcomingTasks: upcomingHarvests.slice(0, 5),
        performanceSummary: analytics
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const moduleCards = [
    {
      title: "Seed Catalog",
      description: "Manage seed varieties, suppliers, and quality tracking",
      iconSvg: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      link: "/seeds/catalog",
      stats: `${dashboardData.totalVarieties} Varieties`,
      gradient: "from-emerald-600 to-teal-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700"
    },
    {
      title: "Field Management",
      description: "Visual field layouts and crop allocation planning",
      iconSvg: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      link: "/seeds/fields",
      stats: `${dashboardData.totalFields} Fields`,
      gradient: "from-blue-600 to-indigo-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700"
    },
    {
      title: "Planting Tracker",
      description: "Track planting schedules and growth monitoring",
      iconSvg: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      link: "/seeds/planting",
      stats: `${dashboardData.activePlantings} Active`,
      gradient: "from-purple-600 to-violet-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700"
    },
    {
      title: "Harvest Records",
      description: "Record harvests, quality, and storage information",
      iconSvg: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      link: "/seeds/harvest",
      stats: `${dashboardData.totalHarvests} Records`,
      gradient: "from-orange-600 to-amber-700",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-700"
    },
    {
      title: "Performance Analytics",
      description: "ROI analysis, yield trends, and optimization insights",
      iconSvg: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: "/seeds/analytics",
      stats: "View Insights",
      gradient: "from-teal-600 to-cyan-700",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      textColor: "text-teal-700"
    },
    {
      title: "Seasonal Planning",
      description: "Crop rotation planning and seasonal recommendations",
      iconSvg: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      link: "/seeds/planning",
      stats: "Plan Crops",
      gradient: "from-rose-600 to-pink-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      textColor: "text-rose-700"
    }
  ];

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
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Seeds Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  Please wait while we load your seeds management data...
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
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-gray-700 to-slate-600 bg-clip-text text-transparent mb-2">
                Seeds Management
              </h1>
              <div className="text-xl sm:text-2xl font-semibold text-emerald-600">System</div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6">
              Transform traditional seed management into a sophisticated tracking ecosystem with comprehensive variety database, 
              intelligent seasonal planning, quality assurance protocols, and advanced performance analytics.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Real-time Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Data Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Automated Planning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.totalVarieties}</p>
                <p className="text-gray-600 font-medium">Seed Varieties</p>
              </div>
            </div>
          </div>
          
          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.activePlantings}</p>
                <p className="text-gray-600 font-medium">Active Plantings</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.totalHarvests}</p>
                <p className="text-gray-600 font-medium">Total Harvests</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m5 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-5 4v6m4-6v6" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{dashboardData.upcomingTasks.length}</p>
                <p className="text-gray-600 font-medium">Upcoming Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {moduleCards.map((module, index) => (
            <Link
              key={index}
              to={module.link}
              className="group block relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-900 to-transparent rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-900 to-transparent rounded-full -ml-12 -mb-12"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${module.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    {module.iconSvg}
                  </div>
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-gray-100 group-hover:to-gray-200 transition-all duration-300">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {module.description}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${module.textColor} ${module.bgColor} px-4 py-2 rounded-xl border ${module.borderColor}`}>
                        {module.stats}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">Access</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:bg-gradient-to-r group-hover:${module.gradient} group-hover:p-0.5 transition-all duration-300`}>
                <div className="w-full h-full bg-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activities & Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Recent Activities</h3>
                <p className="text-gray-500">Latest system updates</p>
              </div>
            </div>
            <div className="space-y-4">
              {dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="relative flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 mb-1">{activity.description}</p>
                      <p className="text-sm text-gray-600 mb-2">{activity.field}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(activity.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No recent activities</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Upcoming Tasks</h3>
                <p className="text-gray-500">Scheduled activities</p>
              </div>
            </div>
            <div className="space-y-4">
              {dashboardData.upcomingTasks.length > 0 ? (
                dashboardData.upcomingTasks.map((task, index) => (
                  <div key={index} className="relative flex items-start gap-4 p-6 bg-gradient-to-r from-orange-50 to-amber-50/50 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 mb-1">Harvest {task.crop}</p>
                      <p className="text-sm text-gray-600 mb-2">{task.fieldName}, Section {task.sectionId}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                        <p className="text-xs text-orange-600 font-bold">
                          Due in {task.daysUntil} days
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-orange-600">{task.daysUntil}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">No upcoming tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedsManagementPage;