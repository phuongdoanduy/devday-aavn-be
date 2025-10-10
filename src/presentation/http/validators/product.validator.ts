import { z } from 'zod';

const stockStatusEnum = z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'PRE_ORDER']);

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Product ID must be a number')
  }),
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    image: z.string().url('Image must be a valid URL').optional(),
    price: z.number().positive('Price must be greater than 0').optional(),
    tags: z.array(z.string()).optional(),
    rating: z.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5').optional(),
    background: z.string().optional(),
    backgroundImg: z.string().url('Background image must be a valid URL').optional(),
    isAI: z.boolean().optional(),
    stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative').optional(),
    stockStatus: stockStatusEnum.optional()
  }).refine(
    data => {
      if (data.stockQuantity !== undefined && data.stockStatus !== undefined) {
        if (data.stockStatus !== 'PRE_ORDER') {
          if (data.stockQuantity === 0 && data.stockStatus !== 'OUT_OF_STOCK') {
            return false;
          }
          if (data.stockQuantity > 0 && data.stockQuantity <= 20 && data.stockStatus !== 'LOW_STOCK') {
            return false;
          }
          if (data.stockQuantity > 20 && data.stockStatus !== 'IN_STOCK') {
            return false;
          }
        }
      }
      return true;
    },
    {
      message: 'Stock status must match stock quantity'
    }
  )
});

export const batchUpdateProductsSchema = z.object({
  body: z.object({
    updates: z.array(
      z.object({
        id: z.number().int().positive('Product ID must be a positive integer'),
        data: z.object({
          name: z.string().min(1, 'Name cannot be empty').optional(),
          image: z.string().url('Image must be a valid URL').optional(),
          price: z.number().positive('Price must be greater than 0').optional(),
          tags: z.array(z.string()).optional(),
          rating: z.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5').optional(),
          background: z.string().optional(),
          backgroundImg: z.string().url('Background image must be a valid URL').optional(),
          isAI: z.boolean().optional(),
          stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative').optional(),
          stockStatus: stockStatusEnum.optional()
        }).refine(
          data => {
            if (data.stockQuantity !== undefined && data.stockStatus !== undefined) {
              if (data.stockStatus !== 'PRE_ORDER') {
                if (data.stockQuantity === 0 && data.stockStatus !== 'OUT_OF_STOCK') {
                  return false;
                }
                if (data.stockQuantity > 0 && data.stockQuantity <= 20 && data.stockStatus !== 'LOW_STOCK') {
                  return false;
                }
                if (data.stockQuantity > 20 && data.stockStatus !== 'IN_STOCK') {
                  return false;
                }
              }
            }
            return true;
          },
          {
            message: 'Stock status must match stock quantity'
          }
        )
      })
    ).min(1, 'At least one product update is required').max(50, 'Maximum 50 products can be updated at once')
  })
});
