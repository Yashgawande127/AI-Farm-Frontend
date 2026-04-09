import React, { useState } from 'react';
import { getCropData } from '../data/cropData';

const CropConditionsGuide = ({ cropName }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const cropInfo = getCropData(cropName);

  if (!cropInfo) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 mt-6">
        <div className="text-center text-gray-500">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-300">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.791-6.211-2.118C5.132 11.665 4.937 10 4.937 10H4c-.893 0-1.75.25-2.48.694A4.002 4.002 0 001 18h22c0-2.76-1.12-5.26-2.93-7.06A7.99 7.99 0 0018 13.291z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">Guide Not Available</h3>
          <p className="text-lg text-gray-500">Cultivation guide information not available for {cropName}.</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'overview', name: 'Crop Overview', icon: '🌱', color: 'emerald' },
    { id: 'soil', name: 'Soil Conditions', icon: '🌍', color: 'amber' },
    { id: 'climate', name: 'Climate Requirements', icon: '🌤️', color: 'sky' },
    { id: 'sowing', name: 'Sowing & Harvesting', icon: '⏰', color: 'green' },
    { id: 'irrigation', name: 'Irrigation Details', icon: '💧', color: 'blue' },
    { id: 'pest', name: 'Pest & Disease Management', icon: '🛡️', color: 'red' },
    { id: 'tips', name: 'Additional Tips', icon: '💡', color: 'purple' }
  ];

  const renderOverview = () => (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
        <div className="relative group">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform group-hover:rotate-3 transition-transform duration-500">
            <img 
              src={cropInfo.image} 
              alt={cropInfo.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDNWMU05IDE5SDEwLjVNMTUgMTlIMTYuNU05IDIxSDEwLjVNMTUgMjFIMTYuNU0yMSAxMkgyME0xMiAyMVYyM00zIDEySDE0TTE0IDEyTDIxIDEyTTEyIDNWMU0xMiAzTDIxIDEyTTEyIDNMMTMgMTJNMTIgM0wxMSAxMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
              }}
            />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-[2.5rem] blur-2xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity duration-500"></div>
        </div>
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight capitalize">
            {cropInfo.name}
          </h3>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0 font-medium">
            {cropInfo.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl font-bold text-sm border-2 border-emerald-100 shadow-sm">
              <span className="text-lg">📈</span>
              High Yield Potential
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-2xl font-bold text-sm border-2 border-blue-100 shadow-sm">
              <span className="text-lg">🛡️</span>
              Climate Resilient
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-emerald-800 text-lg">Growing Regions</h4>
          </div>
          <p className="text-emerald-700 leading-relaxed">
            {getGrowingRegions(cropName)} - Suitable for regions with {cropInfo.conditions.climate.toLowerCase()}.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h4 className="font-bold text-blue-800 text-lg">Primary Uses</h4>
          </div>
          <p className="text-blue-700 leading-relaxed">{getCropUses(cropName)}</p>
        </div>
      </div>
    </div>
  );

  const renderSoilConditions = () => (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-amber-800 text-xl">Soil Composition</h4>
          </div>
          <p className="text-amber-700 text-lg font-semibold mb-3">{cropInfo.conditions.soil.type}</p>
          <div className="bg-white/60 rounded-xl p-4 border border-amber-200/30">
            <p className="text-amber-600 leading-relaxed">
              <strong>Importance:</strong> {getSoilTypeExplanation(cropInfo.conditions.soil.type)}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h4 className="font-bold text-purple-800 text-xl">pH Balance</h4>
          </div>
          <p className="text-purple-700 text-lg font-semibold mb-3">{cropInfo.conditions.soil.ph}</p>
          <div className="bg-white/60 rounded-xl p-4 border border-purple-200/30">
            <p className="text-purple-600 leading-relaxed">
              <strong>Monitoring:</strong> Test pH levels monthly using digital meters for accuracy
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/50 rounded-3xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-emerald-800 text-2xl">Essential Nutrients (NPK Analysis)</h4>
            <p className="text-emerald-600 text-lg">Macro-nutrient requirements for optimal growth</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <h5 className="font-bold text-red-700 text-lg mb-2">Nitrogen</h5>
            <p className="text-gray-600 font-semibold text-lg">{cropInfo.conditions.soil.nitrogen}</p>
            <p className="text-red-600 text-sm mt-3">Essential for leaf growth & chlorophyll</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <h5 className="font-bold text-orange-700 text-lg mb-2">Phosphorus</h5>
            <p className="text-gray-600 font-semibold text-lg">{cropInfo.conditions.soil.phosphorus}</p>
            <p className="text-orange-600 text-sm mt-3">Critical for root development & flowering</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <h5 className="font-bold text-purple-700 text-lg mb-2">Potassium</h5>
            <p className="text-gray-600 font-semibold text-lg">{cropInfo.conditions.soil.potassium}</p>
            <p className="text-purple-600 text-sm mt-3">Enhances disease resistance & water uptake</p>
          </div>
        </div>
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h5 className="font-bold text-gray-800 text-lg">Expert Recommendation</h5>
          </div>
          <p className="text-gray-700 leading-relaxed">
            <strong>Optimal Fertilization:</strong> {getFertilizerTip(cropInfo.conditions.soil)}
          </p>
        </div>
      </div>
    </div>
  );

  const renderClimateRequirements = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white">🌡️</span>
            </div>
            <h4 className="font-semibold text-red-800">Temperature Range</h4>
          </div>
          <p className="text-red-700 text-lg font-semibold">{cropInfo.conditions.temperature}</p>
          <div className="mt-2 text-sm text-red-600">
            <strong>Critical periods:</strong> {getTemperatureTips(cropName)}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white">💧</span>
            </div>
            <h4 className="font-semibold text-blue-800">Humidity Levels</h4>
          </div>
          <p className="text-blue-700 text-lg font-semibold">{cropInfo.conditions.humidity}</p>
          <div className="mt-2 text-sm text-blue-600">
            <strong>Management:</strong> {getHumidityTips(cropName)}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-50 to-green-50 border border-cyan-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white">🌧️</span>
          </div>
          <h4 className="font-semibold text-cyan-800 text-lg">Rainfall Requirements</h4>
        </div>
        <p className="text-cyan-700 text-lg font-semibold mb-3">{cropInfo.conditions.rainfall}</p>
        <div className="bg-white rounded-md p-3">
          <p className="text-sm text-gray-700">
            <strong>💡 Water Management:</strong> {getRainfallTips(cropName, cropInfo.conditions.rainfall)}
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white">☀️</span>
          </div>
          <h4 className="font-semibold text-yellow-800">Sunlight Requirements</h4>
        </div>
        <p className="text-yellow-700">{getSunlightRequirements(cropName)}</p>
      </div>
    </div>
  );

  const renderSowingHarvesting = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white">🌱</span>
            </div>
            <h4 className="font-semibold text-green-800">Sowing Season</h4>
          </div>
          <p className="text-green-700 text-lg font-semibold mb-2">{cropInfo.conditions.season}</p>
          <div className="text-sm text-green-600">
            <strong>Best planting window:</strong> {getSowingTips(cropName)}
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white">🌾</span>
            </div>
            <h4 className="font-semibold text-orange-800">Harvesting Period</h4>
          </div>
          <p className="text-orange-700 text-lg font-semibold mb-2">{cropInfo.conditions.harvesting}</p>
          <div className="text-sm text-orange-600">
            <strong>Harvest indicators:</strong> {getHarvestIndicators(cropName)}
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white">⏳</span>
          </div>
          <h4 className="font-semibold text-indigo-800 text-lg">Crop Duration</h4>
        </div>
        <div className="bg-white rounded-md p-4">
          <p className="text-indigo-700 text-lg font-semibold mb-2">{cropInfo.conditions.harvesting}</p>
          <div className="space-y-2 text-sm text-indigo-600">
            <p><strong>Growth stages:</strong> {getGrowthStages(cropName)}</p>
            <p><strong>Key milestones:</strong> {getKeyMilestones(cropName)}</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-3">📅 Seasonal Calendar</h4>
        <div className="text-sm text-yellow-700">
          {getSeasonalCalendar(cropName, cropInfo.conditions)}
        </div>
      </div>
    </div>
  );

  const renderIrrigationDetails = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-800 mb-4 text-lg">💧 Water Management Strategy</h4>
        <p className="text-blue-700 mb-4">{cropInfo.conditions.water}</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-2">🕒 Watering Frequency</h5>
            <p className="text-gray-700">{getWateringFrequency(cropName)}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-semibold text-gray-800 mb-2">🚿 Irrigation Type</h5>
            <p className="text-gray-700">{getIrrigationType(cropName)}</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-semibold text-red-800 mb-3">🌊 Critical Growth Stages for Water</h4>
        <div className="space-y-2 text-red-700">
          {getCriticalWaterStages(cropName).map((stage, index) => (
            <div key={index} className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>{stage}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-3">💡 Water Conservation Tips</h4>
        <div className="text-sm text-green-700 space-y-1">
          {getWaterConservationTips(cropName).map((tip, index) => (
            <p key={index}>• {tip}</p>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPestDisease = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h4 className="font-semibold text-red-800 mb-4 text-lg">🐛 Common Pests</h4>
        <div className="space-y-3">
          {getCommonPests(cropName).map((pest, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-red-100">
              <p className="font-semibold text-red-700">{pest.name}</p>
              <p className="text-sm text-red-600">{pest.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h4 className="font-semibold text-orange-800 mb-4 text-lg">🦠 Common Diseases</h4>
        <div className="space-y-3">
          {getCommonDiseases(cropName).map((disease, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-orange-100">
              <p className="font-semibold text-orange-700">{disease.name}</p>
              <p className="text-sm text-orange-600">{disease.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-3">🌿 Natural Control Methods</h4>
          <div className="text-sm text-green-700 space-y-1">
            {getNaturalControlMethods(cropName).map((method, index) => (
              <p key={index}>• {method}</p>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-3">🧪 Chemical Control Methods</h4>
          <div className="text-sm text-blue-700 space-y-1">
            {getChemicalControlMethods(cropName).map((method, index) => (
              <p key={index}>• {method}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-3">🛡️ Preventive Measures</h4>
        <div className="text-sm text-purple-700 space-y-1">
          {getPreventiveMeasures(cropName).map((measure, index) => (
            <p key={index}>• {measure}</p>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdditionalTips = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-green-800 mb-4 text-lg">🌱 Best Companion Crops</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {getCompanionCrops(cropName).map((companion, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-green-100">
              <p className="font-semibold text-green-700">{companion.crop}</p>
              <p className="text-sm text-green-600">{companion.benefit}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-3">📦 Post-Harvest Storage Advice</h4>
        <div className="text-amber-700 space-y-2">
          {getStorageAdvice(cropName).map((advice, index) => (
            <p key={index}>• {advice}</p>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h4 className="font-semibold text-indigo-800 mb-4 text-lg">🚀 Modern Techniques & Technology</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-center mb-2">
              <span className="text-2xl">📡</span>
            </div>
            <h5 className="font-semibold text-indigo-700 mb-2">Smart Sensors</h5>
            <p className="text-sm text-indigo-600">{getSensorTechniques(cropName)}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-center mb-2">
              <span className="text-2xl">🌿</span>
            </div>
            <h5 className="font-semibold text-green-700 mb-2">Organic Methods</h5>
            <p className="text-sm text-green-600">{getOrganicMethods(cropName)}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-center mb-2">
              <span className="text-2xl">🤖</span>
            </div>
            <h5 className="font-semibold text-purple-700 mb-2">AI Tools</h5>
            <p className="text-sm text-purple-600">{getAITools(cropName)}</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-3">📚 Additional Resources</h4>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• Local agricultural extension services</p>
          <p>• Soil testing laboratories in your area</p>
          <p>• Weather monitoring apps and services</p>
          <p>• Farm management software solutions</p>
          <p>• Agricultural commodity market updates</p>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'soil': return renderSoilConditions();
      case 'climate': return renderClimateRequirements();
      case 'sowing': return renderSowingHarvesting();
      case 'irrigation': return renderIrrigationDetails();
      case 'pest': return renderPestDisease();
      case 'tips': return renderAdditionalTips();
      default: return renderOverview();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mt-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Cultivation Guide</h2>
            <p className="text-emerald-100 text-lg">Complete growing information for {cropInfo.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto scrollbar-hide p-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 mx-1 px-6 py-4 text-sm font-semibold transition-all duration-300 whitespace-nowrap rounded-2xl flex items-center gap-3 ${
                activeSection === section.id
                  ? `bg-gradient-to-r from-${section.color}-500 to-${section.color}-600 text-white shadow-lg transform scale-105`
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/60 hover:shadow-md backdrop-blur-sm'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span>{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="animate-fade-in">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

// Helper functions for generating specific information
const getGrowingRegions = (cropName) => {
  const regions = {
    rice: "Asia (China, India, Thailand), South America (Brazil), USA (Arkansas, California)",
    wheat: "Asia (India, China), North America (USA, Canada), Europe (Russia, France)",
    maize: "North America (USA, Mexico), South America (Brazil, Argentina), Asia (China)",
    cotton: "Asia (India, China), North America (USA), Africa (Egypt), Australia",
    sugarcane: "South America (Brazil), Asia (India, Thailand), Australia, Africa",
    coconut: "Southeast Asia, Pacific Islands, India, Philippines, Indonesia",
    jute: "India (West Bengal), Bangladesh, China, Thailand",
    coffee: "South America (Brazil, Colombia), Africa (Ethiopia), Asia (Vietnam)",
    apple: "Temperate regions (Kashmir, Himachal Pradesh, Europe, North America)",
    orange: "Mediterranean, California, Florida, Brazil, India",
    papaya: "Tropical regions worldwide, India, Thailand, Philippines",
    banana: "Tropical regions, India, Philippines, Ecuador, Costa Rica",
    mango: "India, Southeast Asia, South America, Australia",
    grapes: "Mediterranean climate regions, India, California, Australia",
    watermelon: "Warm temperate to tropical regions worldwide"
  };
  return regions[cropName] || "Various suitable climate regions worldwide";
};

const getCropUses = (cropName) => {
  const uses = {
    rice: "Staple food grain, rice flour, rice bran oil, livestock feed, industrial starch",
    wheat: "Flour production, bread making, pasta, breakfast cereals, livestock feed",
    maize: "Human consumption, animal feed, ethanol production, industrial starch, corn oil",
    cotton: "Textile fiber, cottonseed oil, animal feed, paper production, medical cotton",
    sugarcane: "Sugar production, ethanol fuel, bagasse for paper, molasses, juice",
    coconut: "Cooking oil, coconut milk, coir fiber, charcoal, cosmetics, food products",
    jute: "Burlap sacks, rope, carpets, textiles, paper, composite materials",
    coffee: "Beverage production, cosmetics, fertilizer (grounds), flavoring",
    apple: "Fresh fruit, juice, cider, dried fruit, pectin, vinegar",
    orange: "Fresh fruit, juice, essential oils, marmalade, pectin",
    papaya: "Fresh fruit, papain enzyme, juice, dried fruit, cosmetics",
    banana: "Fresh fruit, chips, flour, fiber, paper, livestock feed",
    mango: "Fresh fruit, juice, dried fruit, pickles, pulp, oil from seeds",
    grapes: "Fresh fruit, wine, raisins, juice, vinegar, grape seed oil",
    watermelon: "Fresh fruit, juice, seeds (roasted snacks), rind (pickles)"
  };
  return uses[cropName] || "Multiple food and industrial applications";
};

const getSoilTypeExplanation = (soilType) => {
  if (soilType.includes('loamy')) return "Loamy soil provides excellent drainage while retaining moisture and nutrients";
  if (soilType.includes('clay')) return "Clay soil retains water well but may need organic matter for better drainage";
  if (soilType.includes('sandy')) return "Sandy soil drains well but requires frequent irrigation and organic amendments";
  if (soilType.includes('alluvial')) return "Alluvial soil is fertile and well-suited for high-yield cultivation";
  return "This soil type provides optimal growing conditions for the crop";
};

const getFertilizerTip = (soil) => {
  return `Apply fertilizers in split doses during key growth stages. Use organic compost to improve soil structure. Monitor NPK levels regularly for optimal nutrient management.`;
};

const getTemperatureTips = (cropName) => {
  const tips = {
    rice: "Maintain 25-30°C during grain filling. Avoid cold stress during flowering.",
    wheat: "Cool weather during vegetative growth, warm during grain development.",
    maize: "Consistent warmth needed. Protect from frost during seedling stage.",
    cotton: "Warm temperatures essential for fiber development and quality.",
    sugarcane: "High temperatures boost sugar accumulation in stalks."
  };
  return tips[cropName] || "Monitor temperature during critical growth phases";
};

const getHumidityTips = (cropName) => {
  const tips = {
    rice: "High humidity supports growth but ensure good air circulation",
    wheat: "Moderate humidity prevents fungal diseases",
    maize: "Balanced humidity prevents drought stress and disease",
    cotton: "Control humidity to prevent boll rot and pest issues"
  };
  return tips[cropName] || "Maintain appropriate humidity levels for healthy growth";
};

const getRainfallTips = (cropName, rainfall) => {
  return `Supplement natural rainfall with irrigation as needed. Install drainage systems in high-rainfall areas. Use mulching to conserve soil moisture during dry periods.`;
};

const getSunlightRequirements = (cropName) => {
  const requirements = {
    rice: "Full sun (6-8 hours daily) for optimal photosynthesis and grain filling",
    wheat: "Full sun exposure needed for proper tillering and grain development",
    maize: "Full sun (6+ hours) essential for maximum yield potential",
    cotton: "Full sun required for fiber quality and boll development",
    apple: "Full to partial sun (6+ hours) for fruit color and sugar content",
    coffee: "Partial shade (4-6 hours) or filtered sunlight preferred"
  };
  return requirements[cropName] || "Full sun (6-8 hours daily) for optimal growth";
};

const getSowingTips = (cropName) => {
  const tips = {
    rice: "Pre-monsoon sowing for transplanting. Ensure adequate water before sowing.",
    wheat: "Sow after monsoon retreat when soil moisture is optimal.",
    maize: "Early spring sowing after last frost date for best yields.",
    cotton: "Sow when soil temperature reaches 18°C consistently."
  };
  return tips[cropName] || "Follow local agricultural calendar for optimal sowing time";
};

const getHarvestIndicators = (cropName) => {
  const indicators = {
    rice: "Golden yellow color, 80% grain maturity, easy separation from panicle",
    wheat: "Golden brown color, hard grains, moisture content 20-25%",
    maize: "Brown silk, hard kernels, moisture content 15-20%",
    cotton: "Fully opened bolls, white fluffy fiber, dry conditions",
    apple: "Color development, easy separation from tree, sweet taste",
    orange: "Full color development, slight give when pressed, sweet aroma"
  };
  return indicators[cropName] || "Monitor crop maturity indicators and weather conditions";
};

const getGrowthStages = (cropName) => {
  const stages = {
    rice: "Germination → Seedling → Tillering → Stem elongation → Panicle initiation → Flowering → Grain filling → Maturity",
    wheat: "Germination → Tillering → Stem elongation → Booting → Heading → Flowering → Grain filling → Maturity",
    maize: "Germination → Vegetative growth → Tasseling → Silking → Grain filling → Maturity"
  };
  return stages[cropName] || "Germination → Vegetative growth → Flowering → Fruit/grain development → Maturity";
};

const getKeyMilestones = (cropName) => {
  return "30% germination, 50% flowering, 75% fruit set, harvest readiness indicators";
};

const getSeasonalCalendar = (cropName, conditions) => {
  return `Sowing: ${conditions.season} | Growth period: ${conditions.harvesting} | Harvest: Based on maturity indicators`;
};

const getWateringFrequency = (cropName) => {
  const frequency = {
    rice: "Continuous flooding or daily irrigation in early stages",
    wheat: "Weekly irrigation or as per soil moisture levels",
    maize: "2-3 times per week during vegetative growth, daily during tasseling",
    cotton: "Weekly irrigation, increased during flowering and boll development"
  };
  return frequency[cropName] || "Monitor soil moisture and irrigate as needed (2-3 times weekly)";
};

const getIrrigationType = (cropName) => {
  const types = {
    rice: "Flood irrigation or paddy field system preferred",
    wheat: "Furrow irrigation or sprinkler system",
    maize: "Drip irrigation or furrow irrigation for water efficiency",
    cotton: "Drip irrigation recommended for water conservation",
    apple: "Drip irrigation or micro-sprinklers around root zone",
    orange: "Drip irrigation or basin irrigation"
  };
  return types[cropName] || "Drip irrigation recommended for water efficiency";
};

const getCriticalWaterStages = (cropName) => {
  const stages = {
    rice: ["Transplanting period", "Tillering stage", "Panicle initiation", "Grain filling stage"],
    wheat: ["Crown root initiation", "Tillering", "Jointing", "Grain filling"],
    maize: ["Germination", "Vegetative growth", "Tasseling and silking", "Grain filling"],
    cotton: ["Germination", "Square formation", "Flowering", "Boll development"]
  };
  return stages[cropName] || ["Germination", "Flowering", "Fruit/grain development"];
};

const getWaterConservationTips = (cropName) => {
  return [
    "Use mulching to reduce evaporation",
    "Install drip irrigation for precise water application",
    "Practice rainwater harvesting during monsoon",
    "Monitor soil moisture with sensors",
    "Apply water during cooler parts of the day"
  ];
};

const getCommonPests = (cropName) => {
  const pests = {
    rice: [
      { name: "Brown Planthopper", description: "Sucks plant sap, causes hopper burn" },
      { name: "Rice Stem Borer", description: "Larvae bore into stems, causing white heads" },
      { name: "Leaf Folder", description: "Folds leaves and feeds inside, reduces photosynthesis" }
    ],
    wheat: [
      { name: "Aphids", description: "Small insects that suck plant juices" },
      { name: "Termites", description: "Attack roots and stems of young plants" },
      { name: "Army Worm", description: "Larvae feed on leaves and stems" }
    ],
    maize: [
      { name: "Fall Army Worm", description: "Larvae feed on leaves, causing extensive damage" },
      { name: "Corn Borer", description: "Tunnels into stalks and ears" },
      { name: "Aphids", description: "Transmit viral diseases while feeding" }
    ]
  };
  return pests[cropName] || [
    { name: "Aphids", description: "Common sap-sucking insects" },
    { name: "Caterpillars", description: "Larvae that feed on leaves and fruits" }
  ];
};

const getCommonDiseases = (cropName) => {
  const diseases = {
    rice: [
      { name: "Blast Disease", description: "Fungal disease affecting leaves and panicles" },
      { name: "Bacterial Leaf Blight", description: "Causes yellowing and drying of leaves" },
      { name: "Sheath Rot", description: "Affects leaf sheaths and reduces grain quality" }
    ],
    wheat: [
      { name: "Rust Diseases", description: "Fungal diseases causing orange pustules" },
      { name: "Powdery Mildew", description: "White powdery growth on leaves" },
      { name: "Loose Smut", description: "Replaces grain with black spores" }
    ],
    cotton: [
      { name: "Fusarium Wilt", description: "Soil-borne fungal disease causing wilting" },
      { name: "Bacterial Blight", description: "Angular leaf spots with yellow halos" },
      { name: "Verticillium Wilt", description: "Yellowing and wilting of leaves" }
    ]
  };
  return diseases[cropName] || [
    { name: "Fungal Infections", description: "Various fungal diseases affecting growth" },
    { name: "Bacterial Diseases", description: "Bacterial infections causing leaf spots" }
  ];
};

const getNaturalControlMethods = (cropName) => {
  return [
    "Neem oil spray for pest control",
    "Beneficial insects like ladybugs and parasitic wasps",
    "Companion planting with pest-repelling plants",
    "Biological fungicides using Trichoderma",
    "Trap crops to divert pests from main crop"
  ];
};

const getChemicalControlMethods = (cropName) => {
  return [
    "Systemic insecticides for severe pest infestations",
    "Fungicides for disease prevention and control",
    "Herbicides for weed management",
    "Growth regulators for plant development",
    "Follow recommended dosage and safety guidelines"
  ];
};

const getPreventiveMeasures = (cropName) => {
  return [
    "Crop rotation to break pest and disease cycles",
    "Use certified disease-free seeds",
    "Maintain field sanitation and remove crop residues",
    "Monitor crops regularly for early detection",
    "Provide proper plant spacing for air circulation"
  ];
};

const getCompanionCrops = (cropName) => {
  const companions = {
    rice: [
      { crop: "Fish farming", benefit: "Integrated rice-fish system provides protein and pest control" },
      { crop: "Duck farming", benefit: "Ducks eat pests and weeds, provide fertilizer" }
    ],
    wheat: [
      { crop: "Mustard", benefit: "Acts as trap crop for aphids" },
      { crop: "Gram/Chickpea", benefit: "Fixes nitrogen in soil for following wheat crop" }
    ],
    maize: [
      { crop: "Beans", benefit: "Nitrogen fixation improves soil fertility" },
      { crop: "Pumpkin", benefit: "Ground cover reduces weeds and conserves moisture" }
    ],
    cotton: [
      { crop: "Marigold", benefit: "Repels nematodes and attracts beneficial insects" },
      { crop: "Okra", benefit: "Serves as trap crop for bollworms" }
    ]
  };
  return companions[cropName] || [
    { crop: "Leguminous plants", benefit: "Nitrogen fixation improves soil fertility" },
    { crop: "Aromatic herbs", benefit: "Natural pest repellent properties" }
  ];
};

const getStorageAdvice = (cropName) => {
  const advice = {
    rice: [
      "Dry grain to 14% moisture content before storage",
      "Store in airtight containers to prevent pest infestation",
      "Use neem leaves or diatomaceous earth as natural preservatives",
      "Maintain cool, dry storage conditions"
    ],
    wheat: [
      "Ensure moisture content below 12% before storage",
      "Use sealed silos or containers to prevent pest entry",
      "Regular monitoring for insect activity",
      "Store in cool, ventilated areas"
    ]
  };
  return advice[cropName] || [
    "Proper drying to safe moisture levels",
    "Clean, pest-free storage containers",
    "Regular monitoring and maintenance",
    "Cool, dry storage environment"
  ];
};

const getSensorTechniques = (cropName) => {
  return "Soil moisture sensors, weather stations, drone monitoring for crop health assessment";
};

const getOrganicMethods = (cropName) => {
  return "Compost application, green manuring, biological pest control, organic certification practices";
};

const getAITools = (cropName) => {
  return "Crop monitoring apps, yield prediction models, precision agriculture platforms, disease identification systems";
};

export default CropConditionsGuide;
