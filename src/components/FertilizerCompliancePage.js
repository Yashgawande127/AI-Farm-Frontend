import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const FertilizerCompliancePage = () => {
  const [activeTab, setActiveTab] = useState('organic');
  const [showReportModal, setShowReportModal] = useState(false);

  // Mock data for compliance tracking
  const organicCertification = {
    status: 'active',
    certificationBody: 'USDA Organic',
    certificateNumber: 'ORG-2024-AI-FARM-001',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-15',
    renewalDue: 45, // days
    inspectionDue: 120, // days
    lastInspection: '2024-07-15',
    nextInspection: '2025-03-01'
  };

  const chemicalUsageLogs = [
    {
      id: 1,
      date: '2024-10-25',
      field: 'Field A - North Section',
      product: 'NPK 10-10-10',
      type: 'synthetic',
      quantity: 150,
      unit: 'kg',
      applicator: 'John Smith',
      purpose: 'Pre-planting nutrition',
      weatherConditions: 'Sunny, 22°C, No wind',
      prePhi: 45, // Pre-harvest interval
      residueTest: 'pending',
      organicApproved: false
    },
    {
      id: 2,
      date: '2024-10-23',
      field: 'Field B - South Section',
      product: 'Organic Compost',
      type: 'organic',
      quantity: 3.5,
      unit: 'cubic yards',
      applicator: 'Maria Garcia',
      purpose: 'Soil conditioning',
      weatherConditions: 'Cloudy, 19°C, Light breeze',
      prePhi: 0,
      residueTest: 'passed',
      organicApproved: true
    },
    {
      id: 3,
      date: '2024-10-20',
      field: 'Field C - East Section',
      product: 'Liquid Kelp Extract',
      type: 'organic',
      quantity: 12,
      unit: 'liters',
      applicator: 'John Smith',
      purpose: 'Micronutrient supplementation',
      weatherConditions: 'Partly cloudy, 21°C',
      prePhi: 0,
      residueTest: 'passed',
      organicApproved: true
    },
    {
      id: 4,
      date: '2024-10-18',
      field: 'Field D - West Section',
      product: 'Phosphorus Booster',
      type: 'synthetic',
      quantity: 75,
      unit: 'kg',
      applicator: 'Maria Garcia',
      purpose: 'Root development',
      weatherConditions: 'Sunny, 24°C',
      prePhi: 30,
      residueTest: 'pending',
      organicApproved: false
    }
  ];

  const regulatoryRequirements = [
    {
      id: 1,
      category: 'Organic Certification',
      requirement: 'Annual organic inspection',
      status: 'compliant',
      dueDate: '2025-03-01',
      daysUntilDue: 120,
      description: 'Required annual inspection by certified organic inspector',
      action: 'Schedule inspection with USDA certified inspector'
    },
    {
      id: 2,
      category: 'Chemical Residue Testing',
      requirement: 'Quarterly residue analysis',
      status: 'due_soon',
      dueDate: '2024-11-15',
      daysUntilDue: 12,
      description: 'Test soil and crop samples for chemical residues',
      action: 'Collect samples and send to certified laboratory'
    },
    {
      id: 3,
      category: 'Record Keeping',
      requirement: 'Application logs documentation',
      status: 'compliant',
      dueDate: 'Ongoing',
      daysUntilDue: null,
      description: 'Maintain detailed records of all fertilizer applications',
      action: 'Continue logging all applications within 24 hours'
    },
    {
      id: 4,
      category: 'Buffer Zones',
      requirement: 'Maintain organic buffer zones',
      status: 'requires_attention',
      dueDate: '2024-11-10',
      daysUntilDue: 7,
      description: 'Ensure 25-foot buffer between organic and conventional fields',
      action: 'Inspect and document buffer zone maintenance'
    },
    {
      id: 5,
      category: 'Supplier Certification',
      requirement: 'Verify organic input suppliers',
      status: 'compliant',
      dueDate: '2025-01-01',
      daysUntilDue: 58,
      description: 'Confirm all organic inputs from certified suppliers',
      action: 'Review and update supplier certifications'
    }
  ];

  const prohibitedSubstances = [
    {
      name: 'Synthetic NPK with ammonia',
      type: 'Synthetic Fertilizer',
      status: 'prohibited',
      reason: 'Contains synthetic ammonia not allowed in organic production',
      alternatives: ['Organic compost', 'Fish emulsion', 'Bone meal']
    },
    {
      name: 'Urea-based fertilizers',
      type: 'Synthetic Fertilizer',
      status: 'prohibited',
      reason: 'Synthetic urea not permitted in organic systems',
      alternatives: ['Blood meal', 'Feather meal', 'Organic nitrogen blends']
    },
    {
      name: 'Superphosphate',
      type: 'Synthetic Fertilizer',
      status: 'prohibited',
      reason: 'Synthetic phosphorus compounds not allowed',
      alternatives: ['Rock phosphate', 'Bone meal', 'Organic phosphorus blends']
    },
    {
      name: 'Muriate of Potash',
      type: 'Synthetic Fertilizer',
      status: 'restricted',
      reason: 'Allowed only with organic system plan approval',
      alternatives: ['Kelp meal', 'Wood ash', 'Granite meal']
    }
  ];

  const complianceAlerts = [
    {
      id: 1,
      type: 'urgent',
      title: 'Buffer Zone Inspection Due',
      message: 'Buffer zone inspection due in 7 days for organic certification compliance',
      dueDate: '2024-11-10',
      action: 'Schedule inspection'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Residue Testing Required',
      message: 'Quarterly residue testing due in 12 days',
      dueDate: '2024-11-15',
      action: 'Collect samples'
    },
    {
      id: 3,
      type: 'info',
      title: 'Certification Renewal',
      message: 'Organic certification expires in 45 days - renewal process should begin',
      dueDate: '2025-01-15',
      action: 'Start renewal process'
    }
  ];

  const auditTrail = [
    {
      id: 1,
      timestamp: '2024-10-25 14:30',
      user: 'John Smith',
      action: 'Added fertilizer application log',
      details: 'NPK 10-10-10 application to Field A - 150kg',
      type: 'application'
    },
    {
      id: 2,
      timestamp: '2024-10-23 09:15',
      user: 'Maria Garcia',
      action: 'Updated buffer zone documentation',
      details: 'Field B buffer zone inspection completed and documented',
      type: 'compliance'
    },
    {
      id: 3,
      timestamp: '2024-10-20 16:45',
      user: 'Admin System',
      action: 'Generated compliance report',
      details: 'Monthly organic compliance report generated and submitted',
      type: 'report'
    },
    {
      id: 4,
      timestamp: '2024-10-18 11:20',
      user: 'Maria Garcia',
      action: 'Residue test results recorded',
      details: 'Quarterly residue test results - all samples passed',
      type: 'testing'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'due_soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'requires_attention':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'urgent':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/fertilizers" className="hover:text-orange-600">Fertilizer Management</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Compliance Tracking</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                Compliance Tracking
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Monitor organic certification and regulatory compliance requirements
            </p>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Report
          </button>
        </div>

        {/* Compliance Alerts */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Active Compliance Alerts</h2>
          <div className="grid gap-4">
            {complianceAlerts.map((alert) => (
              <div key={alert.id} className={`border-l-4 p-4 rounded-r-lg ${getAlertColor(alert.type)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getAlertIcon(alert.type)}
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <p className="text-gray-700">{alert.message}</p>
                      <p className="text-sm text-gray-600 mt-1">Due: {alert.dueDate}</p>
                    </div>
                  </div>
                  <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-200">
                    {alert.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organic Certification Status */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Organic Certification Status</h2>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✓ ACTIVE
              </span>
              <span className="text-sm text-gray-600">
                Expires in {organicCertification.renewalDue} days
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-1">Certification Body</div>
              <div className="text-gray-900 font-semibold">{organicCertification.certificationBody}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-1">Certificate Number</div>
              <div className="text-gray-900 font-semibold">{organicCertification.certificateNumber}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-1">Issue Date</div>
              <div className="text-gray-900">{organicCertification.issueDate}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-1">Expiry Date</div>
              <div className="text-gray-900">{organicCertification.expiryDate}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h8m-8 0H7a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2m-8 0V7" />
                </svg>
                <h3 className="text-lg font-semibold text-blue-900">Last Inspection</h3>
              </div>
              <div className="text-blue-800">{organicCertification.lastInspection}</div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-yellow-900">Next Inspection</h3>
              </div>
              <div className="text-yellow-800">
                {organicCertification.nextInspection} ({organicCertification.inspectionDue} days)
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('organic')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'organic'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Organic Requirements
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'usage'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chemical Usage Logs
            </button>
            <button
              onClick={() => setActiveTab('prohibited')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'prohibited'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Prohibited Substances
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                activeTab === 'audit'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Audit Trail
            </button>
          </div>

          {/* Organic Requirements Tab */}
          {activeTab === 'organic' && (
            <div className="space-y-4">
              {regulatoryRequirements.map((requirement) => (
                <div key={requirement.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{requirement.requirement}</h3>
                      <p className="text-gray-600">{requirement.category}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {requirement.daysUntilDue && (
                        <span className="text-sm text-gray-600">
                          {requirement.daysUntilDue} days until due
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(requirement.status)}`}>
                        {requirement.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">{requirement.description}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h8m-8 0H7a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2m-8 0V7" />
                      </svg>
                      Due: {requirement.dueDate}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Action Required: {requirement.action}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        View Details
                      </button>
                      {requirement.status !== 'compliant' && (
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200 text-sm">
                          Take Action
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chemical Usage Logs Tab */}
          {activeTab === 'usage' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Field</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">PHI</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Residue Test</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Organic</th>
                  </tr>
                </thead>
                <tbody>
                  {chemicalUsageLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{log.date}</td>
                      <td className="py-3 px-4">{log.field}</td>
                      <td className="py-3 px-4">{log.product}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          log.type === 'organic' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">{log.quantity} {log.unit}</td>
                      <td className="py-3 px-4">{log.prePhi} days</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          log.residueTest === 'passed' ? 'bg-green-100 text-green-800' :
                          log.residueTest === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {log.residueTest}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {log.organicApproved ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Prohibited Substances Tab */}
          {activeTab === 'prohibited' && (
            <div className="space-y-4">
              {prohibitedSubstances.map((substance, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{substance.name}</h3>
                      <p className="text-gray-600">{substance.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      substance.status === 'prohibited' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {substance.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Reason for Restriction:</div>
                    <p className="text-gray-600">{substance.reason}</p>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Approved Alternatives:</div>
                    <div className="flex flex-wrap gap-2">
                      {substance.alternatives.map((alternative, altIndex) => (
                        <span 
                          key={altIndex}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {alternative}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              {auditTrail.map((entry) => (
                <div key={entry.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        entry.type === 'application' ? 'bg-blue-100 text-blue-600' :
                        entry.type === 'compliance' ? 'bg-green-100 text-green-600' :
                        entry.type === 'report' ? 'bg-purple-100 text-purple-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {entry.type === 'application' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                        {entry.type === 'compliance' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {entry.type === 'report' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        {entry.type === 'testing' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{entry.action}</h3>
                        <p className="text-sm text-gray-600">by {entry.user}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{entry.timestamp}</span>
                  </div>
                  <div className="ml-11">
                    <p className="text-gray-700">{entry.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generate Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">Generate Compliance Report</h2>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Organic Compliance Summary</option>
                    <option>Chemical Usage Report</option>
                    <option>Regulatory Requirements Status</option>
                    <option>Complete Audit Trail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Include Fields</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">All Fields</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600" />
                      <span className="ml-2 text-sm text-gray-700">Field A - North Section</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-600" />
                      <span className="ml-2 text-sm text-gray-700">Field B - South Section</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FertilizerCompliancePage;