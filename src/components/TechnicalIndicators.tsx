import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TechnicalIndicator } from '../types/market';

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicator[];
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ indicators }) => {
  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'sell':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'text-green-600 bg-green-50';
      case 'sell':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSignalText = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'COMPRA';
      case 'sell':
        return 'VENDA';
      default:
        return 'NEUTRO';
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores Técnicos</h3>
      
      <div className="space-y-4">
        {indicators.map((indicator, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{indicator.name}</h4>
              <p className="text-sm text-gray-600">{indicator.description}</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {indicator.value.toFixed(3)}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {getSignalIcon(indicator.signal)}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getSignalColor(
                  indicator.signal
                )}`}
              >
                {getSignalText(indicator.signal)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicalIndicators;
