// Weather Service for integrating with weather APIs
class WeatherService {
  constructor() {
    this.apiKey = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // Get current weather conditions
  async getCurrentWeather(lat = 40.7128, lon = -74.0060) {
    // If no real API key is provided, return mock data immediately to avoid 401 errors in console
    if (!this.apiKey || this.apiKey === 'demo_key') {
      return this.getMockWeatherData();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        // Return mock data if API fails
        return this.getMockWeatherData();
      }
      
      const data = await response.json();
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: await this.getUVIndex(lat, lon),
        icon: data.weather[0].icon
      };
    } catch (error) {
      console.warn('Weather API error, using mock data:', error);
      return this.getMockWeatherData();
    }
  }

  // Get 7-day weather forecast
  async getWeatherForecast(lat = 40.7128, lon = -74.0060) {
    // If no real API key is provided, return mock data immediately to avoid 401 errors in console
    if (!this.apiKey || this.apiKey === 'demo_key') {
      return this.getMockForecastData();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );
      
      if (!response.ok) {
        return this.getMockForecastData();
      }
      
      const data = await response.json();
      
      // Group by days and get daily predictions
      const dailyForecasts = {};
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date,
            temp_max: item.main.temp_max,
            temp_min: item.main.temp_min,
            description: item.weather[0].description,
            humidity: item.main.humidity,
            rainfall: item.rain ? item.rain['3h'] || 0 : 0,
            icon: item.weather[0].icon
          };
        } else {
          // Update max/min temperatures
          dailyForecasts[date].temp_max = Math.max(dailyForecasts[date].temp_max, item.main.temp_max);
          dailyForecasts[date].temp_min = Math.min(dailyForecasts[date].temp_min, item.main.temp_min);
          dailyForecasts[date].rainfall += item.rain ? item.rain['3h'] || 0 : 0;
        }
      });
      
      return Object.values(dailyForecasts).slice(0, 7);
    } catch (error) {
      console.warn('Forecast API error, using mock data:', error);
      return this.getMockForecastData();
    }
  }

  // Get UV Index
  async getUVIndex(lat, lon) {
    try {
      const response = await fetch(
        `${this.baseUrl}/uvi?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
      );
      
      if (!response.ok) {
        return 5; // Default moderate UV index
      }
      
      const data = await response.json();
      return Math.round(data.value);
    } catch (error) {
      return 5;
    }
  }

  // Get agricultural weather advisories
  getAgriculturalAdvisory(weather, forecast) {
    const advisories = [];
    
    // Temperature advisories
    if (weather.temperature > 35) {
      advisories.push({
        type: 'heat',
        priority: 'high',
        message: 'Extreme heat warning. Increase irrigation frequency and provide shade for livestock.',
        icon: '🌡️'
      });
    } else if (weather.temperature < 5) {
      advisories.push({
        type: 'frost',
        priority: 'high',
        message: 'Frost risk. Protect sensitive crops and ensure livestock shelter.',
        icon: '❄️'
      });
    }
    
    // Rainfall advisories
    const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0);
    if (totalRainfall > 50) {
      advisories.push({
        type: 'flood',
        priority: 'medium',
        message: 'Heavy rainfall expected. Check drainage systems and delay field operations.',
        icon: '🌧️'
      });
    } else if (totalRainfall < 5) {
      advisories.push({
        type: 'drought',
        priority: 'medium',
        message: 'Low rainfall predicted. Plan irrigation schedules accordingly.',
        icon: '☀️'
      });
    }
    
    // Wind advisories
    if (weather.windSpeed > 15) {
      advisories.push({
        type: 'wind',
        priority: 'medium',
        message: 'Strong winds expected. Secure equipment and delay spraying operations.',
        icon: '💨'
      });
    }
    
    // UV advisories
    if (weather.uvIndex > 8) {
      advisories.push({
        type: 'uv',
        priority: 'low',
        message: 'High UV levels. Ensure adequate protection for field workers.',
        icon: '☀️'
      });
    }
    
    return advisories;
  }

  // Mock weather data for demonstration/fallback
  getMockWeatherData() {
    return {
      temperature: 24,
      humidity: 65,
      description: 'partly cloudy',
      windSpeed: 8,
      pressure: 1013,
      visibility: 10,
      uvIndex: 5,
      icon: '02d'
    };
  }

  // Mock forecast data for demonstration/fallback
  getMockForecastData() {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      
      return {
        date: date.toDateString(),
        temp_max: 22 + Math.random() * 8,
        temp_min: 15 + Math.random() * 5,
        description: ['sunny', 'partly cloudy', 'cloudy', 'light rain'][Math.floor(Math.random() * 4)],
        humidity: 50 + Math.random() * 30,
        rainfall: Math.random() * 10,
        icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)]
      };
    });
  }

  // Get optimal farming conditions
  getOptimalConditions(cropType) {
    const conditions = {
      wheat: {
        temperature: { min: 15, max: 25, optimal: 20 },
        humidity: { min: 40, max: 70, optimal: 55 },
        rainfall: { min: 300, max: 750, optimal: 500 }
      },
      rice: {
        temperature: { min: 20, max: 30, optimal: 25 },
        humidity: { min: 60, max: 90, optimal: 75 },
        rainfall: { min: 1000, max: 2000, optimal: 1500 }
      },
      corn: {
        temperature: { min: 18, max: 32, optimal: 25 },
        humidity: { min: 50, max: 80, optimal: 65 },
        rainfall: { min: 500, max: 1200, optimal: 800 }
      }
    };
    
    return conditions[cropType.toLowerCase()] || conditions.wheat;
  }

  // Calculate farming suitability score
  calculateSuitabilityScore(weather, forecast, cropType) {
    const optimal = this.getOptimalConditions(cropType);
    let score = 0;
    
    // Temperature score (40% weight)
    const tempScore = this.calculateParameterScore(
      weather.temperature, 
      optimal.temperature.min, 
      optimal.temperature.max, 
      optimal.temperature.optimal
    );
    score += tempScore * 0.4;
    
    // Humidity score (30% weight)
    const humidityScore = this.calculateParameterScore(
      weather.humidity,
      optimal.humidity.min,
      optimal.humidity.max,
      optimal.humidity.optimal
    );
    score += humidityScore * 0.3;
    
    // Rainfall score (30% weight)
    const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0) * 30; // Approximate monthly
    const rainfallScore = this.calculateParameterScore(
      totalRainfall,
      optimal.rainfall.min,
      optimal.rainfall.max,
      optimal.rainfall.optimal
    );
    score += rainfallScore * 0.3;
    
    return Math.round(score);
  }

  calculateParameterScore(value, min, max, optimal) {
    if (value < min || value > max) return 0;
    if (value === optimal) return 100;
    
    const distanceFromOptimal = Math.abs(value - optimal);
    const maxDistance = Math.max(optimal - min, max - optimal);
    return Math.max(0, 100 - (distanceFromOptimal / maxDistance) * 100);
  }
}

export default new WeatherService();