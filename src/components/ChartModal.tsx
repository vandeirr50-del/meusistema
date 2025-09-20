import React from 'react';
import { X, Maximize, Minimize } from 'lucide-react';
import CandlestickChart from './CandlestickChart';
import SmartMoneyToggle from './SmartMoneyToggle';
import { CandlestickData, SmartMoneyConcept } from '../types/market';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  name: string;
  timeframe: string;
  candlestickData: CandlestickData[];
  smartMoneyData: SmartMoneyConcept[];
  applySmartMoney: boolean;
  onApplySmartMoneyChange: (value: boolean) => void;
}

const ChartModal: React.FC<ChartModalProps> = ({
  isOpen,
  onClose,
  symbol,
  name,
  timeframe,
  candlestickData,
  smartMoneyData,
  applySmartMoney,
  onApplySmartMoneyChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full h-full flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">{symbol} - {name}</h2>
            <p className="text-sm text-gray-400">Timeframe: {timeframe}</p>
          </div>
          <div className="flex items-center space-x-4">
            <SmartMoneyToggle isChecked={applySmartMoney} onChange={onApplySmartMoneyChange} />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-700 rounded-full transition-colors"
              title="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Chart Area */}
        <main className="flex-1 p-4">
          <CandlestickChart
            data={candlestickData}
            title=""
            smartMoneyData={smartMoneyData}
            showSmartMoney={applySmartMoney}
            isFullScreen={true}
          />
        </main>
      </div>
    </div>
  );
};

export default ChartModal;
