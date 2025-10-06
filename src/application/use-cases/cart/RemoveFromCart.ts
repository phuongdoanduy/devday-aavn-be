import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { CartItemNotFoundException } from '../../../domain/exceptions/CartExceptions';

/**
 * Use case: Remove item from cart
 */
export class RemoveFromCart {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(sessionId: string, productId: number): Promise<void> {
    // Validate session ID
    if (!sessionId || sessionId.trim().length === 0) {
      throw new Error('Session ID is required');
    }

    // Get the cart item to retrieve quantity and product info
    const cartItem = await this.cartRepository.getItem(sessionId, productId);
    if (!cartItem) {
      throw new CartItemNotFoundException(productId);
    }

    // Restore stock quantity (only if not PRE_ORDER)
    if (!cartItem.product.isPreOrder()) {
      await this.productRepository.updateStockQuantity(productId, cartItem.quantity);
    }

    // Remove from cart
    await this.cartRepository.removeItem(sessionId, productId);
  }
}
