import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const billsData = Array.from({ length: 100 }).map(() => ({
    date: faker.date.past().toISOString(), // Random past date as ISO string
    name: faker.person.fullName(),
    address: faker.location.streetAddress(),
    panNumber: faker.string.alphanumeric(10).toUpperCase(),
    GSTINumber: faker.string.alphanumeric(15).toUpperCase(),
    billNumber: faker.number.int({ min: 1000, max: 9999 }).toString(),
    totalAmount: parseFloat(faker.finance.amount({ min: 100, max: 50000, dec: 2 })),
  }));

  await prisma.bill.createMany({
    data: billsData,
  });

  console.log('✅ Seeded 100 bills successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
