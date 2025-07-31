// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@kasir.com' },
    update: {},
    create: {
      name: 'Admin Kasir',
      email: 'admin@kasir.com',
      password: hashedPassword,
    },
  });

  const hashedPassword2 = await bcrypt.hash('kasir123', 10);
  await prisma.cashier.upsert({
    where: { email: 'kasir1@kasir.com' },
    update: {},
    create: {
      name: 'Kasir 1',
      email: 'kasir1@mail.com',
      password: hashedPassword2,
    },
  })

  await prisma.product.createMany({
    data: [
      { 
        name: 'Teh Botol', 
        price: 5000, 
        stock: 50, 
        category: 'DRINK', 
        imageUrl: 'https://c.alfagift.id/product/1/1_A12790005980_20200513221105857_base.jpg'},
      { 
        name: 'Indomie Goreng', 
        price: 3000, 
        stock: 100, 
        category: 'FOOD', 
        imageUrl: 'https://image.astronauts.cloud/product-images/2024/4/IndomieGorengSpesialMieinstan1_19ed38d5-421f-4813-bd66-25cf83f1909c_900x900.png'},
      {
        name: "Headset Bluetooth",
        price: 150000,
        stock: 20,
        category: 'ELECTRONICS',
        imageUrl: "https://cworld.id/wp-content/uploads/2023/07/JETE-13-PRO-3.jpg",
      },
      {
        name: "Kaos Polos Hitam",
        price: 50000,
        stock: 30,
        category: 'CLOTHING',
        imageUrl: "https://i.pinimg.com/736x/a3/de/b4/a3deb423a6ac5ff162f43d60a61c6e08.jpg",
      },
      {
        name: "Hand Sanitizer 250ml",
        price: 20000,
        stock: 40,
        category: 'HEALTH',
        imageUrl: "https://image.astronauts.cloud/product-images/2024/4/SoftiesHandSanitizer1_3493f45e-a449-42c1-824a-91ca60d72d09_900x900.jpeg",
      },
      {
        name: "Buku Tulis A5",
        price: 6000,
        stock: 60,
        category: 'STATIONERY',
        imageUrl: "https://image1ws.indotrading.com/s3/productimages/webp/co261211/p1401016/w600-h600/362777ee-54c4-4cfa-b1f4-cef77adbb5c7.jpeg",
      }
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error('Seeding error: ', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
