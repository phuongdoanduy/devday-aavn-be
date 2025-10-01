import { IProductRepository } from '@domain/repositories/IProductRepository';
import { Product } from '@domain/entities/Product';

export class GetFeaturedProducts {
  constructor(private productRepository: IProductRepository) {}

  async execute(isAI: boolean = false): Promise<Product[]> {
    return await this.productRepository.findFeatured(isAI);
  }
}
