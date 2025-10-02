/**
 * Stock status enumeration representing product availability states
 */
export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  PRE_ORDER = 'PRE_ORDER'
}

/**
 * Type guard to check if a string is a valid StockStatus
 */
export function isStockStatus(value: string): value is StockStatus {
  return Object.values(StockStatus).includes(value as StockStatus);
}

/**
 * Business rules for stock status
 */
export const StockStatusRules = {
  LOW_STOCK_THRESHOLD: 20,

  /**
   * Determine stock status based on quantity
   */
  fromQuantity(quantity: number): StockStatus {
    if (quantity === 0) {
      return StockStatus.OUT_OF_STOCK;
    } else if (quantity <= this.LOW_STOCK_THRESHOLD) {
      return StockStatus.LOW_STOCK;
    }
    return StockStatus.IN_STOCK;
  },

  /**
   * Check if products can be purchased for a given status
   */
  canPurchase(status: StockStatus): boolean {
    return status === StockStatus.IN_STOCK ||
           status === StockStatus.LOW_STOCK ||
           status === StockStatus.PRE_ORDER;
  }
};
