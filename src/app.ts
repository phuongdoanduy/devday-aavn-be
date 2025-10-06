import express from 'express';
import helmet from 'helmet';
import { config } from './infrastructure/config/env.config';
import { corsMiddleware } from './presentation/http/middleware/cors';
import { errorHandler } from './presentation/http/middleware/error-handler';
import { createRoutes } from './presentation/http/routes';

// Dependency Injection Setup
import { ProductRepository } from './infrastructure/database/repositories/ProductRepository';
import { CartRepository } from './infrastructure/database/repositories/CartRepository';

import { GetAllProducts } from './application/use-cases/product/GetAllProducts';
import { GetProductById } from './application/use-cases/product/GetProductById';
import { GetFeaturedProducts } from './application/use-cases/product/GetFeaturedProducts';
import { SearchProducts } from './application/use-cases/product/SearchProducts';

import { GetCart } from './application/use-cases/cart/GetCart';
import { AddToCart } from './application/use-cases/cart/AddToCart';
import { UpdateCartItem } from './application/use-cases/cart/UpdateCartItem';
import { RemoveFromCart } from './application/use-cases/cart/RemoveFromCart';
import { ClearCart } from './application/use-cases/cart/ClearCart';

import { ProductController } from './presentation/http/controllers/ProductController';
import { CartController } from './presentation/http/controllers/CartController';

function setupDependencies() {
  // Repositories
  const productRepo = new ProductRepository();
  const cartRepo = new CartRepository();

  // Product Use Cases
  const getAllProducts = new GetAllProducts(productRepo);
  const getProductById = new GetProductById(productRepo);
  const getFeaturedProducts = new GetFeaturedProducts(productRepo);
  const searchProducts = new SearchProducts(productRepo);

  // Cart Use Cases
  const getCart = new GetCart(cartRepo);
  const addToCart = new AddToCart(cartRepo, productRepo);
  const updateCartItem = new UpdateCartItem(cartRepo, productRepo);
  const removeFromCart = new RemoveFromCart(cartRepo, productRepo);
  const clearCart = new ClearCart(cartRepo, productRepo);

  // Controllers
  const productController = new ProductController(
    getAllProducts,
    getProductById,
    getFeaturedProducts,
    searchProducts
  );

  const cartController = new CartController(
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  );

  return { productController, cartController };
}

// Express App
const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup dependencies and routes
const { productController, cartController } = setupDependencies();
app.use('/api', createRoutes(productController, cartController));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🛍️  Products API: http://localhost:${PORT}/api/products`);
  console.log(`🛒 Cart API: http://localhost:${PORT}/api/cart`);
});

export default app;
