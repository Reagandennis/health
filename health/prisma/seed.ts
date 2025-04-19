import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.patient.create({
    data: {
      email: 'reaganenochowiti@techgetafrica.com',
      firstName: 'Reagan',
      lastName: 'Enoch',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Male',
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
