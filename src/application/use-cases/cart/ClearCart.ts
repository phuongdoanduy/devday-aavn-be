import { ICartRepository } from '../../../domain/repositories/ICartRepository';

/**
 * Use case: Clear all items from cart
 */
export class ClearCart {
  constructor(private cartRepository: ICartRepository) {}

  async execute(sessionId: string): Promise<void> {
    // Validate session ID
    if (!sessionId || sessionId.trim().length === 0) {
      throw new Error('Session ID is required');
    }

    // Clear cart
    await this.cartRepository.clearCart(sessionId);
  }
}
