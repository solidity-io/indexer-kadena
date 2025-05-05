const DIA_PRICE_CACHE_TTL = parseInt(process.env.DIA_PRICE_CACHE_TTL || '300000', 10); // Default 5 minutes
const DIA_ORACLE_MODULE = 'n_bfb76eab37bf8c84359d6552a1d96a309e030b71.dia-oracle';

export class PriceService {
  private static instance: PriceService;
  private kdaUsdPrice: number | undefined;
  private lastPriceUpdate: number = 0;

  private constructor() {}

  public static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }
    return PriceService.instance;
  }

  public getKdaUsdPrice(): number | undefined {
    // Check if price is stale
    if (this.kdaUsdPrice && Date.now() - this.lastPriceUpdate > DIA_PRICE_CACHE_TTL) {
      this.kdaUsdPrice = undefined;
    }
    return this.kdaUsdPrice;
  }

  public setKdaUsdPrice(price: number): void {
    this.kdaUsdPrice = price;
    this.lastPriceUpdate = Date.now();
  }

  public processDiaPriceUpdate(eventData: {
    module: { namespace: string };
    name: string;
    params: string;
  }) {
    if (eventData.module.namespace === DIA_ORACLE_MODULE && eventData.name === 'UPDATE') {
      try {
        const params = JSON.parse(eventData.params);
        if (params[0] === 'KDA/USD') {
          const price = params[2] as number;
          if (price && price > 0) {
            this.setKdaUsdPrice(price);
            console.log(`[INFO][PRICE] Updated KDA/USD price from DIA oracle to: $${price}`);
          }
        }
      } catch (error) {
        console.error('[ERROR][PRICE] Failed to process DIA oracle price update:', error);
      }
    }
  }

  public calculateTokenPrice(tokenAmount: number, tokenDecimals: number = 12): number | undefined {
    const kdaUsdPrice = this.getKdaUsdPrice();
    if (kdaUsdPrice === undefined) return undefined;

    // Convert token amount to human readable format and multiply by KDA/USD price
    return (tokenAmount / Math.pow(10, tokenDecimals)) * kdaUsdPrice;
  }
}
