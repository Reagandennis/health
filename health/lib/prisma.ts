import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Add this debug logging
const prismaClient = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Log available models
console.log('Prisma Client Models:', Object.keys(prismaClient));

export const prisma = globalForPrisma.prisma || prismaClient;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Debugging: Log the Prisma client and available models
console.log('Prisma Client:', prisma);
