import { DomainException } from './DomainException';

/**
 * Exception thrown when an invalid quantity is provided
 */
export class InvalidQuantityException extends DomainException {
  constructor(message: string = 'Invalid quantity provided') {
    super(message, 'INVALID_QUANTITY');
    this.name = 'InvalidQuantityException';
  }
}

/**
 * Exception thrown when there is insufficient stock
 */
export class InsufficientStockException extends DomainException {
  constructor(message: string = 'Insufficient stock available') {
    super(message, 'INSUFFICIENT_STOCK');
    this.name = 'InsufficientStockException';
  }
}

/**
 * Exception thrown when a cart item is not found
 */
export class CartItemNotFoundException extends DomainException {
  constructor(productId: number) {
    super(`Cart item with product ID ${productId} not found`, 'CART_ITEM_NOT_FOUND');
    this.name = 'CartItemNotFoundException';
  }
}

/**
 * Exception thrown when an invalid session ID is provided
 */
export class InvalidSessionException extends DomainException {
  constructor(message: string = 'Invalid or missing session ID') {
    super(message, 'INVALID_SESSION');
    this.name = 'InvalidSessionException';
  }
}

/**
 * Exception thrown when a product is not available for purchase
 */
export class ProductNotAvailableException extends DomainException {
  constructor(productId: number) {
    super(`Product ${productId} is not available for purchase`, 'PRODUCT_NOT_AVAILABLE');
    this.name = 'ProductNotAvailableException';
  }
}
