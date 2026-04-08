import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from './Header';

const MaintenanceSystemPage = () => {
  const [searchParams] = useSearchParams();
  const equipmentFilter = searchParams.get('equipment');
  
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterEquipment, setFilterEquipment] = useState(equipmentFilter || 'all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newMaintenance, setNewMaintenance] = useState({
    equipmentId: equipmentFilter || '',
    type: 'scheduled',
    category: '',
    description: '',
    scheduledDate: '',
    completedDate: '',
    status: 'scheduled',
    cost: '',
    laborHours: '',
    parts: '',
    serviceProviderId: '',
    notes: '',
    nextDueHours: '',
    nextDueDate: ''
  });

  const [newProvider, setNewProvider] = useState({
    name: '',
    specialties: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    rating: 5,
    notes: ''
  });

  const maintenanceCategories = [
    'Oil Change', 'Filter Replacement', 'Tire Maintenance', 'Engine Tune-up',
    'Hydraulic System', 'Electrical System', 'Transmission', 'Brake System',
    'Cooling System', 'Fuel System', 'General Inspection', 'Emergency Repair'
  ];

  const statusOptions = ['scheduled', 'in-progress', 'completed', 'overdue', 'cancelled'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [maintenanceRecords, activeTab, filterEquipment, filterStatus]);

  const loadData = () => {
    // Load maintenance records
    const savedRecords = JSON.parse(localStorage.getItem('machinery_maintenance') || '[]');
    setMaintenanceRecords(savedRecords);

    // Load equipment data
    const savedEquipment = JSON.parse(localStorage.getItem('machinery_inventory') || '[]');
    setEquipment(savedEquipment);

    // Load service providers
    const savedProviders = JSON.parse(localStorage.getItem('service_providers') || '[]');
    setServiceProviders(savedProviders);

    // Set initial equipment filter
    if (equipmentFilter) {
      setFilterEquipment(equipmentFilter);
    }
  };

  const filterRecords = () => {
    let filtered = maintenanceRecords.filter(record => {
      const matchesTab = activeTab === 'all' || 
        (activeTab === 'scheduled' && ['scheduled', 'overdue'].includes(record.status)) ||
        (activeTab === 'completed' && record.status === 'completed') ||
        (activeTab === 'in-progress' && record.status === 'in-progress');
      
      const matchesEquipment = filterEquipment === 'all' || record.equipmentId === filterEquipment;
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
      
      return matchesTab && matchesEquipment && matchesStatus;
    });

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.scheduledDate || a.completedDate);
      const dateB = new Date(b.scheduledDate || b.completedDate);
      return activeTab === 'completed' ? dateB - dateA : dateA - dateB;
    });

    setFilteredRecords(filtered);
  };

  const handleAddMaintenance = (e) => {
    e.preventDefault();
    
    const maintenanceWithId = {
      ...newMaintenance,
      id: Date.now().toString(),
      cost: parseFloat(newMaintenance.cost) || 0,
      laborHours: parseFloat(newMaintenance.laborHours) || 0,
      nextDueHours: parseFloat(newMaintenance.nextDueHours) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedRecords = [...maintenanceRecords, maintenanceWithId];
    setMaintenanceRecords(updatedRecords);
    localStorage.setItem('machinery_maintenance', JSON.stringify(updatedRecords));
    
    setNewMaintenance({
      equipmentId: equipmentFilter || '',
      type: 'scheduled',
      category: '',
      description: '',
      scheduledDate: '',
      completedDate: '',
      status: 'scheduled',
      cost: '',
      laborHours: '',
      parts: '',
      serviceProviderId: '',
      notes: '',
      nextDueHours: '',
      nextDueDate: ''
    });
    setShowAddForm(false);
  };

  const handleAddProvider = (e) => {
    e.preventDefault();
    
    const providerWithId = {
      ...newProvider,
      id: Date.now().toString(),
      specialties: newProvider.specialties.split(',').map(s => s.trim()),
      rating: parseFloat(newProvider.rating),
      createdAt: new Date().toISOString()
    };

    const updatedProviders = [...serviceProviders, providerWithId];
    setServiceProviders(updatedProviders);
    localStorage.setItem('service_providers', JSON.stringify(updatedProviders));
    
    setNewProvider({
      name: '', specialties: '', contactPerson: '', phone: '', email: '',
      address: '', rating: 5, notes: ''
    });
    setShowProviderForm(false);
  };

  const handleStatusChange = (recordId, newStatus) => {
    const updatedRecords = maintenanceRecords.map(record => {
      if (record.id === recordId) {
        const updated = { ...record, status: newStatus, updatedAt: new Date().toISOString() };
        if (newStatus === 'completed' && !record.completedDate) {
          updated.completedDate = new Date().toISOString().split('T')[0];
        }
        return updated;
      }
      return record;
    });
    
    setMaintenanceRecords(updatedRecords);
    localStorage.setItem('machinery_maintenance', JSON.stringify(updatedRecords));
  };

  const getEquipmentName = (equipmentId) => {
    const eq = equipment.find(e => e.id === equipmentId);
    return eq ? `${eq.name} (${eq.make} ${eq.model})` : 'Unknown Equipment';
  };

  const getProviderName = (providerId) => {
    const provider = serviceProviders.find(p => p.id === providerId);
    return provider ? provider.name : 'Internal/Self';
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'overdue': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.scheduled;
  };

  const getCostAnalysis = () => {
    const completedRecords = maintenanceRecords.filter(r => r.status === 'completed');
    const totalCost = completedRecords.reduce((sum, r) => sum + (r.cost || 0), 0);
    const avgCost = completedRecords.length > 0 ? totalCost / completedRecords.length : 0;
    
    const currentYear = new Date().getFullYear();
    const yearlyRecords = completedRecords.filter(r => 
      new Date(r.completedDate).getFullYear() === currentYear
    );
    const yearlyCost = yearlyRecords.reduce((sum, r) => sum + (r.cost || 0), 0);
    
    return { totalCost, avgCost, yearlyCost, totalRecords: completedRecords.length };
  };

  const costAnalysis = getCostAnalysis();

  const getUpcomingMaintenance = () => {
    const upcoming = maintenanceRecords.filter(record => {
      if (record.status !== 'scheduled') return false;
      const scheduledDate = new Date(record.scheduledDate);
      const today = new Date();
      const diffDays = Math.ceil((scheduledDate - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays >= 0;
    });
    return upcoming.length;
  };

  const getOverdueMaintenance = () => {
    return maintenanceRecords.filter(record => {
      if (record.status !== 'scheduled') return false;
      const scheduledDate = new Date(record.scheduledDate);
      const today = new Date();
      return scheduledDate < today;
    }).length;
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
              <h1 className="text-4xl font-bold text-gray-900">Maintenance System</h1>
              <p className="text-gray-600 text-lg">Comprehensive maintenance management</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowProviderForm(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add Provider
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200 shadow-lg"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Schedule Maintenance
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Upcoming (30 days)</p>
                <p className="text-3xl font-bold text-blue-600">{getUpcomingMaintenance()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{getOverdueMaintenance()}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Yearly Cost</p>
                <p className="text-3xl font-bold text-purple-600">${costAnalysis.yearlyCost.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg. Cost</p>
                <p className="text-3xl font-bold text-green-600">${Math.round(costAnalysis.avgCost).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
            {[
              { key: 'scheduled', label: 'Scheduled', count: maintenanceRecords.filter(r => ['scheduled', 'overdue'].includes(r.status)).length },
              { key: 'in-progress', label: 'In Progress', count: maintenanceRecords.filter(r => r.status === 'in-progress').length },
              { key: 'completed', label: 'Completed', count: maintenanceRecords.filter(r => r.status === 'completed').length },
              { key: 'all', label: 'All Records', count: maintenanceRecords.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 font-medium rounded-lg transition duration-200 ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Equipment</label>
              <select
                value={filterEquipment}
                onChange={(e) => setFilterEquipment(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Maintenance Records */}
        <div className="space-y-4 mb-8">
          {filteredRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition duration-300">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{record.description}</h3>
                  <p className="text-gray-600 mb-1">{getEquipmentName(record.equipmentId)}</p>
                  <p className="text-sm text-gray-500">Category: {record.category}</p>
                </div>
                
                <div className="flex items-center gap-3 mt-2 md:mt-0">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                  
                  <select
                    value={record.status}
                    onChange={(e) => handleStatusChange(record.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">Scheduled Date</p>
                  <p className="text-gray-900">{record.scheduledDate ? new Date(record.scheduledDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 font-medium">Service Provider</p>
                  <p className="text-gray-900">{getProviderName(record.serviceProviderId)}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 font-medium">Cost</p>
                  <p className="text-gray-900">₹{record.cost ? record.cost.toLocaleString() : '0'}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 font-medium">Labor Hours</p>
                  <p className="text-gray-900">{record.laborHours || '0'} hrs</p>
                </div>
                
                <div>
                  <p className="text-gray-500 font-medium">Parts</p>
                  <p className="text-gray-900">{record.parts || 'None'}</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedRecord(record)}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Records Found</h3>
            <p className="text-gray-500">No maintenance records match your current filter criteria.</p>
          </div>
        )}

        {/* Add Maintenance Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">Schedule Maintenance</h3>
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

              <form onSubmit={handleAddMaintenance} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipment *</label>
                    <select
                      required
                      value={newMaintenance.equipmentId}
                      onChange={(e) => setNewMaintenance({...newMaintenance, equipmentId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Equipment</option>
                      {equipment.map(eq => (
                        <option key={eq.id} value={eq.id}>
                          {eq.name} - {eq.make} {eq.model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={newMaintenance.category}
                      onChange={(e) => setNewMaintenance({...newMaintenance, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {maintenanceCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <input
                      type="text"
                      required
                      value={newMaintenance.description}
                      onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of maintenance work"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date *</label>
                    <input
                      type="date"
                      required
                      value={newMaintenance.scheduledDate}
                      onChange={(e) => setNewMaintenance({...newMaintenance, scheduledDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Provider</label>
                    <select
                      value={newMaintenance.serviceProviderId}
                      onChange={(e) => setNewMaintenance({...newMaintenance, serviceProviderId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Internal/Self Service</option>
                      {serviceProviders.map(provider => (
                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newMaintenance.cost}
                      onChange={(e) => setNewMaintenance({...newMaintenance, cost: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Labor Hours</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={newMaintenance.laborHours}
                      onChange={(e) => setNewMaintenance({...newMaintenance, laborHours: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parts Needed</label>
                    <input
                      type="text"
                      value={newMaintenance.parts}
                      onChange={(e) => setNewMaintenance({...newMaintenance, parts: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List parts needed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Due (Hours)</label>
                    <input
                      type="number"
                      min="0"
                      value={newMaintenance.nextDueHours}
                      onChange={(e) => setNewMaintenance({...newMaintenance, nextDueHours: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Operating hours until next maintenance"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows="3"
                    value={newMaintenance.notes}
                    onChange={(e) => setNewMaintenance({...newMaintenance, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes or special instructions..."
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200"
                  >
                    Schedule Maintenance
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

        {/* Add Service Provider Modal */}
        {showProviderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">Add Service Provider</h3>
                  <button
                    onClick={() => setShowProviderForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddProvider} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={newProvider.name}
                      onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                    <input
                      type="text"
                      value={newProvider.specialties}
                      onChange={(e) => setNewProvider({...newProvider, specialties: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Comma-separated specialties (e.g., Hydraulics, Engine Repair)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                    <input
                      type="text"
                      value={newProvider.contactPerson}
                      onChange={(e) => setNewProvider({...newProvider, contactPerson: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={newProvider.phone}
                        onChange={(e) => setNewProvider({...newProvider, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={newProvider.rating}
                        onChange={(e) => setNewProvider({...newProvider, rating: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newProvider.email}
                      onChange={(e) => setNewProvider({...newProvider, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      rows="2"
                      value={newProvider.address}
                      onChange={(e) => setNewProvider({...newProvider, address: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      rows="2"
                      value={newProvider.notes}
                      onChange={(e) => setNewProvider({...newProvider, notes: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Additional notes about this service provider..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200"
                  >
                    Add Provider
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProviderForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Maintenance Details Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedRecord.description}</h3>
                    <p className="text-gray-600">{getEquipmentName(selectedRecord.equipmentId)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedRecord.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedRecord.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRecord.status)}`}>
                          {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Scheduled Date:</span>
                        <span className="font-medium">{selectedRecord.scheduledDate ? new Date(selectedRecord.scheduledDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed Date:</span>
                        <span className="font-medium">{selectedRecord.completedDate ? new Date(selectedRecord.completedDate).toLocaleDateString() : 'Not completed'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost & Resources</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Provider:</span>
                        <span className="font-medium">{getProviderName(selectedRecord.serviceProviderId)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost:</span>
                        <span className="font-medium">₹{selectedRecord.cost?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labor Hours:</span>
                        <span className="font-medium">{selectedRecord.laborHours || '0'} hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Parts:</span>
                        <span className="font-medium">{selectedRecord.parts || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Due Hours:</span>
                        <span className="font-medium">{selectedRecord.nextDueHours || 'Not set'}</span>
                      </div>
                    </div>
                  </div>

                  {selectedRecord.notes && (
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Notes</h4>
                      <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{selectedRecord.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setSelectedRecord(null)}
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

export default MaintenanceSystemPage;