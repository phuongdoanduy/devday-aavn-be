import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Product } from '../../../domain/entities/Product';
import { Money } from '../../../domain/value-objects/Money';
import { Rating } from '../../../domain/value-objects/Rating';
import { StockStatus } from '../../../domain/enums/StockStatus';
import prisma from '../prisma/client';

export class ProductRepository implements IProductRepository {
  async findAll(isAI: boolean): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { isAI }
    });

    return products.map(this.toDomain);
  }

  async findById(id: number, isAI: boolean): Promise<Product | null> {
    const product = await prisma.product.findFirst({
      where: { id, isAI }
    });

    return product ? this.toDomain(product) : null;
  }

  async findByCategory(categoryId: string, isAI: boolean): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isAI,
        tags: {
          has: categoryId
        }
      }
    });

    return products.map(this.toDomain);
  }

  async findByTags(tags: string[], isAI: boolean): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isAI,
        tags: {
          hasSome: tags
        }
      }
    });

    return products.map(this.toDomain);
  }

  async findFeatured(isAI: boolean): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isAI,
        tags: {
          has: 'Season Choice'
        }
      }
    });

    return products.map(this.toDomain);
  }

  async findTopRated(isAI: boolean): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isAI,
        rating: {
          gte: 5
        }
      }
    });

    return products.map(this.toDomain);
  }

  async search(query: string, isAI: boolean): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        isAI,
        name: {
          contains: query,
          mode: 'insensitive'
        }
      }
    });

    return products.map(this.toDomain);
  }

  async updateStockQuantity(productId: number, quantityDelta: number): Promise<Product> {
    // Get current product to calculate new stock
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!currentProduct) {
      throw new Error(`Product with id ${productId} not found`);
    }

    // Calculate new stock quantity
    const newStockQuantity = currentProduct.stockQuantity + quantityDelta;

    // Prevent negative stock
    if (newStockQuantity < 0) {
      throw new Error(`Cannot update stock: resulting quantity would be negative (current: ${currentProduct.stockQuantity}, delta: ${quantityDelta})`);
    }

    // Determine new stock status based on quantity (unless it's a PRE_ORDER)
    let newStockStatus = currentProduct.stockStatus;
    if (currentProduct.stockStatus !== 'PRE_ORDER') {
      if (newStockQuantity === 0) {
        newStockStatus = 'OUT_OF_STOCK';
      } else if (newStockQuantity <= 20) {
        newStockStatus = 'LOW_STOCK';
      } else {
        newStockStatus = 'IN_STOCK';
      }
    }

    // Update product with new stock quantity and status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: newStockQuantity,
        stockStatus: newStockStatus
      }
    });

    return this.toDomain(updatedProduct);
  }

  private toDomain(data: any): Product {
    return new Product(
      data.id,
      data.name,
      data.image,
      new Money(data.price),
      data.tags,
      new Rating(data.rating),
      data.background,
      data.backgroundImg,
      data.isAI,
      data.stockQuantity,
      data.stockStatus as StockStatus
    );
  }
}
