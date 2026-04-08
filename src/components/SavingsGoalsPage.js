import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import financialService from '../services/financialService';

const SavingsGoalsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('goals');

  // Savings Goals Data
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    type: 'equipment',
    targetAmount: '',
    currentAmount: 0,
    targetDate: '',
    description: '',
    priority: 'medium',
    autoSave: false,
    autoSaveAmount: ''
  });

  // Emergency Fund Data
  const [emergencyFund, setEmergencyFund] = useState({
    currentAmount: 0,
    targetAmount: 50000,
    monthlyExpenses: 0,
    monthsOfExpenses: 6,
    autoContribute: false,
    contributionAmount: 0
  });

  // Seasonal Planning Data
  const [seasonalPlanning, setSeasonalPlanning] = useState({
    currentSavings: 0,
    springNeeds: 25000,
    summerNeeds: 15000,
    fallNeeds: 20000,
    winterNeeds: 10000,
    totalNeeded: 70000,
    projectedIncome: 80000
  });

  // Expansion Planning Data
  const [expansionPlans, setExpansionPlans] = useState([]);
  const [newExpansion, setNewExpansion] = useState({
    name: '',
    type: 'land',
    estimatedCost: '',
    timeframe: '',
    description: '',
    expectedReturn: '',
    priority: 'medium'
  });

  const goalTypes = ['Equipment', 'Land', 'Infrastructure', 'Technology', 'Emergency', 'Seasonal', 'Other'];
  const priorityLevels = ['Low', 'Medium', 'High', 'Critical'];
  const expansionTypes = ['Land Purchase', 'Equipment Upgrade', 'Facility Construction', 'Technology Integration', 'Market Expansion'];

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    try {
      setLoading(true);
      const [goals, emergency, seasonal, expansions] = await Promise.all([
        financialService.getSavingsGoals(),
        financialService.getEmergencyFund(),
        financialService.getSeasonalPlanning(),
        financialService.getExpansionPlans()
      ]);
      
      setSavingsGoals(goals);
      setEmergencyFund(emergency);
      setSeasonalPlanning(seasonal);
      setExpansionPlans(expansions);
    } catch (error) {
      console.error('Error loading savings data:', error);
      setError('Failed to load savings data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const goal = await financialService.addSavingsGoal(newGoal);
      setSavingsGoals(prev => [goal, ...prev]);
      setNewGoal({
        name: '',
        type: 'equipment',
        targetAmount: '',
        currentAmount: 0,
        targetDate: '',
        description: '',
        priority: 'medium',
        autoSave: false,
        autoSaveAmount: ''
      });
      setSuccess('Savings goal created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error adding goal:', error);
      setError('Failed to create savings goal');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpansion = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const expansion = await financialService.addExpansionPlan(newExpansion);
      setExpansionPlans(prev => [expansion, ...prev]);
      setNewExpansion({
        name: '',
        type: 'land',
        estimatedCost: '',
        timeframe: '',
        description: '',
        expectedReturn: '',
        priority: 'medium'
      });
      setSuccess('Expansion plan added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error adding expansion plan:', error);
      setError('Failed to add expansion plan');
    } finally {
      setLoading(false);
    }
  };

  const handleContributeToGoal = async (goalId, amount) => {
    try {
      setLoading(true);
      await financialService.contributeToGoal(goalId, amount);
      setSavingsGoals(prev => 
        prev.map(goal => 
          goal.id === goalId 
            ? { ...goal, currentAmount: goal.currentAmount + amount }
            : goal
        )
      );
      setSuccess('Contribution added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error contributing to goal:', error);
      setError('Failed to add contribution');
    } finally {
      setLoading(false);
    }
  };

  const updateEmergencyFund = async () => {
    try {
      setLoading(true);
      await financialService.updateEmergencyFund(emergencyFund);
      setSuccess('Emergency fund settings updated!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating emergency fund:', error);
      setError('Failed to update emergency fund');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysToGoal = (targetDate) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateMonthlySavingsNeeded = (remaining, daysLeft) => {
    const monthsLeft = daysLeft / 30;
    return monthsLeft > 0 ? remaining / monthsLeft : 0;
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Header />
      <div className="flex justify-center items-center min-h-64 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg mx-auto text-center">
          <div className="mb-8">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Savings Data</h3>
          <p className="text-gray-600 leading-relaxed">
            Please wait while we load your savings goals...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              to="/financial" 
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
            >
              ← Back to Financial Management
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Savings Goals</h1>
          <p className="text-xl text-gray-600">
            Plan and track your savings for equipment, expansion, and emergency funds
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <span className="text-red-400 text-xl mr-3">⚠️</span>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <span className="text-green-400 text-xl mr-3">✅</span>
              <div>
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Saved</p>
                <p className="text-3xl font-bold">
                  ₹{savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100">Total Target</p>
                <p className="text-3xl font-bold">
                  ₹{savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-4xl">🎯</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Active Goals</p>
                <p className="text-3xl font-bold">{savingsGoals.length}</p>
              </div>
              <span className="text-4xl">📊</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Emergency Fund</p>
                <p className="text-3xl font-bold">
                  ₹{emergencyFund.currentAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-4xl">🆘</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('goals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'goals'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🎯 Savings Goals
              </button>
              <button
                onClick={() => setActiveTab('emergency')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'emergency'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🆘 Emergency Fund
              </button>
              <button
                onClick={() => setActiveTab('seasonal')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'seasonal'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🌾 Seasonal Planning
              </button>
              <button
                onClick={() => setActiveTab('expansion')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'expansion'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📈 Expansion Plans
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Savings Goals Tab */}
            {activeTab === 'goals' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add New Goal */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Savings Goal</h3>
                    <form onSubmit={handleAddGoal} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                        <input
                          type="text"
                          value={newGoal.name}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., New Combine Harvester"
                          required
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
                          <select
                            value={newGoal.type}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            {goalTypes.map(type => (
                              <option key={type} value={type.toLowerCase()}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          <select
                            value={newGoal.priority}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            {priorityLevels.map(priority => (
                              <option key={priority} value={priority.toLowerCase()}>{priority}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newGoal.targetAmount}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                            placeholder="₹0.00"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                          <input
                            type="date"
                            value={newGoal.targetDate}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={newGoal.description}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your savings goal"
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="autoSave"
                          checked={newGoal.autoSave}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, autoSave: e.target.checked }))}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="autoSave" className="text-sm font-medium text-gray-700">
                          Enable automatic savings
                        </label>
                        {newGoal.autoSave && (
                          <input
                            type="number"
                            step="0.01"
                            value={newGoal.autoSaveAmount}
                            onChange={(e) => setNewGoal(prev => ({ ...prev, autoSaveAmount: e.target.value }))}
                            placeholder="Monthly amount (₹)"
                            className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create Savings Goal
                      </button>
                    </form>
                  </div>

                  {/* Current Goals Progress */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Savings Goals</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {savingsGoals.map((goal, index) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const daysLeft = calculateDaysToGoal(goal.targetDate);
                        const remaining = goal.targetAmount - goal.currentAmount;
                        const monthlyNeeded = calculateMonthlySavingsNeeded(remaining, daysLeft);
                        
                        return (
                          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{goal.name}</h4>
                                <p className="text-sm text-gray-600 capitalize">{goal.type} • {goal.priority} priority</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                progress >= 100 ? 'bg-green-100 text-green-800' :
                                progress >= 75 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {Math.round(progress)}%
                              </span>
                            </div>
                            
                            <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>₹{goal.currentAmount.toLocaleString('en-IN')} saved</span>
                              <span>₹{goal.targetAmount.toLocaleString('en-IN')} target</span>
                            </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <p>Days remaining: <span className="font-medium">{daysLeft > 0 ? daysLeft : 'Overdue'}</span></p>
                              </div>
                              <div>
                                <p>Monthly needed: <span className="font-medium">₹{monthlyNeeded.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Contribute amount (₹)"
                                className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const amount = parseFloat(e.target.value);
                                    if (amount > 0) {
                                      handleContributeToGoal(goal.id, amount);
                                      e.target.value = '';
                                    }
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  const input = document.querySelector(`input[placeholder="Contribute amount"]`);
                                  const amount = parseFloat(input.value);
                                  if (amount > 0) {
                                    handleContributeToGoal(goal.id, amount);
                                    input.value = '';
                                  }
                                }}
                                className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Fund Tab */}
            {activeTab === 'emergency' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Emergency Fund Status */}
                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                      <span className="mr-2">🆘</span>
                      Emergency Fund Status
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Current Amount</span>
                          <span className="text-2xl font-bold text-green-600">
                            ₹{emergencyFund.currentAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-600">Target Amount</span>
                          <span className="text-lg font-semibold text-gray-900">
                            ₹{emergencyFund.targetAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-red-500 h-3 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((emergencyFund.currentAmount / emergencyFund.targetAmount) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {Math.round((emergencyFund.currentAmount / emergencyFund.targetAmount) * 100)}% of target reached
                        </p>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <h4 className="font-medium text-yellow-900 mb-2">Coverage Analysis</h4>
                        <div className="text-sm text-yellow-800">
                          <p>Monthly Expenses: ₹{emergencyFund.monthlyExpenses.toLocaleString('en-IN')}</p>
                          <p>Months Covered: {(emergencyFund.currentAmount / emergencyFund.monthlyExpenses).toFixed(1)}</p>
                          <p className="mt-2 font-medium">
                            Recommendation: {emergencyFund.monthsOfExpenses} months of expenses
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Fund Settings */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Fund Settings</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={emergencyFund.targetAmount}
                          onChange={(e) => setEmergencyFund(prev => ({ 
                            ...prev, 
                            targetAmount: parseFloat(e.target.value) || 0 
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Expenses</label>
                        <input
                          type="number"
                          step="0.01"
                          value={emergencyFund.monthlyExpenses}
                          onChange={(e) => setEmergencyFund(prev => ({ 
                            ...prev, 
                            monthlyExpenses: parseFloat(e.target.value) || 0 
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Coverage (Months)</label>
                        <select
                          value={emergencyFund.monthsOfExpenses}
                          onChange={(e) => setEmergencyFund(prev => ({ 
                            ...prev, 
                            monthsOfExpenses: parseInt(e.target.value),
                            targetAmount: prev.monthlyExpenses * parseInt(e.target.value)
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value={3}>3 months</option>
                          <option value={6}>6 months (Recommended)</option>
                          <option value={9}>9 months</option>
                          <option value={12}>12 months</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="autoContribute"
                          checked={emergencyFund.autoContribute}
                          onChange={(e) => setEmergencyFund(prev => ({ 
                            ...prev, 
                            autoContribute: e.target.checked 
                          }))}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="autoContribute" className="text-sm font-medium text-gray-700">
                          Automatic monthly contribution
                        </label>
                      </div>

                      {emergencyFund.autoContribute && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution</label>
                          <input
                            type="number"
                            step="0.01"
                            value={emergencyFund.contributionAmount}
                            onChange={(e) => setEmergencyFund(prev => ({ 
                              ...prev, 
                              contributionAmount: parseFloat(e.target.value) || 0 
                            }))}
                            placeholder="0.00"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      )}

                      <button
                        onClick={updateEmergencyFund}
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Update Emergency Fund Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seasonal Planning Tab */}
            {activeTab === 'seasonal' && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <span className="mr-2">🌾</span>
                    Seasonal Financial Planning
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <span className="text-3xl mb-2 block">🌱</span>
                      <h4 className="font-medium text-gray-900">Spring</h4>
                      <p className="text-sm text-gray-600">Planting Season</p>
                      <p className="text-lg font-semibold text-green-600">
                        ₹{seasonalPlanning.springNeeds.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <span className="text-3xl mb-2 block">☀️</span>
                      <h4 className="font-medium text-gray-900">Summer</h4>
                      <p className="text-sm text-gray-600">Growing Season</p>
                      <p className="text-lg font-semibold text-yellow-600">
                        ₹{seasonalPlanning.summerNeeds.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <span className="text-3xl mb-2 block">🍂</span>
                      <h4 className="font-medium text-gray-900">Fall</h4>
                      <p className="text-sm text-gray-600">Harvest Season</p>
                      <p className="text-lg font-semibold text-orange-600">
                        ₹{seasonalPlanning.fallNeeds.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <span className="text-3xl mb-2 block">❄️</span>
                      <h4 className="font-medium text-gray-900">Winter</h4>
                      <p className="text-sm text-gray-600">Planning Season</p>
                      <p className="text-lg font-semibold text-blue-600">
                        ₹{seasonalPlanning.winterNeeds.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Annual Financial Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Expenses Needed</p>
                        <p className="text-xl font-bold text-red-600">
                          ₹{seasonalPlanning.totalNeeded.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Projected Income</p>
                        <p className="text-xl font-bold text-green-600">
                          ₹{seasonalPlanning.projectedIncome.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Current Savings</p>
                        <p className="text-xl font-bold text-blue-600">
                          ₹{seasonalPlanning.currentSavings.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Net Position</p>
                        <p className={`text-xl font-bold ${
                          (seasonalPlanning.projectedIncome - seasonalPlanning.totalNeeded) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          ₹{(seasonalPlanning.projectedIncome - seasonalPlanning.totalNeeded).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expansion Plans Tab */}
            {activeTab === 'expansion' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add Expansion Plan */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Expansion Plan</h3>
                    <form onSubmit={handleAddExpansion} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expansion Name</label>
                        <input
                          type="text"
                          value={newExpansion.name}
                          onChange={(e) => setNewExpansion(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., North Field Purchase"
                          required
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expansion Type</label>
                          <select
                            value={newExpansion.type}
                            onChange={(e) => setNewExpansion(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            {expansionTypes.map(type => (
                              <option key={type} value={type.toLowerCase().replace(/ /g, '_')}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          <select
                            value={newExpansion.priority}
                            onChange={(e) => setNewExpansion(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            {priorityLevels.map(priority => (
                              <option key={priority} value={priority.toLowerCase()}>{priority}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newExpansion.estimatedCost}
                            onChange={(e) => setNewExpansion(prev => ({ ...prev, estimatedCost: e.target.value }))}
                            placeholder="₹0.00"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                          <input
                            type="text"
                            value={newExpansion.timeframe}
                            onChange={(e) => setNewExpansion(prev => ({ ...prev, timeframe: e.target.value }))}
                            placeholder="e.g., 2-3 years"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Annual Return (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newExpansion.expectedReturn}
                          onChange={(e) => setNewExpansion(prev => ({ ...prev, expectedReturn: e.target.value }))}
                          placeholder="0.00"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={newExpansion.description}
                          onChange={(e) => setNewExpansion(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the expansion plan and its benefits"
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Expansion Plan
                      </button>
                    </form>
                  </div>

                  {/* Current Expansion Plans */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Expansion Plans</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {expansionPlans.map((plan, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{plan.name}</h4>
                              <p className="text-sm text-gray-600 capitalize">
                                {plan.type.replace(/_/g, ' ')} • {plan.priority} priority
                              </p>
                            </div>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                              Planning
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-gray-600">Estimated Cost</p>
                              <p className="font-semibold text-red-600">₹{plan.estimatedCost.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Expected Return</p>
                              <p className="font-semibold text-green-600">{plan.expectedReturn}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Timeframe</p>
                              <p className="font-semibold">{plan.timeframe}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">ROI Period</p>
                              <p className="font-semibold">
                                {plan.expectedReturn ? Math.round(100 / plan.expectedReturn) : 'N/A'} years
                              </p>
                            </div>
                          </div>
                          {plan.description && (
                            <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsGoalsPage;