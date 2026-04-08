// Market Data Service for real-time pricing and market information
class MarketDataService {
  constructor() {
    this.baseUrl = 'https://api.marketdata.example.com'; // Replace with actual market data API
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
    this.cache = new Map();
    this.lastUpdate = null;
  }

  // Get current market prices for crops
  async getCropPrices() {
    try {
      const cacheKey = 'crop_prices';
      const cached = this.getCachedData(cacheKey);
      
      if (cached) {
        return cached;
      }

      // In a real implementation, this would call an actual market API
      // const response = await fetch(`${this.baseUrl}/crops/prices`);
      // const data = await response.json();
      
      // Using mock data for demonstration
      const data = this.getMockCropPrices();
      
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.warn('Market API error, using cached/mock data:', error);
      return this.getMockCropPrices();
    }
  }

  // Get fertilizer prices
  async getFertilizerPrices() {
    try {
      const cacheKey = 'fertilizer_prices';
      const cached = this.getCachedData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const data = this.getMockFertilizerPrices();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.warn('Fertilizer market API error:', error);
      return this.getMockFertilizerPrices();
    }
  }

  // Get machinery rental rates
  async getMachineryRates() {
    try {
      const cacheKey = 'machinery_rates';
      const cached = this.getCachedData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const data = this.getMockMachineryRates();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.warn('Machinery rates API error:', error);
      return this.getMockMachineryRates();
    }
  }

  // Get price trends over time
  async getPriceTrends(commodity, period = '30d') {
    try {
      const cacheKey = `price_trends_${commodity}_${period}`;
      const cached = this.getCachedData(cacheKey);
      
      if (cached) {
        return cached;
      }

      const data = this.getMockPriceTrends(commodity, period);
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.warn('Price trends API error:', error);
      return this.getMockPriceTrends(commodity, period);
    }
  }

  // Get market analysis and predictions
  async getMarketAnalysis(commodity) {
    try {
      const trends = await this.getPriceTrends(commodity);
      const currentPrice = await this.getCropPrices();
      
      const analysis = this.calculateMarketAnalysis(trends, currentPrice[commodity]);
      return analysis;
    } catch (error) {
      console.warn('Market analysis error:', error);
      return this.getMockMarketAnalysis(commodity);
    }
  }

  // Calculate market analysis from price data
  calculateMarketAnalysis(trends, currentPrice) {
    const prices = trends.map(item => item.price);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const volatility = this.calculateVolatility(prices);
    
    let trend = 'stable';
    let recommendation = 'hold';
    
    const recentPrices = prices.slice(-7); // Last 7 days
    const earlierPrices = prices.slice(0, 7); // First 7 days
    
    const recentAvg = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
    const earlierAvg = earlierPrices.reduce((sum, price) => sum + price, 0) / earlierPrices.length;
    
    const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;
    
    if (change > 5) {
      trend = 'bullish';
      recommendation = 'hold';
    } else if (change < -5) {
      trend = 'bearish';
      recommendation = 'sell';
    }
    
    if (currentPrice < avgPrice * 0.9) {
      recommendation = 'buy';
    } else if (currentPrice > avgPrice * 1.1) {
      recommendation = 'sell';
    }
    
    return {
      trend,
      recommendation,
      volatility,
      changePercent: change.toFixed(2),
      avgPrice: avgPrice.toFixed(2),
      confidence: Math.max(20, 100 - volatility * 10),
      factors: this.getMarketFactors(trend, volatility)
    };
  }

  calculateVolatility(prices) {
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance) / mean;
  }

  getMarketFactors(trend, volatility) {
    const factors = [];
    
    if (trend === 'bullish') {
      factors.push('Increasing demand', 'Favorable weather conditions', 'Strong export market');
    } else if (trend === 'bearish') {
      factors.push('Oversupply concerns', 'Weather disruptions', 'Reduced export demand');
    } else {
      factors.push('Balanced supply-demand', 'Stable weather patterns', 'Normal market conditions');
    }
    
    if (volatility > 0.1) {
      factors.push('High market uncertainty', 'Seasonal variations');
    }
    
    return factors;
  }

  // Cache management
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.updateInterval) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Mock data methods for demonstration (Indian Rupee prices)
  getMockCropPrices() {
    const baseTime = Date.now();
    return {
      wheat: 203.35 + (Math.random() - 0.5) * 16.6,      // ₹203.35 ± ₹16.6 per kg
      rice: 156.87 + (Math.random() - 0.5) * 12.45,      // ₹156.87 ± ₹12.45 per kg
      corn: 146.08 + (Math.random() - 0.5) * 14.94,      // ₹146.08 ± ₹14.94 per kg
      barley: 175.96 + (Math.random() - 0.5) * 13.28,    // ₹175.96 ± ₹13.28 per kg
      soybeans: 268.92 + (Math.random() - 0.5) * 20.75,  // ₹268.92 ± ₹20.75 per kg
      oats: 161.85 + (Math.random() - 0.5) * 11.62,      // ₹161.85 ± ₹11.62 per kg
      lastUpdate: new Date(baseTime).toISOString(),
      marketStatus: 'open'
    };
  }

  getMockFertilizerPrices() {
    return {
      nitrogen: 3784.80 + (Math.random() - 0.5) * 415,       // ₹3,784.80 ± ₹415 per kg
      phosphorus: 4340.90 + (Math.random() - 0.5) * 498,     // ₹4,340.90 ± ₹498 per kg
      potassium: 3216.25 + (Math.random() - 0.5) * 332,      // ₹3,216.25 ± ₹332 per kg
      organic_blend: 2921.60 + (Math.random() - 0.5) * 249,  // ₹2,921.60 ± ₹249 per kg
      lime: 2361.35 + (Math.random() - 0.5) * 166,           // ₹2,361.35 ± ₹166 per kg
      lastUpdate: new Date().toISOString()
    };
  }

  getMockMachineryRates() {
    return {
      tractor_small: 9960 + Math.random() * 2490,     // ₹9,960 ± ₹2,490 per day
      tractor_large: 14940 + Math.random() * 3320,    // ₹14,940 ± ₹3,320 per day
      combine_harvester: 20750 + Math.random() * 4150, // ₹20,750 ± ₹4,150 per day
      planter: 7055 + Math.random() * 2075,           // ₹7,055 ± ₹2,075 per day
      cultivator: 7885 + Math.random() * 1660,        // ₹7,885 ± ₹1,660 per day
      sprayer: 9130 + Math.random() * 2490,           // ₹9,130 ± ₹2,490 per day
      lastUpdate: new Date().toISOString()
    };
  }

  getMockPriceTrends(commodity, period) {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const basePrice = {
      wheat: 203.35,
      rice: 156.87,
      corn: 146.08,
      barley: 175.96
    }[commodity] || 166.00;

    const trends = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const variation = (Math.random() - 0.5) * 0.3;
      const seasonalFactor = Math.sin((i / days) * Math.PI * 2) * 0.1;
      
      trends.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat((basePrice + variation + seasonalFactor).toFixed(2)),
        volume: Math.floor(Math.random() * 10000) + 5000
      });
    }

    return trends;
  }

  getMockMarketAnalysis(commodity) {
    return {
      trend: 'bullish',
      recommendation: 'hold',
      volatility: 0.08,
      changePercent: '3.2',
      avgPrice: '194.22',  // ₹194.22 (converted from $2.34)
      confidence: 75,
      factors: [
        'Strong demand from export markets',
        'Favorable weather conditions',
        'Reduced inventory levels',
        'Seasonal price support'
      ]
    };
  }

  // Utility methods
  formatPrice(price, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(price);
  }

  formatChange(change) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }

  getPriceColor(change) {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  }
}

export default new MarketDataService();