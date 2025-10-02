import { Cart } from '../entities/Cart';
import { CartItem } from '../entities/CartItem';

/**
 * Cart repository interface defining data access operations
 */
export interface ICartRepository {
  /**
   * Find cart by session ID
   */
  findBySession(sessionId: string): Promise<Cart>;

  /**
   * Add item to cart or increase quantity if exists
   */
  addItem(sessionId: string, productId: number, quantity: number): Promise<CartItem>;

  /**
   * Update item quantity
   */
  updateItem(sessionId: string, productId: number, quantity: number): Promise<CartItem>;

  /**
   * Remove item from cart
   */
  removeItem(sessionId: string, productId: number): Promise<void>;

  /**
   * Clear all items from cart
   */
  clearCart(sessionId: string): Promise<void>;

  /**
   * Check if item exists in cart
   */
  itemExists(sessionId: string, productId: number): Promise<boolean>;

  /**
   * Get specific cart item
   */
  getItem(sessionId: string, productId: number): Promise<CartItem | null>;
}
