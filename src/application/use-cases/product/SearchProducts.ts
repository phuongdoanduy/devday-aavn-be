import { IProductRepository } from '@domain/repositories/IProductRepository';
import { Product } from '@domain/entities/Product';

export class SearchProducts {
  constructor(private productRepository: IProductRepository) {}

  async execute(query: string, isAI: boolean = false): Promise<Product[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    return await this.productRepository.search(query.trim(), isAI);
  }
}
