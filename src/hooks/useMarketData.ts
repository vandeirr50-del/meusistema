import { useState, useEffect, useCallback } from 'react';
import { MarketDataService } from '../services/marketData';
import { StockData, CandlestickData, TechnicalIndicator, MarketSentiment } from '../types/market';

export const useMarketData = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('PETR4');
  const [candlestickData, setCandlestickData] = useState<CandlestickData[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment>({
    bullish: 0,
    bearish: 0,
    neutral: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const marketService = MarketDataService.getInstance();

  const fetchStocks = useCallback(async () => {
    try {
      const stocksData = await marketService.getMultipleStocks();
      setStocks(stocksData);
    } catch (err) {
      setError('Erro ao buscar dados das ações');
      console.error('Error fetching stocks:', err);
    }
  }, [marketService]);

  const fetchCandlestickData = useCallback(async (symbol: string) => {
    try {
      const data = await marketService.getCandlestickData(symbol);
      setCandlestickData(data);
    } catch (err) {
      setError('Erro ao buscar dados do gráfico');
      console.error('Error fetching candlestick data:', err);
    }
  }, [marketService]);

  const fetchTechnicalIndicators = useCallback(async (symbol: string) => {
    try {
      const indicators = await marketService.getTechnicalIndicators(symbol);
      setTechnicalIndicators(indicators);
    } catch (err) {
      setError('Erro ao buscar indicadores técnicos');
      console.error('Error fetching technical indicators:', err);
    }
  }, [marketService]);

  const fetchMarketSentiment = useCallback(async () => {
    try {
      const sentiment = await marketService.getMarketSentiment();
      setMarketSentiment(sentiment);
    } catch (err) {
      setError('Erro ao buscar sentimento do mercado');
      console.error('Error fetching market sentiment:', err);
    }
  }, [marketService]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchStocks(),
        fetchCandlestickData(selectedStock),
        fetchTechnicalIndicators(selectedStock),
        fetchMarketSentiment()
      ]);
    } catch (err) {
      setError('Erro ao carregar dados do mercado');
    } finally {
      setLoading(false);
    }
  }, [selectedStock, fetchStocks, fetchCandlestickData, fetchTechnicalIndicators, fetchMarketSentiment]);

  const refreshData = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  const selectStock = useCallback((symbol: string) => {
    setSelectedStock(symbol);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    fetchCandlestickData(selectedStock);
    fetchTechnicalIndicators(selectedStock);
  }, [selectedStock, fetchCandlestickData, fetchTechnicalIndicators]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStocks();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStocks]);

  return {
    stocks,
    selectedStock,
    candlestickData,
    technicalIndicators,
    marketSentiment,
    loading,
    error,
    refreshData,
    selectStock
  };
};
