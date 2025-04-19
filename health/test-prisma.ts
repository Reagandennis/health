import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function testDatabaseConnection(): Promise<void> {
  const prisma = new PrismaClient();
  
  console.log('Testing database connection to RDS...');
  console.log(`Connection string: ${process.env.DATABASE_URL?.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://USER:PASSWORD@')}`);
  
  try {
    // Test connection with a simple raw query
    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now;`;
    
    console.log('✅ Database connection successful!');
    if (result && result[0] && result[0].now) {
      console.log(`🕒 Current database time: ${result[0].now.toISOString()}`);
    }
    
    // Check database version
    const versionResult = await prisma.$queryRaw<[{ version: string }]>`SELECT version();`;
    if (versionResult && versionResult[0]) {
      console.log(`🛢️ Database version: ${versionResult[0].version}`);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed');
    
    // Safely handle the error
    const typedError = error as Error;
    const errorMessage = typedError.message || 'Unknown error';
    
    // Sanitize error message to remove credentials
    const sanitizedError = errorMessage
      .replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://USER:PASSWORD@')
      .replace(/password=[^&\s]+/g, 'password=REDACTED');
    
    console.error('Error details:', sanitizedError);
    
    // Provide troubleshooting guidance
    console.log('\n🔍 Troubleshooting suggestions:');
    console.log('1. Verify that your database credentials are correct');
    console.log('2. Ensure your IP address has access to the RDS instance in AWS Security Groups');
    console.log('3. Check if the database server is running');
    console.log('4. Verify the database exists and is accessible');
    console.log('5. Make sure the database port (5432) is open in the security group');
    
  } finally {
    // Always disconnect from the database
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection()
  .then(() => {
    console.log('Test completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });

import { prisma } from './lib/prisma';

async function testPrismaTypes() {
  // This is just a type check, we don't need to actually run it
  const patient = await prisma.patient.findFirst();
  console.log('Patient type check passed');
  return patient;
}

// Export to make TypeScript check the types
export { testPrismaTypes };

