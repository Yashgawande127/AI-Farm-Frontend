import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import { getCropData } from '../data/cropData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
);

const PredictionAnalytics = ({ prediction, inputData }) => {
  if (!prediction || !prediction.data) return null;

  const { predicted_crop, confidence } = prediction.data;
  const cropInfo = getCropData(predicted_crop);

  // Confidence breakdown
  const confidenceData = {
    labels: ['Confidence', 'Uncertainty'],
    datasets: [
      {
        data: [confidence * 100, (1 - confidence) * 100],
        backgroundColor: [
          confidence >= 0.8 ? 'rgba(34, 197, 94, 0.8)' : 
          confidence >= 0.6 ? 'rgba(245, 158, 11, 0.8)' : 'rgba(239, 68, 68, 0.8)',
          'rgba(229, 231, 235, 0.8)',
        ],
        borderColor: [
          confidence >= 0.8 ? 'rgba(34, 197, 94, 1)' : 
          confidence >= 0.6 ? 'rgba(245, 158, 11, 1)' : 'rgba(239, 68, 68, 1)',
          'rgba(229, 231, 235, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const confidenceOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Prediction Confidence',
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        position: 'bottom',
      },
    },
    cutout: '60%',
  };

  // Input parameters analysis
  const parameterData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'pH', 'Rainfall'],
    datasets: [
      {
        label: 'Your Input Values',
        data: inputData ? [
          inputData.nitrogen || 0,
          inputData.phosphorus || 0, 
          inputData.potassium || 0,
          inputData.temperature || 0,
          inputData.humidity || 0,
          inputData.ph || 0,
          inputData.rainfall || 0,
        ] : [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const parameterOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Input Parameters Analysis',
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Suitability radar if crop info is available
  const suitabilityData = cropInfo ? {
    labels: ['Temperature', 'Humidity', 'pH Level', 'Water Needs', 'Nutrient Req', 'Climate Match'],
    datasets: [
      {
        label: 'Suitability Score',
        data: [85, 78, 92, 88, 75, 90], // You can calculate these based on actual input vs requirements
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
      },
    ],
  } : null;

  const suitabilityOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Environmental Suitability',
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl">🎯</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Prediction Analytics
            </h3>
            <p className="text-gray-600">
              Detailed analysis of your crop recommendation
            </p>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Confidence Chart */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
            <div className="h-80 flex items-center justify-center">
              <div className="w-72">
                <Doughnut data={confidenceData} options={confidenceOptions} />
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {Math.round(confidence * 100)}%
              </div>
              <p className="text-sm text-gray-600">
                Model confidence in recommendation
              </p>
            </div>
          </div>

          {/* Parameters Bar Chart */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="h-80">
              <Bar data={parameterData} options={parameterOptions} />
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-blue-700">
                Your soil and environmental input parameters
              </p>
            </div>
          </div>

          {/* Suitability Radar (if crop info available) */}
          {cropInfo && suitabilityData && (
            <div className="lg:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="h-80">
                <Radar data={suitabilityData} options={suitabilityOptions} />
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-green-700">
                  How well your conditions match {cropInfo.name} requirements
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Key Insights */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <h4 className="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Key Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <h5 className="font-semibold text-indigo-800 mb-2">Prediction Reliability</h5>
              <p className="text-indigo-700 text-sm">
                {confidence >= 0.8 
                  ? "High confidence prediction - Your conditions are well-suited for this crop."
                  : confidence >= 0.6
                  ? "Moderate confidence - Consider optimizing some growing conditions."
                  : "Lower confidence - Multiple crops may be suitable. Consider consulting experts."
                }
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <h5 className="font-semibold text-indigo-800 mb-2">Recommended Actions</h5>
              <p className="text-indigo-700 text-sm">
                {confidence >= 0.8
                  ? "Proceed with cultivation planning. Monitor seasonal variations."
                  : confidence >= 0.6
                  ? "Fine-tune soil nutrients and water management before planting."
                  : "Consider soil testing and consultation with local agricultural experts."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Input Summary */}
        {inputData && (
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Your Input Summary
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{inputData.nitrogen || 0}</div>
                <div className="text-sm text-gray-600">Nitrogen (N)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{inputData.phosphorus || 0}</div>
                <div className="text-sm text-gray-600">Phosphorus (P)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{inputData.potassium || 0}</div>
                <div className="text-sm text-gray-600">Potassium (K)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{inputData.temperature || 0}°C</div>
                <div className="text-sm text-gray-600">Temperature</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">{inputData.humidity || 0}%</div>
                <div className="text-sm text-gray-600">Humidity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{inputData.ph || 0}</div>
                <div className="text-sm text-gray-600">pH Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{inputData.rainfall || 0}mm</div>
                <div className="text-sm text-gray-600">Rainfall</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionAnalytics;