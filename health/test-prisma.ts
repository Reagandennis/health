import { prisma } from './lib/prisma';

async function testPrismaTypes() {
  // This is just a type check, we don't need to actually run it
  const patient = await prisma.patient.findFirst();
  console.log('Patient type check passed');
  return patient;
}

// Export to make TypeScript check the types
export { testPrismaTypes };

