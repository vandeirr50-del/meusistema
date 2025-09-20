import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { MarketSentiment } from '../types/market';

interface MarketSentimentChartProps {
  sentiment: MarketSentiment;
}

const MarketSentimentChart: React.FC<MarketSentimentChartProps> = ({ sentiment }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      chartInstance.current = echarts.init(chartRef.current);

      const option: echarts.EChartsOption = {
        title: {
          text: 'Sentimento do Mercado',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}%'
        },
        legend: {
          orient: 'horizontal',
          bottom: '0%',
          data: ['Otimista', 'Pessimista', 'Neutro']
        },
        series: [
          {
            name: 'Sentimento',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { 
                value: sentiment.bullish, 
                name: 'Otimista',
                itemStyle: { color: '#22c55e' }
              },
              { 
                value: sentiment.bearish, 
                name: 'Pessimista',
                itemStyle: { color: '#ef4444' }
              },
              { 
                value: sentiment.neutral, 
                name: 'Neutro',
                itemStyle: { color: '#6b7280' }
              }
            ]
          }
        ]
      };

      chartInstance.current.setOption(option);

      const handleResize = () => {
        chartInstance.current?.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [sentiment]);

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{sentiment.bullish}%</div>
          <div className="text-sm text-gray-600">Otimista</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{sentiment.bearish}%</div>
          <div className="text-sm text-gray-600">Pessimista</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{sentiment.neutral}%</div>
          <div className="text-sm text-gray-600">Neutro</div>
        </div>
      </div>
    </div>
  );
};

export default MarketSentimentChart;
