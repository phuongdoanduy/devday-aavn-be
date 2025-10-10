import { Product } from '../entities/Product';
import { StockStatus } from '../enums/StockStatus';

export interface UpdateProductData {
  name?: string;
  image?: string;
  price?: number;
  tags?: string[];
  rating?: number;
  background?: string;
  backgroundImg?: string;
  isAI?: boolean;
  stockQuantity?: number;
  stockStatus?: StockStatus;
}

export interface BatchUpdateItem {
  id: number;
  data: UpdateProductData;
}

export interface IProductRepository {
  findAll(isAI: boolean): Promise<Product[]>;
  findById(id: number, isAI: boolean): Promise<Product | null>;
  findByCategory(categoryId: string, isAI: boolean): Promise<Product[]>;
  findByTags(tags: string[], isAI: boolean): Promise<Product[]>;
  findFeatured(isAI: boolean): Promise<Product[]>;
  findTopRated(isAI: boolean): Promise<Product[]>;
  search(query: string, isAI: boolean): Promise<Product[]>;
  updateStockQuantity(productId: number, quantityDelta: number): Promise<Product>;
  update(id: number, data: UpdateProductData): Promise<Product | null>;
  batchUpdate(updates: BatchUpdateItem[]): Promise<Product[]>;
}
