import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface SeriesData {
  name: string;
  data: [string, number][];
}

interface CorrelationChartProps {
  series1: SeriesData;
  series2: SeriesData;
}

const CorrelationChart: React.FC<CorrelationChartProps> = ({ series1, series2 }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const option: echarts.EChartsOption = {
        title: {
          text: 'Séries Normalizadas',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {
              backgroundColor: '#505765',
            },
          },
        },
        legend: {
          data: [series1.name, series2.name],
          top: 'bottom',
          padding: [20, 0, 0, 0]
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          axisLine: { onZero: false },
        },
        yAxis: [
          {
            type: 'value',
            name: 'Valor Normalizado',
            position: 'left',
            min: 0,
            max: 1,
          },
        ],
        series: [
          {
            name: series1.name,
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: series1.data,
            itemStyle: { color: '#3b82f6' }, // blue-500
          },
          {
            name: series2.name,
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: series2.data,
            itemStyle: { color: '#f97316' }, // orange-500
          },
        ],
        dataZoom: [
          { type: 'inside', start: 0, end: 100 },
          { type: 'slider', start: 0, end: 100 }
        ],
      };

      chartInstance.setOption(option);

      const handleResize = () => chartInstance.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.dispose();
      };
    }
  }, [series1, series2]);

  return <div ref={chartRef} className="bg-white p-6 rounded-lg border shadow-sm w-full h-[500px]" />;
};

export default CorrelationChart;
