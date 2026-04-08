import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import financialService from '../services/financialService';

const FinancialPlanningPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('cashflow');

  // Cash Flow Data
  const [cashFlowData, setCashFlowData] = useState({
    projections: [],
    currentSeason: 'spring',
    seasons: {
      spring: { income: 0, expenses: 0 },
      summer: { income: 0, expenses: 0 },
      fall: { income: 0, expenses: 0 },
      winter: { income: 0, expenses: 0 }
    }
  });

  // Loans Data
  const [loans, setLoans] = useState([]);
  const [newLoan, setNewLoan] = useState({
    lender: '',
    principal: '',
    interestRate: '',
    termMonths: '',
    startDate: new Date().toISOString().split('T')[0],
    purpose: '',
    type: 'equipment'
  });

  // Investments Data
  const [investments, setInvestments] = useState([]);
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: 'equipment',
    amount: '',
    expectedReturn: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Tax Data
  const [taxData, setTaxData] = useState({
    currentYear: new Date().getFullYear(),
    categories: {
      income: 0,
      deductibleExpenses: 0,
      depreciation: 0,
      estimatedTax: 0
    },
    documents: []
  });

  const loanTypes = ['Equipment', 'Land', 'Operating', 'Emergency', 'Expansion'];
  const investmentTypes = ['Equipment', 'Land', 'Infrastructure', 'Technology', 'Storage'];

  useEffect(() => {
    loadPlanningData();
  }, []);

  const loadPlanningData = async () => {
    try {
      setLoading(true);
      const [cashFlow, loansData, investmentsData, taxes] = await Promise.all([
        financialService.getCashFlowProjections(),
        financialService.getLoans(),
        financialService.getInvestments(),
        financialService.getTaxData()
      ]);
      
      setCashFlowData(cashFlow);
      setLoans(loansData);
      setInvestments(investmentsData);
      setTaxData(taxes);
    } catch (error) {
      console.error('Error loading planning data:', error);
      setError('Failed to load financial planning data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLoan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const loan = await financialService.addLoan(newLoan);
      setLoans(prev => [loan, ...prev]);
      setNewLoan({
        lender: '',
        principal: '',
        interestRate: '',
        termMonths: '',
        startDate: new Date().toISOString().split('T')[0],
        purpose: '',
        type: 'equipment'
      });
      setSuccess('Loan added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error adding loan:', error);
      setError('Failed to add loan');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const investment = await financialService.addInvestment(newInvestment);
      setInvestments(prev => [investment, ...prev]);
      setNewInvestment({
        name: '',
        type: 'equipment',
        amount: '',
        expectedReturn: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      setSuccess('Investment tracked successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error adding investment:', error);
      setError('Failed to add investment');
    } finally {
      setLoading(false);
    }
  };

  const calculateLoanPayment = (principal, rate, months) => {
    const monthlyRate = rate / 100 / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return isNaN(payment) ? 0 : payment;
  };

  const generateTaxReport = async () => {
    try {
      setLoading(true);
      await financialService.generateTaxReport();
      setSuccess('Tax report generated and saved!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error generating tax report:', error);
      setError('Failed to generate tax report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
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
            Please wait while we load your financial planning data...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              to="/financial" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              ← Back to Financial Management
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Planning</h1>
          <p className="text-xl text-gray-600">
            Advanced financial planning with seasonal analysis, loans, and investments
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
                onClick={() => setActiveTab('cashflow')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cashflow'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📊 Seasonal Cash Flow
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'loans'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                💰 Loan Management
              </button>
              <button
                onClick={() => setActiveTab('investments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'investments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📈 Investment Tracking
              </button>
              <button
                onClick={() => setActiveTab('tax')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tax'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📋 Tax Preparation
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Seasonal Cash Flow Tab */}
            {activeTab === 'cashflow' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Seasonal Overview */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Cash Flow Analysis</h3>
                    <div className="space-y-4">
                      {Object.entries(cashFlowData.seasons).map(([season, data]) => (
                        <div key={season} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 capitalize flex items-center">
                              <span className="mr-2">
                                {season === 'spring' ? '🌱' : 
                                 season === 'summer' ? '☀️' : 
                                 season === 'fall' ? '🍂' : '❄️'}
                              </span>
                              {season}
                            </h4>
                            <span className={`text-sm font-medium ${
                              cashFlowData.currentSeason === season ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {cashFlowData.currentSeason === season ? 'Current' : ''}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Projected Income</p>
                              <p className="text-green-600 font-semibold">₹{data.income.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Projected Expenses</p>
                              <p className="text-red-600 font-semibold">₹{data.expenses.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Net Cash Flow</span>
                              <span className={`font-semibold ${
                                (data.income - data.expenses) >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ₹{(data.income - data.expenses).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cash Flow Chart Placeholder */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">12-Month Projection</h3>
                    <div className="h-64 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl mb-2 block">📊</span>
                        <p className="text-gray-600 mb-2">Cash Flow Chart</p>
                        <p className="text-sm text-gray-500">Visual representation of monthly projections</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Best Month</p>
                        <p className="text-lg font-semibold text-green-600">October</p>
                        <p className="text-sm text-green-600">+₹4,50,000</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">Challenging Month</p>
                        <p className="text-lg font-semibold text-red-600">March</p>
                        <p className="text-sm text-red-600">-₹1,20,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loan Management Tab */}
            {activeTab === 'loans' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add New Loan */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Loan</h3>
                    <form onSubmit={handleAddLoan} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lender</label>
                        <input
                          type="text"
                          value={newLoan.lender}
                          onChange={(e) => setNewLoan(prev => ({ ...prev, lender: e.target.value }))}
                          placeholder="Bank or lender name"
                          required
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Principal Amount</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newLoan.principal}
                            onChange={(e) => setNewLoan(prev => ({ ...prev, principal: e.target.value }))}
                            placeholder="₹0.00"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newLoan.interestRate}
                            onChange={(e) => setNewLoan(prev => ({ ...prev, interestRate: e.target.value }))}
                            placeholder="0.00"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Term (Months)</label>
                          <input
                            type="number"
                            value={newLoan.termMonths}
                            onChange={(e) => setNewLoan(prev => ({ ...prev, termMonths: e.target.value }))}
                            placeholder="36"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
                          <select
                            value={newLoan.type}
                            onChange={(e) => setNewLoan(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {loanTypes.map(type => (
                              <option key={type} value={type.toLowerCase()}>{type}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                        <input
                          type="text"
                          value={newLoan.purpose}
                          onChange={(e) => setNewLoan(prev => ({ ...prev, purpose: e.target.value }))}
                          placeholder="Describe the loan purpose"
                          required
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={newLoan.startDate}
                          onChange={(e) => setNewLoan(prev => ({ ...prev, startDate: e.target.value }))}
                          required
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {newLoan.principal && newLoan.interestRate && newLoan.termMonths && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            Estimated Monthly Payment: 
                            <span className="font-semibold ml-1">
                              ₹{calculateLoanPayment(
                                parseFloat(newLoan.principal), 
                                parseFloat(newLoan.interestRate), 
                                parseInt(newLoan.termMonths)
                              ).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Loan
                      </button>
                    </form>
                  </div>

                  {/* Current Loans */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Loans</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {loans.map((loan, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{loan.lender}</h4>
                              <p className="text-sm text-gray-600 capitalize">{loan.type} • {loan.purpose}</p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Active
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Principal</p>
                              <p className="font-semibold">₹{loan.principal.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Interest Rate</p>
                              <p className="font-semibold">{loan.interestRate}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Monthly Payment</p>
                              <p className="font-semibold text-red-600">
                                ₹{calculateLoanPayment(loan.principal, loan.interestRate, loan.termMonths).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Remaining Term</p>
                              <p className="font-semibold">{loan.remainingMonths || loan.termMonths} months</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ 
                                  width: `${((loan.termMonths - (loan.remainingMonths || loan.termMonths)) / loan.termMonths) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {Math.round(((loan.termMonths - (loan.remainingMonths || loan.termMonths)) / loan.termMonths) * 100)}% paid off
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Investment Tracking Tab */}
            {activeTab === 'investments' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Add New Investment */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Track New Investment</h3>
                    <form onSubmit={handleAddInvestment} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Investment Name</label>
                        <input
                          type="text"
                          value={newInvestment.name}
                          onChange={(e) => setNewInvestment(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., John Deere Tractor 5075E"
                          required
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Type</label>
                          <select
                            value={newInvestment.type}
                            onChange={(e) => setNewInvestment(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {investmentTypes.map(type => (
                              <option key={type} value={type.toLowerCase()}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount Invested</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newInvestment.amount}
                            onChange={(e) => setNewInvestment(prev => ({ ...prev, amount: e.target.value }))}
                            placeholder="₹0.00"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Annual Return (%)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newInvestment.expectedReturn}
                            onChange={(e) => setNewInvestment(prev => ({ ...prev, expectedReturn: e.target.value }))}
                            placeholder="0.00"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Date</label>
                          <input
                            type="date"
                            value={newInvestment.date}
                            onChange={(e) => setNewInvestment(prev => ({ ...prev, date: e.target.value }))}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={newInvestment.description}
                          onChange={(e) => setNewInvestment(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the investment and expected benefits"
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Track Investment
                      </button>
                    </form>
                  </div>

                  {/* Investment Portfolio */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Portfolio</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {investments.map((investment, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{investment.name}</h4>
                              <p className="text-sm text-gray-600 capitalize">{investment.type}</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Active
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-gray-600">Invested</p>
                              <p className="font-semibold">₹{investment.amount.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Expected Return</p>
                              <p className="font-semibold text-green-600">{investment.expectedReturn}%</p>
                            </div>
                          </div>
                          {investment.description && (
                            <p className="text-sm text-gray-600 mt-2">{investment.description}</p>
                          )}
                          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                            Investment Date: {investment.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tax Preparation Tab */}
            {activeTab === 'tax' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Tax Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Tax Year {taxData.currentYear} Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Total Income</span>
                          <span className="font-semibold text-green-600">
                            ₹{taxData.categories.income.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Deductible Expenses</span>
                          <span className="font-semibold text-red-600">
                            ₹{taxData.categories.deductibleExpenses.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Depreciation</span>
                          <span className="font-semibold text-red-600">
                            ₹{taxData.categories.depreciation.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">Taxable Income</span>
                            <span className="font-bold text-blue-600">
                              ₹{(taxData.categories.income - taxData.categories.deductibleExpenses - taxData.categories.depreciation).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-yellow-800">Estimated Tax Liability</span>
                          <span className="font-bold text-yellow-800">
                            ₹{taxData.categories.estimatedTax.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-2">
                          This is an estimate. Consult with a tax professional for accurate calculations.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={generateTaxReport}
                      disabled={loading}
                      className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Generate Tax Report
                    </button>
                  </div>

                  {/* Tax Documents and Tips */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Planning Tips</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">📋 Keep These Records</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Seed and fertilizer purchase receipts</li>
                          <li>• Equipment and machinery expenses</li>
                          <li>• Labor costs and payroll records</li>
                          <li>• Fuel and maintenance receipts</li>
                          <li>• Insurance premiums and claims</li>
                          <li>• Professional service fees</li>
                        </ul>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">💡 Tax Saving Tips</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Maximize equipment depreciation</li>
                          <li>• Consider Section 179 deductions</li>
                          <li>• Time income and expense recognition</li>
                          <li>• Contribute to retirement accounts</li>
                          <li>• Document business use of vehicles</li>
                          <li>• Track home office expenses</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">📅 Important Dates</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Jan 31: W-2 and 1099 forms due</li>
                          <li>• Mar 15: Corporate tax deadline</li>
                          <li>• Apr 15: Individual tax deadline</li>
                          <li>• Quarterly: Estimated tax payments</li>
                        </ul>
                      </div>
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

export default FinancialPlanningPage;