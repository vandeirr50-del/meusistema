import { faker } from '@faker-js/faker';
import { StockData, CandlestickData, TechnicalIndicator, MarketSentiment } from '../types/market';

// Simulação de dados do Yahoo Finance para demonstração
export class MarketDataService {
  private static instance: MarketDataService;
  private lastPrices: Map<string, number> = new Map();

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  // Simula dados de ações brasileiras populares no day trade
  private getPopularBrazilianStocks(): string[] {
    return ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3', 'MGLU3', 'WEGE3', 'SUZB3', 'RENT3', 'GGBR4'];
  }

  public async getStockData(symbol: string): Promise<StockData> {
    // Simula uma chamada para API do Yahoo Finance
    await new Promise(resolve => setTimeout(resolve, faker.number.int({ min: 100, max: 500 })));
    
    const lastPrice = this.lastPrices.get(symbol) || faker.number.float({ min: 10, max: 100, fractionDigits: 2 });
    const change = faker.number.float({ min: -5, max: 5, fractionDigits: 2 });
    const newPrice = Math.max(0.01, lastPrice + change);
    
    this.lastPrices.set(symbol, newPrice);

    return {
      symbol,
      name: this.getStockName(symbol),
      price: newPrice,
      change,
      changePercent: (change / lastPrice) * 100,
      volume: faker.number.int({ min: 100000, max: 10000000 }),
      marketCap: faker.number.int({ min: 1000000000, max: 100000000000 }),
      high52Week: newPrice * faker.number.float({ min: 1.2, max: 2.5, fractionDigits: 2 }),
      low52Week: newPrice * faker.number.float({ min: 0.3, max: 0.8, fractionDigits: 2 })
    };
  }

  public async getMultipleStocks(): Promise<StockData[]> {
    const symbols = this.getPopularBrazilianStocks();
    const promises = symbols.map(symbol => this.getStockData(symbol));
    return Promise.all(promises);
  }

  public async getCandlestickData(symbol: string, days: number = 30): Promise<CandlestickData[]> {
    const data: CandlestickData[] = [];
    const basePrice = faker.number.float({ min: 20, max: 80, fractionDigits: 2 });
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const open = i === days ? basePrice : data[data.length - 1]?.close || basePrice;
      const volatility = faker.number.float({ min: 0.02, max: 0.08, fractionDigits: 4 });
      const change = faker.number.float({ min: -volatility, max: volatility, fractionDigits: 4 });
      
      const close = Math.max(0.01, open * (1 + change));
      const high = Math.max(open, close) * faker.number.float({ min: 1, max: 1.05, fractionDigits: 4 });
      const low = Math.min(open, close) * faker.number.float({ min: 0.95, max: 1, fractionDigits: 4 });

      data.push({
        time: date.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: faker.number.int({ min: 50000, max: 2000000 })
      });
    }
    
    return data;
  }

  public async getTechnicalIndicators(symbol: string): Promise<TechnicalIndicator[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      {
        name: 'RSI (14)',
        value: faker.number.float({ min: 20, max: 80, fractionDigits: 1 }),
        signal: faker.helpers.arrayElement(['buy', 'sell', 'hold']),
        description: 'Índice de Força Relativa'
      },
      {
        name: 'MACD',
        value: faker.number.float({ min: -2, max: 2, fractionDigits: 3 }),
        signal: faker.helpers.arrayElement(['buy', 'sell', 'hold']),
        description: 'Convergência e Divergência de Médias Móveis'
      },
      {
        name: 'SMA 20',
        value: faker.number.float({ min: 30, max: 70, fractionDigits: 2 }),
        signal: faker.helpers.arrayElement(['buy', 'sell', 'hold']),
        description: 'Média Móvel Simples 20 períodos'
      },
      {
        name: 'Bollinger %B',
        value: faker.number.float({ min: 0, max: 1, fractionDigits: 3 }),
        signal: faker.helpers.arrayElement(['buy', 'sell', 'hold']),
        description: 'Posição nas Bandas de Bollinger'
      }
    ];
  }

  public async getMarketSentiment(): Promise<MarketSentiment> {
    const bullish = faker.number.int({ min: 20, max: 60 });
    const bearish = faker.number.int({ min: 15, max: 40 });
    const neutral = 100 - bullish - bearish;

    return { bullish, bearish, neutral };
  }

  private getStockName(symbol: string): string {
    const names: Record<string, string> = {
      'PETR4': 'Petrobras PN',
      'VALE3': 'Vale ON',
      'ITUB4': 'Itaú Unibanco PN',
      'BBDC4': 'Bradesco PN',
      'ABEV3': 'Ambev ON',
      'MGLU3': 'Magazine Luiza ON',
      'WEGE3': 'WEG ON',
      'SUZB3': 'Suzano ON',
      'RENT3': 'Localiza ON',
      'GGBR4': 'Gerdau PN'
    };
    return names[symbol] || symbol;
  }
}
