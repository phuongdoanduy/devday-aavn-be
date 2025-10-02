import { z } from 'zod';

/**
 * Validation schema for adding item to cart
 */
export const addToCartSchema = z.object({
  body: z.object({
    productId: z.number().int().positive('Product ID must be a positive integer'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Maximum quantity is 100')
  })
});

/**
 * Validation schema for updating cart item
 */
export const updateCartItemSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^\d+$/, 'Product ID must be a number')
  }),
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Maximum quantity is 100')
  })
});

/**
 * Validation schema for removing cart item
 */
export const removeCartItemSchema = z.object({
  params: z.object({
    productId: z.string().regex(/^\d+$/, 'Product ID must be a number')
  })
});
