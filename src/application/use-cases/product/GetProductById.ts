import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Product } from '../../../domain/entities/Product';
import { ProductNotFound } from '../../../domain/exceptions/ProductNotFound';

export class GetProductById {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: number, isAI: boolean = false): Promise<Product> {
    const product = await this.productRepository.findById(id, isAI);

    if (!product) {
      throw new ProductNotFound(id);
    }

    return product;
  }
}
