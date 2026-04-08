import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import seedsService from '../services/seedsService';

const PlantingTrackerPage = () => {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [seedVarieties, setSeedVarieties] = useState([]);
  const [growthStages, setGrowthStages] = useState([]);
  const [plantingCalendar, setPlantingCalendar] = useState([]);
  const [showPlantingForm, setShowPlantingForm] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [plantingData, setPlantingData] = useState({
    cropVariety: '',
    plantingDate: '',
    expectedHarvest: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fieldsData, varieties, stages] = await Promise.all([
        seedsService.getAllFields(),
        seedsService.getAllSeedVarieties(),
        seedsService.getGrowthStages()
      ]);
      
      setFields(fieldsData);
      setSeedVarieties(varieties);
      setGrowthStages(stages);
      generatePlantingCalendar(fieldsData);
    } catch (error) {
      console.error('Error loading planting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePlantingCalendar = (fieldsData) => {
    const calendar = [];
    
    fieldsData.forEach(field => {
      field.sections.forEach(section => {
        if (section.plantingDate) {
          calendar.push({
            id: `${field.id}-${section.id}`,
            fieldName: field.name,
            sectionId: section.id,
            crop: section.currentCrop,
            plantingDate: section.plantingDate,
            expectedHarvest: section.expectedHarvest,
            status: section.status,
            area: section.area
          });
        }
      });
    });

    // Sort by planting date
    calendar.sort((a, b) => new Date(a.plantingDate) - new Date(b.plantingDate));
    setPlantingCalendar(calendar);
  };

  const handlePlantCrop = async () => {
    try {
      if (!selectedSection || !plantingData.cropVariety || !plantingData.plantingDate) {
        alert('Please fill in all required fields');
        return;
      }

      const selectedVariety = seedVarieties.find(v => v.name === plantingData.cropVariety);
      const plantingDate = new Date(plantingData.plantingDate);
      const expectedHarvestDate = new Date(plantingDate);
      
      if (selectedVariety) {
        expectedHarvestDate.setDate(expectedHarvestDate.getDate() + selectedVariety.characteristics.maturityDays);
      }

      await seedsService.plantCrop(selectedSection.fieldId, selectedSection.id, {
        ...plantingData,
        expectedHarvest: expectedHarvestDate.toISOString().split('T')[0]
      });

      setShowPlantingForm(false);
      setSelectedSection(null);
      setPlantingData({ cropVariety: '', plantingDate: '', expectedHarvest: '', notes: '' });
      await loadData();
    } catch (error) {
      console.error('Error planting crop:', error);
      alert('Error planting crop. Please try again.');
    }
  };

  const updateGrowthStage = async (fieldId, sectionId, newStage) => {
    try {
      await seedsService.updateGrowthStage(fieldId, sectionId, newStage);
      await loadData();
    } catch (error) {
      console.error('Error updating growth stage:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Seed/Planting': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Germination': 'bg-green-100 text-green-800 border-green-200',
      'Seedling': 'bg-blue-100 text-blue-800 border-blue-200',
      'Vegetative': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Flowering': 'bg-purple-100 text-purple-800 border-purple-200',
      'Fruiting/Grain Filling': 'bg-orange-100 text-orange-800 border-orange-200',
      'Maturity': 'bg-red-100 text-red-800 border-red-200',
      'Harvested': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDaysFromPlanting = (plantingDate) => {
    const planted = new Date(plantingDate);
    const today = new Date();
    return Math.floor((today - planted) / (1000 * 60 * 60 * 24));
  };

  const getDaysToHarvest = (expectedHarvest) => {
    if (!expectedHarvest) return null;
    const harvest = new Date(expectedHarvest);
    const today = new Date();
    return Math.ceil((harvest - today) / (1000 * 60 * 60 * 24));
  };

  const getAvailableSections = () => {
    const available = [];
    fields.forEach(field => {
      field.sections.forEach(section => {
        if (!section.currentCrop || section.status === 'Harvested') {
          available.push({
            fieldId: field.id,
            fieldName: field.name,
            ...section
          });
        }
      });
    });
    return available;
  };

  const getActivePlantings = () => {
    return plantingCalendar.filter(p => p.status && p.status !== 'Harvested');
  };

  const getUpcomingHarvests = () => {
    return plantingCalendar.filter(p => {
      const daysToHarvest = getDaysToHarvest(p.expectedHarvest);
      return daysToHarvest !== null && daysToHarvest <= 30 && daysToHarvest > 0;
    });
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
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Planting Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  Please wait while we load your planting tracker data...
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
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-gray-600 bg-clip-text text-transparent">
                  Planting Tracker
                </h1>
              </div>
              <p className="text-lg text-gray-600 ml-14">Advanced scheduling and intelligent crop growth stage monitoring</p>
            </div>
          </div>
          <button
            onClick={() => setShowPlantingForm(true)}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-2xl hover:from-purple-700 hover:to-violet-800 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold">Plan New Planting</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{getActivePlantings().length}</p>
                <p className="text-gray-600 font-medium">Active Plantings</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{plantingCalendar.length}</p>
                <p className="text-gray-600 font-medium">Total Plantings</p>
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
                <p className="text-3xl font-bold text-slate-800 mb-1">{getUpcomingHarvests().length}</p>
                <p className="text-gray-600 font-medium">Upcoming Harvests</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{getAvailableSections().length}</p>
                <p className="text-gray-600">Available Sections</p>
              </div>
            </div>
          </div>
        </div>

        {/* Planting Calendar */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Planting Calendar & Growth Tracking</h2>
          
          {plantingCalendar.length > 0 ? (
            <div className="space-y-4">
              {plantingCalendar.map((planting) => {
                const daysFromPlanting = getDaysFromPlanting(planting.plantingDate);
                const daysToHarvest = getDaysToHarvest(planting.expectedHarvest);
                const selectedVariety = seedVarieties.find(v => v.name === planting.crop);
                
                return (
                  <div key={planting.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{planting.crop}</h3>
                          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(planting.status)}`}>
                            {planting.status || 'Planned'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">{planting.fieldName}, Section {planting.sectionId} • {planting.area} acres</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>Planted: {new Date(planting.plantingDate).toLocaleDateString()}</span>
                          <span>Expected Harvest: {new Date(planting.expectedHarvest).toLocaleDateString()}</span>
                          <span>{daysFromPlanting} days ago</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {daysToHarvest !== null && (
                          <div className={`text-sm font-medium ${
                            daysToHarvest <= 7 ? 'text-red-600' : 
                            daysToHarvest <= 30 ? 'text-orange-600' : 'text-gray-600'
                          }`}>
                            {daysToHarvest > 0 ? 
                              `${daysToHarvest} days to harvest` : 
                              daysToHarvest === 0 ? 'Harvest today!' : 
                              `${Math.abs(daysToHarvest)} days overdue`
                            }
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Growth Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Growth Progress</span>
                        <span className="text-sm text-gray-600">
                          {selectedVariety ? `${Math.round((daysFromPlanting / selectedVariety.characteristics.maturityDays) * 100)}%` : ''}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: selectedVariety ? 
                              `${Math.min((daysFromPlanting / selectedVariety.characteristics.maturityDays) * 100, 100)}%` : 
                              '0%' 
                          }}
                        />
                      </div>
                    </div>

                    {/* Growth Stage Selector */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Update Growth Stage:</span>
                        <select
                          value={planting.status || ''}
                          onChange={(e) => {
                            const fieldId = fields.find(f => f.name === planting.fieldName)?.id;
                            if (fieldId) {
                              updateGrowthStage(fieldId, planting.sectionId, e.target.value);
                            }
                          }}
                          className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select Stage</option>
                          {growthStages.map(stage => (
                            <option key={stage} value={stage}>{stage}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/seeds/harvest?field=${planting.fieldName}&section=${planting.sectionId}`}
                          className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                        >
                          Record Harvest
                        </Link>
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📅</span>
              <p className="text-xl text-gray-600 mb-4">No plantings scheduled yet</p>
              <p className="text-gray-500 mb-6">Start by planning your first crop planting</p>
              <button
                onClick={() => setShowPlantingForm(true)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Plan Your First Planting
              </button>
            </div>
          )}
        </div>

        {/* Available Sections for Planting */}
        {getAvailableSections().length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Sections for Planting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAvailableSections().map((section) => (
                <div
                  key={`${section.fieldId}-${section.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedSection(section);
                    setShowPlantingForm(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{section.fieldName}</h3>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Available
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Section {section.id}</p>
                  <p className="text-sm text-gray-600">Area: {section.area} acres</p>
                  <button className="mt-3 w-full px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">
                    Plan Planting
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Planting Form Modal */}
        {showPlantingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Plan New Planting</h2>
                <button
                  onClick={() => {
                    setShowPlantingForm(false);
                    setSelectedSection(null);
                    setPlantingData({ cropVariety: '', plantingDate: '', expectedHarvest: '', notes: '' });
                  }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handlePlantCrop(); }} className="space-y-6">
                  {/* Section Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Field Section *
                    </label>
                    <select
                      value={selectedSection ? `${selectedSection.fieldId}-${selectedSection.id}` : ''}
                      onChange={(e) => {
                        const [fieldId, sectionId] = e.target.value.split('-');
                        const section = getAvailableSections().find(s => 
                          s.fieldId === parseInt(fieldId) && s.id === sectionId
                        );
                        setSelectedSection(section);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a field section</option>
                      {getAvailableSections().map((section) => (
                        <option key={`${section.fieldId}-${section.id}`} value={`${section.fieldId}-${section.id}`}>
                          {section.fieldName}, Section {section.id} ({section.area} acres)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Crop Variety Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Crop Variety *
                    </label>
                    <select
                      value={plantingData.cropVariety}
                      onChange={(e) => setPlantingData({...plantingData, cropVariety: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a seed variety</option>
                      {seedVarieties.map((variety) => (
                        <option key={variety.id} value={variety.name}>
                          {variety.name} ({variety.characteristics.maturityDays} days)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Planting Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Planting Date *
                    </label>
                    <input
                      type="date"
                      value={plantingData.plantingDate}
                      onChange={(e) => setPlantingData({...plantingData, plantingDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Expected Harvest (Auto-calculated) */}
                  {plantingData.cropVariety && plantingData.plantingDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Harvest Date (Auto-calculated)
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {(() => {
                          const selectedVariety = seedVarieties.find(v => v.name === plantingData.cropVariety);
                          if (selectedVariety && plantingData.plantingDate) {
                            const plantingDate = new Date(plantingData.plantingDate);
                            const harvestDate = new Date(plantingDate);
                            harvestDate.setDate(harvestDate.getDate() + selectedVariety.characteristics.maturityDays);
                            return harvestDate.toLocaleDateString();
                          }
                          return 'Select crop variety and planting date';
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={plantingData.notes}
                      onChange={(e) => setPlantingData({...plantingData, notes: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Add any notes about this planting..."
                    />
                  </div>

                  {/* Variety Information */}
                  {plantingData.cropVariety && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-800 mb-2">Variety Information</h3>
                      {(() => {
                        const variety = seedVarieties.find(v => v.name === plantingData.cropVariety);
                        if (!variety) return null;
                        return (
                          <div className="grid grid-cols-2 gap-3 text-sm text-blue-700">
                            <div>Maturity: {variety.characteristics.maturityDays} days</div>
                            <div>Yield: {variety.characteristics.yieldPerAcre}</div>
                            <div>Water: {variety.characteristics.waterRequirement}</div>
                            <div>Soil: {variety.characteristics.soilType}</div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPlantingForm(false);
                        setSelectedSection(null);
                        setPlantingData({ cropVariety: '', plantingDate: '', expectedHarvest: '', notes: '' });
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Plan Planting
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantingTrackerPage;