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
      { name: 'Pisang Cavendish', price: 25000, stock: 50, category: 'FRUITS', imageUrl: 'https://halofresh.co.id/wp-content/uploads/2024/05/Pisang-Cavendish-Halofresh.jpg' },
      { name: 'Bayam Segar', price: 5000, stock: 40, category: 'VEGETABLES', imageUrl: 'https://nilaigizi.com/assets/images/produk/produk_1577340474.jpg' },
      { name: 'Sarden ABC 155g', price: 12000, stock: 30, category: 'CANNED_GOODS', imageUrl: 'https://yoline.co.id/media/products/ProductSardinesintomato_abc_155gr.png' },
      { name: 'Ultra Milk Full Cream 1L', price: 18000, stock: 25, category: 'DAIRY', imageUrl: 'https://rajasusu.com/wp-content/uploads/2023/01/ULTRA-MILK-FULL-CREAM-1000-ML.jpg' },
      { name: 'Daging Sapi Has Dalam', price: 95000, stock: 20, category: 'MEAT', imageUrl: 'https://cdn.shopify.com/s/files/1/0573/8476/3576/files/8._Has_Dalam_Tenderloin.webp?v=1732169384' },
      { name: 'Udang Vaname Segar', price: 85000, stock: 15, category: 'SEAFOOD', imageUrl: 'https://kontainerindonesia.co.id/blog/wp-content/uploads/2023/05/6-Cara-Ekspor-Udang-Segar-dengan-Mudah-untuk-Pemula.jpg' },
      { name: 'Sosis Kanzler Beef 500g', price: 45000, stock: 25, category: 'DELI', imageUrl: 'https://paxelmarket.co/wp-content/uploads/2022/05/knzl-beef-500.jpg' },
      { name: 'Kecap Bango Manis 520ml', price: 23000, stock: 30, category: 'CONDIMENTS_SPICES', imageUrl: 'https://assets.unileversolutions.com/v1/60490408.png' },
      { name: 'Chitato Sapi Panggang 68g', price: 8500, stock: 40, category: 'SNACKS', imageUrl: 'https://solvent-production.s3.amazonaws.com/media/images/products/2021/03/1398a.jpg' },
      { name: 'Roti Tawar Sari Roti 350g', price: 15000, stock: 35, category: 'BREAD_AND_BAKERY', imageUrl: 'https://down-id.img.susercontent.com/file/sg-11134201-22120-50qqy8fxgskvba' },
      { name: 'Teh Botol Sosro 450ml', price: 5000, stock: 50, category: 'BEVERAGES', imageUrl: 'https://c.alfagift.id/product/1/1_A12790005980_20200513221105857_base.jpg' },
      { name: 'Beras Ramos 5kg', price: 70000, stock: 20, category: 'PASTA_RICE_CEREAL', imageUrl: 'https://c.alfagift.id/product/1/1_A7873190002167_20221207095643586_base.jpg' },
      { name: 'Tepung Segitiga Biru 1kg', price: 14000, stock: 25, category: 'BAKING', imageUrl: 'https://c.alfagift.id/product/1/1_A28090001915_20220829102607550_base.jpg' },
      { name: 'Nugget So Good Original 500g', price: 35000, stock: 20, category: 'FROZEN_FOODS', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs19EcW9L2tKpv53fj5dVJ8aB5neIlnorpiQ&s' },
      { name: 'Shampoo Pantene 340ml', price: 35000, stock: 30, category: 'PERSONAL_CARE', imageUrl: 'https://images.tokopedia.net/img/cache/500-square/product-1/2018/6/13/10847525/10847525_5540cc7e-67eb-4bb8-a708-5a5206520cf1_1000_1000.jpg' },
      { name: 'Vitamin C You C1000 140ml', price: 9000, stock: 40, category: 'HEALTH_CARE', imageUrl: 'https://c.alfagift.id/product/1/1_A12740003809_20231027091600300_base.jpg' },
      { name: 'Detergen Rinso 770g', price: 22000, stock: 25, category: 'HOUSEHOLD', imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//103/MTA-92409375/rinso_rinso_powder_detergen_-770_g-_full06_0f6bcb22.jpg' },
      { name: 'Pampers Premium Care S 40 pcs', price: 140000, stock: 15, category: 'BABY_ITEMS', imageUrl: 'https://images.tokopedia.net/img/cache/250-square/product-1/2020/2/13/170646583/170646583_55df69ec-2fd7-4621-970f-73c45e2c2cc5_640_640.jpg' },
      { name: 'Whiskas Adult Tuna 1.2kg', price: 85000, stock: 10, category: 'PET_SUPPLIES', imageUrl: 'https://cdn.onemars.net/sites/whiskas_id_xGoUJ_mwh5/image/whiskas-3d-1-2kg-fop-adult-tuna-2_1713962971851_1720686678842_1723469010343.png' },
      { name: 'Oli Top 1 Evolution 1L', price: 75000, stock: 15, category: 'AUTOMOTIVE', imageUrl: 'https://media.monotaro.id/mid01/big/Otomotif%2C%20Truk%20%26%20Sepeda%20Motor/Onderdil%2C%20Aksesoris%20Motor/Oli%2C%20Bahan%20Kimia%2C%20Perbaikan%20Motor/Oli/TOP%20One%20Evolution%20MC/TOP%20One%20Evolution%20MC%2010W-30%20Bottle%20Natural%201000ml%201pc/hhS030464629-1.jpg' },
      { name: 'Headphone Sony WH-1000XM4', price: 4500000, stock: 5, category: 'ELECTRONICS', imageUrl: 'https://www.sony.co.id/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF' },
      { name: 'Bola Sepak Adidas Tango', price: 350000, stock: 10, category: 'SPORTS_OUTDOORS', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Adidas_Tango.jpg' },
      { name: 'Lego Classic 11005', price: 450000, stock: 8, category: 'TOYS', imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//101/MTA-3309688/lego_lego-classic-11005-creative-fun_full05.jpg' },
      { name: 'Pulpen Pilot G2 0.5mm', price: 15000, stock: 30, category: 'STATIONERIES', imageUrl: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2020/9/5/49948062-5ff6-4fb2-8da4-0e5c3b1cbaa0.jpg' },
      { name: 'Kaos Polos Uniqlo', price: 149000, stock: 20, category: 'CLOTHING', imageUrl: 'https://down-id.img.susercontent.com/file/id-11134207-7r992-lxmb48z25doq25' }
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
