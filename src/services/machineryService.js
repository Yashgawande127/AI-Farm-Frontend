// Machinery Data Service
// Provides consistent data management for machinery-related operations

class MachineryService {
  // Equipment Management
  static getEquipment() {
    return JSON.parse(localStorage.getItem('machinery_inventory') || '[]');
  }

  static saveEquipment(equipment) {
    localStorage.setItem('machinery_inventory', JSON.stringify(equipment));
  }

  static addEquipment(equipmentData) {
    const equipment = this.getEquipment();
    const newEquipment = {
      ...equipmentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentValue: this.calculateCurrentValue(equipmentData),
      depreciationAmount: this.calculateDepreciation(equipmentData),
      monthlyOperatingCost: this.calculateMonthlyOperatingCost(equipmentData)
    };
    
    equipment.push(newEquipment);
    this.saveEquipment(equipment);
    return newEquipment;
  }

  static updateEquipment(equipmentId, updates) {
    const equipment = this.getEquipment();
    const index = equipment.findIndex(eq => eq.id === equipmentId);
    
    if (index !== -1) {
      equipment[index] = {
        ...equipment[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        currentValue: this.calculateCurrentValue({ ...equipment[index], ...updates }),
        depreciationAmount: this.calculateDepreciation({ ...equipment[index], ...updates }),
        monthlyOperatingCost: this.calculateMonthlyOperatingCost({ ...equipment[index], ...updates })
      };
      this.saveEquipment(equipment);
      return equipment[index];
    }
    return null;
  }

  static deleteEquipment(equipmentId) {
    const equipment = this.getEquipment();
    const filtered = equipment.filter(eq => eq.id !== equipmentId);
    this.saveEquipment(filtered);
    return true;
  }

  // Maintenance Management
  static getMaintenanceRecords() {
    return JSON.parse(localStorage.getItem('machinery_maintenance') || '[]');
  }

  static saveMaintenanceRecords(records) {
    localStorage.setItem('machinery_maintenance', JSON.stringify(records));
  }

  static addMaintenanceRecord(recordData) {
    const records = this.getMaintenanceRecords();
    const newRecord = {
      ...recordData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    records.push(newRecord);
    this.saveMaintenanceRecords(records);
    return newRecord;
  }

  static updateMaintenanceRecord(recordId, updates) {
    const records = this.getMaintenanceRecords();
    const index = records.findIndex(record => record.id === recordId);
    
    if (index !== -1) {
      records[index] = {
        ...records[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveMaintenanceRecords(records);
      return records[index];
    }
    return null;
  }

  // Service Provider Management
  static getServiceProviders() {
    return JSON.parse(localStorage.getItem('service_providers') || '[]');
  }

  static saveServiceProviders(providers) {
    localStorage.setItem('service_providers', JSON.stringify(providers));
  }

  static addServiceProvider(providerData) {
    const providers = this.getServiceProviders();
    const newProvider = {
      ...providerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      specialties: Array.isArray(providerData.specialties) 
        ? providerData.specialties 
        : providerData.specialties.split(',').map(s => s.trim())
    };
    
    providers.push(newProvider);
    this.saveServiceProviders(providers);
    return newProvider;
  }

  // Schedule Management
  static getSchedules() {
    return JSON.parse(localStorage.getItem('machinery_schedules') || '[]');
  }

  static saveSchedules(schedules) {
    localStorage.setItem('machinery_schedules', JSON.stringify(schedules));
  }

  static addSchedule(scheduleData) {
    const schedules = this.getSchedules();
    const newSchedule = {
      ...scheduleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    schedules.push(newSchedule);
    this.saveSchedules(schedules);
    return newSchedule;
  }

  static updateSchedule(scheduleId, updates) {
    const schedules = this.getSchedules();
    const index = schedules.findIndex(schedule => schedule.id === scheduleId);
    
    if (index !== -1) {
      schedules[index] = {
        ...schedules[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveSchedules(schedules);
      return schedules[index];
    }
    return null;
  }

  // Calculation Methods
  static calculateCurrentValue(equipment) {
    if (!equipment.purchasePrice || !equipment.purchaseDate) return 0;
    
    const purchasePrice = parseFloat(equipment.purchasePrice);
    const purchaseYear = new Date(equipment.purchaseDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - purchaseYear;
    
    // Depreciation schedule based on equipment category
    const depreciationRates = {
      'Tractor': { initial: 0.15, annual: 0.08 },
      'Harvester': { initial: 0.20, annual: 0.12 },
      'Planter': { initial: 0.12, annual: 0.07 },
      'Cultivator': { initial: 0.10, annual: 0.06 },
      'Sprayer': { initial: 0.13, annual: 0.08 },
      'Irrigation': { initial: 0.08, annual: 0.05 },
      'Tillage': { initial: 0.11, annual: 0.07 },
      'Hay Equipment': { initial: 0.12, annual: 0.08 },
      'Transport': { initial: 0.16, annual: 0.10 },
      'Other': { initial: 0.12, annual: 0.08 }
    };
    
    const rates = depreciationRates[equipment.category] || depreciationRates['Other'];
    let totalDepreciation = rates.initial; // First year depreciation
    
    // Additional years
    if (age > 1) {
      totalDepreciation += (age - 1) * rates.annual;
    }
    
    // Cap depreciation at 85% to maintain some residual value
    totalDepreciation = Math.min(totalDepreciation, 0.85);
    
    const currentValue = Math.max(purchasePrice * (1 - totalDepreciation), purchasePrice * 0.15);
    return Math.round(currentValue);
  }

  static calculateDepreciation(equipment) {
    if (!equipment.purchasePrice) return 0;
    return parseFloat(equipment.purchasePrice) - this.calculateCurrentValue(equipment);
  }

  static calculateMonthlyOperatingCost(equipment) {
    // Base rates by category (per month of active use)
    const baseRates = {
      'Tractor': 250,
      'Harvester': 450,
      'Planter': 180,
      'Cultivator': 120,
      'Sprayer': 150,
      'Irrigation': 100,
      'Tillage': 110,
      'Hay Equipment': 140,
      'Transport': 200,
      'Other': 130
    };
    
    const baseRate = baseRates[equipment.category] || 130;
    
    // Adjust for age (older equipment costs more to operate)
    const age = equipment.year ? new Date().getFullYear() - parseInt(equipment.year) : 0;
    const ageMultiplier = 1 + (age * 0.02); // 2% increase per year
    
    // Adjust for operating hours (high usage equipment needs more maintenance)
    const hours = equipment.operatingHours || 0;
    const hoursMultiplier = hours > 5000 ? 1.2 : hours > 3000 ? 1.1 : 1.0;
    
    return Math.round(baseRate * ageMultiplier * hoursMultiplier);
  }

  // Analytics Methods
  static getFleetStatistics() {
    const equipment = this.getEquipment();
    const maintenance = this.getMaintenanceRecords();
    
    const stats = {
      totalEquipment: equipment.length,
      activeEquipment: equipment.filter(eq => eq.status === 'active').length,
      totalValue: equipment.reduce((sum, eq) => sum + (eq.currentValue || 0), 0),
      totalDepreciation: equipment.reduce((sum, eq) => sum + (eq.depreciationAmount || 0), 0),
      avgAge: equipment.length > 0 
        ? Math.round(equipment.reduce((sum, eq) => sum + (new Date().getFullYear() - parseInt(eq.year || 0)), 0) / equipment.length)
        : 0,
      maintenanceDue: this.getMaintenanceDue().length,
      totalMaintenanceCost: maintenance
        .filter(m => m.status === 'completed')
        .reduce((sum, m) => sum + (m.cost || 0), 0),
      categoryBreakdown: equipment.reduce((acc, eq) => {
        acc[eq.category] = (acc[eq.category] || 0) + 1;
        return acc;
      }, {})
    };
    
    return stats;
  }

  static getMaintenanceDue(daysAhead = 30) {
    const maintenance = this.getMaintenanceRecords();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
    
    return maintenance.filter(record => {
      if (record.status !== 'scheduled') return false;
      
      const scheduledDate = new Date(record.scheduledDate);
      return scheduledDate <= cutoffDate;
    });
  }

  static getEquipmentUtilization() {
    const equipment = this.getEquipment();
    const schedules = this.getSchedules();
    
    return equipment.map(eq => {
      const equipmentSchedules = schedules.filter(s => s.equipmentId === eq.id);
      const activeSchedules = equipmentSchedules.filter(s => 
        ['scheduled', 'in-progress'].includes(s.status)
      );
      
      // Calculate utilization based on scheduled time
      const totalScheduledHours = equipmentSchedules.reduce((sum, schedule) => {
        const start = new Date(`1970-01-01T${schedule.startTime}`);
        const end = new Date(`1970-01-01T${schedule.endTime}`);
        const hours = (end - start) / (1000 * 60 * 60);
        return sum + (hours > 0 ? hours : 0);
      }, 0);
      
      return {
        ...eq,
        utilization: {
          scheduledHours: totalScheduledHours,
          activeSchedules: activeSchedules.length,
          utilizationRate: totalScheduledHours > 0 ? Math.min(100, (totalScheduledHours / (8 * 30)) * 100) : 0 // Assuming 8 hours/day, 30 days
        }
      };
    });
  }

  // Export/Import Methods
  static exportData() {
    return {
      equipment: this.getEquipment(),
      maintenance: this.getMaintenanceRecords(),
      serviceProviders: this.getServiceProviders(),
      schedules: this.getSchedules(),
      exportDate: new Date().toISOString()
    };
  }

  static importData(data) {
    if (data.equipment) this.saveEquipment(data.equipment);
    if (data.maintenance) this.saveMaintenanceRecords(data.maintenance);
    if (data.serviceProviders) this.saveServiceProviders(data.serviceProviders);
    if (data.schedules) this.saveSchedules(data.schedules);
  }

  // Initialize mock data
  static initializeMockDataIfEmpty() {
    // Check if any data exists
    const hasEquipment = this.getEquipment().length > 0;
    const hasMaintenance = this.getMaintenanceRecords().length > 0;
    const hasProviders = this.getServiceProviders().length > 0;
    const hasSchedules = this.getSchedules().length > 0;

    if (!hasEquipment || !hasMaintenance || !hasProviders || !hasSchedules) {
      this.createMockData();
    }
  }

  static createMockData() {
    // This method can be called to reset to mock data
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
        createdAt: '2020-03-15T00:00:00.000Z',
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
        createdAt: '2018-08-22T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      }
    ];

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
        createdAt: '2025-10-15T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      }
    ];

    // Save mock data if arrays are provided
    if (mockEquipment.length > 0) this.saveEquipment(mockEquipment);
    if (mockMaintenance.length > 0) this.saveMaintenanceRecords(mockMaintenance);
  }

  // Search and Filter Methods
  static searchEquipment(query, filters = {}) {
    const equipment = this.getEquipment();
    
    return equipment.filter(eq => {
      // Text search
      const searchText = query.toLowerCase();
      const matchesSearch = !query || 
        eq.name.toLowerCase().includes(searchText) ||
        eq.make.toLowerCase().includes(searchText) ||
        eq.model.toLowerCase().includes(searchText) ||
        eq.category.toLowerCase().includes(searchText);
      
      // Filter by category
      const matchesCategory = !filters.category || 
        filters.category === 'all' || 
        eq.category === filters.category;
      
      // Filter by status
      const matchesStatus = !filters.status || 
        filters.status === 'all' || 
        eq.status === filters.status;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  // Validation Methods
  static validateEquipmentData(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Equipment name is required');
    }
    
    if (!data.category) {
      errors.push('Equipment category is required');
    }
    
    if (!data.make || data.make.trim().length === 0) {
      errors.push('Equipment make is required');
    }
    
    if (!data.model || data.model.trim().length === 0) {
      errors.push('Equipment model is required');
    }
    
    if (!data.year || isNaN(parseInt(data.year))) {
      errors.push('Valid year is required');
    }
    
    if (data.purchasePrice && isNaN(parseFloat(data.purchasePrice))) {
      errors.push('Purchase price must be a valid number');
    }
    
    return errors;
  }

  static validateMaintenanceData(data) {
    const errors = [];
    
    if (!data.equipmentId) {
      errors.push('Equipment selection is required');
    }
    
    if (!data.category) {
      errors.push('Maintenance category is required');
    }
    
    if (!data.description || data.description.trim().length === 0) {
      errors.push('Maintenance description is required');
    }
    
    if (!data.scheduledDate) {
      errors.push('Scheduled date is required');
    }
    
    return errors;
  }
}

export default MachineryService;