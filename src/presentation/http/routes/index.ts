import { Router } from 'express';
import { createProductRoutes } from './product.routes';

export function createRoutes(productController: any): Router {
  const router = Router();

  router.use('/products', createProductRoutes(productController));

  return router;
}
