import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const EquipmentInventoryPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    make: '',
    model: '',
    year: '',
    category: '',
    serialNumber: '',
    capacity: '',
    fuelType: '',
    purchasePrice: '',
    purchaseDate: '',
    operatingHours: 0,
    status: 'active',
    location: '',
    notes: ''
  });

  const categories = [
    'Tractor', 'Harvester', 'Planter', 'Cultivator', 'Sprayer', 
    'Irrigation', 'Tillage', 'Hay Equipment', 'Transport', 'Other'
  ];

  const fuelTypes = ['Diesel', 'Gasoline', 'Electric', 'Hybrid', 'Manual'];
  const statusOptions = ['active', 'maintenance', 'retired', 'out-of-service'];

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    filterAndSortEquipment();
  }, [equipment, searchTerm, filterCategory, filterStatus, sortField, sortDirection]);

  const loadEquipment = () => {
    const savedEquipment = JSON.parse(localStorage.getItem('machinery_inventory') || '[]');
    const equipmentWithDepreciation = savedEquipment.map(item => ({
      ...item,
      currentValue: calculateCurrentValue(item),
      depreciationAmount: calculateDepreciation(item),
      monthlyOperatingCost: calculateMonthlyOperatingCost(item)
    }));
    setEquipment(equipmentWithDepreciation);
  };

  const calculateCurrentValue = (item) => {
    if (!item.purchasePrice || !item.purchaseDate) return 0;
    
    const purchasePrice = parseFloat(item.purchasePrice);
    const purchaseYear = new Date(item.purchaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - purchaseYear;
    
    // Simple depreciation: 10% per year for first 10 years, then 5% per year
    let depreciationRate = 0;
    if (age <= 10) {
      depreciationRate = age * 0.10;
    } else {
      depreciationRate = 1.0 + ((age - 10) * 0.05);
    }
    
    const currentValue = Math.max(purchasePrice * (1 - depreciationRate), purchasePrice * 0.1);
    return Math.round(currentValue);
  };

  const calculateDepreciation = (item) => {
    if (!item.purchasePrice) return 0;
    return parseFloat(item.purchasePrice) - calculateCurrentValue(item);
  };

  const calculateMonthlyOperatingCost = (item) => {
    // Estimated based on fuel consumption, maintenance, etc.
    const baseRate = {
      'Tractor': 200,
      'Harvester': 400,
      'Planter': 150,
      'Cultivator': 100,
      'Sprayer': 120,
      'Irrigation': 80,
      'Tillage': 90,
      'Hay Equipment': 110,
      'Transport': 180,
      'Other': 100
    };
    
    return baseRate[item.category] || 100;
  };

  const filterAndSortEquipment = () => {
    let filtered = equipment.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort equipment
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'currentValue' || sortField === 'purchasePrice') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredEquipment(filtered);
  };

  const handleAddEquipment = (e) => {
    e.preventDefault();
    
    const equipmentWithId = {
      ...newEquipment,
      id: Date.now().toString(),
      purchasePrice: parseFloat(newEquipment.purchasePrice) || 0,
      operatingHours: parseFloat(newEquipment.operatingHours) || 0,
      year: parseInt(newEquipment.year) || new Date().getFullYear(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedEquipment = [...equipment, equipmentWithId];
    setEquipment(updatedEquipment);
    localStorage.setItem('machinery_inventory', JSON.stringify(updatedEquipment));
    
    setNewEquipment({
      name: '', make: '', model: '', year: '', category: '', serialNumber: '',
      capacity: '', fuelType: '', purchasePrice: '', purchaseDate: '',
      operatingHours: 0, status: 'active', location: '', notes: ''
    });
    setShowAddForm(false);
  };

  const handleUpdateOperatingHours = (equipmentId, newHours) => {
    const updatedEquipment = equipment.map(item => 
      item.id === equipmentId 
        ? { ...item, operatingHours: parseFloat(newHours) || 0, updatedAt: new Date().toISOString() }
        : item
    );
    setEquipment(updatedEquipment);
    localStorage.setItem('machinery_inventory', JSON.stringify(updatedEquipment));
  };

  const handleStatusChange = (equipmentId, newStatus) => {
    const updatedEquipment = equipment.map(item => 
      item.id === equipmentId 
        ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
        : item
    );
    setEquipment(updatedEquipment);
    localStorage.setItem('machinery_inventory', JSON.stringify(updatedEquipment));
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'retired': 'bg-gray-100 text-gray-800',
      'out-of-service': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.active;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <Link 
              to="/machinery" 
              className="p-2 sm:p-3 bg-white rounded-xl shadow-md border border-gray-200 text-gray-600 hover:text-gray-900 transition-all hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">Equipment <span className="text-blue-600">Inventory</span></h1>
              <p className="text-lg sm:text-xl text-gray-600">Manage your complete equipment fleet</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Equipment
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Equipment</label>
              <input
                type="text"
                placeholder="Search by name, make, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortField}
                onChange={(e) => handleSort(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="year">Year</option>
                <option value="currentValue">Current Value</option>
                <option value="operatingHours">Operating Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredEquipment.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">{item.make} {item.model}</p>
                    <p className="text-sm text-gray-500">Year: {item.year}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Serial Number:</span>
                    <span className="font-medium">{item.serialNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fuel Type:</span>
                    <span className="font-medium">{item.fuelType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Operating Hours:</span>
                    <span className="font-medium">{item.operatingHours.toLocaleString()} hrs</span>
                  </div>
                </div>

                {/* Value Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Purchase Price</p>
                      <p className="font-bold text-gray-900">${item.purchasePrice?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Current Value</p>
                      <p className="font-bold text-green-600">${item.currentValue?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-500 text-xs">Depreciation: ${item.depreciationAmount?.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs">Monthly Op. Cost: ~${item.monthlyOperatingCost}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedEquipment(item)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    View Details
                  </button>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Equipment Found</h3>
            <p className="text-gray-500">No equipment matches your current search and filter criteria.</p>
          </div>
        )}

        {/* Add Equipment Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">Add New Equipment</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddEquipment} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name *</label>
                    <input
                      type="text"
                      required
                      value={newEquipment.name}
                      onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={newEquipment.category}
                      onChange={(e) => setNewEquipment({...newEquipment, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                    <input
                      type="text"
                      required
                      value={newEquipment.make}
                      onChange={(e) => setNewEquipment({...newEquipment, make: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <input
                      type="text"
                      required
                      value={newEquipment.model}
                      onChange={(e) => setNewEquipment({...newEquipment, model: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <input
                      type="number"
                      required
                      min="1900"
                      max="2030"
                      value={newEquipment.year}
                      onChange={(e) => setNewEquipment({...newEquipment, year: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                    <input
                      type="text"
                      value={newEquipment.serialNumber}
                      onChange={(e) => setNewEquipment({...newEquipment, serialNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <input
                      type="text"
                      placeholder="e.g., 150 HP, 500 gal"
                      value={newEquipment.capacity}
                      onChange={(e) => setNewEquipment({...newEquipment, capacity: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                    <select
                      value={newEquipment.fuelType}
                      onChange={(e) => setNewEquipment({...newEquipment, fuelType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Fuel Type</option>
                      {fuelTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newEquipment.purchasePrice}
                      onChange={(e) => setNewEquipment({...newEquipment, purchasePrice: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                    <input
                      type="date"
                      value={newEquipment.purchaseDate}
                      onChange={(e) => setNewEquipment({...newEquipment, purchaseDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Operating Hours</label>
                    <input
                      type="number"
                      min="0"
                      value={newEquipment.operatingHours}
                      onChange={(e) => setNewEquipment({...newEquipment, operatingHours: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g., Barn 1, Field Office"
                      value={newEquipment.location}
                      onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows="3"
                    value={newEquipment.notes}
                    onChange={(e) => setNewEquipment({...newEquipment, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes about this equipment..."
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200"
                  >
                    Add Equipment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Equipment Details Modal */}
        {selectedEquipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedEquipment.name}</h3>
                    <p className="text-gray-600">{selectedEquipment.make} {selectedEquipment.model} ({selectedEquipment.year})</p>
                  </div>
                  <button
                    onClick={() => setSelectedEquipment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedEquipment.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Serial Number:</span>
                        <span className="font-medium">{selectedEquipment.serialNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium">{selectedEquipment.capacity || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fuel Type:</span>
                        <span className="font-medium">{selectedEquipment.fuelType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedEquipment.location || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEquipment.status)}`}>
                          {selectedEquipment.status.charAt(0).toUpperCase() + selectedEquipment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchase Price:</span>
                        <span className="font-medium">${selectedEquipment.purchasePrice?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Value:</span>
                        <span className="font-medium text-green-600">${selectedEquipment.currentValue?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Depreciation:</span>
                        <span className="font-medium text-red-600">${selectedEquipment.depreciationAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Op. Cost:</span>
                        <span className="font-medium">${selectedEquipment.monthlyOperatingCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchase Date:</span>
                        <span className="font-medium">{selectedEquipment.purchaseDate ? new Date(selectedEquipment.purchaseDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Usage Information */}
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Usage Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-600 text-sm font-medium">Operating Hours</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedEquipment.operatingHours?.toLocaleString()}</p>
                        <div className="mt-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Update hours"
                            className="w-full px-3 py-1 text-sm border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onBlur={(e) => {
                              if (e.target.value) {
                                handleUpdateOperatingHours(selectedEquipment.id, e.target.value);
                                setSelectedEquipment({...selectedEquipment, operatingHours: parseFloat(e.target.value)});
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-green-600 text-sm font-medium">Avg. Hours/Month</p>
                        <p className="text-2xl font-bold text-green-900">
                          {selectedEquipment.purchaseDate ? 
                            Math.round(selectedEquipment.operatingHours / Math.max(1, (new Date() - new Date(selectedEquipment.purchaseDate)) / (1000 * 60 * 60 * 24 * 30))) 
                            : 'N/A'}
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-purple-600 text-sm font-medium">Efficiency Score</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {selectedEquipment.status === 'active' ? '85%' : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedEquipment.notes && (
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Notes</h4>
                      <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{selectedEquipment.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <Link
                    to={`/machinery/maintenance?equipment=${selectedEquipment.id}`}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200"
                  >
                    View Maintenance
                  </Link>
                  <button
                    onClick={() => setSelectedEquipment(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentInventoryPage;