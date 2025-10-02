import { Rating } from '../value-objects/Rating';
import { Money } from '../value-objects/Money';
import { StockStatus, StockStatusRules } from '../enums/StockStatus';

export class Product {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly image: string,
    public readonly price: Money,
    public readonly tags: string[],
    public readonly rating: Rating,
    public readonly background: string,
    public readonly backgroundImg: string | undefined = undefined,
    public readonly isAI: boolean = false,
    public readonly stockQuantity: number = 100,
    public readonly stockStatus: StockStatus = StockStatus.IN_STOCK
  ) {
    // Validate stock quantity
    if (stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
  }

  isFeatured(): boolean {
    return this.tags.includes('Season Choice');
  }

  hasTag(tag: string): boolean {
    return this.tags.includes(tag);
  }

  matchesCategory(categoryId: string): boolean {
    return this.tags.includes(categoryId);
  }

  matchesSearch(query: string): boolean {
    return this.name.toLowerCase().includes(query.toLowerCase());
  }

  /**
   * Check if product is available for purchase
   */
  isAvailable(): boolean {
    return StockStatusRules.canPurchase(this.stockStatus) && this.stockQuantity > 0;
  }

  /**
   * Check if product stock is running low
   */
  isLowStock(): boolean {
    return this.stockStatus === StockStatus.LOW_STOCK;
  }

  /**
   * Check if product is out of stock
   */
  isOutOfStock(): boolean {
    return this.stockStatus === StockStatus.OUT_OF_STOCK || this.stockQuantity === 0;
  }

  /**
   * Check if product is available for pre-order
   */
  isPreOrder(): boolean {
    return this.stockStatus === StockStatus.PRE_ORDER;
  }

  /**
   * Check if requested quantity can be purchased
   */
  canPurchase(requestedQuantity: number): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    // For pre-orders, allow any quantity
    if (this.isPreOrder()) {
      return requestedQuantity > 0;
    }

    // For regular stock, check if enough quantity available
    return requestedQuantity > 0 && requestedQuantity <= this.stockQuantity;
  }

  /**
   * Get remaining stock quantity
   */
  getRemainingStock(): number {
    return this.stockQuantity;
  }

  /**
   * Check if stock status matches the actual quantity
   */
  hasAccurateStockStatus(): boolean {
    const expectedStatus = StockStatusRules.fromQuantity(this.stockQuantity);
    // Pre-order status is manually set, so we don't validate it
    if (this.stockStatus === StockStatus.PRE_ORDER) {
      return true;
    }
    return this.stockStatus === expectedStatus;
  }
}
