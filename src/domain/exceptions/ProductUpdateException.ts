import { DomainException } from './DomainException';

export class ProductUpdateException extends DomainException {
  constructor(message: string) {
    super(message, 'PRODUCT_UPDATE_ERROR');
  }
}

export class InvalidProductDataException extends DomainException {
  constructor(message: string) {
    super(message, 'INVALID_PRODUCT_DATA');
  }
}
