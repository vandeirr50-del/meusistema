import React from 'react';
import { BrainCircuit, Info, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

interface TradeSuggestionCardProps {
  correlation: number;
  suggestion: string;
  logic: string;
  signalStrength: 'Baixa' | 'Média' | 'Alta';
}

const TradeSuggestionCard: React.FC<TradeSuggestionCardProps> = ({ correlation, suggestion, logic, signalStrength }) => {
  
  const getStrengthInfo = () => {
    switch (signalStrength) {
      case 'Alta':
        return { icon: <ShieldCheck className="w-6 h-6 text-green-600" />, color: 'text-green-600' };
      case 'Média':
        return { icon: <ShieldAlert className="w-6 h-6 text-yellow-600" />, color: 'text-yellow-600' };
      default:
        return { icon: <Shield className="w-6 h-6 text-gray-500" />, color: 'text-gray-500' };
    }
  };

  const strengthInfo = getStrengthInfo();

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <BrainCircuit className="w-5 h-5 mr-2 text-blue-600" />
        Painel de Decisão Rápida (Pairs Trading)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Coeficiente */}
        <div className="text-center border-r border-gray-200 pr-4">
            <p className="text-sm text-gray-500">Coeficiente</p>
            <p className={`text-5xl font-bold ${correlation < 0 ? 'text-red-600' : 'text-green-600'}`}>{correlation.toFixed(3)}</p>
        </div>

        {/* Sinal */}
        <div className="text-center">
          <p className="text-sm text-gray-500">Sinal Sugerido</p>
          <p className="text-2xl font-bold text-blue-700">{suggestion}</p>
        </div>

        {/* Força do Sinal */}
        <div className="flex flex-col items-center text-center border-l border-gray-200 pl-4">
            <p className="text-sm text-gray-500">Força do Sinal</p>
            {strengthInfo.icon}
            <p className={`text-xl font-bold ${strengthInfo.color}`}>{signalStrength}</p>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-200 mt-6 p-4 rounded-b-lg">
            <div className="flex">
                <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-gray-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Lógica da Operação:</p>
                    <p className="text-sm text-gray-600">{logic}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TradeSuggestionCard;
