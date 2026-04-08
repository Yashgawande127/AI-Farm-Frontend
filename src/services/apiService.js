import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://ai-farm-backend-hax2.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Token management
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.access_token;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return null;
};

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Request interceptor for authentication and logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to:`, config.url);
    
    // Add auth token to requests
    const token = getAuthToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     `Server error: ${error.response.status}`;
      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

const apiService = {
  /**
   * Predict crop based on soil and weather data
   * @param {Object} data - The input data for prediction
   * @param {number} data.N - Nitrogen content
   * @param {number} data.P - Phosphorus content  
   * @param {number} data.K - Potassium content
   * @param {number} data.temperature - Temperature in Celsius
   * @param {number} data.humidity - Humidity percentage
   * @param {number} data.ph - pH level
   * @param {number} data.rainfall - Rainfall in mm
   * @returns {Promise} - Promise resolving to prediction result
   */
  async predictCrop(data) {
    try {
      console.log('Sending prediction request with data:', data);
      
      // Validate input data
      const requiredFields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
      const missingFields = requiredFields.filter(field => 
        data[field] === undefined || data[field] === null || data[field] === ''
      );
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Ensure all values are numbers
      const numericData = {};
      for (const [key, value] of Object.entries(data)) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          throw new Error(`Invalid numeric value for ${key}: ${value}`);
        }
        numericData[key] = numValue;
      }
      
      const response = await api.post('/predict', numericData);

      if (response.data.status === 'success') {
        // Normalize backend response into { status, data: { ... } }
        // Backend returns top-level keys like predicted_crop and confidence.
        const resp = response.data;
        const normalized = {
          status: resp.status,
          data: {
            predicted_crop: resp.predicted_crop || resp.data?.predicted_crop,
            confidence: resp.confidence || resp.data?.confidence || 0,
            recommendations: resp.recommendations || resp.data?.recommendations || [],
            input_features: resp.input_features || resp.data?.input_features || {}
          }
        };

        console.log('Normalized prediction response:', normalized);
        return normalized;
      } else {
        throw new Error(response.data.message || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction service error:', error);
      throw error;
    }
  },

  /**
   * Predict crop using ensemble of multiple AI models with comparison
   * @param {Object} data - The input data for prediction
   * @param {number} data.N - Nitrogen content
   * @param {number} data.P - Phosphorus content  
   * @param {number} data.K - Potassium content
   * @param {number} data.temperature - Temperature in Celsius
   * @param {number} data.humidity - Humidity percentage
   * @param {number} data.ph - pH level
   * @param {number} data.rainfall - Rainfall in mm
   * @returns {Promise} - Promise resolving to ensemble prediction result with model comparison
   */
  async predictCropEnsemble(data) {
    try {
      console.log('Sending ensemble prediction request with data:', data);
      
      // Validate input data
      const requiredFields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
      const missingFields = requiredFields.filter(field => 
        data[field] === undefined || data[field] === null || data[field] === ''
      );
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Ensure all values are numbers
      const numericData = {};
      for (const [key, value] of Object.entries(data)) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          throw new Error(`Invalid numeric value for ${key}: ${value}`);
        }
        numericData[key] = numValue;
      }
      
      const response = await api.post('/predict/ensemble', numericData);

      if (response.data.status === 'success') {
        const resp = response.data;
        
        // Extract ensemble prediction data
        const ensembleData = resp.ensemble_prediction || {};
        const ensemble = ensembleData.ensemble || {};
        
        // Normalize response to match expected structure
        const normalized = {
          status: resp.status,
          data: {
            predicted_crop: ensemble.prediction || resp.predicted_crop,
            confidence: ensemble.confidence || resp.confidence || 0,
            recommendations: resp.recommendations || [],
            input_features: resp.input_features || {},
            ensemble_data: ensembleData // Include full ensemble data for comparison
          }
        };

        console.log('Normalized ensemble prediction response:', normalized);
        return normalized;
      } else {
        throw new Error(response.data.message || 'Ensemble prediction failed');
      }
    } catch (error) {
      console.error('Ensemble prediction service error:', error);
      throw error;
    }
  },

  // Authentication methods
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise resolving to registration result
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.status === 'success') {
        // Store user data and token
        const userData = {
          ...response.data.user,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setAuthToken(response.data.access_token);
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration service error:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise resolving to login result
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.status === 'success') {
        // Store user data and token
        const userData = {
          ...response.data.user,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setAuthToken(response.data.access_token);
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      const token = getAuthToken();
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout service error:', error);
      // Continue with local logout even if server request fails
    } finally {
      // Clear local storage and auth header
      localStorage.removeItem('user');
      setAuthToken(null);
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} - Promise resolving to user profile
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      
      if (response.data.status === 'success') {
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Failed to get profile');
      }
    } catch (error) {
      console.error('Get profile service error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} updateData - Profile update data
   * @returns {Promise} - Promise resolving to updated profile
   */
  async updateProfile(updateData) {
    try {
      const response = await api.put('/auth/profile', updateData);
      
      if (response.data.status === 'success') {
        // Update local storage with new user data
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile service error:', error);
      throw error;
    }
  },

  /**
   * Verify if current token is valid
   * @returns {Promise} - Promise resolving to token verification result
   */
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify-token');
      
      if (response.data.status === 'success') {
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Token verification failed');
      }
    } catch (error) {
      console.error('Token verification service error:', error);
      // If token is invalid, clear local storage
      localStorage.removeItem('user');
      setAuthToken(null);
      throw error;
    }
  },

  /**
   * Health check endpoint
   * @returns {Promise} - Promise resolving to health status
   */
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },

  /**
   * Get model information
   * @returns {Promise} - Promise resolving to model info
   */
  async getModelInfo() {
    try {
      const response = await api.get('/model/info');
      return response.data;
    } catch (error) {
      console.error('Model info error:', error);
      throw error;
    }
  },

  /**
   * Authentication Methods
   */

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise resolving to user data and tokens
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.status === 'success') {
        // Store user data and token in localStorage
        const userWithToken = {
          ...response.data.user,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token
        };
        localStorage.setItem('user', JSON.stringify(userWithToken));
        setAuthToken(response.data.access_token);
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise resolving to user data and tokens
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.status === 'success') {
        // Store user data and token in localStorage
        const userWithToken = {
          ...response.data.user,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token
        };
        localStorage.setItem('user', JSON.stringify(userWithToken));
        setAuthToken(response.data.access_token);
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise} - Promise resolving to logout confirmation
   */
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      
      // Clear local storage and auth token regardless of response
      localStorage.removeItem('user');
      setAuthToken(null);
      
      return response.data;
    } catch (error) {
      // Clear local storage even if logout request fails
      localStorage.removeItem('user');
      setAuthToken(null);
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} - Promise resolving to user profile
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} - Promise resolving to updated profile
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Verify authentication token
   * @returns {Promise} - Promise resolving to token verification
   */
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify-token');
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },

  /**
   * Train all models including deep learning models
   * @returns {Promise} - Promise resolving to training results
   */
  async trainAllModels() {
    try {
      console.log('Training all models including deep learning models...');
      const response = await api.post('/train-all-models');
      return response.data;
    } catch (error) {
      console.error('Train all models error:', error);
      throw error;
    }
  },

  /**
   * Get comprehensive model comparison data
   * @returns {Promise} - Promise resolving to model comparison data
   */
  async getModelComparison() {
    try {
      console.log('Fetching model comparison data...');
      const response = await api.get('/model-comparison');
      return response.data;
    } catch (error) {
      console.error('Get model comparison error:', error);
      throw error;
    }
  }
};

export default apiService;