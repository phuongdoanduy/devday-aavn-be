import { PrismaClient, StockStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ProductUpdate {
  id: number;
  data: {
    name?: string;
    price?: number;
    stockQuantity?: number;
    stockStatus?: StockStatus;
    tags?: string[];
    rating?: number;
    image?: string;
    background?: string;
    backgroundImg?: string;
    isAI?: boolean;
  };
}

/**
 * Update products from a JSON file
 * JSON format should be an array of { id, data } objects
 */
async function updateFromJson(jsonFilePath: string) {
  try {
    console.log(`Reading updates from: ${jsonFilePath}`);

    // Read and parse JSON file
    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const updates: ProductUpdate[] = JSON.parse(fileContent);

    console.log(`Found ${updates.length} products to update`);

    // Update each product
    for (const update of updates) {
      try {
        const result = await prisma.product.update({
          where: { id: update.id },
          data: update.data,
        });
        console.log(`✓ Updated product ${update.id}: ${result.name}`);
      } catch (error) {
        console.error(`✗ Failed to update product ${update.id}:`, error);
      }
    }

    console.log('All updates processed!');
  } catch (error) {
    console.error('Error reading or processing JSON file:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get JSON file path from command line argument
const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
  console.error('Usage: npm run update:json <path-to-json-file>');
  console.error('\nExample JSON format:');
  console.error(JSON.stringify([
    {
      id: 1,
      data: {
        name: 'Updated Product',
        price: 99.99,
        stockQuantity: 50,
      },
    },
  ], null, 2));
  process.exit(1);
}

updateFromJson(jsonFilePath)
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
