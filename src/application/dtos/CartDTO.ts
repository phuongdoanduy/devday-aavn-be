import { CartItemDTO } from './CartItemDTO';

/**
 * Cart Data Transfer Object
 */
export interface CartDTO {
  sessionId: string;
  items: CartItemDTO[];
  total: number;
  itemCount: number;
}
