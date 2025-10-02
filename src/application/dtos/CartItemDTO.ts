/**
 * Cart Item Data Transfer Object
 */
export interface CartItemDTO {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    stockQuantity: number;
    stockStatus: string;
    isAvailable: boolean;
  };
  subtotal: number;
}
