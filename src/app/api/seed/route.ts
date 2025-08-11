import { faker } from '@faker-js/faker';
import prisma from '@/lib/prisma';

export async function POST() {
  const billsData = Array.from({ length: 100 }).map(() => ({
    date: faker.date.past().toISOString(), // Random past date as ISO string
    name: faker.person.fullName(),
    address: faker.location.streetAddress(),
    panNumber: faker.string.alphanumeric(10).toUpperCase(),
    GSTINumber: faker.string.alphanumeric(15).toUpperCase(),
    totalAmount: parseFloat(faker.finance.amount({ min: 100, max: 50000, dec: 2 })),
  }));

  await prisma.bill.createMany({
    data: billsData,
  });

  console.log('✅ Seeded 100 bills successfully');
    return new Response('Seeded 100 bills successfully', { status: 200 });
}