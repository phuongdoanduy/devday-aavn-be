import { PrismaClient, StockStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function updateProducts() {
  try {
    console.log('Starting product updates...');

    // Example 1: Update a specific product by ID
    const updatedProduct = await prisma.product.update({
      where: { id: 1 },
      data: {
        name: 'Updated Product Name',
        price: 99.99,
        stockQuantity: 50,
        stockStatus: StockStatus.IN_STOCK,
      },
    });
    console.log('Updated product:', updatedProduct);

    // Example 2: Update multiple products matching a condition
    const bulkUpdate = await prisma.product.updateMany({
      where: {
        stockQuantity: {
          lte: 10, // Less than or equal to 10
        },
      },
      data: {
        stockStatus: StockStatus.LOW_STOCK,
      },
    });
    console.log(`Updated ${bulkUpdate.count} products to LOW_STOCK status`);

    // Example 3: Update products with specific tags
    const tagUpdate = await prisma.product.updateMany({
      where: {
        tags: {
          has: 'sale', // Products with 'sale' tag
        },
      },
      data: {
        price: {
          multiply: 0.8, // 20% discount
        },
      },
    });
    console.log(`Applied discount to ${tagUpdate.count} products`);

    // Example 4: Set all out of stock products
    const outOfStock = await prisma.product.updateMany({
      where: {
        stockQuantity: 0,
      },
      data: {
        stockStatus: StockStatus.OUT_OF_STOCK,
      },
    });
    console.log(`Marked ${outOfStock.count} products as OUT_OF_STOCK`);

    console.log('Product updates completed successfully!');
  } catch (error) {
    console.error('Error updating products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateProducts()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
