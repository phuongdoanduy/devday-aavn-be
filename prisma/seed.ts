import { PrismaClient, StockStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Generate stock data based on product ID for variety
function getStockData(productId: number): { stockQuantity: number; stockStatus: StockStatus } {
  // Create different stock scenarios for variety
  const scenarios = [
    productId % 17 === 0, // OUT_OF_STOCK
    productId % 13 === 0, // LOW_STOCK
    productId % 23 === 0, // PRE_ORDER
  ];

  if (scenarios[0]) {
    return { stockQuantity: 0, stockStatus: StockStatus.OUT_OF_STOCK };
  } else if (scenarios[1]) {
    return { stockQuantity: 10 + (productId % 10), stockStatus: StockStatus.LOW_STOCK };
  } else if (scenarios[2]) {
    return { stockQuantity: 0, stockStatus: StockStatus.PRE_ORDER };
  } else {
    // Most products are in stock with good quantity
    return { stockQuantity: 50 + (productId % 150), stockStatus: StockStatus.IN_STOCK };
  }
}

// Load Cloudinary image URLs from Products_assets.json
function loadCloudinaryImages(): string[] {
  const assetsPath = path.join(__dirname, '..', 'Products_assets.json');
  const assetsData = fs.readFileSync(assetsPath, 'utf-8');
  const assets = JSON.parse(assetsData);
  return assets.resources.map((resource: any) => resource.secure_url);
}

// Get random image from array using seeded randomness based on ID
function getRandomImage(images: string[], seed: number): string {
  const index = seed % images.length;
  return images[index];
}

// Assign product images randomly
function assignProductImages(productId: number, images: string[]): { image: string; backgroundImg?: string } {
  const imageIndex = (productId * 7) % images.length;
  const bgIndex = (productId * 13) % images.length;

  return {
    image: images[imageIndex],
    backgroundImg: images[bgIndex]
  };
}

async function main() {
  console.log('Starting seed...');

  // Load Cloudinary images
  const cloudinaryImages = loadCloudinaryImages();
  console.log(`Loaded ${cloudinaryImages.length} Cloudinary images`);

  // Seed categories
  console.log('Seeding categories...');
  await prisma.category.createMany({
    data: [
      { id: 'xmas', label: 'Xmas' },
      { id: 'candy', label: 'Candy' },
      { id: 'monster', label: 'Monster' },
      { id: 'camping', label: 'Camping' },
      { id: 'sporty', label: 'Sporty' }
    ],
    skipDuplicates: true
  });

  // Seed regular products
  console.log('Seeding regular products...');
  const products = [
    {
      id: 100,
      name: "Xmas Globin",
      price: 3.12,
      tags: ['xmas', 'candy', 'queen', 'Season Choice'],
      rating: 4.5,
      background: "#49B649",
      isAI: false
    },
    {
      id: 101,
      name: "City Hunter",
      price: 2.15,
      tags: ['monster', 'hunter', 'sporty'],
      rating: 4.5,
      background: "#AF2A3A",
      isAI: false
    },
    {
      id: 102,
      name: "Cosy Student",
      price: 1.63,
      tags: ['king', 'student', 'blue', 'sporty'],
      rating: 4.5,
      background: "#E1BF47",
      isAI: false
    },
    {
      id: 103,
      name: "Baby Boy",
      price: 9.30,
      tags: ['sporty', 'blue'],
      rating: 4.5,
      background: "#4962B6",
      isAI: false
    },
    {
      id: 104,
      name: "Active Summer",
      price: 4.8,
      tags: ['sporty', 'summer', 'Season Choice'],
      rating: 4.5,
      background: "#B69349",
      isAI: false
    },
    {
      id: 105,
      name: "Mystery Landlord",
      price: 2.58,
      tags: ['monster', 'landlord', 'Season Choice'],
      rating: 4.5,
      background: "#954AB1",
      isAI: false
    },
    {
      id: 106,
      name: "Sporty Friend",
      price: 1.2,
      tags: ['sporty', 'friend', 'blue'],
      rating: 4.5,
      background: "#1E82A3",
      isAI: false
    },
    {
      id: 107,
      name: "Halloween Cuties",
      price: 12.6,
      tags: ['queen', 'Season Choice', 'halloween', 'monster'],
      rating: 4.5,
      background: "#BE0B88",
      isAI: false
    },
    {
      id: 108,
      name: "Let's go camping",
      price: 7.75,
      tags: ['camping', 'sporty', 'Season Choice'],
      rating: 4.5,
      background: "#A5B649",
      isAI: false
    },
    {
      id: 109,
      name: "Study hard",
      price: 10.1,
      tags: ['student', 'sporty', 'boy', 'blue'],
      rating: 4.5,
      background: "#49ABB6",
      isAI: false
    },
    {
      id: 110,
      name: "Awesome Pumpkin",
      price: 3.6,
      tags: ['halloween', 'monster', 'Season Choice'],
      rating: 4.5,
      background: "#B64957",
      isAI: false
    },
    {
      id: 111,
      name: "Warm cave",
      price: 5.3,
      tags: ['monster', 'cave', 'Season Choice'],
      rating: 4.5,
      background: "#B66649",
      isAI: false
    },
    {
      id: 113,
      name: "Snow man",
      price: 5.3,
      tags: ['snow', 'xmas', 'cold'],
      rating: 4.5,
      background: "#810CC5",
      isAI: false
    },
    {
      id: 114,
      name: "Santa's surprise",
      price: 6.3,
      tags: ['santa', 'xmas', 'gift', 'boy'],
      rating: 4.5,
      background: "#EDBF6B",
      isAI: false
    },
    {
      id: 115,
      name: "Jingle all the slide",
      price: 4.3,
      tags: ['xmas', 'santa', 'sleigh', 'snow', 'sporty'],
      rating: 4.5,
      background: "#9F0000",
      isAI: false
    },
    {
      id: 116,
      name: "Santa Claus is coming",
      price: 5.8,
      tags: ['santa', 'xmas', 'cute'],
      rating: 4.5,
      background: "#A95FA1",
      isAI: false
    },
    {
      id: 117,
      name: "Peter Pan",
      price: 2.58,
      tags: ['camping', 'xmas', 'Season Choice', 'boy'],
      rating: 4.5,
      background: "#C8BD1D",
      isAI: false
    },
    {
      id: 118,
      name: "Santa claus",
      price: 3.2,
      tags: ['xmas', 'santa', 'Season Choice'],
      rating: 4.5,
      background: "#2E71DE",
      isAI: false
    },
    {
      id: 119,
      name: "Sound of love",
      price: 12.6,
      tags: ['baby', 'angel', 'love', 'xmas', 'music'],
      rating: 4.5,
      background: "#179193",
      isAI: false
    },
    {
      id: 120,
      name: "Baby Angel",
      price: 7.5,
      tags: ['xmas', 'baby', 'angel'],
      rating: 4.5,
      background: "#1340BA",
      isAI: false
    },
    {
      id: 121,
      name: "King",
      price: 10.1,
      tags: ['king', 'xmas', 'Season Choice'],
      rating: 4.5,
      background: "#B65749",
      isAI: false
    },
    {
      id: 122,
      name: "Little Red Riding Hood",
      price: 3.6,
      tags: ['Girl', 'student', 'camping', 'xmas'],
      rating: 4.5,
      background: "#1C914A",
      isAI: false
    },
    {
      id: 123,
      name: "Friends Forever",
      price: 5.3,
      tags: ['friend', 'xmas', 'sporty'],
      rating: 5,
      background: "#D3A117",
      isAI: false
    }
  ];

  for (const product of products) {
    const stockData = getStockData(product.id);
    const imageData = assignProductImages(product.id, cloudinaryImages);
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        ...stockData,
        ...imageData
      },
      create: {
        ...product,
        ...imageData,
        ...stockData
      }
    });
  }

  // Seed AI products
  console.log('Seeding AI products...');
  const aiProducts = products.map(p => {
    const aiProductId = p.id + 1000;
    return {
      id: aiProductId,
      name: p.name + " by AI",
      price: p.price,
      tags: p.tags,
      rating: p.rating,
      background: p.background,
      isAI: true
    };
  });

  for (const product of aiProducts) {
    const stockData = getStockData(product.id);
    const imageData = assignProductImages(product.id, cloudinaryImages);
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        ...stockData,
        ...imageData
      },
      create: {
        ...product,
        ...imageData,
        ...stockData
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
