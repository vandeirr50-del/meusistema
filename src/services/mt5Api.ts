import axios from 'axios';
import { IbovPulseData, DiCurveData, StockData, CandlestickData, TechnicalIndicator, CorrelationData, SymbolInfo, WinWdoCorrelationData } from '../types/market';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private static instance: ApiService;
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }
  
  constructor() {
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          console.error('🔌 Backend não está rodando em:', API_BASE_URL);
        }
        return Promise.reject(error);
      }
    );
  }

  async checkHealth(): Promise<{ status: string; mt5_connected: boolean }> {
    try {
      const response = await this.apiClient.get('/health');
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Backend não está rodando.');
      }
      throw new Error('Erro ao verificar status da API');
    }
  }

  async getIbovPulse(): Promise<IbovPulseData> {
    const response = await this.apiClient.get('/ibov-pulse');
    return response.data;
  }

  async getDiCurve(): Promise<DiCurveData> {
    const response = await this.apiClient.get('/di-curve');
    return response.data;
  }

  async getTradableStocks(): Promise<StockData[]> {
    const response = await this.apiClient.get('/tradable-stocks');
    return response.data;
  }

  async getCandlestickData(symbol: string, timeframe: string): Promise<CandlestickData[]> {
    const response = await this.apiClient.get(`/candlestick/${symbol}/${timeframe}`);
    return response.data;
  }
  
  async getCorrelationData(instrument: 'WIN' | 'WDO'): Promise<CorrelationData> {
    const response = await this.apiClient.get(`/correlation/${instrument}`);
    return response.data;
  }

  async getSymbolInfo(symbol: string): Promise<SymbolInfo> {
    const response = await this.apiClient.get(`/symbol-info/${symbol}`);
    return response.data;
  }

  // NOVO: Busca dados de correlação WIN vs WDO
  async getWinWdoCorrelation(): Promise<WinWdoCorrelationData> {
    const response = await this.apiClient.get('/win-wdo-correlation');
    return response.data;
  }

  async getTechnicalIndicators(symbol: string): Promise<TechnicalIndicator[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [
      { name: 'RSI (14)', value: Math.random() * 70 + 15, signal: 'hold', description: 'Índice de Força Relativa' },
      { name: 'MACD', value: Math.random() * 2 - 1, signal: 'buy', description: 'Convergência/Divergência de Médias Móveis' },
    ];
  }
}

export const apiService = ApiService.getInstance();
