// Seeds Management Service
import { 
  seedVarieties, 
  fieldMaps, 
  harvestRecords, 
  performanceAnalytics,
  cropRotationPlans,
  growthStages 
} from '../data/seedsData';

class SeedsService {
  // Seed Catalog Management
  getAllSeedVarieties() {
    return Promise.resolve(seedVarieties);
  }

  getSeedVarietyById(id) {
    const seed = seedVarieties.find(s => s.id === parseInt(id));
    return Promise.resolve(seed);
  }

  getSeedVarietiesByCategory(category) {
    const filtered = seedVarieties.filter(s => 
      s.category.toLowerCase().includes(category.toLowerCase())
    );
    return Promise.resolve(filtered);
  }

  searchSeedVarieties(searchTerm) {
    const filtered = seedVarieties.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return Promise.resolve(filtered);
  }

  addSeedVariety(seedData) {
    const newSeed = {
      id: Math.max(...seedVarieties.map(s => s.id)) + 1,
      ...seedData,
      createdDate: new Date().toISOString()
    };
    seedVarieties.push(newSeed);
    return Promise.resolve(newSeed);
  }

  updateSeedVariety(id, updateData) {
    const index = seedVarieties.findIndex(s => s.id === parseInt(id));
    if (index !== -1) {
      seedVarieties[index] = { ...seedVarieties[index], ...updateData };
      return Promise.resolve(seedVarieties[index]);
    }
    return Promise.reject(new Error('Seed variety not found'));
  }

  // Field Management
  getAllFields() {
    return Promise.resolve(fieldMaps);
  }

  getFieldById(id) {
    const field = fieldMaps.find(f => f.id === parseInt(id));
    return Promise.resolve(field);
  }

  updateFieldSection(fieldId, sectionId, updateData) {
    const field = fieldMaps.find(f => f.id === parseInt(fieldId));
    if (field) {
      const section = field.sections.find(s => s.id === sectionId);
      if (section) {
        Object.assign(section, updateData);
        return Promise.resolve(section);
      }
    }
    return Promise.reject(new Error('Field section not found'));
  }

  addField(fieldData) {
    const newField = {
      id: Math.max(...fieldMaps.map(f => f.id)) + 1,
      ...fieldData,
      sections: fieldData.sections || []
    };
    fieldMaps.push(newField);
    return Promise.resolve(newField);
  }

  // Planting and Growth Tracking
  plantCrop(fieldId, sectionId, plantingData) {
    const field = fieldMaps.find(f => f.id === parseInt(fieldId));
    if (field) {
      const section = field.sections.find(s => s.id === sectionId);
      if (section) {
        Object.assign(section, {
          currentCrop: plantingData.cropVariety,
          plantingDate: plantingData.plantingDate,
          expectedHarvest: plantingData.expectedHarvest,
          status: 'Seed/Planting'
        });
        return Promise.resolve(section);
      }
    }
    return Promise.reject(new Error('Field section not found'));
  }

  updateGrowthStage(fieldId, sectionId, newStage) {
    const field = fieldMaps.find(f => f.id === parseInt(fieldId));
    if (field) {
      const section = field.sections.find(s => s.id === sectionId);
      if (section && growthStages.includes(newStage)) {
        section.status = newStage;
        section.lastUpdated = new Date().toISOString();
        return Promise.resolve(section);
      }
    }
    return Promise.reject(new Error('Invalid field section or growth stage'));
  }

  getGrowthStages() {
    return Promise.resolve(growthStages);
  }

  // Harvest Management
  getAllHarvestRecords() {
    return Promise.resolve(harvestRecords);
  }

  getHarvestRecordsByField(fieldId) {
    const filtered = harvestRecords.filter(h => h.fieldId === parseInt(fieldId));
    return Promise.resolve(filtered);
  }

  addHarvestRecord(harvestData) {
    const newRecord = {
      id: Math.max(...harvestRecords.map(h => h.id)) + 1,
      ...harvestData,
      recordedDate: new Date().toISOString()
    };
    harvestRecords.push(newRecord);
    
    // Update field section status to "Harvested"
    this.updateGrowthStage(harvestData.fieldId, harvestData.sectionId, 'Harvested');
    
    return Promise.resolve(newRecord);
  }

  updateHarvestRecord(id, updateData) {
    const index = harvestRecords.findIndex(h => h.id === parseInt(id));
    if (index !== -1) {
      harvestRecords[index] = { ...harvestRecords[index], ...updateData };
      return Promise.resolve(harvestRecords[index]);
    }
    return Promise.reject(new Error('Harvest record not found'));
  }

  // Performance Analytics
  getPerformanceAnalytics() {
    return Promise.resolve(performanceAnalytics);
  }

  getROIBySeedVariety() {
    return Promise.resolve(performanceAnalytics.seedVarietyROI);
  }

  getMonthlyTrends() {
    return Promise.resolve(performanceAnalytics.monthlyTrends);
  }

  calculateFieldPerformance(fieldId) {
    const fieldRecords = harvestRecords.filter(h => h.fieldId === parseInt(fieldId));
    
    if (fieldRecords.length === 0) {
      return Promise.resolve({
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        averageROI: 0,
        totalHarvests: 0
      });
    }

    const totalRevenue = fieldRecords.reduce((sum, record) => sum + record.totalRevenue, 0);
    const totalCost = fieldRecords.reduce((sum, record) => sum + record.costIncurred, 0);
    const totalProfit = totalRevenue - totalCost;
    const averageROI = fieldRecords.reduce((sum, record) => sum + record.profitMargin, 0) / fieldRecords.length;

    return Promise.resolve({
      totalRevenue,
      totalCost,
      totalProfit,
      averageROI: Math.round(averageROI * 100) / 100,
      totalHarvests: fieldRecords.length,
      records: fieldRecords
    });
  }

  // Crop Rotation Planning
  getCropRotationPlans() {
    return Promise.resolve(cropRotationPlans);
  }

  getCropRotationPlanByField(fieldId) {
    const plan = cropRotationPlans.find(p => p.fieldId === parseInt(fieldId));
    return Promise.resolve(plan);
  }

  updateCropRotationPlan(fieldId, rotationData) {
    const index = cropRotationPlans.findIndex(p => p.fieldId === parseInt(fieldId));
    if (index !== -1) {
      cropRotationPlans[index] = { ...cropRotationPlans[index], ...rotationData };
      return Promise.resolve(cropRotationPlans[index]);
    }
    
    // Create new rotation plan if doesn't exist
    const newPlan = {
      fieldId: parseInt(fieldId),
      ...rotationData
    };
    cropRotationPlans.push(newPlan);
    return Promise.resolve(newPlan);
  }

  // Seasonal Planning
  getSeasonalRecommendations(season, soilType) {
    const recommendations = seedVarieties.filter(seed => {
      const matchesSeason = seed.seasonalInfo.plantingSeasons.includes(season);
      const matchesSoil = seed.characteristics.soilType.toLowerCase().includes(soilType.toLowerCase()) ||
                         soilType.toLowerCase().includes(seed.characteristics.soilType.toLowerCase());
      return matchesSeason && matchesSoil;
    });
    
    return Promise.resolve(recommendations);
  }

  // Cost Analysis
  getCostAnalysis() {
    const totalInvestment = seedVarieties.reduce((sum, seed) => sum + seed.costInfo.totalCost, 0);
    const averageCostPerKg = seedVarieties.reduce((sum, seed) => sum + seed.costInfo.pricePerKg, 0) / seedVarieties.length;
    
    const priceHistory = seedVarieties.map(seed => ({
      variety: seed.name,
      currentPrice: seed.costInfo.pricePerKg,
      lastPurchaseDate: seed.costInfo.lastPurchaseDate,
      trend: Math.random() > 0.5 ? 'up' : 'down' // Mock trend data
    }));

    return Promise.resolve({
      totalInvestment,
      averageCostPerKg: Math.round(averageCostPerKg),
      varietiesCount: seedVarieties.length,
      priceHistory,
      bulkDiscountOpportunities: seedVarieties.filter(seed => seed.costInfo.bulkDiscountAvailable)
    });
  }

  // Quality Tracking
  getQualityReport() {
    const averageGermination = seedVarieties.reduce((sum, seed) => sum + seed.qualityInfo.germinationRate, 0) / seedVarieties.length;
    const averagePurity = seedVarieties.reduce((sum, seed) => sum + seed.qualityInfo.purity, 0) / seedVarieties.length;
    
    const expiringSeeds = seedVarieties.filter(seed => {
      const expiryDate = new Date(seed.qualityInfo.expiryDate);
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      return expiryDate <= sixMonthsFromNow;
    });

    return Promise.resolve({
      averageGerminationRate: Math.round(averageGermination * 100) / 100,
      averagePurity: Math.round(averagePurity * 100) / 100,
      totalBatches: seedVarieties.length,
      expiringSeeds,
      qualityAlert: expiringSeeds.length > 0 ? `${expiringSeeds.length} seed batches expiring soon` : null
    });
  }
}

export default new SeedsService();