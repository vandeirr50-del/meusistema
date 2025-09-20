export interface MoverStock {
  symbol: string;
  price: number;
  changePercent: number;
}

export interface IbovPulseData {
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  positivePercent: number;
  negativePercent: number;
  pressure: number;
  topGainers: MoverStock[];
  topLosers: MoverStock[];
  totalMonitored: number;
  totalPossible: number;
  source: 'real' | 'simulated';
}

export interface DiContract {
  symbol: string;
  rate: number;
  maturityDate: string; // YYYY-MM-DD
}

export interface DiCurveData {
  source: 'real' | 'simulated';
  contracts: DiContract[];
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface SymbolInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  source: 'real' | 'simulated';
}

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'hold';
  description: string;
}

export interface SmartMoneyConcept {
  type: SmartMoneyConceptType;
  timeStart: string;
  priceStart: number;
  priceEnd: number;
}

export type SmartMoneyConceptType = 'FVG' | 'Bullish OB' | 'Bearish OB';

export interface CorrelationData {
  seriesDI: {
    name: string;
    data: [string, number][];
  };
  seriesInstrument: {
    name: string;
    data: [string, number][];
  };
  correlation: number;
  suggestion: string;
  source: 'real' | 'simulated';
}

// NOVO: Tipo para correlação WIN vs WDO
export interface WinWdoCorrelationData {
  seriesWin: {
    name: string;
    data: [string, number][];
  };
  seriesWdo: {
    name: string;
    data: [string, number][];
  };
  correlation: number;
  suggestion: string;
  logic: string;
  signalStrength: 'Baixa' | 'Média' | 'Alta';
  source: 'real' | 'simulated';
}
