import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from 'chart.js';
import { Bar, Radar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
);

const CropChartsDisplay = ({ cropData }) => {
  if (!cropData) return null;

  const { conditions } = cropData;

  // Extract numeric values for charts
  const extractRange = (str) => {
    const matches = str.match(/(\d+)-(\d+)/);
    if (matches) {
      return {
        min: parseInt(matches[1]),
        max: parseInt(matches[2]),
        avg: (parseInt(matches[1]) + parseInt(matches[2])) / 2
      };
    }
    const single = str.match(/(\d+)/);
    if (single) {
      const val = parseInt(single[1]);
      return { min: val, max: val, avg: val };
    }
    return { min: 0, max: 0, avg: 0 };
  };

  // Temperature and humidity data
  const tempRange = extractRange(conditions.temperature);
  const humidityRange = extractRange(conditions.humidity);
  const rainfallRange = extractRange(conditions.rainfall);

  // Nutrient requirements data
  const getNutrientLevel = (requirement) => {
    if (requirement.includes('Very High')) return 5;
    if (requirement.includes('High')) return 4;
    if (requirement.includes('Medium')) return 3;
    if (requirement.includes('Low')) return 2;
    return 1;
  };

  const nitrogenLevel = getNutrientLevel(conditions.soil.nitrogen);
  const phosphorusLevel = getNutrientLevel(conditions.soil.phosphorus);
  const potassiumLevel = getNutrientLevel(conditions.soil.potassium);

  // pH range
  const phRange = extractRange(conditions.soil.ph);

  // Climate conditions radar chart
  const radarData = {
    labels: ['Temperature', 'Humidity', 'Rainfall', 'Nitrogen', 'Phosphorus', 'Potassium'],
    datasets: [
      {
        label: 'Requirement Level',
        data: [
          (tempRange.avg / 40) * 100, // Normalize to 100
          humidityRange.avg,
          (rainfallRange.avg / 300) * 100, // Normalize to 100
          nitrogenLevel * 20, // Convert to 100 scale
          phosphorusLevel * 20,
          potassiumLevel * 20,
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(34, 197, 94, 1)',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Overall Requirements Profile',
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
          color: '#6B7280',
        },
        grid: {
          color: '#E5E7EB',
        },
        angleLines: {
          color: '#E5E7EB',
        },
      },
    },
  };

  // Nutrient requirements bar chart
  const nutrientData = {
    labels: ['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)'],
    datasets: [
      {
        label: 'Requirement Level',
        data: [nitrogenLevel, phosphorusLevel, potassiumLevel],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // Red for Nitrogen
          'rgba(245, 158, 11, 0.8)',   // Orange for Phosphorus
          'rgba(139, 92, 246, 0.8)',   // Purple for Potassium
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const nutrientOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'NPK Requirements',
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        display: false,
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

  // Climate conditions doughnut chart
  const climateScore = (tempRange.avg + humidityRange.avg + (rainfallRange.avg / 3)) / 3;
  const climateData = {
    labels: ['Optimal Range', 'Remaining'],
    datasets: [
      {
        data: [Math.min(climateScore, 100), Math.max(100 - climateScore, 0)],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(229, 231, 235, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(229, 231, 235, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const climateOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Climate Suitability',
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        position: 'bottom',
      },
    },
    cutout: '60%',
  };

  // Growing timeline chart
  const harvestDays = extractRange(conditions.harvesting);
  const timelineData = {
    labels: ['Planting', '25% Growth', '50% Growth', '75% Growth', 'Harvest'],
    datasets: [
      {
        label: 'Days',
        data: [0, harvestDays.avg * 0.25, harvestDays.avg * 0.5, harvestDays.avg * 0.75, harvestDays.avg],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const timelineOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Growing Timeline (Days)',
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' days';
          },
        },
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

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl">📊</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {cropData.name} - Visual Analytics
            </h3>
            <p className="text-gray-600">
              Interactive charts showing cultivation requirements and growth patterns
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="h-80">
              <Radar data={radarData} options={radarOptions} />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-green-700">
                Higher values indicate greater requirements
              </p>
            </div>
          </div>

          {/* Nutrient Bar Chart */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="h-80">
              <Bar data={nutrientData} options={nutrientOptions} />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-blue-700">
                Essential macronutrient requirements for optimal growth
              </p>
            </div>
          </div>

          {/* Climate Suitability Doughnut */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <div className="h-80 flex items-center justify-center">
              <div className="w-72">
                <Doughnut data={climateData} options={climateOptions} />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-purple-700">
                Overall climate compatibility score
              </p>
            </div>
          </div>

          {/* Growing Timeline */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
            <div className="h-80">
              <Line data={timelineData} options={timelineOptions} />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-amber-700">
                Expected growth phases from planting to harvest
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 text-center border border-red-100">
            <div className="text-2xl font-bold text-red-600">
              {tempRange.min}-{tempRange.max}°C
            </div>
            <div className="text-sm text-red-700 font-medium">Temperature</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">
              {humidityRange.min}-{humidityRange.max}%
            </div>
            <div className="text-sm text-blue-700 font-medium">Humidity</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600">
              {rainfallRange.min}-{rainfallRange.max}cm
            </div>
            <div className="text-sm text-green-700 font-medium">Rainfall</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 text-center border border-yellow-100">
            <div className="text-2xl font-bold text-yellow-600">
              {phRange.min}-{phRange.max}
            </div>
            <div className="text-sm text-yellow-700 font-medium">Soil pH</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropChartsDisplay;