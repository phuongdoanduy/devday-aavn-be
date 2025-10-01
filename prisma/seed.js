const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

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
      image: "/images/100.png",
      price: 3.12,
      tags: ['xmas', 'candy', 'queen', 'Season Choice'],
      rating: 4.5,
      background: "#49B649",
      isAI: false
    },
    {
      id: 101,
      name: "City Hunter",
      image: "/images/101.png",
      price: 2.15,
      tags: ['monster', 'hunter', 'sporty'],
      rating: 4.5,
      background: "#AF2A3A",
      isAI: false
    },
    {
      id: 102,
      name: "Cosy Student",
      image: "/images/102.png",
      price: 1.63,
      tags: ['king', 'student', 'blue', 'sporty'],
      rating: 4.5,
      background: "#E1BF47",
      isAI: false
    },
    {
      id: 103,
      name: "Baby Boy",
      image: "/images/103.png",
      price: 9.30,
      tags: ['sporty', 'blue'],
      rating: 4.5,
      background: "#4962B6",
      isAI: false
    },
    {
      id: 104,
      name: "Active Summer",
      image: "/images/104.png",
      price: 4.8,
      tags: ['sporty', 'summer', 'Season Choice'],
      rating: 4.5,
      background: "#B69349",
      isAI: false
    },
    {
      id: 105,
      name: "Mystery Landlord",
      image: "/images/105.png",
      price: 2.58,
      tags: ['monster', 'landlord', 'Season Choice'],
      rating: 4.5,
      background: "#954AB1",
      isAI: false
    },
    {
      id: 106,
      name: "Sporty Friend",
      image: "/images/106.png",
      price: 1.2,
      tags: ['sporty', 'friend', 'blue'],
      rating: 4.5,
      background: "#1E82A3",
      isAI: false
    },
    {
      id: 107,
      name: "Halloween Cuties",
      image: "/images/107.png",
      price: 12.6,
      tags: ['queen', 'Season Choice', 'halloween', 'monster'],
      rating: 4.5,
      background: "#BE0B88",
      isAI: false
    },
    {
      id: 108,
      name: "Let's go camping",
      image: "/images/108.png",
      price: 7.75,
      tags: ['camping', 'sporty', 'Season Choice'],
      rating: 4.5,
      background: "#A5B649",
      isAI: false
    },
    {
      id: 109,
      name: "Study hard",
      image: "/images/109.png",
      price: 10.1,
      tags: ['student', 'sporty', 'boy', 'blue'],
      rating: 4.5,
      background: "#49ABB6",
      isAI: false
    },
    {
      id: 110,
      name: "Awesome Pumpkin",
      image: "/images/110.png",
      price: 3.6,
      tags: ['halloween', 'monster', 'Season Choice'],
      rating: 4.5,
      background: "#B64957",
      isAI: false
    },
    {
      id: 111,
      name: "Warm cave",
      image: "/images/111.png",
      price: 5.3,
      tags: ['monster', 'cave', 'Season Choice'],
      rating: 4.5,
      background: "#B66649",
      isAI: false
    },
    {
      id: 113,
      name: "Snow man",
      image: "/images/113.png",
      price: 5.3,
      tags: ['snow', 'xmas', 'cold'],
      rating: 4.5,
      background: "#810CC5",
      isAI: false
    },
    {
      id: 114,
      name: "Santa's surprise",
      image: "/images/114.png",
      price: 6.3,
      tags: ['santa', 'xmas', 'gift', 'boy'],
      rating: 4.5,
      background: "#EDBF6B",
      isAI: false
    },
    {
      id: 115,
      name: "Jingle all the slide",
      image: "/images/115.png",
      price: 4.3,
      tags: ['xmas', 'santa', 'sleigh', 'snow', 'sporty'],
      rating: 4.5,
      background: "#9F0000",
      isAI: false
    },
    {
      id: 116,
      name: "Santa Claus is coming",
      image: "/images/116.png",
      price: 5.8,
      tags: ['santa', 'xmas', 'cute'],
      rating: 4.5,
      background: "#A95FA1",
      isAI: false
    },
    {
      id: 117,
      name: "Peter Pan",
      image: "/images/117.png",
      price: 2.58,
      tags: ['camping', 'xmas', 'Season Choice', 'boy'],
      rating: 4.5,
      background: "#C8BD1D",
      isAI: false
    },
    {
      id: 118,
      name: "Santa claus",
      image: "/images/118.png",
      price: 3.2,
      tags: ['xmas', 'santa', 'Season Choice'],
      rating: 4.5,
      background: "#2E71DE",
      isAI: false
    },
    {
      id: 119,
      name: "Sound of love",
      image: "/images/119.png",
      price: 12.6,
      tags: ['baby', 'angel', 'love', 'xmas', 'music'],
      rating: 4.5,
      background: "#179193",
      isAI: false
    },
    {
      id: 120,
      name: "Baby Angel",
      image: "/images/120.png",
      price: 7.5,
      tags: ['xmas', 'baby', 'angel'],
      rating: 4.5,
      background: "#1340BA",
      isAI: false
    },
    {
      id: 121,
      name: "King",
      image: "/images/121.png",
      price: 10.1,
      tags: ['king', 'xmas', 'Season Choice'],
      rating: 4.5,
      background: "#B65749",
      isAI: false
    },
    {
      id: 122,
      name: "Little Red Riding Hood",
      image: "/images/122.png",
      price: 3.6,
      tags: ['Girl', 'student', 'camping', 'xmas'],
      rating: 4.5,
      background: "#1C914A",
      isAI: false
    },
    {
      id: 123,
      name: "Friends Forever",
      image: "/images/123.png",
      price: 5.3,
      tags: ['friend', 'xmas', 'sporty'],
      rating: 5,
      background: "#D3A117",
      isAI: false
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product
    });
  }

  // Seed AI products
  console.log('Seeding AI products...');
  const aiProducts = products.map(p => {
    const urlBG = (p.id === 100 || (p.id > 112 && p.id < 124))
      ? `/images/xmas-bg/${p.id}.png`
      : `/images/xmas-bg/${p.id - 100}.jpg`;

    return {
      id: p.id + 1000,
      name: p.name + " by AI",
      image: p.image,
      price: p.price,
      tags: p.tags,
      rating: p.rating,
      background: p.background,
      backgroundImg: urlBG,
      isAI: true
    };
  });

  for (const product of aiProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product
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
