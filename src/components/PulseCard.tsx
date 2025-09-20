import React from 'react';
import { Icon } from 'lucide-react';

interface PulseCardProps {
  title: string;
  count: number;
  percentage: number;
  icon: React.ReactElement;
  colorClass: string;
}

const PulseCard: React.FC<PulseCardProps> = ({ title, count, percentage, icon, colorClass }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className={`p-2 rounded-full ${colorClass.replace('text-', 'bg-').replace('600', '100')}`}>
          {React.cloneElement(icon, { className: `w-6 h-6 ${colorClass}` })}
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900">{count}</div>
      <div className={`text-md font-medium ${colorClass}`}>{percentage.toFixed(1)}% do índice</div>
    </div>
  );
};

export default PulseCard;
