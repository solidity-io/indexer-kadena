import NodeCache = require('node-cache');

export class PriceService {
  private static instance: PriceService;
  private cache: NodeCache;
  private readonly KDA_USD_KEY = 'KDA_USD_PRICE';

  private constructor() {
    this.cache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL
  }

  public static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }
    return PriceService.instance;
  }

  public setKdaUsdPrice(price: number): void {
    this.cache.set(this.KDA_USD_KEY, price);
  }

  public getKdaUsdPrice(): number | undefined {
    return this.cache.get<number>(this.KDA_USD_KEY);
  }

  public calculateTokenPrice(tokenAmount: number, tokenDecimals: number = 12): number | undefined {
    const kdaUsdPrice = this.getKdaUsdPrice();
    if (kdaUsdPrice === undefined) return undefined;

    // Convert token amount to human readable format and multiply by KDA/USD price
    return (tokenAmount / Math.pow(10, tokenDecimals)) * kdaUsdPrice;
  }
}
