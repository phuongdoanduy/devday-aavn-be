import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { sessionMiddleware } from '../middleware/session';
import { validate } from '../middleware/validate';
import { addToCartSchema, updateCartItemSchema, removeCartItemSchema } from '../validators/cart.validator';

/**
 * Create cart routes
 */
export function createCartRoutes(cartController: CartController): Router {
  const router = Router();

  // Apply session middleware to all cart routes
  router.use(sessionMiddleware);

  // GET /api/cart/total - Get cart total (must be before /:productId)
  router.get('/total', cartController.getTotal);

  // GET /api/cart - Get cart items
  router.get('/', cartController.getCartItems);

  // POST /api/cart - Add item to cart
  router.post('/', validate(addToCartSchema), cartController.addItem);

  // PUT /api/cart/:productId - Update item quantity
  router.put('/:productId', validate(updateCartItemSchema), cartController.updateItem);

  // DELETE /api/cart/:productId - Remove item
  router.delete('/:productId', validate(removeCartItemSchema), cartController.removeItem);

  // DELETE /api/cart - Clear cart (must be after /:productId)
  router.delete('/', cartController.clearCartItems);

  return router;
}
