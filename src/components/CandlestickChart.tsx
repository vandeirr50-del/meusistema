import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { CandlestickData, SmartMoneyConcept, SmartMoneyConceptType } from '../types/market';

interface CandlestickChartProps {
  data: CandlestickData[];
  title?: string;
  height?: number;
  smartMoneyData?: SmartMoneyConcept[];
  showSmartMoney?: boolean;
  isFullScreen?: boolean;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
  data, 
  title = 'Gráfico Candlestick',
  height = 400,
  smartMoneyData = [],
  showSmartMoney = false,
  isFullScreen = false
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      chartInstance.current = echarts.init(chartRef.current, isFullScreen ? 'dark' : undefined);

      const dates = data.map(item => item.time);
      const candlestickData = data.map(item => [item.open, item.close, item.low, item.high]);
      const volumeData = data.map((item, index) => {
        const color = data[index].close > data[index].open ? '#22c55e' : '#ef4444';
        return { value: item.volume, itemStyle: { color } };
      });

      // CORREÇÃO: A estrutura de dados para `markArea` foi refeita para seguir o padrão do ECharts,
      // aplicando estilos individualmente e evitando o erro que deixava o gráfico em branco.
      const smcMarkAreaData = showSmartMoney ? smartMoneyData.flatMap(smc => {
        const colors: Record<SmartMoneyConceptType, string> = {
          'FVG': 'rgba(139, 92, 246, 0.2)', // violet-500
          'Bullish OB': 'rgba(34, 197, 94, 0.15)', // green-500
          'Bearish OB': 'rgba(239, 68, 68, 0.15)', // red-500
        };
        const labelColor = colors[smc.type].replace(/0\.\d+/, '0.7');

        const startIndex = dates.indexOf(smc.timeStart);
        if (startIndex === -1 || startIndex >= dates.length - 1) {
          return []; // Retorna array vazio para ser removido pelo flatMap
        }
        const nextTime = dates[startIndex + 1];
        
        const y1 = Math.max(smc.priceStart, smc.priceEnd);
        const y2 = Math.min(smc.priceStart, smc.priceEnd);

        return [[
            {
                name: smc.type,
                xAxis: smc.timeStart,
                yAxis: y1,
                itemStyle: { color: colors[smc.type] },
                label: {
                    show: true,
                    position: 'insideTopLeft',
                    formatter: smc.type,
                    color: '#fff',
                    fontSize: 10,
                    backgroundColor: labelColor,
                    padding: [2, 4],
                    borderRadius: 4,
                }
            },
            {
                xAxis: nextTime,
                yAxis: y2
            }
        ]];
      }) : [];

      const option: echarts.EChartsOption = {
        backgroundColor: isFullScreen ? '#111827' : 'transparent',
        title: {
          text: title,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isFullScreen ? '#D1D5DB' : '#1F2937'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          backgroundColor: isFullScreen ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255,255,255,0.8)',
          borderColor: isFullScreen ? '#4B5563' : '#E5E7EB',
          textStyle: { color: isFullScreen ? '#F9FAFB' : '#1F2937' },
          formatter: (params: any) => {
            const dataIndex = params[0].dataIndex;
            const item = data[dataIndex];
            return `
              <div>
                <strong>${item.time}</strong><br/>
                Abertura: R$ ${item.open.toFixed(2)}<br/>
                Máxima: R$ ${item.high.toFixed(2)}<br/>
                Mínima: R$ ${item.low.toFixed(2)}<br/>
                Fechamento: R$ ${item.close.toFixed(2)}<br/>
                Volume: ${item.volume.toLocaleString('pt-BR')}
              </div>
            `;
          }
        },
        grid: [
          { left: '8%', right: '8%', height: '60%', top: '15%' },
          { left: '8%', right: '8%', top: '80%', height: '15%' }
        ],
        xAxis: [
          { type: 'category', data: dates, scale: true, boundaryGap: false, axisLine: { onZero: false, lineStyle: { color: '#6B7280' } }, splitLine: { show: false }, min: 'dataMin', max: 'dataMax' },
          { type: 'category', gridIndex: 1, data: dates, scale: true, boundaryGap: false, axisLine: { onZero: false }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, min: 'dataMin', max: 'dataMax' }
        ],
        yAxis: [
          { scale: true, splitArea: { show: false }, axisLabel: { formatter: 'R$ {value}', color: '#9CA3AF' }, splitLine: { lineStyle: { color: '#374151' } } },
          { scale: true, gridIndex: 1, splitNumber: 2, axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } }
        ],
        dataZoom: [
          { type: 'inside', xAxisIndex: [0, 1], start: 50, end: 100 },
          { show: true, xAxisIndex: [0, 1], type: 'slider', top: '95%', start: 50, end: 100, handleStyle: { color: '#4B5563' }, dataBackground: { lineStyle: { color: '#4B5563' }, areaStyle: { color: '#374151' } } }
        ],
        series: [
          {
            name: 'Candlestick',
            type: 'candlestick',
            data: candlestickData,
            itemStyle: { 
              color: '#22c55e',      // Verde para alta (close > open)
              color0: '#ef4444',     // Vermelho para baixa (close < open)
              borderColor: '#16a34a', // Borda verde escura para melhor contraste
              borderColor0: '#dc2626' // Borda vermelha escura para melhor contraste
            },
            markArea: {
              data: smcMarkAreaData
            }
          },
          { name: 'Volume', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: volumeData }
        ]
      };

      chartInstance.current.setOption(option, true);

      const handleResize = () => chartInstance.current?.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, [data, title, height, smartMoneyData, showSmartMoney, isFullScreen]);

  return <div ref={chartRef} style={{ width: '100%', height: isFullScreen ? '100%' : `${height}px` }} />;
};

export default CandlestickChart;
