import { Product } from '../../domain/entities/Product';
import { ProductDTO } from '../dtos/ProductDTO';

export class ProductMapper {
  static toDTO(product: Product): ProductDTO {
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price.amount,
      tags: product.tags,
      rating: product.rating.value,
      background: product.background,
      backgroundImg: product.backgroundImg
    };
  }

  static toDTOList(products: Product[]): ProductDTO[] {
    return products.map(this.toDTO);
  }
}
