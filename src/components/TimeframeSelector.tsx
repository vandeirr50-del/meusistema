import React from 'react';
import { Clock } from 'lucide-react';

interface TimeframeSelectorProps {
  currentTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  currentTimeframe,
  onTimeframeChange
}) => {
  const timeframes = [
    { value: 'M1', label: '1M' },
    { value: 'M5', label: '5M' },
    { value: 'M15', label: '15M' },
    { value: 'M30', label: '30M' },
    { value: 'H1', label: '1H' },
    { value: 'H4', label: '4H' },
    { value: 'D1', label: '1D' }
  ];

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center space-x-3 mb-3">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Timeframe</h3>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => onTimeframeChange(tf.value)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentTimeframe === tf.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeSelector;
