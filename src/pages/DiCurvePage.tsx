import React, { useState } from 'react';
import { useDiCurve } from '../hooks/useDiCurve';
import MT5ConnectionStatus from '../components/MT5ConnectionStatus';
import YieldCurveChart from '../components/YieldCurveChart';
import DiContractsTable from '../components/DiContractsTable'; // NOVO
import { RefreshCw, AlertCircle, Zap, Database } from 'lucide-react';
import { DiContract } from '../types/market';

type CurveTab = 'short' | 'long';

function DiCurvePage() {
  const { curveData, loading, error, mt5Connected, backendAvailable, refreshData } = useDiCurve();
  const [activeTab, setActiveTab] = useState<CurveTab>('short');

  const shortTermData = curveData?.contracts.filter(d => new Date(d.maturityDate).getFullYear() <= 2029) || [];
  const longTermData = curveData?.contracts.filter(d => new Date(d.maturityDate).getFullYear() > 2029) || [];

  const renderContent = () => {
    if (loading && !curveData) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-600">
          <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
          <p className="mt-4">Buscando dados da curva de juros...</p>
        </div>
      );
    }

    if (!curveData || curveData.contracts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-600">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="mt-4">Não foi possível carregar os dados da curva de juros.</p>
        </div>
      );
    }

    let dataToShow: DiContract[] = [];
    let title = '';
    let tableTitle = '';
    if (activeTab === 'short') {
      dataToShow = shortTermData;
      title = 'Curva de Juros Curtos (até 2029)';
      tableTitle = 'Cotações - Curto Prazo';
    } else {
      dataToShow = longTermData;
      title = 'Curva de Juros Longos (após 2029)';
      tableTitle = 'Cotações - Longo Prazo';
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <YieldCurveChart data={dataToShow} title={title} />
        </div>
        <div className="md:col-span-1">
          <DiContractsTable contracts={dataToShow} title={tableTitle} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Curva de Juros Futuros (DI)</h2>
          <div className="text-sm text-gray-600 flex items-center space-x-2">
            {curveData?.source === 'real' ? (
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

      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('short')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'short'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Curva Curta
            </button>
            <button
              onClick={() => setActiveTab('long')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'long'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Curva Longa
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

export default DiCurvePage;
