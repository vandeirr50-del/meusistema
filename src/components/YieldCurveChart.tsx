import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { DiContract } from '../types/market';

interface YieldCurveChartProps {
  data: DiContract[];
  title: string;
}

const YieldCurveChart: React.FC<YieldCurveChartProps> = ({ data, title }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const chartInstance = echarts.init(chartRef.current);

      const chartData = data
        .map(d => [d.maturityDate, d.rate])
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

      const option: echarts.EChartsOption = {
        title: {
          text: title,
          subtext: 'Taxa (%) vs. Vencimento',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const date = new Date(params[0].value[0]);
            const rate = params[0].value[1];
            const symbol = data.find(d => d.maturityDate === params[0].axisValue)?.symbol || '';
            return `
              <b>${symbol}</b><br/>
              Vencimento: ${date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}<br/>
              Taxa: <b>${rate.toFixed(2)}%</b>
            `;
          },
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          name: 'Vencimento',
          nameLocation: 'middle',
          nameGap: 30,
          axisLabel: {
            formatter: '{yyyy}-{MM}',
          },
        },
        yAxis: {
          type: 'value',
          name: 'Taxa (%)',
          axisLabel: {
            formatter: '{value}%',
          },
          scale: true,
        },
        series: [
          {
            name: 'Taxa DI',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            data: chartData,
            itemStyle: { color: '#3b82f6' }, // blue-500
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
  }, [data, title]);

  return <div ref={chartRef} className="w-full h-[500px]" />;
};

export default YieldCurveChart;
