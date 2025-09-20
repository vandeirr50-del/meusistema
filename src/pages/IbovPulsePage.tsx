import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus, RefreshCw, AlertCircle, Zap, Database } from 'lucide-react';
import { useIbovPulse } from '../hooks/useIbovPulse';
import MT5ConnectionStatus from '../components/MT5ConnectionStatus';
import PulseCard from '../components/PulseCard';
import PressureGauge from '../components/PressureGauge';
import MoversList from '../components/MoversList';

function IbovPulsePage() {
  const { pulseData, loading, error, mt5Connected, backendAvailable, refreshData } = useIbovPulse();

  const renderContent = () => {
    if (loading && !pulseData) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-600">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
          <p className="mt-4">Buscando pulso do mercado...</p>
        </div>
      );
    }

    if (!pulseData) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-600">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="mt-4">Não foi possível carregar os dados do pulso do mercado.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <PulseCard
            title="Ativos em Alta"
            count={pulseData.positiveCount}
            percentage={pulseData.positivePercent}
            icon={<TrendingUp />}
            colorClass="text-green-600"
          />
          <PulseCard
            title="Ativos em Baixa"
            count={pulseData.negativeCount}
            percentage={pulseData.negativePercent}
            icon={<TrendingDown />}
            colorClass="text-red-600"
          />
          <PulseCard
            title="Ativos Estáveis"
            count={pulseData.neutralCount}
            percentage={100 - pulseData.positivePercent - pulseData.negativePercent}
            icon={<Minus />}
            colorClass="text-gray-600"
          />
        </div>

        <div className="lg:col-span-1">
          <PressureGauge pressure={pulseData.pressure} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <MoversList title="Maiores Altas" stocks={pulseData.topGainers} type="gainers" />
          <MoversList title="Maiores Quedas" stocks={pulseData.topLosers} type="losers" />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-800">Pulso do Mercado IBOV</h2>
            <div className="text-sm text-gray-500 pt-1">
              Monitorando {pulseData?.totalMonitored || 0} de {pulseData?.totalPossible || 0} ativos
            </div>
          </div>
          <div className="text-sm text-gray-600 flex items-center space-x-2">
            {pulseData?.source === 'real' ? (
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
      
      <MT5ConnectionStatus
        connected={mt5Connected}
        loading={loading}
        onRefresh={refreshData}
        backendAvailable={backendAvailable}
      />

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-yellow-700 font-medium">Aviso:</p>
            <p className="text-yellow-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
}

export default IbovPulsePage;
