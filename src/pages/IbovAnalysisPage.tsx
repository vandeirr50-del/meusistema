import React, { useState, useMemo } from 'react';
import { useIbovAnalysis } from '../hooks/useIbovAnalysis';
import { RefreshCw, AlertCircle, Expand, Activity, TrendingUp, TrendingDown, Zap, Database } from 'lucide-react';
import CandlestickChart from '../components/CandlestickChart';
import ChartModal from '../components/ChartModal';
import TechnicalIndicators from '../components/TechnicalIndicators';
import TimeframeSelector from '../components/TimeframeSelector';
import { smartMoneyService } from '../services/smartMoney';

// Card de estatísticas para o IBOV
const StatCard: React.FC<{ label: string; value: string | number; change?: number }> = ({ label, value, change }) => {
  const color = change === undefined ? 'text-gray-900' : change >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <div className="bg-gray-50 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
};

function IbovAnalysisPage() {
  const {
    symbolInfo,
    candlestickData,
    technicalIndicators,
    timeframe,
    loading,
    error,
    setTimeframe,
  } = useIbovAnalysis();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applySmartMoney, setApplySmartMoney] = useState(false);

  const smartMoneyData = useMemo(() => {
    if (!candlestickData) return [];
    return smartMoneyService.analyze(candlestickData);
  }, [candlestickData]);

  if (loading && !symbolInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-600">
        <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4">Carregando análise do IBOVESPA...</p>
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
  
  if (!symbolInfo) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center"><Activity className="mr-3 text-blue-600"/>Análise do Índice IBOVESPA</h2>
          <div className="text-sm text-gray-600 flex items-center space-x-2">
            {symbolInfo.source === 'real' ? (
              <>
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">Dados em tempo real via MT5</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4 text-orange-600" />
                <span className="text-orange-600 font-medium">Dados simulados</span>
              </>
            )}
          </div>
      </div>

      {/* Painel de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Último Preço" value={symbolInfo.price.toLocaleString('pt-BR')} change={symbolInfo.change} />
        <StatCard label="Variação" value={`${symbolInfo.change >= 0 ? '+' : ''}${symbolInfo.change.toFixed(2)} (${symbolInfo.changePercent.toFixed(2)}%)`} change={symbolInfo.change} />
        <StatCard label="Máxima (Dia)" value={symbolInfo.high.toLocaleString('pt-BR')} />
        <StatCard label="Mínima (Dia)" value={symbolInfo.low.toLocaleString('pt-BR')} />
      </div>

      {/* Gráfico e Indicadores */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Gráfico de Preços</h3>
            <TimeframeSelector currentTimeframe={timeframe} onTimeframeChange={setTimeframe} />
          </div>
          
          <div className="relative group">
            <CandlestickChart data={candlestickData} height={450} />
            <button 
              onClick={() => setIsModalOpen(true)}
              className="absolute top-4 right-4 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Expandir Gráfico"
            >
              <Expand className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <TechnicalIndicators indicators={technicalIndicators} />
      </div>

      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        symbol={symbolInfo.symbol}
        name={symbolInfo.name}
        timeframe={timeframe}
        candlestickData={candlestickData}
        smartMoneyData={smartMoneyData}
        applySmartMoney={applySmartMoney}
        onApplySmartMoneyChange={setApplySmartMoney}
      />
    </div>
  );
}

export default IbovAnalysisPage;
