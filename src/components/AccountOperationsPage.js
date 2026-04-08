import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import financialService from '../services/financialService';

const AccountOperationsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions');
  
  // Transaction Management
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false
  });

  // Recurring Transactions
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [newRecurring, setNewRecurring] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    active: true
  });

  // Budget Allocation
  const [budgetAllocation, setBudgetAllocation] = useState({
    seeds: 25,
    fertilizers: 20,
    labor: 30,
    equipment: 15,
    other: 10
  });

  const transactionCategories = {
    income: ['Crop Sales', 'Government Subsidies', 'Insurance Claims', 'Equipment Rental', 'Other Income'],
    expense: ['Seeds', 'Fertilizers', 'Labor', 'Equipment', 'Fuel', 'Maintenance', 'Insurance', 'Utilities', 'Other']
  };

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      setLoading(true);
      const [transactionsData, recurringData, budgetData] = await Promise.all([
        financialService.getTransactions(),
        financialService.getRecurringTransactions(),
        financialService.getBudgetAllocation()
      ]);
      
      setTransactions(transactionsData);
      setRecurringTransactions(recurringData);
      setBudgetAllocation(budgetData);
    } catch (error) {
      console.error('Error loading account data:', error);
      setError('Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const transaction = await financialService.addTransaction(newTransaction);
      setTransactions(prev => [transaction, ...prev]);
      setNewTransaction({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        recurring: false
      });
      setSuccess('Transaction added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecurring = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const recurring = await financialService.addRecurringTransaction(newRecurring);
      setRecurringTransactions(prev => [recurring, ...prev]);
      setNewRecurring({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        active: true
      });
      setSuccess('Recurring transaction set up successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error adding recurring transaction:', error);
      setError('Failed to set up recurring transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    try {
      setLoading(true);
      await financialService.updateBudgetAllocation(budgetAllocation);
      setSuccess('Budget allocation updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating budget:', error);
      setError('Failed to update budget allocation');
    } finally {
      setLoading(false);
    }
  };

  const toggleRecurringStatus = async (id) => {
    try {
      await financialService.toggleRecurringTransaction(id);
      setRecurringTransactions(prev => 
        prev.map(recurring => 
          recurring.id === id 
            ? { ...recurring, active: !recurring.active }
            : recurring
        )
      );
      setSuccess('Recurring transaction status updated!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error toggling recurring transaction:', error);
      setError('Failed to update recurring transaction');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="flex justify-center items-center min-h-64 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg mx-auto text-center">
          <div className="mb-8">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Account Data</h3>
          <p className="text-gray-600 leading-relaxed">
            Please wait while we load your account operations data...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              to="/financial" 
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              ← Back to Financial Management
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Operations</h1>
          <p className="text-xl text-gray-600">
            Manage transactions, recurring payments, and budget allocation
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                💰 Transactions
              </button>
              <button
                onClick={() => setActiveTab('recurring')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recurring'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🔄 Recurring Payments
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'budget'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📊 Budget Allocation
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add New Transaction */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Transaction</h3>
                    <form onSubmit={handleAddTransaction} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={newTransaction.type}
                            onChange={(e) => setNewTransaction(prev => ({ 
                              ...prev, 
                              type: e.target.value, 
                              category: '' 
                            }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input
                              type="number"
                              step="0.01"
                              value={newRecurring.amount}
                              onChange={(e) => setNewRecurring(prev => ({ ...prev, amount: e.target.value }))}
                              placeholder="₹0.00"
                              required
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={newTransaction.description}
                          onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Transaction description"
                          required
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={newTransaction.category}
                            onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="">Select Category</option>
                            {transactionCategories[newTransaction.type].map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={newTransaction.date}
                            onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Transaction
                      </button>
                    </form>
                  </div>

                  {/* Recent Transactions List */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {transactions.slice(0, 10).map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <span className={`text-sm ${
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.type === 'income' ? '📈' : '📉'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-600">{transaction.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recurring Transactions Tab */}
            {activeTab === 'recurring' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add Recurring Transaction */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Up Recurring Transaction</h3>
                    <form onSubmit={handleAddRecurring} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={newRecurring.type}
                            onChange={(e) => setNewRecurring(prev => ({ 
                              ...prev, 
                              type: e.target.value,
                              category: '' 
                            }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newRecurring.amount}
                            onChange={(e) => setNewRecurring(prev => ({ ...prev, amount: e.target.value }))}
                            placeholder="0.00"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={newRecurring.description}
                          onChange={(e) => setNewRecurring(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Recurring transaction description"
                          required
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={newRecurring.category}
                            onChange={(e) => setNewRecurring(prev => ({ ...prev, category: e.target.value }))}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="">Select Category</option>
                            {transactionCategories[newRecurring.type].map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                          <select
                            value={newRecurring.frequency}
                            onChange={(e) => setNewRecurring(prev => ({ ...prev, frequency: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annually">Annually</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={newRecurring.startDate}
                          onChange={(e) => setNewRecurring(prev => ({ ...prev, startDate: e.target.value }))}
                          required
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Set Up Recurring Transaction
                      </button>
                    </form>
                  </div>

                  {/* Active Recurring Transactions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Recurring Transactions</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {recurringTransactions.map((recurring, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              recurring.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <span className="text-sm">🔄</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{recurring.description}</p>
                              <p className="text-sm text-gray-600">
                                {recurring.category} • {recurring.frequency}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className={`font-semibold ${
                                recurring.type === 'income' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {recurring.type === 'income' ? '+' : '-'}₹{recurring.amount.toLocaleString('en-IN')}
                              </p>
                              <p className={`text-sm ${recurring.active ? 'text-green-600' : 'text-red-600'}`}>
                                {recurring.active ? 'Active' : 'Paused'}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleRecurringStatus(recurring.id)}
                              className={`px-3 py-1 text-sm rounded-lg ${
                                recurring.active 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {recurring.active ? 'Pause' : 'Resume'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Budget Allocation Tab */}
            {activeTab === 'budget' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation by Category</h3>
                  <p className="text-gray-600 mb-6">
                    Set percentage allocation for different farm activities. Total should equal 100%.
                  </p>
                  
                  <div className="space-y-4">
                    {Object.entries(budgetAllocation).map(([category, percentage]) => (
                      <div key={category} className="flex items-center space-x-4">
                        <div className="w-24">
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {category}
                          </label>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={percentage}
                              onChange={(e) => setBudgetAllocation(prev => ({
                                ...prev,
                                [category]: parseInt(e.target.value)
                              }))}
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="w-16 text-right">
                              <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                            </div>
                          </div>
                          <div className="mt-1 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-green-600 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">Total Allocation:</span>
                      <span className={`text-sm font-bold ${
                        Object.values(budgetAllocation).reduce((sum, val) => sum + val, 0) === 100
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {Object.values(budgetAllocation).reduce((sum, val) => sum + val, 0)}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateBudget}
                    disabled={loading || Object.values(budgetAllocation).reduce((sum, val) => sum + val, 0) !== 100}
                    className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update Budget Allocation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOperationsPage;