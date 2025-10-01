import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { asyncHandler } from '../../../shared/utils/async-handler';

export function createProductRoutes(controller: ProductController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.getAll));
  router.get('/featured', asyncHandler(controller.getFeatured));
  router.get('/top-rated', asyncHandler(controller.getTopRated));
  router.get('/:id', asyncHandler(controller.getById));

  return router;
}
