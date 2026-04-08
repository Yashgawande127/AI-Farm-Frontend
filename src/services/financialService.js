import axios from 'axios';

// Create axios instance for financial services
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.access_token) {
          config.headers.Authorization = `Bearer ${userData.access_token}`;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const financialService = {
  // Financial Overview
  async getFinancialOverview() {
    try {
      const response = await api.get('/financial/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching financial overview:', error);
      // Return mock data for development (amounts in INR)
      return {
        totalBalance: 1250000,
        monthlyIncome: 450000,
        monthlyExpenses: 320000,
        savingsGoals: [
          { name: 'New Tractor', saved: 250000, target: 850000 },
          { name: 'Field Expansion', saved: 150000, target: 1200000 },
        ],
        recentTransactions: [
          { type: 'income', description: 'Rice Sale', category: 'Crop Sales', amount: 150000, date: '2024-11-01' },
          { type: 'expense', description: 'Fertilizer Purchase', category: 'Fertilizers', amount: 35000, date: '2024-10-30' },
          { type: 'expense', description: 'Labor Costs', category: 'Labor', amount: 28000, date: '2024-10-28' },
        ],
        upcomingPayments: []
      };
    }
  },

  // Transactions
  async getTransactions(limit = 50) {
    try {
      const response = await api.get(`/financial/transactions?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Return mock data (amounts in INR)
      return [
        { id: 1, type: 'income', description: 'Rice Sale', category: 'Crop Sales', amount: 150000, date: '2024-11-01' },
        { id: 2, type: 'expense', description: 'Fertilizer Purchase', category: 'Fertilizers', amount: 35000, date: '2024-10-30' },
        { id: 3, type: 'expense', description: 'Labor Costs', category: 'Labor', amount: 28000, date: '2024-10-28' },
        { id: 4, type: 'income', description: 'Wheat Sale', category: 'Crop Sales', amount: 120000, date: '2024-10-25' },
        { id: 5, type: 'expense', description: 'Seed Purchase', category: 'Seeds', amount: 42000, date: '2024-10-20' },
      ];
    }
  },

  async addTransaction(transaction) {
    try {
      const response = await api.post('/financial/transactions', transaction);
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      // Return mock response
      return {
        id: Date.now(),
        ...transaction,
        amount: parseFloat(transaction.amount)
      };
    }
  },

  // Recurring Transactions
  async getRecurringTransactions() {
    try {
      const response = await api.get('/financial/recurring-transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching recurring transactions:', error);
      // Return mock data (amounts in INR)
      return [
        { id: 1, type: 'expense', description: 'Equipment Loan Payment', category: 'Equipment', amount: 12000, frequency: 'monthly', active: true },
        { id: 2, type: 'expense', description: 'Insurance Premium', category: 'Insurance', amount: 8500, frequency: 'quarterly', active: true },
        { id: 3, type: 'income', description: 'Land Lease', category: 'Other Income', amount: 25000, frequency: 'monthly', active: true },
      ];
    }
  },

  async addRecurringTransaction(recurring) {
    try {
      const response = await api.post('/financial/recurring-transactions', recurring);
      return response.data;
    } catch (error) {
      console.error('Error adding recurring transaction:', error);
      // Return mock response
      return {
        id: Date.now(),
        ...recurring,
        amount: parseFloat(recurring.amount),
        active: true
      };
    }
  },

  async toggleRecurringTransaction(id) {
    try {
      const response = await api.patch(`/financial/recurring-transactions/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error('Error toggling recurring transaction:', error);
      throw error;
    }
  },

  // Budget Allocation
  async getBudgetAllocation() {
    try {
      const response = await api.get('/financial/budget-allocation');
      return response.data;
    } catch (error) {
      console.error('Error fetching budget allocation:', error);
      // Return mock data
      return {
        seeds: 25,
        fertilizers: 20,
        labor: 30,
        equipment: 15,
        other: 10
      };
    }
  },

  async updateBudgetAllocation(allocation) {
    try {
      const response = await api.put('/financial/budget-allocation', allocation);
      return response.data;
    } catch (error) {
      console.error('Error updating budget allocation:', error);
      throw error;
    }
  },

  // Cash Flow Projections
  async getCashFlowProjections() {
    try {
      const response = await api.get('/financial/cash-flow');
      return response.data;
    } catch (error) {
      console.error('Error fetching cash flow projections:', error);
      // Return mock data
      return {
        projections: [],
        currentSeason: 'fall',
        seasons: {
          spring: { income: 200000, expenses: 450000 },
          summer: { income: 150000, expenses: 250000 },
          fall: { income: 850000, expenses: 350000 },
          winter: { income: 100000, expenses: 150000 }
        }
      };
    }
  },

  // Loans
  async getLoans() {
    try {
      const response = await api.get('/financial/loans');
      return response.data;
    } catch (error) {
      console.error('Error fetching loans:', error);
      // Return mock data (amounts in INR)
      return [
        { 
          id: 1, 
          lender: 'Agricultural Bank of India', 
          principal: 850000, 
          interestRate: 4.25, 
          termMonths: 84, 
          remainingMonths: 67,
          startDate: '2022-01-15',
          purpose: 'Combine harvester purchase',
          type: 'equipment'
        },
        { 
          id: 2, 
          lender: 'State Bank of India', 
          principal: 1500000, 
          interestRate: 3.75, 
          termMonths: 180, 
          remainingMonths: 142,
          startDate: '2021-06-01',
          purpose: 'Land acquisition',
          type: 'land'
        }
      ];
    }
  },

  async addLoan(loan) {
    try {
      const response = await api.post('/financial/loans', loan);
      return response.data;
    } catch (error) {
      console.error('Error adding loan:', error);
      // Return mock response
      return {
        id: Date.now(),
        ...loan,
        principal: parseFloat(loan.principal),
        interestRate: parseFloat(loan.interestRate),
        termMonths: parseInt(loan.termMonths),
        remainingMonths: parseInt(loan.termMonths)
      };
    }
  },

  // Investments
  async getInvestments() {
    try {
      const response = await api.get('/financial/investments');
      return response.data;
    } catch (error) {
      console.error('Error fetching investments:', error);
      // Return mock data (amounts in INR)
      return [
        { 
          id: 1, 
          name: 'Precision Planting System', 
          type: 'technology', 
          amount: 250000, 
          expectedReturn: 12, 
          date: '2024-03-15',
          description: 'GPS-guided planting system for improved efficiency'
        },
        { 
          id: 2, 
          name: 'Grain Storage Facility', 
          type: 'infrastructure', 
          amount: 1200000, 
          expectedReturn: 8, 
          date: '2023-08-20',
          description: 'On-farm grain storage to reduce transportation costs'
        }
      ];
    }
  },

  async addInvestment(investment) {
    try {
      const response = await api.post('/financial/investments', investment);
      return response.data;
    } catch (error) {
      console.error('Error adding investment:', error);
      // Return mock response
      return {
        id: Date.now(),
        ...investment,
        amount: parseFloat(investment.amount),
        expectedReturn: parseFloat(investment.expectedReturn)
      };
    }
  },

  // Tax Data
  async getTaxData() {
    try {
      const response = await api.get('/financial/tax-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching tax data:', error);
      // Return mock data (amounts in INR)
      return {
        currentYear: 2024,
        categories: {
          income: 1800000,
          deductibleExpenses: 1250000,
          depreciation: 250000,
          estimatedTax: 90000
        },
        documents: []
      };
    }
  },

  async generateTaxReport() {
    try {
      const response = await api.post('/financial/tax-report');
      return response.data;
    } catch (error) {
      console.error('Error generating tax report:', error);
      throw error;
    }
  },

  // Savings Goals
  async getSavingsGoals() {
    try {
      const response = await api.get('/financial/savings-goals');
      return response.data;
    } catch (error) {
      console.error('Error fetching savings goals:', error);
      // Return mock data (amounts in INR)
      return [
        {
          id: 1,
          name: 'New Mahindra Tractor',
          type: 'equipment',
          targetAmount: 850000,
          currentAmount: 250000,
          targetDate: '2025-04-01',
          description: 'Replace aging tractor for improved efficiency',
          priority: 'high',
          autoSave: true,
          autoSaveAmount: 15000
        },
        {
          id: 2,
          name: 'Field Expansion Project',
          type: 'land',
          targetAmount: 1200000,
          currentAmount: 150000,
          targetDate: '2026-01-01',
          description: 'Purchase adjacent 2-acre field',
          priority: 'medium',
          autoSave: false,
          autoSaveAmount: 0
        },
        {
          id: 3,
          name: 'Drip Irrigation System',
          type: 'infrastructure',
          targetAmount: 450000,
          currentAmount: 80000,
          targetDate: '2025-06-01',
          description: 'Install modern drip irrigation system',
          priority: 'medium',
          autoSave: true,
          autoSaveAmount: 8000
        }
      ];
    }
  },

  async addSavingsGoal(goal) {
    try {
      const response = await api.post('/financial/savings-goals', goal);
      return response.data;
    } catch (error) {
      console.error('Error adding savings goal:', error);
      // Return mock response
      return {
        id: Date.now(),
        ...goal,
        targetAmount: parseFloat(goal.targetAmount),
        currentAmount: 0,
        autoSaveAmount: parseFloat(goal.autoSaveAmount) || 0
      };
    }
  },

  async contributeToGoal(goalId, amount) {
    try {
      const response = await api.post(`/financial/savings-goals/${goalId}/contribute`, { amount });
      return response.data;
    } catch (error) {
      console.error('Error contributing to goal:', error);
      throw error;
    }
  },

  // Emergency Fund
  async getEmergencyFund() {
    try {
      const response = await api.get('/financial/emergency-fund');
      return response.data;
    } catch (error) {
      console.error('Error fetching emergency fund:', error);
      // Return mock data (amounts in INR)
      return {
        currentAmount: 350000,
        targetAmount: 500000,
        monthlyExpenses: 85000,
        monthsOfExpenses: 6,
        autoContribute: true,
        contributionAmount: 10000
      };
    }
  },

  async updateEmergencyFund(fund) {
    try {
      const response = await api.put('/financial/emergency-fund', fund);
      return response.data;
    } catch (error) {
      console.error('Error updating emergency fund:', error);
      throw error;
    }
  },

  // Seasonal Planning
  async getSeasonalPlanning() {
    try {
      const response = await api.get('/financial/seasonal-planning');
      return response.data;
    } catch (error) {
      console.error('Error fetching seasonal planning:', error);
      // Return mock data (amounts in INR)
      return {
        currentSavings: 450000,
        springNeeds: 250000,
        summerNeeds: 150000,
        fallNeeds: 200000,
        winterNeeds: 100000,
        totalNeeded: 700000,
        projectedIncome: 1800000
      };
    }
  },

  // Expansion Plans
  async getExpansionPlans() {
    try {
      const response = await api.get('/financial/expansion-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching expansion plans:', error);
      // Return mock data (amounts in INR)
      return [
        {
          id: 1,
          name: 'North Field Acquisition',
          type: 'land_purchase',
          estimatedCost: 1500000,
          timeframe: '2-3 years',
          description: 'Purchase 3-acre field adjacent to current property',
          expectedReturn: 6,
          priority: 'high'
        },
        {
          id: 2,
          name: 'Dairy Farming Integration',
          type: 'market_expansion',
          estimatedCost: 850000,
          timeframe: '3-4 years',
          description: 'Add dairy operation to diversify income streams',
          expectedReturn: 10,
          priority: 'medium'
        }
      ];
    }
  },

  async addExpansionPlan(plan) {
    try {
      const response = await api.post('/financial/expansion-plans', plan);
      return response.data;
    } catch (error) {
      console.error('Error adding expansion plan:', error);
      // Return mock response
      return {
        id: Date.now(),
        ...plan,
        estimatedCost: parseFloat(plan.estimatedCost),
        expectedReturn: parseFloat(plan.expectedReturn)
      };
    }
  }
};

export default financialService;