import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/mt5Api';
import { DiCurveData } from '../types/market';

export const useDiCurve = () => {
  const [curveData, setCurveData] = useState<DiCurveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mt5Connected, setMt5Connected] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(false);

  const checkConnectionAndFetch = useCallback(async () => {
    if(!loading) setLoading(true);
    try {
      const health = await apiService.checkHealth();
      setBackendAvailable(true);
      setMt5Connected(health.mt5_connected);
      
      const data = await apiService.getDiCurve();
      setCurveData(data);

      if (data.source === 'real' && health.mt5_connected) {
         setError(null);
      } else if (data.source === 'simulated' && health.mt5_connected) {
         setError('MT5 conectado, mas usando dados simulados. Verifique os símbolos DI no MT5.');
      } else if (!health.mt5_connected && backendAvailable) {
         setError('MT5 desconectado. Usando dados simulados.');
      }

    } catch (err: any) {
      setBackendAvailable(false);
      setMt5Connected(false);
      setError('⚠️ Backend Python não está rodando. Para dados reais, execute: cd backend && python app.py');
       try {
        const data = await apiService.getDiCurve();
        setCurveData(data);
      } catch (finalErr) {
        console.error("Could not even get simulated DI data", finalErr);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, backendAvailable]);

  useEffect(() => {
    checkConnectionAndFetch();
    const interval = setInterval(checkConnectionAndFetch, 1000); // ATUALIZAÇÃO A CADA 1 SEGUNDO
    return () => clearInterval(interval);
  }, []);

  return {
    curveData,
    loading,
    error,
    mt5Connected,
    backendAvailable,
    refreshData: checkConnectionAndFetch,
  };
};
