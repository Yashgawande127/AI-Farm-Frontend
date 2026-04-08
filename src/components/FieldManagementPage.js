import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import seedsService from '../services/seedsService';

const FieldManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showAddField, setShowAddField] = useState(false);
  const [seedVarieties, setSeedVarieties] = useState([]);
  const [growthStages, setGrowthStages] = useState([]);

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
    } catch (error) {
      console.error('Error loading field data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Seed/Planting': 'bg-yellow-100 text-yellow-800',
      'Germination': 'bg-green-100 text-green-800',
      'Seedling': 'bg-blue-100 text-blue-800',
      'Vegetative': 'bg-emerald-100 text-emerald-800',
      'Flowering': 'bg-purple-100 text-purple-800',
      'Fruiting': 'bg-orange-100 text-orange-800',
      'Maturity': 'bg-red-100 text-red-800',
      'Harvested': 'bg-gray-100 text-gray-800',
      'Planned': 'bg-indigo-100 text-indigo-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateDaysToHarvest = (expectedHarvest) => {
    if (!expectedHarvest) return null;
    const harvest = new Date(expectedHarvest);
    const today = new Date();
    const days = Math.ceil((harvest - today) / (1000 * 60 * 60 * 24));
    return days;
  };

  const updateSectionStage = async (fieldId, sectionId, newStage) => {
    try {
      await seedsService.updateGrowthStage(fieldId, sectionId, newStage);
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Error updating growth stage:', error);
    }
  };

  const getTotalArea = () => {
    return fields.reduce((total, field) => total + field.area, 0);
  };

  const getActiveSection = () => {
    return fields.reduce((count, field) => {
      return count + field.sections.filter(section => 
        section.status && section.status !== 'Harvested' && section.status !== 'Planned'
      ).length;
    }, 0);
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
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Field Data</h3>
                <p className="text-gray-600 leading-relaxed">
                  Please wait while we load your field management data...
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-gray-600 bg-clip-text text-transparent">
                  Field Management
                </h1>
              </div>
              <p className="text-lg text-gray-600 ml-14">Visual field layouts with intelligent crop allocation and growth monitoring</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddField(true)}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold">Add New Field</span>
          </button>
        </div>

        {/* Field Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{fields.length}</p>
                <p className="text-gray-600 font-medium">Total Fields</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{getTotalArea().toFixed(1)}</p>
                <p className="text-gray-600 font-medium">Total Acres</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{getActiveSection()}</p>
                <p className="text-gray-600 font-medium">Active Sections</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">85%</p>
                <p className="text-gray-600 font-medium">Field Utilization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {fields.map((field) => (
            <div key={field.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Field Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
                </div>
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold">{field.name}</h2>
                    </div>
                    <div className="flex items-center gap-6 text-blue-100">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="font-medium">{field.area} {field.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                        </svg>
                        <span className="font-medium">{field.soilType}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedField(selectedField?.id === field.id ? null : field)}
                    className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl hover:bg-opacity-30 transition-all duration-300 font-medium text-sm"
                  >
                    {selectedField?.id === field.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {/* Field Sections */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Field Sections</h3>
                <div className="grid grid-cols-1 gap-4">
                  {field.sections.map((section) => {
                    const daysToHarvest = calculateDaysToHarvest(section.expectedHarvest);
                    
                    return (
                      <div
                        key={section.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedSection(section)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-800">Section {section.id}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(section.status)}`}>
                                {section.status || 'Available'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Area: {section.area} acres</p>
                          </div>
                          <div className="text-right">
                            {daysToHarvest !== null && (
                              <p className={`text-sm font-medium ${daysToHarvest <= 7 ? 'text-red-600' : daysToHarvest <= 30 ? 'text-orange-600' : 'text-gray-600'}`}>
                                {daysToHarvest > 0 ? `${daysToHarvest} days to harvest` : daysToHarvest === 0 ? 'Harvest today!' : `${Math.abs(daysToHarvest)} days overdue`}
                              </p>
                            )}
                          </div>
                        </div>

                        {section.currentCrop && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="font-medium text-gray-800 mb-1">{section.currentCrop}</p>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Planted: {section.plantingDate ? new Date(section.plantingDate).toLocaleDateString() : 'N/A'}</span>
                              <span>Expected Harvest: {section.expectedHarvest ? new Date(section.expectedHarvest).toLocaleDateString() : 'N/A'}</span>
                            </div>
                          </div>
                        )}

                        {!section.currentCrop && (
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <p className="text-green-700 font-medium">Available for Planting</p>
                            <p className="text-sm text-green-600">Click to plan crop allocation</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Field Details (Expanded) */}
              {selectedField?.id === field.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Field Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Location</h4>
                      <p className="text-sm text-gray-600 mb-1">
                        Coordinates: {field.coordinates.lat}, {field.coordinates.lng}
                      </p>
                      <p className="text-sm text-gray-600">Soil Type: {field.soilType}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Utilization</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Total Area: {field.area} {field.unit}
                        </p>
                        <p className="text-sm text-gray-600">
                          Utilized Area: {field.sections.reduce((sum, s) => sum + s.area, 0)} {field.unit}
                        </p>
                        <p className="text-sm text-gray-600">
                          Active Crops: {field.sections.filter(s => s.currentCrop && s.status !== 'Harvested').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🗺️</span>
            <p className="text-xl text-gray-600 mb-4">No fields configured yet</p>
            <p className="text-gray-500 mb-6">Start by adding your first field to manage crop allocation</p>
            <button
              onClick={() => setShowAddField(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Field
            </button>
          </div>
        )}

        {/* Section Details Modal */}
        {selectedSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Section {selectedSection.id} Details</h2>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Current Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Status</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600">Growth Stage:</span>
                        <select
                          value={selectedSection.status || ''}
                          onChange={(e) => {
                            const fieldId = fields.find(f => f.sections.some(s => s.id === selectedSection.id))?.id;
                            if (fieldId) {
                              updateSectionStage(fieldId, selectedSection.id, e.target.value);
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Stage</option>
                          {growthStages.map(stage => (
                            <option key={stage} value={stage}>{stage}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-600">Area:</span>
                          <p className="font-medium">{selectedSection.area} acres</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Current Crop:</span>
                          <p className="font-medium">{selectedSection.currentCrop || 'Not planted'}</p>
                        </div>
                        {selectedSection.plantingDate && (
                          <div>
                            <span className="text-gray-600">Planting Date:</span>
                            <p className="font-medium">{new Date(selectedSection.plantingDate).toLocaleDateString()}</p>
                          </div>
                        )}
                        {selectedSection.expectedHarvest && (
                          <div>
                            <span className="text-gray-600">Expected Harvest:</span>
                            <p className="font-medium">{new Date(selectedSection.expectedHarvest).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Growth Timeline */}
                  {selectedSection.currentCrop && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Growth Timeline</h3>
                      <div className="space-y-2">
                        {growthStages.map((stage, index) => {
                          const isCurrentStage = stage === selectedSection.status;
                          const isPastStage = growthStages.indexOf(selectedSection.status) > index;
                          
                          return (
                            <div
                              key={stage}
                              className={`flex items-center gap-3 p-3 rounded-lg ${
                                isCurrentStage 
                                  ? 'bg-blue-100 border border-blue-200' 
                                  : isPastStage 
                                  ? 'bg-green-50 border border-green-200' 
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full ${
                                isCurrentStage 
                                  ? 'bg-blue-600' 
                                  : isPastStage 
                                  ? 'bg-green-600' 
                                  : 'bg-gray-300'
                              }`} />
                              <span className={`font-medium ${
                                isCurrentStage 
                                  ? 'text-blue-800' 
                                  : isPastStage 
                                  ? 'text-green-800' 
                                  : 'text-gray-600'
                              }`}>
                                {stage}
                              </span>
                              {isCurrentStage && (
                                <span className="ml-auto text-sm bg-blue-600 text-white px-2 py-1 rounded-full">
                                  Current
                                </span>
                              )}
                              {isPastStage && (
                                <span className="ml-auto text-sm text-green-600">
                                  ✓
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      {!selectedSection.currentCrop ? (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Plan Planting
                        </button>
                      ) : (
                        <>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Update Growth Stage
                          </button>
                          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            Record Harvest
                          </button>
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            View Analytics
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Field Performance Summary */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Field Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌾</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Crop Diversity</h3>
              <p className="text-3xl font-bold text-green-600 mb-1">
                {new Set(fields.flatMap(f => f.sections.map(s => s.currentCrop).filter(Boolean))).size}
              </p>
              <p className="text-gray-600">Different Crops</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Utilization Rate</h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">85%</p>
              <p className="text-gray-600">Field Utilization</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Harvests</h3>
              <p className="text-3xl font-bold text-orange-600 mb-1">
                {fields.reduce((count, field) => {
                  return count + field.sections.filter(section => {
                    const daysToHarvest = calculateDaysToHarvest(section.expectedHarvest);
                    return daysToHarvest !== null && daysToHarvest <= 30 && daysToHarvest > 0;
                  }).length;
                }, 0)}
              </p>
              <p className="text-gray-600">Next 30 Days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldManagementPage;