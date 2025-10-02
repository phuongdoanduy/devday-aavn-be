import { Cart } from '../../domain/entities/Cart';
import { CartDTO } from '../dtos/CartDTO';
import { CartItemMapper } from './CartItemMapper';

/**
 * Mapper for Cart entity to DTO
 */
export class CartMapper {
  static toDTO(cart: Cart): CartDTO {
    return {
      sessionId: cart.sessionId,
      items: CartItemMapper.toDTOList(cart.items),
      total: cart.calculateTotal().amount,
      itemCount: cart.getItemCount()
    };
  }
}
