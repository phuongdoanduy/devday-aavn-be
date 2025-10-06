import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { CartItem } from '../../../domain/entities/CartItem';
import { ProductNotFound } from '../../../domain/exceptions/ProductNotFound';
import { InsufficientStockException, InvalidQuantityException, ProductNotAvailableException } from '../../../domain/exceptions/CartExceptions';

/**
 * Use case: Add item to cart
 */
export class AddToCart {
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

    // Validate product exists
    const product = await this.productRepository.findById(productId, false);
    if (!product) {
      throw new ProductNotFound(productId);
    }

    // Check if product is available
    if (!product.isAvailable() && !product.isPreOrder()) {
      throw new ProductNotAvailableException(productId);
    }

    // Check if enough stock (considering existing cart quantity)
    const existingItem = await this.cartRepository.getItem(sessionId, productId);
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (!product.canPurchase(totalQuantity)) {
      throw new InsufficientStockException(
        `Cannot add ${quantity} more items. Available: ${product.getRemainingStock()}, Already in cart: ${existingItem?.quantity || 0}`
      );
    }

    // Decrement stock quantity (only if not PRE_ORDER)
    if (!product.isPreOrder()) {
      await this.productRepository.updateStockQuantity(productId, -quantity);
    }

    // Add to cart
    return await this.cartRepository.addItem(sessionId, productId, quantity);
  }
}
