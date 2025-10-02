import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { CartItem } from '../../../domain/entities/CartItem';
import { ProductNotFound } from '../../../domain/exceptions/ProductNotFound';
import { CartItemNotFoundException, InsufficientStockException, InvalidQuantityException } from '../../../domain/exceptions/CartExceptions';

/**
 * Use case: Update cart item quantity
 */
export class UpdateCartItem {
  constructor(
    private cartRepository: ICartRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(sessionId: string, productId: number, quantity: number): Promise<CartItem> {
    // Validate session ID
    if (!sessionId || sessionId.trim().length === 0) {
      throw new Error('Session ID is required');
    }

    // Validate quantity
    if (quantity < 1 || !Number.isInteger(quantity)) {
      throw new InvalidQuantityException('Quantity must be a positive integer');
    }

    if (quantity > 100) {
      throw new InvalidQuantityException('Maximum quantity per item is 100');
    }

    // Check if item exists in cart
    const existingItem = await this.cartRepository.getItem(sessionId, productId);
    if (!existingItem) {
      throw new CartItemNotFoundException(productId);
    }

    // Validate product still exists
    const product = await this.productRepository.findById(productId, false);
    if (!product) {
      throw new ProductNotFound(productId);
    }

    // Check stock availability
    if (!product.canPurchase(quantity)) {
      throw new InsufficientStockException(
        `Cannot update to ${quantity} items. Available: ${product.getRemainingStock()}`
      );
    }

    // Update cart item
    return await this.cartRepository.updateItem(sessionId, productId, quantity);
  }
}
