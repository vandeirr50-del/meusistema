import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StockData } from '../types/market';

interface StockCardProps {
  stock: StockData;
  onClick?: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = stock.change >= 0;
  const isNeutral = stock.change === 0;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(0)}K`;
    }
    return volume.toString();
  };

  return (
    <div
      className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        onClick ? 'hover:border-blue-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
          <p className="text-sm text-gray-600 truncate">{stock.name}</p>
        </div>
        <div className="flex items-center">
          {isNeutral ? (
            <Minus className="w-4 h-4 text-gray-500" />
          ) : isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(stock.price)}
          </span>
          <div className="text-right">
            <div
              className={`text-sm font-medium ${
                isNeutral
                  ? 'text-gray-600'
                  : isPositive
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {isPositive && !isNeutral ? '+' : ''}{formatCurrency(stock.change)}
            </div>
            <div
              className={`text-xs ${
                isNeutral
                  ? 'text-gray-500'
                  : isPositive
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {isPositive && !isNeutral ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Volume:</span>
          <span>{formatVolume(stock.volume)}</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
