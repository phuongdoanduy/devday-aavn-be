import { CartItem } from '../../domain/entities/CartItem';
import { CartItemDTO } from '../dtos/CartItemDTO';

/**
 * Mapper for CartItem entity to DTO
 */
export class CartItemMapper {
  static toDTO(cartItem: CartItem): CartItemDTO {
    return {
      id: cartItem.id,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      product: {
        id: cartItem.product.id,
        name: cartItem.product.name,
        price: cartItem.product.price.amount,
        image: cartItem.product.image,
        stockQuantity: cartItem.product.stockQuantity,
        stockStatus: cartItem.product.stockStatus,
        isAvailable: cartItem.product.isAvailable()
      },
      subtotal: cartItem.calculateSubtotal().amount
    };
  }

  static toDTOList(cartItems: CartItem[]): CartItemDTO[] {
    return cartItems.map(this.toDTO);
  }
}
