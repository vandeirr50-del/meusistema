import React from 'react';
import { motion } from 'framer-motion';

interface PressureGaugeProps {
  pressure: number; // 0 a 100
}

const PressureGauge: React.FC<PressureGaugeProps> = ({ pressure }) => {
  const isBuyerPressure = pressure >= 50;
  const color = isBuyerPressure ? 'bg-green-500' : 'bg-red-500';
  const label = isBuyerPressure ? 'Pressão Compradora' : 'Pressão Vendedora';
  const displayPressure = isBuyerPressure ? pressure : 100 - pressure;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Pressão do Mercado</h3>
      <div className="flex-grow flex items-end w-24">
        <div className="relative w-full h-full bg-gray-200 rounded-t-lg overflow-hidden">
          <motion.div
            className={`absolute bottom-0 w-full ${color}`}
            initial={{ height: '0%' }}
            animate={{ height: `${pressure}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <div className="absolute bottom-0 w-full h-1/2 border-t-2 border-dashed border-gray-400">
            <span className="absolute -right-8 top-[-10px] text-xs text-gray-500">50%</span>
          </div>
           <span className="absolute -right-8 top-[-10px] text-xs text-gray-500">100%</span>
           <span className="absolute -right-6 bottom-[-5px] text-xs text-gray-500">0%</span>
        </div>
      </div>
      <div className="text-center mt-4">
        <div className={`text-2xl font-bold ${isBuyerPressure ? 'text-green-600' : 'text-red-600'}`}>
          {displayPressure.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
};

export default PressureGauge;
