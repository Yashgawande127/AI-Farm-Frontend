import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const MachineryManagementPage = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    activeEquipment: 0,
    maintenanceDue: 0,
    totalValue: 0
  });

  useEffect(() => {
    // Initialize with mock data if no data exists
    initializeMockData();
    // Load machinery statistics
    loadMachineryStats();
  }, []);

  const initializeMockData = () => {
    // Check if data already exists
    const existingEquipment = JSON.parse(localStorage.getItem('machinery_inventory') || '[]');
    const existingMaintenance = JSON.parse(localStorage.getItem('machinery_maintenance') || '[]');
    const existingProviders = JSON.parse(localStorage.getItem('service_providers') || '[]');
    const existingSchedules = JSON.parse(localStorage.getItem('machinery_schedules') || '[]');

    // Initialize equipment data if empty
    if (existingEquipment.length === 0) {
      const mockEquipment = [
        {
          id: 'eq1',
          name: 'John Deere 8370R',
          make: 'John Deere',
          model: '8370R',
          year: '2020',
          category: 'Tractor',
          serialNumber: 'JD8370R2020001',
          capacity: '370 HP',
          fuelType: 'Diesel',
          purchasePrice: 285000,
          purchaseDate: '2020-03-15',
          operatingHours: 2850,
          status: 'active',
          location: 'Main Barn',
          notes: 'Primary field tractor, excellent condition',
          currentValue: 225000,
          depreciationAmount: 60000,
          monthlyOperatingCost: 320,
          createdAt: new Date('2020-03-15').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'eq2',
          name: 'Case IH Axial-Flow 9250',
          make: 'Case IH',
          model: 'Axial-Flow 9250',
          year: '2018',
          category: 'Harvester',
          serialNumber: 'CIH9250-2018-456',
          capacity: '450 HP',
          fuelType: 'Diesel',
          purchasePrice: 520000,
          purchaseDate: '2018-08-22',
          operatingHours: 1650,
          status: 'active',
          location: 'Equipment Shed A',
          notes: 'Combine harvester, serviced regularly',
          currentValue: 380000,
          depreciationAmount: 140000,
          monthlyOperatingCost: 580,
          createdAt: new Date('2018-08-22').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'eq3',
          name: 'John Deere 1775NT',
          make: 'John Deere',
          model: '1775NT',
          year: '2019',
          category: 'Planter',
          serialNumber: 'JD1775NT-2019-789',
          capacity: '16-Row',
          fuelType: 'Hydraulic',
          purchasePrice: 125000,
          purchaseDate: '2019-02-10',
          operatingHours: 890,
          status: 'active',
          location: 'Equipment Shed B',
          notes: 'Precision planter with GPS guidance',
          currentValue: 95000,
          depreciationAmount: 30000,
          monthlyOperatingCost: 190,
          createdAt: new Date('2019-02-10').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'eq4',
          name: 'New Holland T7.315',
          make: 'New Holland',
          model: 'T7.315',
          year: '2016',
          category: 'Tractor',
          serialNumber: 'NH-T7315-2016-123',
          capacity: '315 HP',
          fuelType: 'Diesel',
          purchasePrice: 245000,
          purchaseDate: '2016-05-12',
          operatingHours: 4200,
          status: 'maintenance',
          location: 'Service Bay',
          notes: 'Under maintenance for hydraulic system repair',
          currentValue: 165000,
          depreciationAmount: 80000,
          monthlyOperatingCost: 380,
          createdAt: new Date('2016-05-12').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'eq5',
          name: 'Apache AS1240',
          make: 'Apache',
          model: 'AS1240',
          year: '2021',
          category: 'Sprayer',
          serialNumber: 'AP-AS1240-2021-567',
          capacity: '120ft Boom',
          fuelType: 'Diesel',
          purchasePrice: 425000,
          purchaseDate: '2021-04-08',
          operatingHours: 1240,
          status: 'active',
          location: 'Chemical Storage Area',
          notes: 'Self-propelled sprayer with precision application',
          currentValue: 365000,
          depreciationAmount: 60000,
          monthlyOperatingCost: 290,
          createdAt: new Date('2021-04-08').toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('machinery_inventory', JSON.stringify(mockEquipment));
    }

    // Initialize maintenance data if empty
    if (existingMaintenance.length === 0) {
      const mockMaintenance = [
        {
          id: 'maint1',
          equipmentId: 'eq1',
          type: 'scheduled',
          category: 'Oil Change',
          description: '500-hour oil and filter service',
          scheduledDate: '2025-11-10',
          status: 'scheduled',
          cost: 450,
          laborHours: 2,
          parts: 'Engine oil (15qt), Oil filter, Air filter',
          serviceProviderId: 'sp1',
          notes: 'Include hydraulic fluid check',
          nextDueHours: 3350,
          createdAt: new Date('2025-10-15').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'maint2',
          equipmentId: 'eq4',
          type: 'repair',
          category: 'Hydraulic System',
          description: 'Hydraulic pump replacement',
          scheduledDate: '2025-11-01',
          completedDate: '2025-11-05',
          status: 'in-progress',
          cost: 2850,
          laborHours: 8,
          parts: 'Hydraulic pump, seals kit, hydraulic fluid',
          serviceProviderId: 'sp2',
          notes: 'Major hydraulic system overhaul required',
          createdAt: new Date('2025-10-28').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'maint3',
          equipmentId: 'eq2',
          type: 'scheduled',
          category: 'General Inspection',
          description: 'Pre-harvest inspection and service',
          scheduledDate: '2025-09-15',
          completedDate: '2025-09-15',
          status: 'completed',
          cost: 675,
          laborHours: 4,
          parts: 'Belts, filters, grease',
          serviceProviderId: 'sp1',
          notes: 'Ready for harvest season',
          createdAt: new Date('2025-09-01').toISOString(),
          updatedAt: new Date('2025-09-15').toISOString()
        },
        {
          id: 'maint4',
          equipmentId: 'eq5',
          type: 'scheduled',
          category: 'Filter Replacement',
          description: 'Replace air and fuel filters',
          scheduledDate: '2025-11-20',
          status: 'scheduled',
          cost: 285,
          laborHours: 1.5,
          parts: 'Air filter, fuel filter',
          serviceProviderId: '',
          notes: 'Self-service maintenance',
          nextDueHours: 1500,
          createdAt: new Date('2025-11-01').toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('machinery_maintenance', JSON.stringify(mockMaintenance));
    }

    // Initialize service providers if empty
    if (existingProviders.length === 0) {
      const mockProviders = [
        {
          id: 'sp1',
          name: 'Green Valley Equipment Services',
          specialties: ['Engine Repair', 'Hydraulics', 'General Maintenance'],
          contactPerson: 'Mike Johnson',
          phone: '(555) 123-4567',
          email: 'mike@greenvalleyequip.com',
          address: '1245 Farm Road, Green Valley, ST 12345',
          rating: 4.8,
          notes: 'Certified John Deere service center, excellent response time',
          createdAt: new Date('2020-01-15').toISOString()
        },
        {
          id: 'sp2',
          name: 'Advanced Hydraulic Solutions',
          specialties: ['Hydraulic Systems', 'Transmission Repair', 'Welding'],
          contactPerson: 'Sarah Martinez',
          phone: '(555) 987-6543',
          email: 'sarah@advhydraulics.com',
          address: '789 Industrial Blvd, Farmington, ST 12346',
          rating: 4.9,
          notes: 'Specialists in complex hydraulic repairs, mobile service available',
          createdAt: new Date('2019-06-20').toISOString()
        },
        {
          id: 'sp3',
          name: 'Farm Equipment Specialists',
          specialties: ['Electrical Systems', 'GPS/Technology', 'Diagnostics'],
          contactPerson: 'Tom Williams',
          phone: '(555) 456-7890',
          email: 'tom@farmequipspec.com',
          address: '456 Tech Drive, Innovation Park, ST 12347',
          rating: 4.7,
          notes: 'Modern equipment technology experts, software updates',
          createdAt: new Date('2021-03-10').toISOString()
        }
      ];
      localStorage.setItem('service_providers', JSON.stringify(mockProviders));
    }

    // Initialize schedules if empty
    if (existingSchedules.length === 0) {
      const today = new Date();
      const mockSchedules = [
        {
          id: 'sched1',
          equipmentId: 'eq1',
          task: 'Plowing',
          field: 'North Field - Section A',
          operator: 'John Smith',
          startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '07:00',
          endTime: '16:00',
          priority: 'high',
          status: 'scheduled',
          notes: 'Prepare field for winter wheat planting',
          estimatedHours: 8,
          fuelRequired: 45,
          weatherDependent: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'sched2',
          equipmentId: 'eq3',
          task: 'Planting',
          field: 'South Field - Section B',
          operator: 'Maria Garcia',
          startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '08:00',
          endTime: '17:00',
          priority: 'urgent',
          status: 'scheduled',
          notes: 'Plant corn in prepared field, optimal soil conditions',
          estimatedHours: 16,
          fuelRequired: 25,
          weatherDependent: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'sched3',
          equipmentId: 'eq5',
          task: 'Spraying',
          field: 'East Field - All Sections',
          operator: 'David Brown',
          startDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '06:00',
          endTime: '11:00',
          priority: 'medium',
          status: 'scheduled',
          notes: 'Early morning herbicide application, wind speed critical',
          estimatedHours: 5,
          fuelRequired: 35,
          weatherDependent: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'sched4',
          equipmentId: 'eq2',
          task: 'Harvesting',
          field: 'West Field - Section C',
          operator: 'Robert Johnson',
          startDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '18:00',
          priority: 'high',
          status: 'completed',
          notes: 'Soybean harvest completed successfully, excellent yield',
          estimatedHours: 18,
          fuelRequired: 85,
          weatherDependent: false,
          createdAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem('machinery_schedules', JSON.stringify(mockSchedules));
    }
  };

  const loadMachineryStats = () => {
    // This would typically fetch from an API
    const equipmentData = JSON.parse(localStorage.getItem('machinery_inventory') || '[]');
    
    const total = equipmentData.length;
    const active = equipmentData.filter(item => item.status === 'active').length;
    const maintenanceDue = equipmentData.filter(item => {
      const nextMaintenance = new Date(item.nextMaintenanceDate);
      const today = new Date();
      return nextMaintenance <= today;
    }).length;
    const totalValue = equipmentData.reduce((sum, item) => sum + (item.currentValue || 0), 0);

    setStats({
      totalEquipment: total,
      activeEquipment: active,
      maintenanceDue: maintenanceDue,
      totalValue: totalValue
    });
  };

  const managementModules = [
    {
      title: 'Equipment Inventory',
      description: 'Manage your complete equipment fleet with detailed specifications, depreciation tracking, and usage analytics.',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      link: '/machinery/inventory',
      color: 'blue',
      features: ['Equipment Specifications', 'Depreciation Tracking', 'Usage Analytics', 'Value Assessment']
    },
    {
      title: 'Maintenance System',
      description: 'Comprehensive maintenance management with scheduling, repair history, and cost analysis.',
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: '/machinery/maintenance',
      color: 'green',
      features: ['Scheduled Maintenance', 'Repair History', 'Cost Analysis', 'Service Providers']
    },
    {
      title: 'Equipment Analytics',
      description: 'Advanced analytics for equipment performance, utilization, and operational efficiency.',
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: '/machinery/analytics',
      color: 'purple',
      features: ['Performance Metrics', 'Utilization Reports', 'Fuel Efficiency', 'ROI Analysis']
    },
    {
      title: 'Equipment Scheduler',
      description: 'Plan and schedule equipment usage across different fields and operations.',
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      link: '/machinery/scheduler',
      color: 'orange',
      features: ['Task Scheduling', 'Resource Planning', 'Field Assignments', 'Availability Tracking']
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Machinery Management</h1>
              <p className="text-gray-600 text-lg">Comprehensive equipment lifecycle management</p>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Equipment</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEquipment}</p>
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
                <p className="text-gray-500 text-sm font-medium">Active Equipment</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeEquipment}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Maintenance Due</p>
                <p className="text-3xl font-bold text-red-600">{stats.maintenanceDue}</p>
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
                <p className="text-gray-500 text-sm font-medium">Fleet Value</p>
                <p className="text-3xl font-bold text-purple-600">₹{stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Management Modules */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {managementModules.map((module, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    {module.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {module.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={module.link}
                  className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${getColorClasses(module.color)} text-white font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-xl`}
                >
                  Access {module.title}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/machinery/inventory/add"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-200"
            >
              <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Add Equipment</p>
                <p className="text-sm text-gray-600">Register new machinery</p>
              </div>
            </Link>

            <Link
              to="/machinery/maintenance/schedule"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition duration-200"
            >
              <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Schedule Maintenance</p>
                <p className="text-sm text-gray-600">Plan maintenance tasks</p>
              </div>
            </Link>

            <Link
              to="/machinery/analytics"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition duration-200"
            >
              <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">View Reports</p>
                <p className="text-sm text-gray-600">Equipment analytics</p>
              </div>
            </Link>

            <button
              onClick={() => {
                // Reset to fresh demo data
                localStorage.removeItem('machinery_inventory');
                localStorage.removeItem('machinery_maintenance');
                localStorage.removeItem('service_providers');
                localStorage.removeItem('machinery_schedules');
                initializeMockData();
                loadMachineryStats();
                alert('Demo data has been reset! Refresh the page to see updated statistics.');
              }}
              className="flex items-center p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition duration-200"
            >
              <svg className="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Reset Demo Data</p>
                <p className="text-sm text-gray-600">Restore sample data</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineryManagementPage;