import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/mt5Api';
import { StockData, CandlestickData, TechnicalIndicator } from '../types/market';

export const useStockAnalysis = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('PETR4');
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [timeframe, setTimeframe] = useState('D1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllStocks = useCallback(async () => {
    try {
      const stocksData = await apiService.getTradableStocks();
      setStocks(stocksData);
    } catch (err) {
      setError('Erro ao buscar lista de ativos.');
      console.error(err);
    }
  }, []);

  const fetchStockDetails = useCallback(async (symbol: string, tf: string) => {
    try {
      setLoading(true);
      const [candleData, indicatorData] = await Promise.all([
        apiService.getCandlestickData(symbol, tf),
        apiService.getTechnicalIndicators(symbol),
      ]);
      setCandlestickData(candleData);
      setTechnicalIndicators(indicatorData);
    } catch (err) {
      setError(`Erro ao buscar detalhes de ${symbol}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStocks();
    const interval = setInterval(fetchAllStocks, 1000); // ATUALIZAÇÃO A CADA 1 SEGUNDO
    return () => clearInterval(interval);
  }, [fetchAllStocks]);

  useEffect(() => {
    if (selectedStock) {
      fetchStockDetails(selectedStock, timeframe);
    }
  }, [selectedStock, timeframe, fetchStockDetails]);
  
  const selectStock = (symbol: string) => {
    setSelectedStock(symbol);
  };

  return {
    stocks,
    selectedStock,
    candlestickData,
    technicalIndicators,
    timeframe,
    loading,
    error,
    selectStock,
    setTimeframe,
    refresh: () => fetchStockDetails(selectedStock, timeframe),
  };
};
