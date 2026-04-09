import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import financialService from '../services/financialService';

const FinancialManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialOverview, setFinancialOverview] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsGoals: [],
    recentTransactions: [],
    upcomingPayments: []
  });

  useEffect(() => {
    loadFinancialOverview();
  }, []);

  const loadFinancialOverview = async () => {
    try {
      setLoading(true);
      const overview = await financialService.getFinancialOverview();
      setFinancialOverview(overview || {
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        savingsGoals: [],
        recentTransactions: [],
        upcomingPayments: []
      });
    } catch (error) {
      console.error('Error loading financial overview:', error);
      setError('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <div className="flex justify-center items-center min-h-64 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg mx-auto text-center">
          <div className="mb-8">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Financial Data</h3>
          <p className="text-gray-600 leading-relaxed">
            Please wait while we load your financial management data...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Management</h1>
          <p className="text-xl text-gray-600">
            Comprehensive financial planning and management for your agricultural business
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{(financialOverview?.totalBalance ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{(financialOverview?.monthlyIncome ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-2xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                <p className="text-3xl font-bold text-red-600">
                  ₹{(financialOverview?.monthlyExpenses ?? 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-2xl">📉</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className={`text-3xl font-bold ${
                  (financialOverview.monthlyIncome - financialOverview.monthlyExpenses) >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  ₹{((financialOverview?.monthlyIncome ?? 0) - (financialOverview?.monthlyExpenses ?? 0)).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-2xl">💎</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/financial/account-operations"
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Account Operations</h3>
              <span className="text-3xl">🏦</span>
            </div>
            <p className="text-green-100 mb-4">
              Manage transactions, categories, and recurring payments
            </p>
            <div className="flex items-center text-green-100">
              <span>Manage Accounts</span>
              <span className="ml-2">→</span>
            </div>
          </Link>

          <Link
            to="/financial/planning"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Financial Planning</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-blue-100 mb-4">
              Seasonal cash flow, loans, and investment tracking
            </p>
            <div className="flex items-center text-blue-100">
              <span>Plan Finances</span>
              <span className="ml-2">→</span>
            </div>
          </Link>

          <Link
            to="/financial/savings-goals"
            className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Savings Goals</h3>
              <span className="text-3xl">🎯</span>
            </div>
            <p className="text-purple-100 mb-4">
              Equipment purchases, expansion, and emergency funds
            </p>
            <div className="flex items-center text-purple-100">
              <span>Set Goals</span>
              <span className="ml-2">→</span>
            </div>
          </Link>
        </div>

        {/* Recent Activity and Savings Goals Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
              <Link 
                to="/financial/account-operations" 
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View All →
              </Link>
            </div>
            
            {financialOverview.recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {financialOverview.recentTransactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <span className={`text-xl ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '💰' : '💸'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{(transaction?.amount ?? 0).toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-6xl mb-4 block">📝</span>
                <p className="text-gray-600">No recent transactions</p>
                <Link 
                  to="/financial/account-operations" 
                  className="text-green-600 hover:text-green-700 font-medium mt-2 inline-block"
                >
                  Add your first transaction
                </Link>
              </div>
            )}
          </div>

          {/* Savings Goals Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Savings Goals</h3>
              <Link 
                to="/financial/savings-goals" 
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Manage Goals →
              </Link>
            </div>
            
            {financialOverview.savingsGoals.length > 0 ? (
              <div className="space-y-4">
                {financialOverview.savingsGoals.slice(0, 3).map((goal, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{goal.name}</h4>
                      <span className="text-sm text-gray-600">
                        ₹{(goal?.saved ?? 0).toLocaleString('en-IN')} / ₹{(goal?.target ?? 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((goal.saved / goal.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.round((goal.saved / goal.target) * 100)}% complete
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-6xl mb-4 block">🎯</span>
                <p className="text-gray-600">No savings goals set</p>
                <Link 
                  to="/financial/savings-goals" 
                  className="text-purple-600 hover:text-purple-700 font-medium mt-2 inline-block"
                >
                  Create your first goal
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagementPage;