import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getAllCrops } from '../data/cropData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
);

const CropComparisonCharts = () => {
  const [selectedCrops, setSelectedCrops] = useState(['rice', 'wheat', 'maize']);
  const [chartType, setChartType] = useState('nutrients');
  const allCrops = getAllCrops();

  const extractRange = (str) => {
    const matches = str.match(/(\d+)-(\d+)/);
    if (matches) {
      return (parseInt(matches[1]) + parseInt(matches[2])) / 2;
    }
    const single = str.match(/(\d+)/);
    return single ? parseInt(single[1]) : 0;
  };

  const getNutrientLevel = (requirement) => {
    if (requirement.includes('Very High')) return 5;
    if (requirement.includes('High')) return 4;
    if (requirement.includes('Medium')) return 3;
    if (requirement.includes('Low')) return 2;
    return 1;
  };

  const getSelectedCropData = () => {
    return allCrops.filter(crop => selectedCrops.includes(crop.key));
  };

  const generateNutrientChart = () => {
    const cropData = getSelectedCropData();
    
    const data = {
      labels: cropData.map(crop => crop.name),
      datasets: [
        {
          label: 'Nitrogen',
          data: cropData.map(crop => getNutrientLevel(crop.conditions.soil.nitrogen)),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
        },
        {
          label: 'Phosphorus',
          data: cropData.map(crop => getNutrientLevel(crop.conditions.soil.phosphorus)),
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 2,
        },
        {
          label: 'Potassium',
          data: cropData.map(crop => getNutrientLevel(crop.conditions.soil.potassium)),
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'NPK Requirements Comparison',
          font: { size: 18, weight: 'bold' }
        },
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1,
            callback: function(value) {
              const levels = ['', 'Very Low', 'Low', 'Medium', 'High', 'Very High'];
              return levels[value] || '';
            },
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const generateClimateChart = () => {
    const cropData = getSelectedCropData();
    
    const data = {
      labels: cropData.map(crop => crop.name),
      datasets: [
        {
          label: 'Temperature (°C)',
          data: cropData.map(crop => extractRange(crop.conditions.temperature)),
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Humidity (%)',
          data: cropData.map(crop => extractRange(crop.conditions.humidity)),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Climate Requirements Comparison',
          font: { size: 18, weight: 'bold' }
        },
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (°C)',
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Humidity (%)',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  const generateHarvestChart = () => {
    const cropData = getSelectedCropData();
    
    const data = {
      labels: cropData.map(crop => crop.name),
      datasets: [
        {
          label: 'Days to Harvest',
          data: cropData.map(crop => extractRange(crop.conditions.harvesting)),
          backgroundColor: cropData.map((_, index) => {
            const colors = [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
            ];
            return colors[index % colors.length];
          }),
          borderColor: cropData.map((_, index) => {
            const colors = [
              'rgba(34, 197, 94, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(236, 72, 153, 1)',
            ];
            return colors[index % colors.length];
          }),
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Harvest Timeline Comparison',
          font: { size: 18, weight: 'bold' }
        },
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Days',
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'nutrients': return generateNutrientChart();
      case 'climate': return generateClimateChart();
      case 'harvest': return generateHarvestChart();
      default: return generateNutrientChart();
    }
  };

  const handleCropToggle = (cropKey) => {
    if (selectedCrops.includes(cropKey)) {
      if (selectedCrops.length > 1) {
        setSelectedCrops(selectedCrops.filter(key => key !== cropKey));
      }
    } else {
      if (selectedCrops.length < 5) {
        setSelectedCrops([...selectedCrops, cropKey]);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl">📈</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Crop Comparison Analytics
            </h3>
            <p className="text-gray-600">
              Compare requirements and characteristics across different crops
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-6">
          {/* Chart Type Selection */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Chart Type</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'nutrients', label: 'NPK Requirements', icon: '🧪' },
                { key: 'climate', label: 'Climate Conditions', icon: '🌤️' },
                { key: 'harvest', label: 'Harvest Timeline', icon: '⏰' }
              ].map(type => (
                <button
                  key={type.key}
                  onClick={() => setChartType(type.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    chartType === type.key
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Selection */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Select Crops to Compare (Max 5)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {allCrops.slice(0, 12).map(crop => (
                <button
                  key={crop.key}
                  onClick={() => handleCropToggle(crop.key)}
                  disabled={!selectedCrops.includes(crop.key) && selectedCrops.length >= 5}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCrops.includes(crop.key)
                      ? 'bg-green-600 text-white shadow-md'
                      : selectedCrops.length >= 5
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {crop.name}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {selectedCrops.length}/5 crops
            </p>
          </div>
        </div>

        {/* Chart Display */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
          <div className="h-96">
            {renderChart()}
          </div>
        </div>

        {/* Selected Crops Summary */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Selected Crops Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getSelectedCropData().map(crop => (
              <div key={crop.key} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={crop.image} 
                    alt={crop.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div>
                    <h5 className="font-bold text-green-800">{crop.name}</h5>
                    <p className="text-sm text-green-600">{crop.conditions.season.split('(')[0].trim()}</p>
                  </div>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Temperature:</span>
                    <span className="font-medium">{extractRange(crop.conditions.temperature)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Harvest:</span>
                    <span className="font-medium">{extractRange(crop.conditions.harvesting)} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropComparisonCharts;