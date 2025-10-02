import { ICartRepository } from '../../../domain/repositories/ICartRepository';
import { Cart } from '../../../domain/entities/Cart';
import { CartItem } from '../../../domain/entities/CartItem';
import { Product } from '../../../domain/entities/Product';
import { Money } from '../../../domain/value-objects/Money';
import { Rating } from '../../../domain/value-objects/Rating';
import { StockStatus } from '../../../domain/enums/StockStatus';
import prisma from '../prisma/client';

/**
 * Cart repository implementation using Prisma
 */
export class CartRepository implements ICartRepository {
  /**
   * Find cart by session ID
   */
  async findBySession(sessionId: string): Promise<Cart> {
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: { product: true },
      orderBy: { createdAt: 'asc' }
    });

    const items = cartItems.map(item => this.toDomain(item));
    return new Cart(sessionId, items);
  }

  /**
   * Add item to cart or increase quantity if exists
   */
  async addItem(sessionId: string, productId: number, quantity: number): Promise<CartItem> {
    // Check if item already exists
    const existing = await prisma.cartItem.findUnique({
      where: {
        productId_sessionId: {
          productId,
          sessionId
        }
      },
      include: { product: true }
    });

    if (existing) {
      // Update quantity (increment)
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true }
      });
      return this.toDomain(updated);
    } else {
      // Create new item
      const created = await prisma.cartItem.create({
        data: {
          sessionId,
          productId,
          quantity
        },
        include: { product: true }
      });
      return this.toDomain(created);
    }
  }

  /**
   * Update item quantity
   */
  async updateItem(sessionId: string, productId: number, quantity: number): Promise<CartItem> {
    const updated = await prisma.cartItem.update({
      where: {
        productId_sessionId: {
          productId,
          sessionId
        }
      },
      data: { quantity },
      include: { product: true }
    });

    return this.toDomain(updated);
  }

  /**
   * Remove item from cart
   */
  async removeItem(sessionId: string, productId: number): Promise<void> {
    await prisma.cartItem.delete({
      where: {
        productId_sessionId: {
          productId,
          sessionId
        }
      }
    });
  }

  /**
   * Clear all items from cart
   */
  async clearCart(sessionId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { sessionId }
    });
  }

  /**
   * Check if item exists in cart
   */
  async itemExists(sessionId: string, productId: number): Promise<boolean> {
    const item = await prisma.cartItem.findUnique({
      where: {
        productId_sessionId: {
          productId,
          sessionId
        }
      }
    });

    return item !== null;
  }

  /**
   * Get specific cart item
   */
  async getItem(sessionId: string, productId: number): Promise<CartItem | null> {
    const item = await prisma.cartItem.findUnique({
      where: {
        productId_sessionId: {
          productId,
          sessionId
        }
      },
      include: { product: true }
    });

    return item ? this.toDomain(item) : null;
  }

  /**
   * Convert Prisma data to domain CartItem entity
   */
  private toDomain(data: any): CartItem {
    const product = new Product(
      data.product.id,
      data.product.name,
      data.product.image,
      new Money(data.product.price),
      data.product.tags,
      new Rating(data.product.rating),
      data.product.background,
      data.product.backgroundImg,
      data.product.isAI,
      data.product.stockQuantity,
      data.product.stockStatus as StockStatus
    );

    return new CartItem(
      data.id,
      data.productId,
      data.quantity,
      data.sessionId,
      product
    );
  }
}
