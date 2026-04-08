// Seeds data structure and mock data for the Seeds Management Module

export const seedVarieties = [
  {
    id: 1,
    name: "Premium Basmati Rice",
    category: "Rice",
    variety: "Basmati 1121",
    supplier: "Green Valley Seeds",
    characteristics: {
      maturityDays: 135,
      yieldPerAcre: "25-30 quintals",
      plantingDepth: "2-3 cm",
      spacing: "20x15 cm",
      waterRequirement: "High",
      soilType: "Clay loam"
    },
    growingRequirements: {
      temperature: "20-35°C",
      rainfall: "100-150 cm",
      humidity: "70-80%",
      sunlight: "6-8 hours",
      pH: "6.0-7.0"
    },
    seasonalInfo: {
      plantingSeasons: ["Kharif"],
      bestMonths: ["June", "July"],
      harvestMonths: ["October", "November"]
    },
    qualityInfo: {
      germinationRate: 92,
      purity: 98.5,
      batchNumber: "BR2024-001",
      testDate: "2024-03-15",
      expiryDate: "2025-03-15"
    },
    costInfo: {
      pricePerKg: 850,
      currency: "INR",
      lastPurchaseDate: "2024-03-20",
      quantityPurchased: 100,
      totalCost: 85000,
      bulkDiscountAvailable: true
    }
  },
  {
    id: 2,
    name: "Hybrid Wheat - HD 3086",
    category: "Wheat",
    variety: "HD 3086",
    supplier: "AgriTech Solutions",
    characteristics: {
      maturityDays: 110,
      yieldPerAcre: "40-45 quintals",
      plantingDepth: "3-4 cm",
      spacing: "20x2.5 cm",
      waterRequirement: "Medium",
      soilType: "Well-drained loam"
    },
    growingRequirements: {
      temperature: "15-25°C",
      rainfall: "50-75 cm",
      humidity: "50-70%",
      sunlight: "7-9 hours",
      pH: "6.5-7.5"
    },
    seasonalInfo: {
      plantingSeasons: ["Rabi"],
      bestMonths: ["November", "December"],
      harvestMonths: ["March", "April"]
    },
    qualityInfo: {
      germinationRate: 95,
      purity: 99.2,
      batchNumber: "WH2024-002",
      testDate: "2024-02-10",
      expiryDate: "2025-02-10"
    },
    costInfo: {
      pricePerKg: 45,
      currency: "INR",
      lastPurchaseDate: "2024-02-15",
      quantityPurchased: 500,
      totalCost: 22500,
      bulkDiscountAvailable: true
    }
  },
  {
    id: 3,
    name: "Cotton Bt - Bollgard II",
    category: "Cotton",
    variety: "Bollgard II",
    supplier: "Cotton Corp India",
    characteristics: {
      maturityDays: 160,
      yieldPerAcre: "15-20 quintals",
      plantingDepth: "2-3 cm",
      spacing: "90x30 cm",
      waterRequirement: "Medium",
      soilType: "Black cotton soil"
    },
    growingRequirements: {
      temperature: "21-30°C",
      rainfall: "50-100 cm",
      humidity: "60-80%",
      sunlight: "8-10 hours",
      pH: "5.8-8.0"
    },
    seasonalInfo: {
      plantingSeasons: ["Kharif"],
      bestMonths: ["April", "May", "June"],
      harvestMonths: ["October", "November", "December"]
    },
    qualityInfo: {
      germinationRate: 88,
      purity: 97.8,
      batchNumber: "CT2024-003",
      testDate: "2024-01-25",
      expiryDate: "2025-01-25"
    },
    costInfo: {
      pricePerKg: 1200,
      currency: "INR",
      lastPurchaseDate: "2024-01-30",
      quantityPurchased: 50,
      totalCost: 60000,
      bulkDiscountAvailable: false
    }
  },
  {
    id: 4,
    name: "Tomato Hybrid - Arka Rakshak",
    category: "Vegetables",
    variety: "Arka Rakshak",
    supplier: "Vegetable Research Station",
    characteristics: {
      maturityDays: 75,
      yieldPerAcre: "600-800 quintals",
      plantingDepth: "1-2 cm",
      spacing: "60x45 cm",
      waterRequirement: "High",
      soilType: "Well-drained sandy loam"
    },
    growingRequirements: {
      temperature: "20-30°C",
      rainfall: "60-150 cm",
      humidity: "60-70%",
      sunlight: "6-8 hours",
      pH: "6.0-7.0"
    },
    seasonalInfo: {
      plantingSeasons: ["Kharif", "Rabi", "Summer"],
      bestMonths: ["June", "July", "December", "January"],
      harvestMonths: ["September", "October", "March", "April"]
    },
    qualityInfo: {
      germinationRate: 90,
      purity: 96.5,
      batchNumber: "TM2024-004",
      testDate: "2024-04-01",
      expiryDate: "2026-04-01"
    },
    costInfo: {
      pricePerKg: 25000,
      currency: "INR",
      lastPurchaseDate: "2024-04-05",
      quantityPurchased: 2,
      totalCost: 50000,
      bulkDiscountAvailable: false
    }
  },
  {
    id: 5,
    name: "Maize Hybrid - NK 6240",
    category: "Maize",
    variety: "NK 6240",
    supplier: "Pioneer Seeds",
    characteristics: {
      maturityDays: 95,
      yieldPerAcre: "80-100 quintals",
      plantingDepth: "3-5 cm",
      spacing: "60x20 cm",
      waterRequirement: "Medium",
      soilType: "Well-drained loam"
    },
    growingRequirements: {
      temperature: "21-27°C",
      rainfall: "50-100 cm",
      humidity: "60-70%",
      sunlight: "7-9 hours",
      pH: "5.8-7.8"
    },
    seasonalInfo: {
      plantingSeasons: ["Kharif", "Rabi"],
      bestMonths: ["June", "July", "December"],
      harvestMonths: ["September", "October", "March"]
    },
    qualityInfo: {
      germinationRate: 94,
      purity: 98.8,
      batchNumber: "MZ2024-005",
      testDate: "2024-03-10",
      expiryDate: "2025-03-10"
    },
    costInfo: {
      pricePerKg: 450,
      currency: "INR",
      lastPurchaseDate: "2024-03-15",
      quantityPurchased: 200,
      totalCost: 90000,
      bulkDiscountAvailable: true
    }
  }
];

export const fieldMaps = [
  {
    id: 1,
    name: "North Field",
    area: 5.2,
    unit: "acres",
    soilType: "Clay loam",
    coordinates: { lat: 28.6139, lng: 77.2090 },
    sections: [
      {
        id: "N1",
        area: 2.1,
        currentCrop: "Premium Basmati Rice",
        plantingDate: "2024-06-15",
        expectedHarvest: "2024-10-28",
        status: "Growing"
      },
      {
        id: "N2", 
        area: 1.8,
        currentCrop: "Maize Hybrid - NK 6240",
        plantingDate: "2024-06-20",
        expectedHarvest: "2024-09-23",
        status: "Flowering"
      },
      {
        id: "N3",
        area: 1.3,
        currentCrop: "Cotton Bt - Bollgard II",
        plantingDate: "2024-05-10",
        expectedHarvest: "2024-10-17",
        status: "Fruiting"
      }
    ]
  },
  {
    id: 2,
    name: "South Field",
    area: 3.8,
    unit: "acres",
    soilType: "Sandy loam",
    coordinates: { lat: 28.6129, lng: 77.2080 },
    sections: [
      {
        id: "S1",
        area: 2.0,
        currentCrop: "Tomato Hybrid - Arka Rakshak",
        plantingDate: "2024-07-01",
        expectedHarvest: "2024-09-14",
        status: "Vegetative"
      },
      {
        id: "S2",
        area: 1.8,
        currentCrop: "Hybrid Wheat - HD 3086",
        plantingDate: "2024-11-15",
        expectedHarvest: "2025-03-05",
        status: "Planned"
      }
    ]
  }
];

export const growthStages = [
  "Seed/Planting",
  "Germination",
  "Seedling",
  "Vegetative",
  "Flowering",
  "Fruiting/Grain Filling",
  "Maturity",
  "Harvested"
];

export const harvestRecords = [
  {
    id: 1,
    fieldId: 1,
    sectionId: "N2",
    cropVariety: "Maize Hybrid - NK 6240",
    plantingDate: "2024-03-15",
    harvestDate: "2024-06-18",
    quantityHarvested: 180,
    unit: "quintals",
    qualityGrade: "A",
    storageLocation: "Warehouse A",
    marketPrice: 2200,
    totalRevenue: 396000,
    costIncurred: 45000,
    profitMargin: 88.6
  },
  {
    id: 2,
    fieldId: 2,
    sectionId: "S1",
    cropVariety: "Tomato Hybrid - Arka Rakshak",
    plantingDate: "2024-01-10",
    harvestDate: "2024-03-25",
    quantityHarvested: 420,
    unit: "quintals",
    qualityGrade: "Premium",
    storageLocation: "Cold Storage B",
    marketPrice: 1800,
    totalRevenue: 756000,
    costIncurred: 85000,
    profitMargin: 88.8
  },
  {
    id: 3,
    fieldId: 1,
    sectionId: "N1",
    cropVariety: "Premium Basmati Rice",
    plantingDate: "2023-06-20",
    harvestDate: "2023-11-02",
    quantityHarvested: 56,
    unit: "quintals",
    qualityGrade: "Premium",
    storageLocation: "Warehouse C",
    marketPrice: 4500,
    totalRevenue: 252000,
    costIncurred: 32000,
    profitMargin: 87.3
  }
];

export const performanceAnalytics = {
  seedVarietyROI: [
    {
      variety: "Premium Basmati Rice",
      totalInvestment: 117000,
      totalRevenue: 252000,
      roi: 115.4,
      successRate: 92,
      averageYield: 26.7
    },
    {
      variety: "Tomato Hybrid - Arka Rakshak",
      totalInvestment: 135000,
      totalRevenue: 756000,
      roi: 460.0,
      successRate: 88,
      averageYield: 700
    },
    {
      variety: "Maize Hybrid - NK 6240",
      totalInvestment: 135000,
      totalRevenue: 396000,
      roi: 193.3,
      successRate: 95,
      averageYield: 90
    },
    {
      variety: "Hybrid Wheat - HD 3086",
      totalInvestment: 67500,
      totalRevenue: 0,
      roi: 0,
      successRate: 0,
      averageYield: 0,
      status: "Planned"
    },
    {
      variety: "Cotton Bt - Bollgard II",
      totalInvestment: 60000,
      totalRevenue: 0,
      roi: 0,
      successRate: 0,
      averageYield: 0,
      status: "Growing"
    }
  ],
  monthlyTrends: [
    { month: "Jan", planting: 2, harvesting: 1, revenue: 756000 },
    { month: "Feb", planting: 0, harvesting: 0, revenue: 0 },
    { month: "Mar", planting: 1, harvesting: 2, revenue: 648000 },
    { month: "Apr", planting: 0, harvesting: 0, revenue: 0 },
    { month: "May", planting: 1, harvesting: 0, revenue: 0 },
    { month: "Jun", planting: 3, harvesting: 1, revenue: 396000 },
    { month: "Jul", planting: 1, harvesting: 0, revenue: 0 },
    { month: "Aug", planting: 0, harvesting: 0, revenue: 0 },
    { month: "Sep", planting: 0, harvesting: 2, revenue: 0 },
    { month: "Oct", planting: 0, harvesting: 2, revenue: 0 },
    { month: "Nov", planting: 1, harvesting: 1, revenue: 252000 },
    { month: "Dec", planting: 1, harvesting: 0, revenue: 0 }
  ]
};

export const cropRotationPlans = [
  {
    fieldId: 1,
    fieldName: "North Field",
    rotationCycle: "3-year",
    years: [
      {
        year: 2024,
        seasons: [
          { season: "Kharif", crops: ["Premium Basmati Rice", "Cotton Bt - Bollgard II"] },
          { season: "Rabi", crops: ["Hybrid Wheat - HD 3086"] },
          { season: "Summer", crops: ["Fallow/Green Manure"] }
        ]
      },
      {
        year: 2025,
        seasons: [
          { season: "Kharif", crops: ["Maize Hybrid - NK 6240"] },
          { season: "Rabi", crops: ["Mustard", "Gram"] },
          { season: "Summer", crops: ["Fodder crops"] }
        ]
      },
      {
        year: 2026,
        seasons: [
          { season: "Kharif", crops: ["Cotton Bt - Bollgard II"] },
          { season: "Rabi", crops: ["Hybrid Wheat - HD 3086"] },
          { season: "Summer", crops: ["Vegetables"] }
        ]
      }
    ]
  }
];