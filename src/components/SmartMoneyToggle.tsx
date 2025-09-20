import React from 'react';
import { Zap } from 'lucide-react';

interface SmartMoneyToggleProps {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

const SmartMoneyToggle: React.FC<SmartMoneyToggleProps> = ({ isChecked, onChange }) => {
  return (
    <div className="flex items-center space-x-3 bg-gray-700 bg-opacity-50 p-3 rounded-lg">
      <Zap className="w-5 h-5 text-yellow-400" />
      <label htmlFor="smart-money-toggle" className="text-white font-medium">
        Aplicar estudos Smart Money
      </label>
      <input
        id="smart-money-toggle"
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-600 focus:ring-2"
      />
    </div>
  );
};

export default SmartMoneyToggle;
