import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const MachineryAnalyticsPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [timeRange, setTimeRange] = useState('12months');
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateAnalytics();
  }, [equipment, maintenanceRecords, selectedEquipment, timeRange]);

  const loadData = () => {
    const savedEquipment = JSON.parse(localStorage.getItem('machinery_inventory') || '[]');
    const savedMaintenance = JSON.parse(localStorage.getItem('machinery_maintenance') || '[]');
    
    setEquipment(savedEquipment);
    setMaintenanceRecords(savedMaintenance);
  };

  const calculateAnalytics = () => {
    const filteredEquipment = selectedEquipment === 'all' 
      ? equipment 
      : equipment.filter(eq => eq.id === selectedEquipment);

    const now = new Date();
    const timeRanges = {
      '3months': new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
      '6months': new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
      '12months': new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
      '24months': new Date(now.getFullYear() - 2, now.getMonth(), now.getDate())
    };

    const startDate = timeRanges[timeRange];
    
    const filteredMaintenance = maintenanceRecords.filter(record => {
      const recordDate = new Date(record.completedDate || record.scheduledDate);
      const matchesEquipment = selectedEquipment === 'all' || record.equipmentId === selectedEquipment;
      const matchesTimeRange = recordDate >= startDate;
      
      return matchesEquipment && matchesTimeRange;
    });

    // Calculate various analytics
    const analytics = {
      fleetOverview: calculateFleetOverview(filteredEquipment),
      utilizationMetrics: calculateUtilizationMetrics(filteredEquipment),
      maintenanceCosts: calculateMaintenanceCosts(filteredMaintenance),
      performanceMetrics: calculatePerformanceMetrics(filteredEquipment, filteredMaintenance),
      fuelEfficiency: calculateFuelEfficiency(filteredEquipment),
      roiAnalysis: calculateROIAnalysis(filteredEquipment, filteredMaintenance),
      equipmentAge: calculateEquipmentAge(filteredEquipment),
      maintenanceFrequency: calculateMaintenanceFrequency(filteredMaintenance),
      costTrends: calculateCostTrends(filteredMaintenance),
      utilizationTrends: calculateUtilizationTrends(filteredEquipment)
    };

    setAnalyticsData(analytics);
  };

  const calculateFleetOverview = (equipmentList) => {
    const totalValue = equipmentList.reduce((sum, eq) => sum + (eq.currentValue || 0), 0);
    const totalPurchaseValue = equipmentList.reduce((sum, eq) => sum + (parseFloat(eq.purchasePrice) || 0), 0);
    const totalDepreciation = totalPurchaseValue - totalValue;
    
    const categoryBreakdown = equipmentList.reduce((acc, eq) => {
      acc[eq.category] = (acc[eq.category] || 0) + 1;
      return acc;
    }, {});

    const statusBreakdown = equipmentList.reduce((acc, eq) => {
      acc[eq.status] = (acc[eq.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCount: equipmentList.length,
      totalValue,
      totalPurchaseValue,
      totalDepreciation,
      categoryBreakdown,
      statusBreakdown,
      avgAge: equipmentList.length > 0 
        ? equipmentList.reduce((sum, eq) => sum + (new Date().getFullYear() - parseInt(eq.year || 0)), 0) / equipmentList.length 
        : 0
    };
  };

  const calculateUtilizationMetrics = (equipmentList) => {
    const totalHours = equipmentList.reduce((sum, eq) => sum + (eq.operatingHours || 0), 0);
    const avgHours = equipmentList.length > 0 ? totalHours / equipmentList.length : 0;
    
    const utilizationByCategory = equipmentList.reduce((acc, eq) => {
      if (!acc[eq.category]) {
        acc[eq.category] = { totalHours: 0, count: 0 };
      }
      acc[eq.category].totalHours += eq.operatingHours || 0;
      acc[eq.category].count += 1;
      return acc;
    }, {});

    Object.keys(utilizationByCategory).forEach(category => {
      utilizationByCategory[category].avgHours = utilizationByCategory[category].totalHours / utilizationByCategory[category].count;
    });

    return {
      totalHours,
      avgHours,
      utilizationByCategory,
      highUtilizationEquipment: equipmentList.filter(eq => (eq.operatingHours || 0) > avgHours * 1.5),
      lowUtilizationEquipment: equipmentList.filter(eq => (eq.operatingHours || 0) < avgHours * 0.5)
    };
  };

  const calculateMaintenanceCosts = (maintenanceList) => {
    const completedMaintenance = maintenanceList.filter(m => m.status === 'completed');
    const totalCost = completedMaintenance.reduce((sum, m) => sum + (m.cost || 0), 0);
    const avgCost = completedMaintenance.length > 0 ? totalCost / completedMaintenance.length : 0;

    const costByCategory = completedMaintenance.reduce((acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + (m.cost || 0);
      return acc;
    }, {});

    const costByEquipment = completedMaintenance.reduce((acc, m) => {
      acc[m.equipmentId] = (acc[m.equipmentId] || 0) + (m.cost || 0);
      return acc;
    }, {});

    return {
      totalCost,
      avgCost,
      costByCategory,
      costByEquipment,
      maintenanceCount: completedMaintenance.length
    };
  };

  const calculatePerformanceMetrics = (equipmentList, maintenanceList) => {
    const equipmentPerformance = equipmentList.map(eq => {
      const equipmentMaintenance = maintenanceList.filter(m => m.equipmentId === eq.id);
      const completedMaintenance = equipmentMaintenance.filter(m => m.status === 'completed');
      
      const maintenanceCost = completedMaintenance.reduce((sum, m) => sum + (m.cost || 0), 0);
      const hoursPerMaintenance = completedMaintenance.length > 0 
        ? (eq.operatingHours || 0) / completedMaintenance.length 
        : 0;
      
      const costPerHour = (eq.operatingHours || 0) > 0 ? maintenanceCost / eq.operatingHours : 0;
      
      // Simple reliability score based on maintenance frequency and cost
      let reliabilityScore = 100;
      if (completedMaintenance.length > 0) {
        reliabilityScore -= Math.min(completedMaintenance.length * 5, 30); // Reduce for frequency
        reliabilityScore -= Math.min(costPerHour * 1000, 30); // Reduce for cost per hour
      }
      reliabilityScore = Math.max(reliabilityScore, 0);

      return {
        ...eq,
        maintenanceCost,
        hoursPerMaintenance,
        costPerHour,
        reliabilityScore: Math.round(reliabilityScore),
        maintenanceCount: completedMaintenance.length
      };
    });

    return {
      equipmentPerformance,
      avgReliabilityScore: equipmentPerformance.length > 0 
        ? Math.round(equipmentPerformance.reduce((sum, eq) => sum + eq.reliabilityScore, 0) / equipmentPerformance.length)
        : 0,
      mostReliable: equipmentPerformance.reduce((max, eq) => eq.reliabilityScore > (max.reliabilityScore || 0) ? eq : max, {}),
      leastReliable: equipmentPerformance.reduce((min, eq) => eq.reliabilityScore < (min.reliabilityScore || 100) ? eq : min, {})
    };
  };

  const calculateFuelEfficiency = (equipmentList) => {
    // Estimated fuel efficiency based on equipment type and operating hours
    const fuelRates = {
      'Tractor': 8, // gallons per hour
      'Harvester': 12,
      'Planter': 6,
      'Cultivator': 5,
      'Sprayer': 4,
      'Irrigation': 3,
      'Tillage': 7,
      'Hay Equipment': 6,
      'Transport': 10,
      'Other': 6
    };

    const fuelData = equipmentList.map(eq => {
      const fuelRate = fuelRates[eq.category] || 6;
      const estimatedFuelUsage = (eq.operatingHours || 0) * fuelRate;
      return {
        ...eq,
        estimatedFuelUsage,
        fuelRate
      };
    });

    const totalFuelUsage = fuelData.reduce((sum, eq) => sum + eq.estimatedFuelUsage, 0);
    
    return {
      fuelData,
      totalFuelUsage,
      avgFuelRate: fuelData.length > 0 
        ? fuelData.reduce((sum, eq) => sum + eq.fuelRate, 0) / fuelData.length 
        : 0
    };
  };

  const calculateROIAnalysis = (equipmentList, maintenanceList) => {
    return equipmentList.map(eq => {
      const equipmentMaintenance = maintenanceList.filter(m => m.equipmentId === eq.id && m.status === 'completed');
      const totalMaintenanceCost = equipmentMaintenance.reduce((sum, m) => sum + (m.cost || 0), 0);
      
      const purchasePrice = parseFloat(eq.purchasePrice) || 0;
      const currentValue = eq.currentValue || 0;
      const totalCost = purchasePrice + totalMaintenanceCost;
      
      // Estimated revenue based on operating hours and equipment type
      const revenuePerHour = {
        'Tractor': 45,
        'Harvester': 120,
        'Planter': 35,
        'Cultivator': 25,
        'Sprayer': 30,
        'Irrigation': 15,
        'Tillage': 20,
        'Hay Equipment': 40,
        'Transport': 25,
        'Other': 30
      };
      
      const estimatedRevenue = (eq.operatingHours || 0) * (revenuePerHour[eq.category] || 30);
      const roi = totalCost > 0 ? ((estimatedRevenue - totalCost) / totalCost) * 100 : 0;
      
      return {
        ...eq,
        totalMaintenanceCost,
        totalCost,
        estimatedRevenue,
        roi: Math.round(roi),
        paybackPeriod: estimatedRevenue > 0 ? Math.round((purchasePrice / (estimatedRevenue * 0.1)) * 10) / 10 : 0 // years
      };
    });
  };

  const calculateEquipmentAge = (equipmentList) => {
    const currentYear = new Date().getFullYear();
    const ageData = equipmentList.map(eq => ({
      ...eq,
      age: currentYear - parseInt(eq.year || currentYear)
    }));

    const ageGroups = {
      'New (0-2 years)': 0,
      'Young (3-5 years)': 0,
      'Mature (6-10 years)': 0,
      'Old (11-15 years)': 0,
      'Very Old (15+ years)': 0
    };

    ageData.forEach(eq => {
      if (eq.age <= 2) ageGroups['New (0-2 years)']++;
      else if (eq.age <= 5) ageGroups['Young (3-5 years)']++;
      else if (eq.age <= 10) ageGroups['Mature (6-10 years)']++;
      else if (eq.age <= 15) ageGroups['Old (11-15 years)']++;
      else ageGroups['Very Old (15+ years)']++;
    });

    return {
      ageData,
      ageGroups,
      avgAge: ageData.length > 0 ? Math.round(ageData.reduce((sum, eq) => sum + eq.age, 0) / ageData.length) : 0
    };
  };

  const calculateMaintenanceFrequency = (maintenanceList) => {
    const frequencyByCategory = maintenanceList.reduce((acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + 1;
      return acc;
    }, {});

    const frequencyByEquipment = maintenanceList.reduce((acc, m) => {
      acc[m.equipmentId] = (acc[m.equipmentId] || 0) + 1;
      return acc;
    }, {});

    return {
      frequencyByCategory,
      frequencyByEquipment,
      totalMaintenanceEvents: maintenanceList.length
    };
  };

  const calculateCostTrends = (maintenanceList) => {
    const completedMaintenance = maintenanceList.filter(m => m.status === 'completed' && m.completedDate);
    
    const monthlyTrends = completedMaintenance.reduce((acc, m) => {
      const date = new Date(m.completedDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { cost: 0, count: 0 };
      }
      acc[monthKey].cost += m.cost || 0;
      acc[monthKey].count += 1;
      
      return acc;
    }, {});

    return {
      monthlyTrends: Object.entries(monthlyTrends)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({ month, ...data }))
    };
  };

  const calculateUtilizationTrends = (equipmentList) => {
    // This is a simplified calculation - in a real system you'd track historical data
    const utilizationByAge = equipmentList.reduce((acc, eq) => {
      const age = new Date().getFullYear() - parseInt(eq.year || 0);
      const ageGroup = age <= 2 ? '0-2' : age <= 5 ? '3-5' : age <= 10 ? '6-10' : '10+';
      
      if (!acc[ageGroup]) {
        acc[ageGroup] = { totalHours: 0, count: 0 };
      }
      acc[ageGroup].totalHours += eq.operatingHours || 0;
      acc[ageGroup].count += 1;
      
      return acc;
    }, {});

    Object.keys(utilizationByAge).forEach(group => {
      utilizationByAge[group].avgHours = utilizationByAge[group].totalHours / utilizationByAge[group].count;
    });

    return {
      utilizationByAge
    };
  };

  const getEquipmentName = (equipmentId) => {
    const eq = equipment.find(e => e.id === equipmentId);
    return eq ? `${eq.name}` : 'Unknown Equipment';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link 
              to="/machinery" 
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Equipment Analytics</h1>
              <p className="text-gray-600 text-lg">Advanced insights and performance metrics</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Equipment</option>
                {equipment.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} - {eq.make} {eq.model}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="12months">Last 12 Months</option>
                <option value="24months">Last 24 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fleet Overview */}
        {analyticsData.fleetOverview && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Equipment</p>
                  <p className="text-3xl font-bold text-blue-600">{analyticsData.fleetOverview.totalCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Fleet Value</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(analyticsData.fleetOverview.totalValue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Depreciation</p>
                  <p className="text-3xl font-bold text-red-600">{formatCurrency(analyticsData.fleetOverview.totalDepreciation)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Average Age</p>
                  <p className="text-3xl font-bold text-purple-600">{Math.round(analyticsData.fleetOverview.avgAge)} yrs</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {analyticsData.performanceMetrics && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Equipment Performance</h3>
              <p className="text-gray-600">Reliability scores and performance metrics</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-600 text-sm font-medium">Average Reliability Score</p>
                  <p className="text-3xl font-bold text-blue-900">{analyticsData.performanceMetrics.avgReliabilityScore}%</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-600 text-sm font-medium">Most Reliable</p>
                  <p className="text-lg font-bold text-green-900 truncate">
                    {analyticsData.performanceMetrics.mostReliable.name || 'N/A'}
                  </p>
                  <p className="text-sm text-green-700">
                    {analyticsData.performanceMetrics.mostReliable.reliabilityScore}% reliability
                  </p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-red-600 text-sm font-medium">Needs Attention</p>
                  <p className="text-lg font-bold text-red-900 truncate">
                    {analyticsData.performanceMetrics.leastReliable.name || 'N/A'}
                  </p>
                  <p className="text-sm text-red-700">
                    {analyticsData.performanceMetrics.leastReliable.reliabilityScore}% reliability
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Equipment</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Reliability Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Operating Hours</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Maintenance Cost</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Cost/Hour</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Maintenance Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.performanceMetrics.equipmentPerformance.map((eq) => (
                      <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{eq.name}</p>
                            <p className="text-sm text-gray-500">{eq.make} {eq.model}</p>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 text-sm font-semibold rounded-full ${getPerformanceColor(eq.reliabilityScore)}`}>
                            {eq.reliabilityScore}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4 font-medium">{eq.operatingHours?.toLocaleString()}</td>
                        <td className="text-center py-3 px-4 font-medium">{formatCurrency(eq.maintenanceCost)}</td>
                        <td className="text-center py-3 px-4 font-medium">₹{eq.costPerHour?.toFixed(2)}</td>
                        <td className="text-center py-3 px-4 font-medium">{eq.maintenanceCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Utilization and Fuel Efficiency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Utilization Metrics */}
          {analyticsData.utilizationMetrics && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Utilization Metrics</h3>
                <p className="text-gray-600">Equipment usage analysis</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-600 text-sm font-medium">Total Hours</p>
                    <p className="text-2xl font-bold text-blue-900">{analyticsData.utilizationMetrics.totalHours?.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-green-600 text-sm font-medium">Average Hours</p>
                    <p className="text-2xl font-bold text-green-900">{Math.round(analyticsData.utilizationMetrics.avgHours)?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">By Category:</h4>
                  {Object.entries(analyticsData.utilizationMetrics.utilizationByCategory).map(([category, data]) => (
                    <div key={category} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">{category}</span>
                      <span className="font-medium">{Math.round(data.avgHours).toLocaleString()} hrs avg</span>
                    </div>
                  ))}
                </div>

                {analyticsData.utilizationMetrics.highUtilizationEquipment.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">High Utilization Equipment:</h4>
                    {analyticsData.utilizationMetrics.highUtilizationEquipment.slice(0, 3).map(eq => (
                      <p key={eq.id} className="text-sm text-gray-600">{eq.name} - {eq.operatingHours?.toLocaleString()} hrs</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fuel Efficiency */}
          {analyticsData.fuelEfficiency && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Fuel Efficiency</h3>
                <p className="text-gray-600">Estimated fuel consumption</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-orange-600 text-sm font-medium">Total Fuel Usage</p>
                    <p className="text-2xl font-bold text-orange-900">{Math.round(analyticsData.fuelEfficiency.totalFuelUsage).toLocaleString()} gal</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-purple-600 text-sm font-medium">Avg. Rate</p>
                    <p className="text-2xl font-bold text-purple-900">{analyticsData.fuelEfficiency.avgFuelRate?.toFixed(1)} gal/hr</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Top Fuel Consumers:</h4>
                  {analyticsData.fuelEfficiency.fuelData
                    .sort((a, b) => b.estimatedFuelUsage - a.estimatedFuelUsage)
                    .slice(0, 5)
                    .map(eq => (
                      <div key={eq.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 truncate">{eq.name}</span>
                        <span className="font-medium">{Math.round(eq.estimatedFuelUsage).toLocaleString()} gal</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ROI Analysis */}
        {analyticsData.roiAnalysis && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">ROI Analysis</h3>
              <p className="text-gray-600">Return on investment and financial performance</p>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Equipment</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Purchase Price</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Total Cost</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Est. Revenue</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">ROI</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">Payback Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.roiAnalysis
                      .sort((a, b) => b.roi - a.roi)
                      .map((eq) => (
                        <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{eq.name}</p>
                              <p className="text-sm text-gray-500">{eq.category}</p>
                            </div>
                          </td>
                          <td className="text-center py-3 px-4 font-medium">{formatCurrency(eq.purchasePrice)}</td>
                          <td className="text-center py-3 px-4 font-medium">{formatCurrency(eq.totalCost)}</td>
                          <td className="text-center py-3 px-4 font-medium">{formatCurrency(eq.estimatedRevenue)}</td>
                          <td className="text-center py-3 px-4">
                            <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                              eq.roi > 20 ? 'bg-green-100 text-green-800' :
                              eq.roi > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {eq.roi}%
                            </span>
                          </td>
                          <td className="text-center py-3 px-4 font-medium">{eq.paybackPeriod} yrs</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Equipment Age Distribution */}
        {analyticsData.equipmentAge && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Fleet Age Distribution</h3>
              <p className="text-gray-600">Equipment age analysis and replacement planning</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(analyticsData.equipmentAge.ageGroups).map(([group, count]) => (
                  <div key={group} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm font-medium">{group}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Equipment by Age:</h4>
                {analyticsData.equipmentAge.ageData
                  .sort((a, b) => b.age - a.age)
                  .slice(0, 10)
                  .map(eq => (
                    <div key={eq.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <span className="text-gray-900 font-medium">{eq.name}</span>
                        <span className="text-gray-500 text-sm ml-2">{eq.make} {eq.model}</span>
                      </div>
                      <span className={`px-2 py-1 text-sm font-medium rounded ${
                        eq.age > 15 ? 'bg-red-100 text-red-800' :
                        eq.age > 10 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {eq.age} years
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/machinery/inventory"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-200"
            >
              <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Update Equipment Data</p>
                <p className="text-sm text-gray-600">Modify operating hours and details</p>
              </div>
            </Link>

            <Link
              to="/machinery/maintenance"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition duration-200"
            >
              <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Review Maintenance</p>
                <p className="text-sm text-gray-600">Check maintenance records</p>
              </div>
            </Link>

            <button
              onClick={() => window.print()}
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition duration-200"
            >
              <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Export Report</p>
                <p className="text-sm text-gray-600">Print or save analytics</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineryAnalyticsPage;