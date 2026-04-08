import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const MachinerySchedulerPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('day'); // day, week, month
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filterEquipment, setFilterEquipment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newSchedule, setNewSchedule] = useState({
    equipmentId: '',
    task: '',
    field: '',
    operator: '',
    startDate: '',
    endDate: '',
    startTime: '08:00',
    endTime: '17:00',
    priority: 'medium',
    status: 'scheduled',
    notes: '',
    estimatedHours: '',
    fuelRequired: '',
    weatherDependent: false
  });

  const taskTypes = [
    'Plowing', 'Cultivating', 'Planting', 'Seeding', 'Harvesting',
    'Spraying', 'Fertilizing', 'Irrigation', 'Mowing', 'Tillage',
    'Transport', 'Maintenance', 'Field Preparation', 'Other'
  ];

  const priorityLevels = ['low', 'medium', 'high', 'urgent'];
  const statusOptions = ['scheduled', 'in-progress', 'completed', 'cancelled', 'postponed'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [schedules, selectedDate, viewMode, filterEquipment, filterStatus]);

  const loadData = () => {
    const savedEquipment = JSON.parse(localStorage.getItem('machinery_inventory') || '[]');
    const savedSchedules = JSON.parse(localStorage.getItem('machinery_schedules') || '[]');
    
    setEquipment(savedEquipment);
    setSchedules(savedSchedules);
  };

  const filterSchedules = () => {
    let filtered = schedules;

    // Filter by equipment
    if (filterEquipment !== 'all') {
      filtered = filtered.filter(schedule => schedule.equipmentId === filterEquipment);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(schedule => schedule.status === filterStatus);
    }

    // Filter by date range based on view mode
    const baseDate = new Date(selectedDate);
    let startDate, endDate;

    if (viewMode === 'day') {
      startDate = new Date(baseDate);
      endDate = new Date(baseDate);
    } else if (viewMode === 'week') {
      const dayOfWeek = baseDate.getDay();
      startDate = new Date(baseDate);
      startDate.setDate(baseDate.getDate() - dayOfWeek);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (viewMode === 'month') {
      startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
      endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
    }

    filtered = filtered.filter(schedule => {
      const scheduleStart = new Date(schedule.startDate);
      const scheduleEnd = new Date(schedule.endDate || schedule.startDate);
      
      return (scheduleStart <= endDate && scheduleEnd >= startDate);
    });

    // Sort by start date and time
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.startDate}T${a.startTime}`);
      const dateB = new Date(`${b.startDate}T${b.startTime}`);
      return dateA - dateB;
    });

    setFilteredSchedules(filtered);
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    
    const scheduleWithId = {
      ...newSchedule,
      id: Date.now().toString(),
      estimatedHours: parseFloat(newSchedule.estimatedHours) || 0,
      fuelRequired: parseFloat(newSchedule.fuelRequired) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedSchedules = [...schedules, scheduleWithId];
    setSchedules(updatedSchedules);
    localStorage.setItem('machinery_schedules', JSON.stringify(updatedSchedules));
    
    setNewSchedule({
      equipmentId: '', task: '', field: '', operator: '',
      startDate: '', endDate: '', startTime: '08:00', endTime: '17:00',
      priority: 'medium', status: 'scheduled', notes: '',
      estimatedHours: '', fuelRequired: '', weatherDependent: false
    });
    setShowAddForm(false);
  };

  const handleStatusChange = (scheduleId, newStatus) => {
    const updatedSchedules = schedules.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, status: newStatus, updatedAt: new Date().toISOString() }
        : schedule
    );
    setSchedules(updatedSchedules);
    localStorage.setItem('machinery_schedules', JSON.stringify(updatedSchedules));
  };

  const handleDeleteSchedule = (scheduleId) => {
    const updatedSchedules = schedules.filter(schedule => schedule.id !== scheduleId);
    setSchedules(updatedSchedules);
    localStorage.setItem('machinery_schedules', JSON.stringify(updatedSchedules));
  };

  const getEquipmentName = (equipmentId) => {
    const eq = equipment.find(e => e.id === equipmentId);
    return eq ? `${eq.name} (${eq.make} ${eq.model})` : 'Unknown Equipment';
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'postponed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.scheduled;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  const getDateRange = () => {
    const baseDate = new Date(selectedDate);
    
    if (viewMode === 'day') {
      return baseDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (viewMode === 'week') {
      const dayOfWeek = baseDate.getDay();
      const startDate = new Date(baseDate);
      startDate.setDate(baseDate.getDate() - dayOfWeek);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    } else if (viewMode === 'month') {
      return baseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
  };

  const navigateDate = (direction) => {
    const currentDate = new Date(selectedDate);
    
    if (viewMode === 'day') {
      currentDate.setDate(currentDate.getDate() + direction);
    } else if (viewMode === 'week') {
      currentDate.setDate(currentDate.getDate() + (direction * 7));
    } else if (viewMode === 'month') {
      currentDate.setMonth(currentDate.getMonth() + direction);
    }
    
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const getEquipmentAvailability = (equipmentId, date, startTime, endTime) => {
    const conflictingSchedules = schedules.filter(schedule => {
      if (schedule.equipmentId !== equipmentId) return false;
      if (schedule.status === 'cancelled' || schedule.status === 'completed') return false;
      
      const scheduleDate = schedule.startDate;
      if (scheduleDate !== date) return false;
      
      // Check time overlap
      const scheduleStart = schedule.startTime;
      const scheduleEnd = schedule.endTime;
      
      return (startTime < scheduleEnd && endTime > scheduleStart);
    });
    
    return conflictingSchedules.length === 0;
  };

  const getConflictingSchedules = (equipmentId, date) => {
    return schedules.filter(schedule => {
      return schedule.equipmentId === equipmentId && 
             schedule.startDate === date && 
             ['scheduled', 'in-progress'].includes(schedule.status);
    });
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
              <h1 className="text-4xl font-bold text-gray-900">Equipment Scheduler</h1>
              <p className="text-gray-600 text-lg">Plan and manage equipment operations</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-lg"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Schedule Task
          </button>
        </div>

        {/* Date Navigation and View Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-xl font-bold text-gray-900">
                {getDateRange()}
              </div>
              
              <button
                onClick={() => navigateDate(1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {['day', 'week', 'month'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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

        {/* Schedule Grid */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">
              Scheduled Tasks ({filteredSchedules.length})
            </h3>
          </div>
          
          <div className="p-6">
            {filteredSchedules.length > 0 ? (
              <div className="space-y-4">
                {filteredSchedules.map((schedule) => (
                  <div key={schedule.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition duration-200">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{schedule.task}</h4>
                        <p className="text-gray-600 mb-1">{getEquipmentName(schedule.equipmentId)}</p>
                        <p className="text-sm text-gray-500">Field: {schedule.field || 'Not specified'}</p>
                        <p className="text-sm text-gray-500">Operator: {schedule.operator || 'Not assigned'}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 md:mt-0">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(schedule.priority)}`}>
                          {schedule.priority}
                        </span>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                          {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Start Date & Time</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(schedule.startDate).toLocaleDateString()} at {schedule.startTime}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 text-sm font-medium">End Date & Time</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(schedule.endDate || schedule.startDate).toLocaleDateString()} at {schedule.endTime}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Estimated Hours</p>
                        <p className="text-gray-900 font-medium">{schedule.estimatedHours || 'N/A'} hrs</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Fuel Required</p>
                        <p className="text-gray-900 font-medium">{schedule.fuelRequired || 'N/A'} gal</p>
                      </div>
                    </div>

                    {schedule.weatherDependent && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-yellow-800 text-sm font-medium">Weather Dependent Task</span>
                        </div>
                      </div>
                    )}

                    {schedule.notes && (
                      <div className="mb-4">
                        <p className="text-gray-500 text-sm font-medium mb-1">Notes</p>
                        <p className="text-gray-700 text-sm bg-white rounded p-3">{schedule.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setSelectedSchedule(schedule)}
                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        View Details
                      </button>
                      
                      <select
                        value={schedule.status}
                        onChange={(e) => handleStatusChange(schedule.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Scheduled</h3>
                <p className="text-gray-500">No tasks are scheduled for the selected time period.</p>
              </div>
            )}
          </div>
        </div>

        {/* Equipment Availability */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Equipment Availability</h3>
            <p className="text-gray-600">Current availability status for {new Date(selectedDate).toLocaleDateString()}</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.map((eq) => {
                const conflictingSchedules = getConflictingSchedules(eq.id, selectedDate);
                const isAvailable = conflictingSchedules.length === 0;
                
                return (
                  <div key={eq.id} className={`border-2 rounded-lg p-4 ${
                    isAvailable ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{eq.name}</h4>
                        <p className="text-sm text-gray-600">{eq.make} {eq.model}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isAvailable ? 'Available' : 'Busy'}
                      </span>
                    </div>
                    
                    {!isAvailable && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Scheduled Tasks:</p>
                        {conflictingSchedules.map((schedule) => (
                          <p key={schedule.id} className="text-xs text-gray-600">
                            {schedule.startTime}-{schedule.endTime}: {schedule.task}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Add Schedule Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">Schedule New Task</h3>
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

              <form onSubmit={handleAddSchedule} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipment *</label>
                    <select
                      required
                      value={newSchedule.equipmentId}
                      onChange={(e) => setNewSchedule({...newSchedule, equipmentId: e.target.value})}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task *</label>
                    <select
                      required
                      value={newSchedule.task}
                      onChange={(e) => setNewSchedule({...newSchedule, task: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Task</option>
                      {taskTypes.map(task => (
                        <option key={task} value={task}>{task}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field/Location</label>
                    <input
                      type="text"
                      value={newSchedule.field}
                      onChange={(e) => setNewSchedule({...newSchedule, field: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., North Field, Section A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Operator</label>
                    <input
                      type="text"
                      value={newSchedule.operator}
                      onChange={(e) => setNewSchedule({...newSchedule, operator: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Operator name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={newSchedule.startDate}
                      onChange={(e) => setNewSchedule({...newSchedule, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={newSchedule.endDate}
                      onChange={(e) => setNewSchedule({...newSchedule, endDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                    <input
                      type="time"
                      required
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                    <input
                      type="time"
                      required
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newSchedule.priority}
                      onChange={(e) => setNewSchedule({...newSchedule, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {priorityLevels.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={newSchedule.estimatedHours}
                      onChange={(e) => setNewSchedule({...newSchedule, estimatedHours: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Required (gallons)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={newSchedule.fuelRequired}
                      onChange={(e) => setNewSchedule({...newSchedule, fuelRequired: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newSchedule.weatherDependent}
                        onChange={(e) => setNewSchedule({...newSchedule, weatherDependent: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Weather Dependent Task</span>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows="3"
                    value={newSchedule.notes}
                    onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes or instructions..."
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200"
                  >
                    Schedule Task
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

        {/* Schedule Details Modal */}
        {selectedSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedSchedule.task}</h3>
                    <p className="text-gray-600">{getEquipmentName(selectedSchedule.equipmentId)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSchedule(null)}
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
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Field/Location:</span>
                        <span className="font-medium">{selectedSchedule.field || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Operator:</span>
                        <span className="font-medium">{selectedSchedule.operator || 'Not assigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`px-2 py-1 text-sm font-semibold rounded-full ${getPriorityColor(selectedSchedule.priority)}`}>
                          {selectedSchedule.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedSchedule.status)}`}>
                          {selectedSchedule.status.charAt(0).toUpperCase() + selectedSchedule.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Schedule Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start:</span>
                        <span className="font-medium">{new Date(selectedSchedule.startDate).toLocaleDateString()} at {selectedSchedule.startTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End:</span>
                        <span className="font-medium">{new Date(selectedSchedule.endDate || selectedSchedule.startDate).toLocaleDateString()} at {selectedSchedule.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Hours:</span>
                        <span className="font-medium">{selectedSchedule.estimatedHours || 'N/A'} hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fuel Required:</span>
                        <span className="font-medium">{selectedSchedule.fuelRequired || 'N/A'} gal</span>
                      </div>
                      {selectedSchedule.weatherDependent && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center">
                          <span className="text-yellow-800 text-sm font-medium">Weather Dependent</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedSchedule.notes && (
                    <div className="md:col-span-2">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Notes</h4>
                      <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{selectedSchedule.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setSelectedSchedule(null)}
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

export default MachinerySchedulerPage;