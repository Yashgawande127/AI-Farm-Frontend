// Mock data and services for fertilizer management
// This would typically connect to a backend API

export const fertilizerCategories = {
  BALANCED: 'balanced',
  NITROGEN: 'nitrogen',
  PHOSPHORUS: 'phosphorus',
  POTASSIUM: 'potassium',
  MICRONUTRIENT: 'micronutrient',
  SOIL_CONDITIONER: 'soil_conditioner'
};

export const fertilizerTypes = {
  SYNTHETIC: 'synthetic',
  ORGANIC: 'organic',
  LIQUID: 'liquid',
  GRANULAR: 'granular'
};

export const soilTypes = {
  CLAY: 'Clay',
  LOAMY: 'Loamy',
  SANDY: 'Sandy',
  SANDY_LOAM: 'Sandy-loam',
  SILT: 'Silt',
  PEAT: 'Peat'
};

// Mock fertilizer database
const mockFertilizers = [
  {
    id: 1,
    name: 'NPK 10-10-10',
    type: fertilizerTypes.SYNTHETIC,
    category: fertilizerCategories.BALANCED,
    composition: {
      nitrogen: 10,
      phosphorus: 10,
      potassium: 10,
      micronutrients: ['Iron', 'Manganese', 'Zinc'],
      organicMatter: 0
    },
    applicationRates: {
      vegetables: { min: 100, max: 150, unit: 'kg/hectare' },
      grains: { min: 80, max: 120, unit: 'kg/hectare' },
      fruits: { min: 120, max: 180, unit: 'kg/hectare' }
    },
    soilCompatibility: [soilTypes.LOAMY, soilTypes.CLAY, soilTypes.SANDY_LOAM],
    seasonRecommendations: ['spring', 'early_summer'],
    organicCertified: false,
    priceRange: { min: 20, max: 30, currency: 'USD', unit: 'bag' },
    shelfLife: 24, // months
    storageRequirements: 'Cool, dry place',
    safetyPrecautions: [
      'Wear protective gloves when handling',
      'Avoid contact with skin and eyes',
      'Store away from children and pets'
    ]
  },
  {
    id: 2,
    name: 'Organic Compost',
    type: fertilizerTypes.ORGANIC,
    category: fertilizerCategories.SOIL_CONDITIONER,
    composition: {
      nitrogen: 2,
      phosphorus: 1,
      potassium: 2,
      micronutrients: ['Calcium', 'Magnesium', 'Sulfur'],
      organicMatter: 35
    },
    applicationRates: {
      vegetables: { min: 2, max: 4, unit: 'cubic yards/hectare' },
      grains: { min: 1.5, max: 3, unit: 'cubic yards/hectare' },
      fruits: { min: 3, max: 5, unit: 'cubic yards/hectare' }
    },
    soilCompatibility: Object.values(soilTypes),
    seasonRecommendations: ['spring', 'autumn'],
    organicCertified: true,
    priceRange: { min: 30, max: 40, currency: 'USD', unit: 'cubic yard' },
    shelfLife: 12, // months
    storageRequirements: 'Well-ventilated area, prevent waterlogging',
    safetyPrecautions: [
      'Generally safe for handling',
      'Wash hands after use',
      'Avoid inhaling dust particles'
    ]
  }
];

// Fertilizer service functions
export const fertilizerService = {
  // Get all fertilizers
  getAllFertilizers: () => {
    return Promise.resolve(mockFertilizers);
  },

  // Get fertilizer by ID
  getFertilizerById: (id) => {
    const fertilizer = mockFertilizers.find(f => f.id === id);
    return Promise.resolve(fertilizer);
  },

  // Get fertilizers by type
  getFertilizersByType: (type) => {
    const fertilizers = mockFertilizers.filter(f => f.type === type);
    return Promise.resolve(fertilizers);
  },

  // Get fertilizers by category
  getFertilizersByCategory: (category) => {
    const fertilizers = mockFertilizers.filter(f => f.category === category);
    return Promise.resolve(fertilizers);
  },

  // Get fertilizers compatible with soil type
  getFertilizersForSoilType: (soilType) => {
    const fertilizers = mockFertilizers.filter(f => 
      f.soilCompatibility.includes(soilType)
    );
    return Promise.resolve(fertilizers);
  },

  // Get organic certified fertilizers
  getOrganicFertilizers: () => {
    const fertilizers = mockFertilizers.filter(f => f.organicCertified);
    return Promise.resolve(fertilizers);
  },

  // Calculate application rate for crop and field size
  calculateApplicationRate: (fertilizerId, cropType, fieldSize) => {
    const fertilizer = mockFertilizers.find(f => f.id === fertilizerId);
    if (!fertilizer) return null;

    const rates = fertilizer.applicationRates[cropType];
    if (!rates) return null;

    const recommendedRate = (rates.min + rates.max) / 2;
    const totalAmount = recommendedRate * fieldSize;

    return {
      ratePerHectare: recommendedRate,
      totalAmount: totalAmount,
      unit: rates.unit,
      minRate: rates.min,
      maxRate: rates.max
    };
  },

  // Get fertilizer recommendations based on crop and soil
  getRecommendations: (cropType, soilType, season) => {
    const recommendations = mockFertilizers.filter(f => {
      const soilCompatible = f.soilCompatibility.includes(soilType);
      const seasonCompatible = f.seasonRecommendations.includes(season);
      return soilCompatible && seasonCompatible;
    });

    return Promise.resolve(recommendations);
  },

  // Search fertilizers
  searchFertilizers: (query) => {
    const lowercaseQuery = query.toLowerCase();
    const results = mockFertilizers.filter(f => 
      f.name.toLowerCase().includes(lowercaseQuery) ||
      f.category.toLowerCase().includes(lowercaseQuery) ||
      f.type.toLowerCase().includes(lowercaseQuery)
    );
    return Promise.resolve(results);
  }
};

// Inventory management functions
export const inventoryService = {
  // Mock inventory data
  inventory: [
    {
      fertilizerId: 1,
      currentStock: 45,
      unit: 'bags',
      location: 'Warehouse A',
      reorderLevel: 20,
      lastRestocked: '2024-10-01',
      expiryDate: '2025-08-15',
      batchNumber: 'NPK2024-456'
    },
    {
      fertilizerId: 2,
      currentStock: 12,
      unit: 'cubic yards',
      location: 'Compost Area',
      reorderLevel: 5,
      lastRestocked: '2024-09-15',
      expiryDate: null,
      batchNumber: 'ORG2024-123'
    }
  ],

  // Get inventory for all fertilizers
  getInventory: () => {
    return Promise.resolve(inventoryService.inventory);
  },

  // Get inventory for specific fertilizer
  getInventoryByFertilizer: (fertilizerId) => {
    const item = inventoryService.inventory.find(i => i.fertilizerId === fertilizerId);
    return Promise.resolve(item);
  },

  // Update stock levels
  updateStock: (fertilizerId, newStock) => {
    const index = inventoryService.inventory.findIndex(i => i.fertilizerId === fertilizerId);
    if (index !== -1) {
      inventoryService.inventory[index].currentStock = newStock;
      return Promise.resolve(inventoryService.inventory[index]);
    }
    return Promise.reject('Inventory item not found');
  },

  // Get low stock items
  getLowStockItems: () => {
    const lowStock = inventoryService.inventory.filter(item => 
      item.currentStock <= item.reorderLevel
    );
    return Promise.resolve(lowStock);
  }
};

// Application tracking functions
export const applicationService = {
  // Mock application logs
  applications: [
    {
      id: 1,
      fertilizerId: 1,
      fieldId: 'field_a',
      date: '2024-10-25',
      quantity: 150,
      unit: 'kg',
      applicator: 'John Smith',
      weather: 'Sunny, 22°C',
      notes: 'Pre-planting preparation'
    }
  ],

  // Log new application
  logApplication: (applicationData) => {
    const newApplication = {
      id: Date.now(),
      ...applicationData,
      timestamp: new Date().toISOString()
    };
    applicationService.applications.push(newApplication);
    return Promise.resolve(newApplication);
  },

  // Get applications by field
  getApplicationsByField: (fieldId) => {
    const fieldApplications = applicationService.applications.filter(a => a.fieldId === fieldId);
    return Promise.resolve(fieldApplications);
  },

  // Get applications by date range
  getApplicationsByDateRange: (startDate, endDate) => {
    const applications = applicationService.applications.filter(a => {
      const appDate = new Date(a.date);
      return appDate >= new Date(startDate) && appDate <= new Date(endDate);
    });
    return Promise.resolve(applications);
  }
};

export default {
  fertilizerService,
  inventoryService,
  applicationService,
  fertilizerCategories,
  fertilizerTypes,
  soilTypes
};