import React from 'react';
import { BrainCircuit, Info } from 'lucide-react';

interface CorrelationAnalysisCardProps {
  correlation: number;
  suggestion: string;
  instrument: 'WIN' | 'WDO';
}

const CorrelationAnalysisCard: React.FC<CorrelationAnalysisCardProps> = ({ correlation, suggestion, instrument }) => {
  const isStrong = Math.abs(correlation) > 0.3;
  const isPositive = correlation > 0;
  const instrumentName = instrument === 'WIN' ? 'Índice (WIN)' : 'Dólar (WDO)';

  let color = 'text-gray-600';
  if (isStrong) {
    color = isPositive ? 'text-green-600' : 'text-red-600';
  }

  // Lógica para gerar a explicação clara
  let explanation = "Atualmente, não há uma relação clara entre a curva de juros e o " + instrumentName + ".";
  if (isStrong) {
    if (isPositive) {
      explanation = `Quando os juros sobem, o ${instrumentName} tende a subir também (correlação positiva).`;
    } else {
      explanation = `Quando os juros sobem, o ${instrumentName} tende a cair (correlação negativa).`;
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <BrainCircuit className="w-5 h-5 mr-2 text-blue-600" />
        Análise de Correlação
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-sm text-gray-500">Coeficiente</p>
              <p className={`text-4xl font-bold ${color}`}>{correlation.toFixed(3)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Sugestão de Viés</p>
              <p className="text-xl font-semibold text-gray-800">{suggestion}</p>
            </div>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex">
                <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-blue-700">{explanation}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationAnalysisCard;
