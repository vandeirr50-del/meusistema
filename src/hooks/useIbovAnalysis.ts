import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/mt5Api';
import { SymbolInfo, CandlestickData, TechnicalIndicator } from '../types/market';

export const useIbovAnalysis = () => {
  const [symbolInfo, setSymbolInfo] = useState<SymbolInfo | null>(null);
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [timeframe, setTimeframe] = useState('D1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (tf: string) => {
    if(!loading) setLoading(true);
    setError(null);
    try {
      const [info, candles, indicators] = await Promise.all([
        apiService.getSymbolInfo('IBOV'),
        apiService.getCandlestickData('IBOV', tf),
        apiService.getTechnicalIndicators('IBOV'),
      ]);
      setSymbolInfo(info);
      setCandlestickData(candles);
      setTechnicalIndicators(indicators);
    } catch (err) {
      setError('Erro ao buscar dados do IBOV. Verifique o backend e a conexão MT5.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchData(timeframe);
    const interval = setInterval(() => fetchData(timeframe), 1000); // ATUALIZAÇÃO A CADA 1 SEGUNDO
    return () => clearInterval(interval);
  }, [timeframe, fetchData]);

  return {
    symbolInfo,
    candlestickData,
    technicalIndicators,
    timeframe,
    loading,
    error,
    setTimeframe,
    refresh: () => fetchData(timeframe),
  };
};
