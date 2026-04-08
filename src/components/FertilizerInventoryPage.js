import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const FertilizerInventoryPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for fertilizers
  const [fertilizers, setFertilizers] = useState([
    {
      id: 1,
      name: 'NPK 10-10-10',
      type: 'synthetic',
      category: 'balanced',
      composition: {
        nitrogen: 10,
        phosphorus: 10,
        potassium: 10,
        micronutrients: ['Iron', 'Manganese', 'Zinc']
      },
      stock: {
        current: 45,
        unit: 'bags',
        reorderLevel: 20,
        location: 'Warehouse A'
      },
      cost: {
        pricePerUnit: 25.50,
        totalValue: 1147.50,
        supplier: 'AgriSupply Co.'
      },
      soilCompatibility: ['Loamy', 'Clay', 'Sandy-loam'],
      cropSuitability: ['Corn', 'Wheat', 'Soybeans'],
      applicationRate: {
        min: 100,
        max: 200,
        unit: 'kg/hectare'
      },
      expiryDate: '2025-08-15',
      batchNumber: 'NPK2024-456',
      organicCertified: false
    },
    {
      id: 2,
      name: 'Organic Compost',
      type: 'organic',
      category: 'soil_conditioner',
      composition: {
        nitrogen: 2,
        phosphorus: 1,
        potassium: 2,
        organicMatter: 35,
        micronutrients: ['Calcium', 'Magnesium', 'Sulfur']
      },
      stock: {
        current: 12,
        unit: 'cubic yards',
        reorderLevel: 5,
        location: 'Compost Area'
      },
      cost: {
        pricePerUnit: 35.00,
        totalValue: 420.00,
        supplier: 'Local Farm Co-op'
      },
      soilCompatibility: ['All soil types'],
      cropSuitability: ['All organic crops'],
      applicationRate: {
        min: 2,
        max: 5,
        unit: 'cubic yards/hectare'
      },
      expiryDate: 'N/A',
      batchNumber: 'ORG2024-123',
      organicCertified: true
    },
    {
      id: 3,
      name: 'Phosphorus Booster',
      type: 'synthetic',
      category: 'phosphorus',
      composition: {
        nitrogen: 0,
        phosphorus: 46,
        potassium: 0,
        micronutrients: ['Calcium']
      },
      stock: {
        current: 8,
        unit: 'bags',
        reorderLevel: 15,
        location: 'Warehouse B'
      },
      cost: {
        pricePerUnit: 42.00,
        totalValue: 336.00,
        supplier: 'FertMax Industries'
      },
      soilCompatibility: ['Sandy', 'Loamy'],
      cropSuitability: ['Root vegetables', 'Flowering plants'],
      applicationRate: {
        min: 50,
        max: 100,
        unit: 'kg/hectare'
      },
      expiryDate: '2025-12-20',
      batchNumber: 'PHOS2024-789',
      organicCertified: false
    },
    {
      id: 4,
      name: 'Liquid Kelp Extract',
      type: 'organic',
      category: 'micronutrient',
      composition: {
        nitrogen: 1,
        phosphorus: 0.1,
        potassium: 12,
        micronutrients: ['Iodine', 'Boron', 'Molybdenum', 'Cobalt']
      },
      stock: {
        current: 25,
        unit: 'liters',
        reorderLevel: 10,
        location: 'Cold Storage'
      },
      cost: {
        pricePerUnit: 18.75,
        totalValue: 468.75,
        supplier: 'Marine Organics Ltd.'
      },
      soilCompatibility: ['All soil types'],
      cropSuitability: ['Vegetables', 'Fruits', 'Herbs'],
      applicationRate: {
        min: 2,
        max: 4,
        unit: 'liters/hectare'
      },
      expiryDate: '2025-06-30',
      batchNumber: 'KELP2024-321',
      organicCertified: true
    }
  ]);

  const [newFertilizer, setNewFertilizer] = useState({
    name: '',
    type: 'synthetic',
    category: 'balanced',
    composition: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      micronutrients: []
    },
    stock: {
      current: 0,
      unit: 'bags',
      reorderLevel: 0,
      location: ''
    },
    cost: {
      pricePerUnit: 0,
      supplier: ''
    },
    soilCompatibility: [],
    cropSuitability: [],
    applicationRate: {
      min: 0,
      max: 0,
      unit: 'kg/hectare'
    },
    expiryDate: '',
    batchNumber: '',
    organicCertified: false
  });

  const filteredFertilizers = fertilizers.filter(fertilizer => {
    const matchesSearch = fertilizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fertilizer.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || fertilizer.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalInventoryValue = fertilizers.reduce((sum, f) => sum + f.cost.totalValue, 0);
  const lowStockItems = fertilizers.filter(f => f.stock.current <= f.stock.reorderLevel);
  const organicItems = fertilizers.filter(f => f.organicCertified);

  const handleAddFertilizer = (e) => {
    e.preventDefault();
    const id = Math.max(...fertilizers.map(f => f.id)) + 1;
    const totalValue = newFertilizer.stock.current * newFertilizer.cost.pricePerUnit;
    
    setFertilizers([...fertilizers, {
      ...newFertilizer,
      id,
      cost: {
        ...newFertilizer.cost,
        totalValue
      }
    }]);
    
    setShowAddModal(false);
    setNewFertilizer({
      name: '',
      type: 'synthetic',
      category: 'balanced',
      composition: {
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        micronutrients: []
      },
      stock: {
        current: 0,
        unit: 'bags',
        reorderLevel: 0,
        location: ''
      },
      cost: {
        pricePerUnit: 0,
        supplier: ''
      },
      soilCompatibility: [],
      cropSuitability: [],
      applicationRate: {
        min: 0,
        max: 0,
        unit: 'kg/hectare'
      },
      expiryDate: '',
      batchNumber: '',
      organicCertified: false
    });
  };

  const getStockStatus = (current, reorderLevel) => {
    if (current <= reorderLevel) return 'critical';
    if (current <= reorderLevel * 1.5) return 'low';
    return 'good';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'low': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
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
          <span className="text-gray-900 font-medium">Inventory Management</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Fertilizer Inventory
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Comprehensive tracking of fertilizer stock, composition, and compatibility
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Fertilizer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{fertilizers.length}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{totalInventoryValue.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{lowStockItems.length}</div>
            <div className="text-sm text-gray-600">Low Stock Alerts</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{organicItems.length}</div>
            <div className="text-sm text-gray-600">Organic Certified</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fertilizers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="synthetic">Synthetic</option>
                <option value="organic">Organic</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('composition')}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  activeTab === 'composition'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Composition
              </button>
              <button
                onClick={() => setActiveTab('compatibility')}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  activeTab === 'compatibility'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Compatibility
              </button>
            </div>
          </div>
        </div>

        {/* Fertilizer Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFertilizers.map((fertilizer) => (
            <div key={fertilizer.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{fertilizer.name}</h3>
                  <div className="flex items-center space-x-2">
                    {fertilizer.organicCertified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        ORGANIC
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(getStockStatus(fertilizer.stock.current, fertilizer.stock.reorderLevel))}`}>
                      {getStockStatus(fertilizer.stock.current, fertilizer.stock.reorderLevel)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 capitalize">{fertilizer.category.replace('_', ' ')}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Stock Level</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {fertilizer.stock.current} {fertilizer.stock.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            getStockStatus(fertilizer.stock.current, fertilizer.stock.reorderLevel) === 'critical' 
                              ? 'bg-red-500' 
                              : getStockStatus(fertilizer.stock.current, fertilizer.stock.reorderLevel) === 'low'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min((fertilizer.stock.current / (fertilizer.stock.reorderLevel * 2)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium text-gray-900">{fertilizer.stock.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price/Unit:</span>
                      <span className="text-sm font-medium text-gray-900">₹{fertilizer.cost.pricePerUnit}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Value:</span>
                      <span className="text-sm font-semibold text-green-600">₹{fertilizer.cost.totalValue.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'composition' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{fertilizer.composition.nitrogen}%</div>
                        <div className="text-xs text-gray-600">Nitrogen</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{fertilizer.composition.phosphorus}%</div>
                        <div className="text-xs text-gray-600">Phosphorus</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{fertilizer.composition.potassium}%</div>
                        <div className="text-xs text-gray-600">Potassium</div>
                      </div>
                    </div>
                    
                    {fertilizer.composition.organicMatter && (
                      <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-yellow-600">{fertilizer.composition.organicMatter}%</div>
                        <div className="text-xs text-gray-600">Organic Matter</div>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700 mb-2 block">Micronutrients:</span>
                      <div className="flex flex-wrap gap-1">
                        {fertilizer.composition.micronutrients.map((nutrient, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {nutrient}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'compatibility' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700 mb-2 block">Soil Compatibility:</span>
                      <div className="flex flex-wrap gap-1">
                        {fertilizer.soilCompatibility.map((soil, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                            {soil}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700 mb-2 block">Suitable Crops:</span>
                      <div className="flex flex-wrap gap-1">
                        {fertilizer.cropSuitability.map((crop, index) => (
                          <span key={index} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">Application Rate:</div>
                      <div className="text-sm text-gray-600">
                        {fertilizer.applicationRate.min}-{fertilizer.applicationRate.max} {fertilizer.applicationRate.unit}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Batch: {fertilizer.batchNumber}</span>
                  <span className="text-gray-600">Exp: {fertilizer.expiryDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Fertilizer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">Add New Fertilizer</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleAddFertilizer} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newFertilizer.name}
                      onChange={(e) => setNewFertilizer({...newFertilizer, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newFertilizer.type}
                      onChange={(e) => setNewFertilizer({...newFertilizer, type: e.target.value})}
                    >
                      <option value="synthetic">Synthetic</option>
                      <option value="organic">Organic</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nitrogen %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newFertilizer.composition.nitrogen}
                      onChange={(e) => setNewFertilizer({
                        ...newFertilizer,
                        composition: {...newFertilizer.composition, nitrogen: parseFloat(e.target.value) || 0}
                      })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phosphorus %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newFertilizer.composition.phosphorus}
                      onChange={(e) => setNewFertilizer({
                        ...newFertilizer,
                        composition: {...newFertilizer.composition, phosphorus: parseFloat(e.target.value) || 0}
                      })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Potassium %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newFertilizer.composition.potassium}
                      onChange={(e) => setNewFertilizer({
                        ...newFertilizer,
                        composition: {...newFertilizer.composition, potassium: parseFloat(e.target.value) || 0}
                      })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
                    <div className="flex">
                      <input
                        type="number"
                        min="0"
                        required
                        className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={newFertilizer.stock.current}
                        onChange={(e) => setNewFertilizer({
                          ...newFertilizer,
                          stock: {...newFertilizer.stock, current: parseFloat(e.target.value) || 0}
                        })}
                      />
                      <select
                        className="border-l-0 border border-gray-300 rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={newFertilizer.stock.unit}
                        onChange={(e) => setNewFertilizer({
                          ...newFertilizer,
                          stock: {...newFertilizer.stock, unit: e.target.value}
                        })}
                      >
                        <option value="bags">Bags</option>
                        <option value="kg">Kg</option>
                        <option value="liters">Liters</option>
                        <option value="cubic yards">Cubic Yards</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={newFertilizer.cost.pricePerUnit}
                      onChange={(e) => setNewFertilizer({
                        ...newFertilizer,
                        cost: {...newFertilizer.cost, pricePerUnit: parseFloat(e.target.value) || 0}
                      })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="organic"
                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                    checked={newFertilizer.organicCertified}
                    onChange={(e) => setNewFertilizer({...newFertilizer, organicCertified: e.target.checked})}
                  />
                  <label htmlFor="organic" className="text-sm font-medium text-gray-700">
                    Organic Certified
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    Add Fertilizer
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

export default FertilizerInventoryPage;