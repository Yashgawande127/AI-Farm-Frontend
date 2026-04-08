import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import seedsService from '../services/seedsService';

const SeasonalPlanningPage = () => {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [seedVarieties, setSeedVarieties] = useState([]);
  const [cropRotationPlans, setCropRotationPlans] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('Kharif');
  const [selectedSoilType, setSelectedSoilType] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [showRotationPlanner, setShowRotationPlanner] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  const seasons = ['Kharif', 'Rabi', 'Summer'];
  const soilTypes = ['Clay loam', 'Sandy loam', 'Black cotton soil', 'Well-drained loam', 'Well-drained sandy loam'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSeason && selectedSoilType) {
      loadRecommendations();
    }
  }, [selectedSeason, selectedSoilType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fieldsData, varieties, rotationPlans] = await Promise.all([
        seedsService.getAllFields(),
        seedsService.getAllSeedVarieties(),
        seedsService.getCropRotationPlans()
      ]);
      
      setFields(fieldsData);
      setSeedVarieties(varieties);
      setCropRotationPlans(rotationPlans);
      
      // Set default soil type from first field
      if (fieldsData.length > 0 && !selectedSoilType) {
        setSelectedSoilType(fieldsData[0].soilType);
      }
    } catch (error) {
      console.error('Error loading seasonal planning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const recs = await seedsService.getSeasonalRecommendations(selectedSeason, selectedSoilType);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const getCurrentSeasonRecommendations = () => {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    if (currentMonth >= 6 && currentMonth <= 9) {
      return 'Kharif'; // June to September
    } else if (currentMonth >= 11 || currentMonth <= 3) {
      return 'Rabi'; // November to March
    } else {
      return 'Summer'; // April to May
    }
  };

  const getSeasonalCalendar = () => {
    return [
      {
        season: 'Kharif',
        period: 'June - October',
        description: 'Monsoon season crops requiring high rainfall',
        crops: ['Rice', 'Cotton', 'Sugarcane', 'Maize', 'Pulses'],
        color: 'bg-green-100 border-green-300 text-green-800'
      },
      {
        season: 'Rabi',
        period: 'November - April',
        description: 'Winter season crops with cool weather',
        crops: ['Wheat', 'Barley', 'Gram', 'Peas', 'Mustard'],
        color: 'bg-blue-100 border-blue-300 text-blue-800'
      },
      {
        season: 'Summer',
        period: 'March - June',
        description: 'Hot season crops with irrigation',
        crops: ['Vegetables', 'Fodder', 'Watermelon', 'Cucumber'],
        color: 'bg-orange-100 border-orange-300 text-orange-800'
      }
    ];
  };

  const getPlantingWindow = (variety) => {
    const currentSeason = getCurrentSeasonRecommendations();
    const isCurrentSeason = variety.seasonalInfo.plantingSeasons.includes(currentSeason);
    const daysLeft = isCurrentSeason ? getSeasonDaysLeft(currentSeason) : null;
    
    return { isCurrentSeason, daysLeft };
  };

  const getSeasonDaysLeft = (season) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentDate = new Date().getDate();
    
    let endMonth;
    switch (season) {
      case 'Kharif':
        endMonth = 9; // September
        break;
      case 'Rabi':
        endMonth = currentMonth <= 4 ? 4 : 12; // April or December
        break;
      case 'Summer':
        endMonth = 6; // June
        break;
      default:
        return null;
    }
    
    const endDate = new Date(new Date().getFullYear(), endMonth - 1, 30);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : null;
  };

  const getCropRotationSuggestions = (fieldId) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return [];

    // Get currently planted crops in field sections
    const currentCrops = field.sections
      .filter(section => section.currentCrop)
      .map(section => section.currentCrop);

    // Suggest complementary crops for rotation
    const rotationSuggestions = seedVarieties.filter(variety => {
      // Avoid same crop family
      const isDifferentCategory = !currentCrops.some(current => 
        current.toLowerCase().includes(variety.category.toLowerCase())
      );
      
      // Check soil compatibility
      const soilMatch = variety.characteristics.soilType.toLowerCase().includes(field.soilType.toLowerCase()) ||
                       field.soilType.toLowerCase().includes(variety.characteristics.soilType.toLowerCase());
      
      return isDifferentCategory && soilMatch;
    });

    return rotationSuggestions.slice(0, 5);
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
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Planning Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  Please wait while we load your seasonal planning data...
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
                <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-pink-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-gray-600 bg-clip-text text-transparent">
                  Seasonal Planning
                </h1>
              </div>
              <p className="text-lg text-gray-600 ml-14">Intelligent crop rotation planning with seasonal optimization strategies</p>
            </div>
          </div>
          <button
            onClick={() => setShowRotationPlanner(true)}
            className="group px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-700 text-white rounded-2xl hover:from-rose-700 hover:to-pink-800 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold">Plan Rotation</span>
          </button>
        </div>

        {/* Current Season Alert */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 mb-12 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
          </div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3">Current Season: {getCurrentSeasonRecommendations()}</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Optimal time for {getCurrentSeasonRecommendations().toLowerCase()} season crops. 
                Plan your plantings according to seasonal requirements and local climate conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Seasonal Calendar */}
        <div className="bg-white rounded-2xl p-10 shadow-xl border border-gray-100 mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Seasonal Calendar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getSeasonalCalendar().map((season) => {
              const isCurrentSeason = season.season === getCurrentSeasonRecommendations();
              
              return (
                <div
                  key={season.season}
                  className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                    isCurrentSeason 
                      ? 'ring-2 ring-blue-500 ring-opacity-30 shadow-lg transform scale-105' 
                      : 'hover:transform hover:scale-102'
                  } ${season.color}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">{season.season}</h3>
                    {isCurrentSeason && (
                      <div className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold">
                        ACTIVE
                      </div>
                    )}
                  </div>
                  <p className="font-semibold mb-2 text-lg">{season.period}</p>
                  <p className="mb-6 leading-relaxed">{season.description}</p>
                  <div className="space-y-4">
                    <p className="font-bold text-lg">Suitable Crops:</p>
                    <div className="flex flex-wrap gap-2">
                      {season.crops.map((crop) => (
                        <span key={crop} className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seasonal Recommendations */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Seasonal Recommendations</h2>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              {seasons.map(season => (
                <option key={season} value={season}>{season} Season</option>
              ))}
            </select>
            
            <select
              value={selectedSoilType}
              onChange={(e) => setSelectedSoilType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select Soil Type</option>
              {soilTypes.map(soilType => (
                <option key={soilType} value={soilType}>{soilType}</option>
              ))}
            </select>
          </div>

          {/* Recommendations Grid */}
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((variety) => {
                const plantingWindow = getPlantingWindow(variety);
                
                return (
                  <div key={variety.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{variety.name}</h3>
                        <p className="text-sm text-gray-600">{variety.category}</p>
                      </div>
                      {plantingWindow.isCurrentSeason && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Optimal Now
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Maturity:</span>
                        <span className="font-medium">{variety.characteristics.maturityDays} days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Yield:</span>
                        <span className="font-medium">{variety.characteristics.yieldPerAcre}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Water Need:</span>
                        <span className="font-medium">{variety.characteristics.waterRequirement}</span>
                      </div>
                    </div>

                    {/* Planting Months */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Best Planting Months:</p>
                      <div className="flex flex-wrap gap-1">
                        {variety.seasonalInfo.bestMonths.map((month) => (
                          <span key={month} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                            {month}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Planting Window Alert */}
                    {plantingWindow.isCurrentSeason && plantingWindow.daysLeft && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <p className="text-xs text-yellow-800">
                          ⏰ Plant within {plantingWindow.daysLeft} days for optimal results
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-700">
                        ₹{variety.costInfo.pricePerKg}/kg
                      </span>
                      <Link
                        to="/seeds/planting"
                        className="px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
                      >
                        Plan Planting
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">🌾</span>
              <p className="text-gray-600">No recommendations found for selected season and soil type</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Crop Rotation Plans */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Crop Rotation Plans</h2>
            <span className="text-sm text-gray-600">{cropRotationPlans.length} plan(s)</span>
          </div>

          {cropRotationPlans.length > 0 ? (
            <div className="space-y-8">
              {cropRotationPlans.map((plan) => (
                <div key={plan.fieldId} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{plan.fieldName}</h3>
                      <p className="text-sm text-gray-600">{plan.rotationCycle} rotation cycle</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Edit Plan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plan.years.map((yearPlan) => (
                      <div key={yearPlan.year} className="border border-gray-100 rounded-lg p-4">
                        <h4 className="text-lg font-medium text-gray-800 mb-4 text-center">
                          {yearPlan.year}
                        </h4>
                        <div className="space-y-4">
                          {yearPlan.seasons.map((seasonPlan) => (
                            <div key={seasonPlan.season} className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700">{seasonPlan.season}</h5>
                              <div className="space-y-1">
                                {seasonPlan.crops.map((crop, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="text-sm text-gray-600">{crop}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">🔄</span>
              <p className="text-gray-600 mb-4">No rotation plans configured yet</p>
              <button
                onClick={() => setShowRotationPlanner(true)}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Create First Rotation Plan
              </button>
            </div>
          )}
        </div>

        {/* Field-specific Rotation Suggestions */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Field-Specific Rotation Suggestions</h2>
          
          <div className="space-y-6">
            {fields.map((field) => {
              const rotationSuggestions = getCropRotationSuggestions(field.id);
              
              return (
                <div key={field.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{field.name}</h3>
                      <p className="text-sm text-gray-600">{field.soilType} • {field.area} {field.unit}</p>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Currently Growing:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {field.sections.filter(s => s.currentCrop).map((section) => (
                            <span key={section.id} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {section.currentCrop}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {rotationSuggestions.length > 0 ? (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Rotation Suggestions:</p>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {rotationSuggestions.map((suggestion) => (
                          <div key={suggestion.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="text-sm font-medium text-green-800">{suggestion.name}</h4>
                            <p className="text-xs text-green-600">{suggestion.category}</p>
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {suggestion.seasonalInfo.plantingSeasons.map((season) => (
                                  <span key={season} className="px-1 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                                    {season}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No specific rotation suggestions available</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rotation Planner Modal */}
        {showRotationPlanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Crop Rotation Planner</h2>
                <button
                  onClick={() => setShowRotationPlanner(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🔄</span>
                  <p className="text-xl text-gray-600 mb-4">Rotation Planner Coming Soon</p>
                  <p className="text-gray-500">
                    Interactive rotation planning tool will be available in the next update
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonalPlanningPage;