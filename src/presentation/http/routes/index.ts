import { Router } from 'express';
import { createProductRoutes } from './product.routes';
import { createCartRoutes } from './cart.routes';

export function createRoutes(productController: any, cartController: any): Router {
  const router = Router();

  router.use('/products', createProductRoutes(productController));
  router.use('/cart', createCartRoutes(cartController));

  return router;
}
