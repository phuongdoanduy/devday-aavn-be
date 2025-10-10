import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { asyncHandler } from '../../../shared/utils/async-handler';
import { validate } from '../middleware/validate';
import { updateProductSchema, batchUpdateProductsSchema } from '../validators/product.validator';

export function createProductRoutes(controller: ProductController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.getAll));
  router.get('/featured', asyncHandler(controller.getFeatured));
  router.get('/top-rated', asyncHandler(controller.getTopRated));
  router.patch('/batch', validate(batchUpdateProductsSchema), asyncHandler(controller.batchUpdate));
  router.get('/:id', asyncHandler(controller.getById));
  router.put('/:id', validate(updateProductSchema), asyncHandler(controller.update));

  return router;
}
