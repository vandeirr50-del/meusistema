import React, { useState, useMemo } from 'react';
import { useStockAnalysis } from '../hooks/useStockAnalysis';
import { RefreshCw, AlertCircle, Search, Expand } from 'lucide-react';
import CandlestickChart from '../components/CandlestickChart';
import ChartModal from '../components/ChartModal';
import TechnicalIndicators from '../components/TechnicalIndicators';
import TimeframeSelector from '../components/TimeframeSelector';
import { smartMoneyService } from '../services/smartMoney';
import { StockData } from '../types/market';

// Componente de Card de Ação modificado para esta página
const AnalysisStockCard: React.FC<{ stock: StockData; isSelected: boolean; onClick: () => void }> = ({ stock, isSelected, onClick }) => {
  const isPositive = stock.changePercent >= 0;
  
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-50 border-blue-400 shadow-md'
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-center">
        <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>{stock.symbol}</span>
        <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {stock.changePercent.toFixed(2)}%
        </span>
      </div>
      <div className="text-right text-sm text-gray-600">
        R$ {stock.price.toFixed(2)}
      </div>
    </div>
  );
};


function StockAnalysisPage() {
  const {
    stocks,
    selectedStock,
    candlestickData,
    technicalIndicators,
    timeframe,
    loading,
    error,
    selectStock,
    setTimeframe,
  } = useStockAnalysis();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applySmartMoney, setApplySmartMoney] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const smartMoneyData = useMemo(() => {
    if (!candlestickData) return [];
    return smartMoneyService.analyze(candlestickData);
  }, [candlestickData]);

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    return stocks.filter(stock =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stocks, searchTerm]);

  const currentStockDetails = useMemo(() => {
    return stocks.find(s => s.symbol === selectedStock);
  }, [stocks, selectedStock]);

  if (loading && stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-600">
        <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4">Carregando dados dos ativos...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar com lista de ações */}
      <aside className="lg:col-span-1 bg-white p-4 rounded-lg border shadow-sm h-[80vh] flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ativos IBOV</h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar ativo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
          {filteredStocks.length > 0 ? (
            filteredStocks.map(stock => (
               <div key={stock.symbol} className="flex items-center space-x-3">
                 <input
                   type="radio"
                   id={`stock-${stock.symbol}`}
                   name="stock-selection"
                   checked={selectedStock === stock.symbol}
                   onChange={() => selectStock(stock.symbol)}
                   className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                 />
                 <label htmlFor={`stock-${stock.symbol}`} className="w-full">
                    <AnalysisStockCard 
                      stock={stock} 
                      isSelected={selectedStock === stock.symbol}
                      onClick={() => selectStock(stock.symbol)} 
                    />
                 </label>
               </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8">Nenhum ativo encontrado.</p>
          )}
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="lg:col-span-3 space-y-6">
        {error && <AlertCircle className="text-red-500">{error}</AlertCircle>}
        
        {currentStockDetails ? (
          <>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentStockDetails.symbol}</h2>
                  <p className="text-gray-600">{currentStockDetails.name}</p>
                </div>
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
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-white rounded-lg border">
            <p className="text-gray-500">Selecione um ativo na lista para ver os detalhes.</p>
          </div>
        )}
      </main>

      {currentStockDetails && (
        <ChartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          symbol={currentStockDetails.symbol}
          name={currentStockDetails.name}
          timeframe={timeframe}
          candlestickData={candlestickData}
          smartMoneyData={smartMoneyData}
          applySmartMoney={applySmartMoney}
          onApplySmartMoneyChange={setApplySmartMoney}
        />
      )}
    </div>
  );
}

export default StockAnalysisPage;
