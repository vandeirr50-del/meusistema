import React from 'react';
import { DiContract } from '../types/market';
import { List } from 'lucide-react';

interface DiContractsTableProps {
  contracts: DiContract[];
  title: string;
}

const DiContractsTable: React.FC<DiContractsTableProps> = ({ contracts, title }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <List className="w-5 h-5 mr-2 text-blue-600" />
        {title}
      </h3>
      <div className="max-h-[420px] overflow-y-auto pr-2">
        <ul className="space-y-3">
          {contracts.length > 0 ? (
            contracts.map(contract => (
              <li key={contract.symbol} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-50">
                <span className="font-medium text-gray-800">{contract.symbol}</span>
                <span className="font-bold text-blue-700">
                  {contract.rate.toFixed(4)}%
                </span>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum contrato para exibir.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DiContractsTable;
