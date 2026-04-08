import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import seedsService from '../services/seedsService';

const HarvestRecordsPage = () => {
  const [loading, setLoading] = useState(true);
  const [harvestRecords, setHarvestRecords] = useState([]);
  const [fields, setFields] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sortBy, setSortBy] = useState('harvestDate');
  const [filterField, setFilterField] = useState('all');
  const [harvestForm, setHarvestForm] = useState({
    fieldId: '',
    sectionId: '',
    cropVariety: '',
    plantingDate: '',
    harvestDate: '',
    quantityHarvested: '',
    unit: 'quintals',
    qualityGrade: 'A',
    storageLocation: '',
    marketPrice: '',
    costIncurred: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [records, fieldsData] = await Promise.all([
        seedsService.getAllHarvestRecords(),
        seedsService.getAllFields()
      ]);
      
      setHarvestRecords(records);
      setFields(fieldsData);
    } catch (error) {
      console.error('Error loading harvest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHarvest = async () => {
    try {
      if (!harvestForm.fieldId || !harvestForm.sectionId || !harvestForm.quantityHarvested) {
        alert('Please fill in all required fields');
        return;
      }

      const totalRevenue = parseFloat(harvestForm.quantityHarvested) * parseFloat(harvestForm.marketPrice || 0);
      const costIncurred = parseFloat(harvestForm.costIncurred || 0);
      const profitMargin = totalRevenue > 0 ? ((totalRevenue - costIncurred) / totalRevenue) * 100 : 0;

      await seedsService.addHarvestRecord({
        ...harvestForm,
        fieldId: parseInt(harvestForm.fieldId),
        quantityHarvested: parseFloat(harvestForm.quantityHarvested),
        marketPrice: parseFloat(harvestForm.marketPrice || 0),
        totalRevenue,
        costIncurred,
        profitMargin
      });

      setShowAddForm(false);
      setHarvestForm({
        fieldId: '',
        sectionId: '',
        cropVariety: '',
        plantingDate: '',
        harvestDate: '',
        quantityHarvested: '',
        unit: 'quintals',
        qualityGrade: 'A',
        storageLocation: '',
        marketPrice: '',
        costIncurred: '',
        notes: ''
      });
      await loadData();
    } catch (error) {
      console.error('Error adding harvest record:', error);
      alert('Error adding harvest record. Please try again.');
    }
  };

  const getFilteredAndSortedRecords = () => {
    let filtered = [...harvestRecords];

    // Filter by field
    if (filterField !== 'all') {
      filtered = filtered.filter(record => record.fieldId === parseInt(filterField));
    }

    // Sort records
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'harvestDate':
          return new Date(b.harvestDate) - new Date(a.harvestDate);
        case 'quantity':
          return b.quantityHarvested - a.quantityHarvested;
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'profit':
          return b.profitMargin - a.profitMargin;
        case 'crop':
          return a.cropVariety.localeCompare(b.cropVariety);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getQualityBadgeColor = (grade) => {
    const colors = {
      'Premium': 'bg-purple-100 text-purple-800',
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-red-100 text-red-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  const getTotalStats = () => {
    const filtered = getFilteredAndSortedRecords();
    
    return {
      totalRecords: filtered.length,
      totalQuantity: filtered.reduce((sum, record) => sum + record.quantityHarvested, 0),
      totalRevenue: filtered.reduce((sum, record) => sum + record.totalRevenue, 0),
      averagePrice: filtered.length > 0 ? filtered.reduce((sum, record) => sum + record.marketPrice, 0) / filtered.length : 0,
      averageProfit: filtered.length > 0 ? filtered.reduce((sum, record) => sum + record.profitMargin, 0) / filtered.length : 0
    };
  };

  const getActiveFields = () => {
    return fields.filter(field => 
      field.sections.some(section => 
        section.currentCrop && section.status && section.status !== 'Harvested'
      )
    );
  };

  const getSectionsForField = (fieldId) => {
    const field = fields.find(f => f.id === parseInt(fieldId));
    return field ? field.sections.filter(section => 
      section.currentCrop && section.status && section.status !== 'Harvested'
    ) : [];
  };

  const stats = getTotalStats();

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
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Harvest Records</h3>
                <p className="text-gray-600 leading-relaxed">
                  Please wait while we load your harvest records...
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
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-gray-600 bg-clip-text text-transparent">
                  Harvest Records
                </h1>
              </div>
              <p className="text-lg text-gray-600 ml-14">Comprehensive harvest tracking, quality assessments, and storage management</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-700 text-white rounded-2xl hover:from-orange-700 hover:to-amber-800 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold">Record Harvest</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.totalRecords}</p>
                <p className="text-gray-600 font-medium">Total Records</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.totalQuantity.toFixed(1)}</p>
                <p className="text-gray-600 font-medium">Total Quantity</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 mb-1">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-gray-600 font-medium">Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-bl-3xl"></div>
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">₹{stats.averagePrice.toFixed(0)}</p>
                <p className="text-gray-600">Avg. Price</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💹</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.averageProfit.toFixed(1)}%</p>
                <p className="text-gray-600">Avg. Profit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Fields</option>
              {fields.map(field => (
                <option key={field.id} value={field.id}>{field.name}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="harvestDate">Sort by Harvest Date</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="profit">Sort by Profit Margin</option>
              <option value="crop">Sort by Crop</option>
            </select>

            <div className="flex-1" />

            <div className="text-right">
              <p className="text-sm text-gray-600">
                Showing {getFilteredAndSortedRecords().length} of {harvestRecords.length} records
              </p>
            </div>
          </div>
        </div>

        {/* Harvest Records */}
        <div className="space-y-6">
          {getFilteredAndSortedRecords().map((record) => {
            const field = fields.find(f => f.id === record.fieldId);
            
            return (
              <div
                key={record.id}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{record.cropVariety}</h3>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getQualityBadgeColor(record.qualityGrade)}`}>
                        Grade {record.qualityGrade}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {field?.name}, Section {record.sectionId}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>🗓️ Harvested: {new Date(record.harvestDate).toLocaleDateString()}</span>
                      <span>🌱 Planted: {new Date(record.plantingDate).toLocaleDateString()}</span>
                      <span>📍 Storage: {record.storageLocation}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800 mb-1">
                      {record.quantityHarvested} {record.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      @ ₹{record.marketPrice} per {record.unit}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">₹{record.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">₹{record.costIncurred.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Cost Incurred</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">₹{(record.totalRevenue - record.costIncurred).toLocaleString()}</p>
                    <p className="text-xs text-gray-600">Net Profit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">{record.profitMargin.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">Profit Margin</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {getFilteredAndSortedRecords().length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🚜</span>
            <p className="text-xl text-gray-600 mb-4">No harvest records found</p>
            <p className="text-gray-500 mb-6">
              {harvestRecords.length === 0 
                ? "Start by recording your first harvest"
                : "Try adjusting your filters"
              }
            </p>
            {harvestRecords.length === 0 && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Record Your First Harvest
              </button>
            )}
          </div>
        )}

        {/* Add Harvest Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Record New Harvest</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleAddHarvest(); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Field Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field *
                      </label>
                      <select
                        value={harvestForm.fieldId}
                        onChange={(e) => setHarvestForm({...harvestForm, fieldId: e.target.value, sectionId: ''})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Field</option>
                        {getActiveFields().map(field => (
                          <option key={field.id} value={field.id}>{field.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Section Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section *
                      </label>
                      <select
                        value={harvestForm.sectionId}
                        onChange={(e) => {
                          const section = getSectionsForField(harvestForm.fieldId).find(s => s.id === e.target.value);
                          setHarvestForm({
                            ...harvestForm, 
                            sectionId: e.target.value,
                            cropVariety: section?.currentCrop || '',
                            plantingDate: section?.plantingDate || ''
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                        disabled={!harvestForm.fieldId}
                      >
                        <option value="">Select Section</option>
                        {getSectionsForField(harvestForm.fieldId).map(section => (
                          <option key={section.id} value={section.id}>
                            Section {section.id} - {section.currentCrop}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Crop Variety (Auto-filled) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Crop Variety
                      </label>
                      <input
                        type="text"
                        value={harvestForm.cropVariety}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>

                    {/* Planting Date (Auto-filled) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Planting Date
                      </label>
                      <input
                        type="date"
                        value={harvestForm.plantingDate}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                    </div>

                    {/* Harvest Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harvest Date *
                      </label>
                      <input
                        type="date"
                        value={harvestForm.harvestDate}
                        onChange={(e) => setHarvestForm({...harvestForm, harvestDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Quantity Harvested */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity Harvested *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.1"
                          value={harvestForm.quantityHarvested}
                          onChange={(e) => setHarvestForm({...harvestForm, quantityHarvested: e.target.value})}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.0"
                          required
                        />
                        <select
                          value={harvestForm.unit}
                          onChange={(e) => setHarvestForm({...harvestForm, unit: e.target.value})}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="quintals">Quintals</option>
                          <option value="tons">Tons</option>
                          <option value="kg">Kg</option>
                        </select>
                      </div>
                    </div>

                    {/* Quality Grade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quality Grade
                      </label>
                      <select
                        value={harvestForm.qualityGrade}
                        onChange={(e) => setHarvestForm({...harvestForm, qualityGrade: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="Premium">Premium</option>
                        <option value="A">Grade A</option>
                        <option value="B">Grade B</option>
                        <option value="C">Grade C</option>
                        <option value="D">Grade D</option>
                      </select>
                    </div>

                    {/* Storage Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage Location
                      </label>
                      <input
                        type="text"
                        value={harvestForm.storageLocation}
                        onChange={(e) => setHarvestForm({...harvestForm, storageLocation: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Warehouse A, Cold Storage B"
                      />
                    </div>

                    {/* Market Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Market Price (per {harvestForm.unit})
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          value={harvestForm.marketPrice}
                          onChange={(e) => setHarvestForm({...harvestForm, marketPrice: e.target.value})}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* Cost Incurred */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Cost Incurred
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          value={harvestForm.costIncurred}
                          onChange={(e) => setHarvestForm({...harvestForm, costIncurred: e.target.value})}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Revenue Calculation */}
                  {harvestForm.quantityHarvested && harvestForm.marketPrice && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 mb-2">Revenue Calculation</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-green-700">Total Revenue:</span>
                          <p className="font-bold text-green-800">
                            ₹{(parseFloat(harvestForm.quantityHarvested) * parseFloat(harvestForm.marketPrice)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-green-700">Total Cost:</span>
                          <p className="font-bold text-green-800">
                            ₹{parseFloat(harvestForm.costIncurred || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-green-700">Net Profit:</span>
                          <p className="font-bold text-green-800">
                            ₹{((parseFloat(harvestForm.quantityHarvested) * parseFloat(harvestForm.marketPrice)) - parseFloat(harvestForm.costIncurred || 0)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={harvestForm.notes}
                      onChange={(e) => setHarvestForm({...harvestForm, notes: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Add any notes about this harvest..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Record Harvest
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Record Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-screen overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Harvest Record Details</h2>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Crop Variety:</span>
                        <p className="font-medium text-gray-800">{selectedRecord.cropVariety}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Field & Section:</span>
                        <p className="font-medium text-gray-800">
                          {fields.find(f => f.id === selectedRecord.fieldId)?.name}, Section {selectedRecord.sectionId}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Planting Date:</span>
                        <p className="font-medium text-gray-800">{new Date(selectedRecord.plantingDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Harvest Date:</span>
                        <p className="font-medium text-gray-800">{new Date(selectedRecord.harvestDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Growth Duration:</span>
                        <p className="font-medium text-gray-800">
                          {Math.floor((new Date(selectedRecord.harvestDate) - new Date(selectedRecord.plantingDate)) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Quality Grade:</span>
                        <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full ml-2 ${getQualityBadgeColor(selectedRecord.qualityGrade)}`}>
                          Grade {selectedRecord.qualityGrade}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Harvest Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Harvest Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Quantity Harvested:</span>
                        <p className="font-medium text-gray-800">{selectedRecord.quantityHarvested} {selectedRecord.unit}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Storage Location:</span>
                        <p className="font-medium text-gray-800">{selectedRecord.storageLocation || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Financial Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Market Price:</span>
                          <span className="font-medium text-gray-800">₹{selectedRecord.marketPrice} per {selectedRecord.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Revenue:</span>
                          <span className="font-bold text-green-600">₹{selectedRecord.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost Incurred:</span>
                          <span className="font-bold text-red-600">₹{selectedRecord.costIncurred.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Net Profit:</span>
                          <span className="font-bold text-blue-600">
                            ₹{(selectedRecord.totalRevenue - selectedRecord.costIncurred).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profit Margin:</span>
                          <span className="font-bold text-purple-600">{selectedRecord.profitMargin.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenue per {selectedRecord.unit}:</span>
                          <span className="font-medium text-gray-800">
                            ₹{(selectedRecord.totalRevenue / selectedRecord.quantityHarvested).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HarvestRecordsPage;