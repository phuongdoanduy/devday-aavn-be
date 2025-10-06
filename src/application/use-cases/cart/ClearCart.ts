import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

/**
 * Use case: Clear all items from cart
 */
export class ClearCart {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(sessionId: string): Promise<void> {
    // Validate session ID
    if (!sessionId || sessionId.trim().length === 0) {
      throw new Error('Session ID is required');
    }

    // Get all cart items before clearing to restore stock
    const cart = await this.cartRepository.findBySession(sessionId);

    // Restore stock for each item (only if not PRE_ORDER)
    for (const cartItem of cart.items) {
      if (!cartItem.product.isPreOrder()) {
        await this.productRepository.updateStockQuantity(
          cartItem.productId,
          cartItem.quantity
        );
      }
    }

    // Clear cart
    await this.cartRepository.clearCart(sessionId);
  }
}
