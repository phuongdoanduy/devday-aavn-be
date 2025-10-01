import { DomainException } from './DomainException';

export class ProductNotFound extends DomainException {
  constructor(productId: number) {
    super(`Product with ID ${productId} not found`, 'PRODUCT_NOT_FOUND');
    this.name = 'ProductNotFound';
  }
}
