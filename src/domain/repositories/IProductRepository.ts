import { Product } from '../entities/Product';

export interface IProductRepository {
  findAll(isAI: boolean): Promise<Product[]>;
  findById(id: number, isAI: boolean): Promise<Product | null>;
  findByCategory(categoryId: string, isAI: boolean): Promise<Product[]>;
  findByTags(tags: string[], isAI: boolean): Promise<Product[]>;
  findFeatured(isAI: boolean): Promise<Product[]>;
  findTopRated(isAI: boolean): Promise<Product[]>;
  search(query: string, isAI: boolean): Promise<Product[]>;
  updateStockQuantity(productId: number, quantityDelta: number): Promise<Product>;
}
