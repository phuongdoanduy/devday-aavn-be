import { IProductRepository, UpdateProductData } from '../../../domain/repositories/IProductRepository';
import { Product } from '../../../domain/entities/Product';
import { ProductNotFound } from '../../../domain/exceptions/ProductNotFound';
import { InvalidProductDataException } from '../../../domain/exceptions/ProductUpdateException';
import { StockStatus } from '../../../domain/enums/StockStatus';

export class UpdateProduct {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: number, data: UpdateProductData): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id, false);
    if (!existingProduct) {
      const aiProduct = await this.productRepository.findById(id, true);
      if (!aiProduct) {
        throw new ProductNotFound(id);
      }
    }

    this.validateUpdateData(data);

    const updatedProduct = await this.productRepository.update(id, data);

    if (!updatedProduct) {
      throw new ProductNotFound(id);
    }

    return updatedProduct;
  }

  private validateUpdateData(data: UpdateProductData): void {
    if (data.price !== undefined && data.price <= 0) {
      throw new InvalidProductDataException('Price must be greater than 0');
    }

    if (data.rating !== undefined && (data.rating < 0 || data.rating > 5)) {
      throw new InvalidProductDataException('Rating must be between 0 and 5');
    }

    if (data.stockQuantity !== undefined && data.stockQuantity < 0) {
      throw new InvalidProductDataException('Stock quantity cannot be negative');
    }

    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new InvalidProductDataException('Name cannot be empty');
    }

    if (data.stockQuantity !== undefined && data.stockStatus !== undefined) {
      if (data.stockStatus !== StockStatus.PRE_ORDER) {
        if (data.stockQuantity === 0 && data.stockStatus !== StockStatus.OUT_OF_STOCK) {
          throw new InvalidProductDataException('Stock status must be OUT_OF_STOCK when quantity is 0');
        }
        if (data.stockQuantity > 0 && data.stockQuantity <= 20 && data.stockStatus !== StockStatus.LOW_STOCK) {
          throw new InvalidProductDataException('Stock status should be LOW_STOCK when quantity is 1-20');
        }
        if (data.stockQuantity > 20 && data.stockStatus !== StockStatus.IN_STOCK) {
          throw new InvalidProductDataException('Stock status should be IN_STOCK when quantity is greater than 20');
        }
      }
    }
  }
}
