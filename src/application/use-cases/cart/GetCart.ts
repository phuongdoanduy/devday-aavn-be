import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { Cart } from '../../../domain/entities/Cart';

/**
 * Use case: Get cart items by session ID
 */
export class GetCart {
  constructor(private cartRepository: ICartRepository) {}

  async execute(sessionId: string): Promise<Cart> {
    if (!sessionId || sessionId.trim().length === 0) {
      throw new Error('Session ID is required');
    }

    return await this.cartRepository.findBySession(sessionId);
  }
}
