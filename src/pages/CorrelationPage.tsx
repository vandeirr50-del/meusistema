import React, { useState } from 'react';
import { useCorrelation } from '../hooks/useCorrelation';
import { RefreshCw, AlertCircle, GitCompareArrows, TrendingUp, TrendingDown } from 'lucide-react';
import CorrelationChart from '../components/CorrelationChart';
import CorrelationAnalysisCard from '../components/CorrelationAnalysisCard';

type InstrumentTab = 'WIN' | 'WDO';

function CorrelationPage() {
  const [activeTab, setActiveTab] = useState<InstrumentTab>('WIN');
  const { data, loading, error } = useCorrelation(activeTab);

  const renderContent = () => {
    if (loading && !data) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-600">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
          <p className="mt-4">Calculando correlação para {activeTab}...</p>
        </div>
      );
    }
    
    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-600">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="mt-4">{error}</p>
        </div>
      );
    }

    if (!data) return null;

    return (
      <div className="space-y-6">
        <CorrelationAnalysisCard 
          correlation={data.correlation} 
          suggestion={data.suggestion}
          instrument={activeTab}
        />
        <CorrelationChart series1={data.seriesDI} series2={data.seriesInstrument} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Correlação: Juros vs Futuros</h2>
      
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('WIN')}
              className={`flex items-center space-x-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'WIN'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="w-5 h-5"/>
              <span>Juros vs. Mini Índice (WIN)</span>
            </button>
            <button
              onClick={() => setActiveTab('WDO')}
              className={`flex items-center space-x-2 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'WDO'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingDown className="w-5 h-5"/>
              <span>Juros vs. Mini Dólar (WDO)</span>
            </button>
          </nav>
        </div>
        <div className="pt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default CorrelationPage;
