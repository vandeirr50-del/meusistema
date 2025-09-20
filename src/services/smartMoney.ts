import { CandlestickData, SmartMoneyConcept } from '../types/market';

class SmartMoneyService {
  /**
   * Analisa os dados de candlestick para encontrar conceitos de Smart Money.
   * A lógica foi completamente reescrita para ser mais precisa e robusta.
   */
  public analyze(data: CandlestickData[]): SmartMoneyConcept[] {
    if (data.length < 3) return []; // Requer um mínimo de 3 candles para análise
    
    const fvgs = this.findFairValueGaps(data);
    const orderBlocks = this.findOrderBlocks(data);

    return [...fvgs, ...orderBlocks];
  }

  /**
   * Encontra Fair Value Gaps (FVG) ou Imbalances.
   * Um FVG ocorre em um padrão de 3 candles onde há um desequilíbrio de preço.
   */
  private findFairValueGaps(data: CandlestickData[]): SmartMoneyConcept[] {
    const fvgs: SmartMoneyConcept[] = [];

    for (let i = 2; i < data.length; i++) {
      const candleA = data[i - 2]; // Primeiro candle
      const candleB = data[i - 1]; // Candle do meio (onde o gap se forma)
      const candleC = data[i];     // Terceiro candle

      // Bullish FVG: A máxima do candle A é menor que a mínima do candle C.
      if (candleA.high < candleC.low) {
        fvgs.push({
          type: 'FVG',
          timeStart: candleB.time,
          priceStart: candleA.high, // Topo do gap
          priceEnd: candleC.low,    // Fundo do gap
        });
      }

      // Bearish FVG: A mínima do candle A é maior que a máxima do candle C.
      if (candleA.low > candleC.high) {
        fvgs.push({
          type: 'FVG',
          timeStart: candleB.time,
          priceStart: candleA.low,  // Fundo do gap
          priceEnd: candleC.high, // Topo do gap
        });
      }
    }
    return fvgs;
  }

  /**
   * Encontra Order Blocks (OB).
   * Um OB é o último candle de contra-tendência antes de um movimento forte que quebra a estrutura.
   */
  private findOrderBlocks(data: CandlestickData[]): SmartMoneyConcept[] {
    const orderBlocks: SmartMoneyConcept[] = [];

    for (let i = 1; i < data.length; i++) {
      const obCandidate = data[i - 1];
      const move = data[i];

      // Bullish OB: Último candle de BAIXA antes de um movimento de ALTA que quebra a máxima do OB.
      const isBullishOB = 
        obCandidate.close < obCandidate.open && // É um candle de baixa
        move.close > move.open &&             // Seguido por um candle de alta
        move.close > obCandidate.high;        // O movimento de alta rompe a máxima do candidato a OB.

      if (isBullishOB) {
        orderBlocks.push({
          type: 'Bullish OB',
          timeStart: obCandidate.time,
          priceStart: obCandidate.high, // O OB é o range completo do candle
          priceEnd: obCandidate.low,
        });
      }

      // Bearish OB: Último candle de ALTA antes de um movimento de BAIXA que quebra a mínima do OB.
      const isBearishOB = 
        obCandidate.close > obCandidate.open && // É um candle de alta
        move.close < move.open &&             // Seguido por um candle de baixa
        move.close < obCandidate.low;         // O movimento de baixa rompe a mínima do candidato a OB.

      if (isBearishOB) {
        orderBlocks.push({
          type: 'Bearish OB',
          timeStart: obCandidate.time,
          priceStart: obCandidate.high,
          priceEnd: obCandidate.low,
        });
      }
    }
    return orderBlocks;
  }
}

export const smartMoneyService = new SmartMoneyService();
