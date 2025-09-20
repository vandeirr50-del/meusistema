import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { MoverStock } from '../types/market';

interface MoversListProps {
  title: string;
  stocks: MoverStock[];
  type: 'gainers' | 'losers';
}

const MoversList: React.FC<MoversListProps> = ({ title, stocks, type }) => {
  const isGainer = type === 'gainers';
  const colorClass = isGainer ? 'text-green-600' : 'text-red-600';
  const Icon = isGainer ? ArrowUp : ArrowDown;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <Icon className={`w-5 h-5 mr-2 ${colorClass}`} />
        {title}
      </h3>
      <ul className="space-y-3">
        {stocks.length > 0 ? stocks.map(stock => (
          <li key={stock.symbol} className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-800">{stock.symbol}</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">R$ {stock.price.toFixed(2)}</span>
              <span className={`font-bold ${colorClass} w-16 text-right`}>
                {stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </li>
        )) : (
          <p className="text-sm text-gray-500 text-center py-8">Nenhum ativo nesta categoria.</p>
        )}
      </ul>
    </div>
  );
};

export default MoversList;
