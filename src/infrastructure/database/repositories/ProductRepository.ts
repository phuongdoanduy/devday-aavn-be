import { IProductRepository } from '@domain/repositories/IProductRepository';
import { Product } from '@domain/entities/Product';
import { Money } from '@domain/value-objects/Money';
import { Rating } from '@domain/value-objects/Rating';
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
      data.isAI
    );
  }
}
