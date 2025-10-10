import { IProductRepository, BatchUpdateItem, UpdateProductData } from '../../../domain/repositories/IProductRepository';
import { Product } from '../../../domain/entities/Product';
import { ProductNotFound } from '../../../domain/exceptions/ProductNotFound';
import { InvalidProductDataException, ProductUpdateException } from '../../../domain/exceptions/ProductUpdateException';
import { StockStatus } from '../../../domain/enums/StockStatus';

export class BatchUpdateProducts {
  constructor(private productRepository: IProductRepository) {}

  async execute(updates: BatchUpdateItem[]): Promise<Product[]> {
    if (updates.length === 0) {
      throw new InvalidProductDataException('No updates provided');
    }

    if (updates.length > 50) {
      throw new InvalidProductDataException('Maximum 50 products can be updated at once');
    }

    const productIds = updates.map(u => u.id);
    const uniqueIds = new Set(productIds);
    if (uniqueIds.size !== productIds.length) {
      throw new InvalidProductDataException('Duplicate product IDs found in batch update');
    }

    for (const update of updates) {
      const product = await this.productRepository.findById(update.id, false);
      if (!product) {
        const aiProduct = await this.productRepository.findById(update.id, true);
        if (!aiProduct) {
          throw new ProductNotFound(update.id);
        }
      }

      this.validateUpdateData(update.data);
    }

    try {
      const updatedProducts = await this.productRepository.batchUpdate(updates);
      return updatedProducts;
    } catch (error) {
      throw new ProductUpdateException(`Batch update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
