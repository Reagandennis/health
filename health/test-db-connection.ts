import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a function to test the database connection
async function testDatabaseConnection() {
  // Initialize Prisma client
  const prisma = new PrismaClient();
  
  console.log('Testing database connection...');
  
  try {
    // Test connection by executing a simple query
    // This doesn't display sensitive data
    const result = await prisma.$queryRaw`SELECT current_timestamp;`;
    
    console.log('✅ Database connection successful!');
    console.log(`🕒 Current database time: ${result[0].current_timestamp}`);
    
    // Check if we can query a table
    try {
      // Try to count users or another existing table
      // Replace with your actual table name
      const userCount = await prisma.user.count();
      console.log(`📊 User count: ${userCount}`);
    } catch (tableError) {
      // If we can connect but can't query a specific table, that's useful information
      console.log('⚠️ Connected to database, but couldn\'t query a specific table.');
      console.log('This is expected if you haven\'t run migrations or if the schema is empty.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed');
    
    // Sanitize error messages to not reveal sensitive info
    const errorMessage = error.message || 'Unknown error';
    const sanitizedError = errorMessage
      .replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://USER:PASSWORD@')
      .replace(/password=[^&\s]+/g, 'password=REDACTED');
    
    console.error('Error details:', sanitizedError);
    
    // Provide troubleshooting guidance
    console.log('\n🔍 Troubleshooting suggestions:');
    console.log('1. Verify that the database credentials in your .env file are correct');
    console.log('2. Check if the database server is running and accessible');
    console.log('3. Ensure your IP address has access to the RDS instance (check security groups)');
    console.log('4. Verify that the database name and schema exist');
    
    return false;
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}

// Run the test
(async () => {
  const isConnected = await testDatabaseConnection();
  process.exit(isConnected ? 0 : 1);
})();

