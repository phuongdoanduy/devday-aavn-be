import { CartItem } from './CartItem';
import { Product } from './Product';
import { Money } from '../value-objects/Money';

/**
 * Cart aggregate representing a shopping cart
 */
export class Cart {
  constructor(
    public readonly sessionId: string,
    public readonly items: CartItem[]
  ) {
    if (!sessionId || sessionId.trim().length === 0) {
      throw new Error('Session ID is required');
    }
  }

  /**
   * Add item to cart or increase quantity if item exists
   */
  addItem(product: Product, quantity: number): Cart {
    const existingItemIndex = this.items.findIndex(
      item => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      const existingItem = this.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      if (!product.canPurchase(newQuantity)) {
        throw new Error('Cannot add more items: insufficient stock');
      }

      const updatedItem = new CartItem(
        existingItem.id,
        existingItem.productId,
        newQuantity,
        existingItem.sessionId,
        product
      );

      const newItems = [...this.items];
      newItems[existingItemIndex] = updatedItem;

      return new Cart(this.sessionId, newItems);
    } else {
      // New item, add to cart
      if (!product.canPurchase(quantity)) {
        throw new Error('Cannot add item: insufficient stock');
      }

      const newItem = new CartItem(
        0, // ID will be assigned by repository
        product.id,
        quantity,
        this.sessionId,
        product
      );

      return new Cart(this.sessionId, [...this.items, newItem]);
    }
  }

  /**
   * Update quantity of an item
   */
  updateItemQuantity(productId: number, quantity: number): Cart {
    const itemIndex = this.items.findIndex(item => item.productId === productId);

    if (itemIndex < 0) {
      throw new Error('Item not found in cart');
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      return this.removeItem(productId);
    }

    const item = this.items[itemIndex];
    const updatedItem = item.updateQuantity(quantity);

    const newItems = [...this.items];
    newItems[itemIndex] = updatedItem;

    return new Cart(this.sessionId, newItems);
  }

  /**
   * Remove item from cart
   */
  removeItem(productId: number): Cart {
    const itemExists = this.items.some(item => item.productId === productId);

    if (!itemExists) {
      throw new Error('Item not found in cart');
    }

    const newItems = this.items.filter(item => item.productId !== productId);
    return new Cart(this.sessionId, newItems);
  }

  /**
   * Clear all items from cart
   */
  clear(): Cart {
    return new Cart(this.sessionId, []);
  }

  /**
   * Calculate total price of all items
   */
  calculateTotal(): Money {
    if (this.items.length === 0) {
      return new Money(0);
    }

    return this.items.reduce(
      (total, item) => total.add(item.calculateSubtotal()),
      new Money(0)
    );
  }

  /**
   * Get total number of items (sum of quantities)
   */
  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Check if cart has a specific product
   */
  hasItem(productId: number): boolean {
    return this.items.some(item => item.productId === productId);
  }

  /**
   * Check if cart is empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Get item by product ID
   */
  getItem(productId: number): CartItem | null {
    return this.items.find(item => item.productId === productId) || null;
  }

  /**
   * Get quantity of a specific product
   */
  getItemQuantity(productId: number): number {
    const item = this.getItem(productId);
    return item ? item.quantity : 0;
  }

  /**
   * Validate all items in cart (check stock availability)
   */
  validateItems(): { valid: boolean; invalidItems: CartItem[] } {
    const invalidItems = this.items.filter(item => !item.isValid());

    return {
      valid: invalidItems.length === 0,
      invalidItems
    };
  }
}
