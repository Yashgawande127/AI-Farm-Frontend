import React, { useState, useEffect } from 'react';

const FeatureEngineeringDebug = () => {
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the model comparison data
    fetch('http://localhost:5000/api/model-comparison')
      .then(res => res.json())
      .then(data => {
        console.log('Model comparison data:', data);
        setModelData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching model data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading model data...</div>;
  }

  if (!modelData) {
    return <div className="p-8 text-center text-red-600">Failed to load model data</div>;
  }

  const featureEngineering = modelData.model_comparison?.feature_engineering;
  const rfImportance = modelData.model_comparison?.random_forest?.feature_importance;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Feature Engineering Debug View</h1>
      
      {/* Feature Engineering Data */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Feature Engineering Configuration</h2>
        {featureEngineering ? (
          <div className="space-y-2">
            <p><strong>Original Features:</strong> {featureEngineering.original_features}</p>
            <p><strong>Enhanced Features:</strong> {featureEngineering.enhanced_features}</p>
            <p><strong>Domain Features:</strong> {featureEngineering.domain_features}</p>
            <p><strong>Statistical Features:</strong> {featureEngineering.statistical_features}</p>
            <p><strong>KPCA Components:</strong> {featureEngineering.kpca_components}</p>
            <p><strong>Extraction Method:</strong> {featureEngineering.feature_extraction}</p>
          </div>
        ) : (
          <p className="text-red-600">Feature engineering data not available</p>
        )}
      </div>

      {/* SFI and CSI Importance */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">SFI & CSI Importance</h2>
        {rfImportance ? (
          <div className="space-y-2">
            <p><strong>SFI (Soil Fertility Index):</strong> {(rfImportance.SFI * 100).toFixed(2)}%</p>
            <p><strong>CSI (Climate Suitability Index):</strong> {(rfImportance.CSI * 100).toFixed(2)}%</p>
            
            <h3 className="text-xl font-bold mt-4 mb-2">KPCA Components</h3>
            {Array.from({ length: 10 }, (_, i) => (
              <p key={i}>
                <strong>KPCA_{i + 1}:</strong> {(rfImportance[`KPCA_${i + 1}`] * 100).toFixed(2)}%
              </p>
            ))}
          </div>
        ) : (
          <p className="text-red-600">Feature importance data not available</p>
        )}
      </div>

      {/* Visual Bar Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Feature Category Contributions</h2>
        {rfImportance && (
          <div className="space-y-4">
            {(() => {
              const originalFeatures = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
              const kpcaFeatures = Array.from({ length: 10 }, (_, i) => `KPCA_${i + 1}`);
              
              const originalTotal = originalFeatures.reduce((sum, f) => sum + (rfImportance[f] || 0), 0) * 100;
              const sfiValue = (rfImportance['SFI'] || 0) * 100;
              const csiValue = (rfImportance['CSI'] || 0) * 100;
              const kpcaTotal = kpcaFeatures.reduce((sum, f) => sum + (rfImportance[f] || 0), 0) * 100;

              return (
                <>
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="w-40 font-semibold">Original Features:</span>
                      <div className="flex-1 bg-gray-200 h-8 rounded">
                        <div 
                          className="bg-blue-500 h-full rounded flex items-center justify-end pr-2"
                          style={{ width: `${Math.min(originalTotal, 100)}%` }}
                        >
                          <span className="text-white font-bold text-sm">{originalTotal.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="w-40 font-semibold">SFI:</span>
                      <div className="flex-1 bg-gray-200 h-8 rounded">
                        <div 
                          className="bg-green-500 h-full rounded flex items-center justify-end pr-2"
                          style={{ width: `${Math.min(sfiValue * 2, 100)}%` }}
                        >
                          <span className="text-white font-bold text-sm">{sfiValue.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="w-40 font-semibold">CSI:</span>
                      <div className="flex-1 bg-gray-200 h-8 rounded">
                        <div 
                          className="bg-cyan-500 h-full rounded flex items-center justify-end pr-2"
                          style={{ width: `${Math.min(csiValue * 2, 100)}%` }}
                        >
                          <span className="text-white font-bold text-sm">{csiValue.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="w-40 font-semibold">KPCA (Total):</span>
                      <div className="flex-1 bg-gray-200 h-8 rounded">
                        <div 
                          className="bg-purple-500 h-full rounded flex items-center justify-end pr-2"
                          style={{ width: `${Math.min(kpcaTotal, 100)}%` }}
                        >
                          <span className="text-white font-bold text-sm">{kpcaTotal.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Raw JSON Data */}
      <div className="bg-gray-100 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Raw Data (JSON)</h2>
        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-xs">
          {JSON.stringify(modelData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FeatureEngineeringDebug;
