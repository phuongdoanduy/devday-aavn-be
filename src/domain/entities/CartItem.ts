import { Product } from './Product';
import { Money } from '../value-objects/Money';

/**
 * CartItem entity representing an item in the shopping cart
 */
export class CartItem {
  constructor(
    public readonly id: number,
    public readonly productId: number,
    public readonly quantity: number,
    public readonly sessionId: string,
    public readonly product: Product
  ) {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    if (!Number.isInteger(quantity)) {
      throw new Error('Quantity must be an integer');
    }
  }

  /**
   * Calculate subtotal for this cart item (quantity × price)
   */
  calculateSubtotal(): Money {
    return this.product.price.multiply(this.quantity);
  }

  /**
   * Create a new CartItem with updated quantity
   */
  updateQuantity(newQuantity: number): CartItem {
    if (newQuantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    if (!this.product.canPurchase(newQuantity)) {
      throw new Error('Insufficient stock for requested quantity');
    }

    return new CartItem(
      this.id,
      this.productId,
      newQuantity,
      this.sessionId,
      this.product
    );
  }

  /**
   * Check if quantity can be increased
   */
  canIncrease(additionalQuantity: number = 1): boolean {
    const newQuantity = this.quantity + additionalQuantity;
    return this.product.canPurchase(newQuantity);
  }

  /**
   * Check if quantity can be decreased
   */
  canDecrease(): boolean {
    return this.quantity > 1;
  }

  /**
   * Check if the cart item is valid
   */
  isValid(): boolean {
    return this.quantity >= 1 && this.product.canPurchase(this.quantity);
  }

  /**
   * Check if the product is still available
   */
  isProductAvailable(): boolean {
    return this.product.isAvailable();
  }

  /**
   * Get warning if stock is low
   */
  getStockWarning(): string | null {
    if (this.product.isOutOfStock()) {
      return 'Product is out of stock';
    }

    if (this.product.isLowStock()) {
      return `Only ${this.product.getRemainingStock()} items left in stock`;
    }

    if (this.product.isPreOrder()) {
      return 'This is a pre-order item';
    }

    return null;
  }
}
