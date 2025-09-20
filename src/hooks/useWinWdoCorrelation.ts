import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/mt5Api';
import { WinWdoCorrelationData } from '../types/market';

export const useWinWdoCorrelation = () => {
  const [data, setData] = useState<WinWdoCorrelationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if(!loading) setLoading(true);
    setError(null);
    try {
      const correlationData = await apiService.getWinWdoCorrelation();
      setData(correlationData);
    } catch (err: any) {
      setError(`Erro ao buscar dados de correlação WIN vs WDO. Verifique o backend.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000); // ATUALIZAÇÃO A CADA 1 SEGUNDO
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refreshData: fetchData };
};
