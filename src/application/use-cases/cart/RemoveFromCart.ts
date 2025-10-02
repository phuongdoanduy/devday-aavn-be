import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { CartItemNotFoundException } from '../../../domain/exceptions/CartExceptions';

/**
 * Use case: Remove item from cart
 */
export class RemoveFromCart {
  constructor(private cartRepository: ICartRepository) {}

  async execute(sessionId: string, productId: number): Promise<void> {
    // Validate session ID
    if (!sessionId || sessionId.trim().length === 0) {
      throw new Error('Session ID is required');
    }

    // Check if item exists
    const exists = await this.cartRepository.itemExists(sessionId, productId);
    if (!exists) {
      throw new CartItemNotFoundException(productId);
    }

    // Remove from cart
    await this.cartRepository.removeItem(sessionId, productId);
  }
}
