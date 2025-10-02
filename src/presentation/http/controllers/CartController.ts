import { Request, Response } from 'express';
import { GetCart } from '../../../application/use-cases/cart/GetCart';
import { AddToCart } from '../../../application/use-cases/cart/AddToCart';
import { UpdateCartItem } from '../../../application/use-cases/cart/UpdateCartItem';
import { RemoveFromCart } from '../../../application/use-cases/cart/RemoveFromCart';
import { ClearCart } from '../../../application/use-cases/cart/ClearCart';
import { CartMapper } from '../../../application/mappers/CartMapper';
import { CartItemMapper } from '../../../application/mappers/CartItemMapper';
import { ApiResponse } from '../../responses/ApiResponse';
import { asyncHandler } from '../../../shared/utils/async-handler';

/**
 * Cart controller handling HTTP requests for cart operations
 */
export class CartController {
  constructor(
    private getCart: GetCart,
    private addToCart: AddToCart,
    private updateCartItem: UpdateCartItem,
    private removeFromCart: RemoveFromCart,
    private clearCart: ClearCart
  ) {}

  /**
   * GET /api/cart
   * Get all cart items for the session
   */
  getCartItems = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.sessionId;
    const cart = await this.getCart.execute(sessionId);
    const cartDTO = CartMapper.toDTO(cart);

    res.json(ApiResponse.success(cartDTO));
  });

  /**
   * POST /api/cart
   * Add item to cart
   */
  addItem = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.sessionId;
    const { productId, quantity } = req.body;

    const cartItem = await this.addToCart.execute(sessionId, productId, quantity);
    const cartItemDTO = CartItemMapper.toDTO(cartItem);

    res.status(201).json(ApiResponse.success(cartItemDTO, 'Item added to cart'));
  });

  /**
   * PUT /api/cart/:productId
   * Update cart item quantity
   */
  updateItem = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.sessionId;
    const productId = parseInt(req.params.productId, 10);
    const { quantity } = req.body;

    const cartItem = await this.updateCartItem.execute(sessionId, productId, quantity);
    const cartItemDTO = CartItemMapper.toDTO(cartItem);

    res.json(ApiResponse.success(cartItemDTO, 'Cart item updated'));
  });

  /**
   * DELETE /api/cart/:productId
   * Remove item from cart
   */
  removeItem = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.sessionId;
    const productId = parseInt(req.params.productId, 10);

    await this.removeFromCart.execute(sessionId, productId);

    res.json(ApiResponse.success(null, 'Item removed from cart'));
  });

  /**
   * DELETE /api/cart
   * Clear all items from cart
   */
  clearCartItems = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.sessionId;

    await this.clearCart.execute(sessionId);

    res.json(ApiResponse.success(null, 'Cart cleared'));
  });

  /**
   * GET /api/cart/total
   * Get cart total and item count
   */
  getTotal = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.sessionId;
    const cart = await this.getCart.execute(sessionId);

    res.json(
      ApiResponse.success({
        total: cart.calculateTotal().amount,
        itemCount: cart.getItemCount()
      })
    );
  });
}
