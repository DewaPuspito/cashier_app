// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@kasir.com' },
    update: {},
    create: {
      name: 'Admin Kasir',
      email: 'admin@kasir.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const cashierPassword = await bcrypt.hash('cashier123', 10);
  await prisma.user.upsert({
    where: { email: 'kasir@kasir.com' },
    update: {},
    create: {
      name: 'Kasir 1',
      email: 'kasir@kasir.com',
      password: cashierPassword,
      role: 'CASHIER',
    },
  });

  await prisma.product.createMany({
    data: [
      { name: 'Teh Botol', price: 5000, stock: 50 },
      { name: 'Indomie Goreng', price: 3000, stock: 100 },
      { name: 'Roti Bakar', price: 7000, stock: 30 },
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
