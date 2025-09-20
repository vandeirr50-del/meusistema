import React from 'react';
import { useWinWdoCorrelation } from '../hooks/useWinWdoCorrelation';
import { RefreshCw, AlertCircle, GitMerge } from 'lucide-react';
import CorrelationChart from '../components/CorrelationChart';
import TradeSuggestionCard from '../components/TradeSuggestionCard';

function WinWdoCorrelationPage() {
  const { data, loading, error } = useWinWdoCorrelation();

  const renderContent = () => {
    if (loading && !data) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-600">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
          <p className="mt-4">Calculando correlação WIN vs WDO...</p>
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
        <TradeSuggestionCard 
          correlation={data.correlation}
          suggestion={data.suggestion}
          logic={data.logic}
          signalStrength={data.signalStrength}
        />
        <CorrelationChart series1={data.seriesWin} series2={data.seriesWdo} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <GitMerge className="mr-3 text-blue-600"/>
        Correlação: Mini Índice (WIN) vs. Mini Dólar (WDO)
      </h2>
      
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="pt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default WinWdoCorrelationPage;
