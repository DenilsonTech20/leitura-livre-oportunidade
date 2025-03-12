
// Detect browser environment
const isBrowser = typeof window !== 'undefined';

// Create a comprehensive mock client with the same structure as the real client
const createMockPrismaClient = () => {
  // Generic mock function for database operations
  const mockDbOperation = async () => {
    console.log('Mock Prisma operation called in browser');
    return {};
  };

  const mockArrayOperation = async () => {
    console.log('Mock Prisma array operation called in browser');
    return [];
  };

  // Create standardized model methods
  const createMockModel = () => ({
    findUnique: mockDbOperation,
    findMany: mockArrayOperation,
    findFirst: mockDbOperation,
    create: mockDbOperation,
    update: mockDbOperation,
    upsert: mockDbOperation,
    delete: mockDbOperation,
    count: async () => 0,
  });

  // Return mock client with all models used in the application
  return {
    user: createMockModel(),
    book: createMockModel(),
    loan: createMockModel(),
    $connect: async () => {},
    $disconnect: async () => {},
    $on: () => {},
    $transaction: async (ops) => {
      if (Array.isArray(ops)) {
        return [];
      }
      return await ops(createMockPrismaClient());
    },
  };
};

// Default to the mock client
let prisma = createMockPrismaClient();

// Only try to use the real Prisma client on the server
if (!isBrowser) {
  try {
    // Dynamically import Prisma only on the server side
    // This approach prevents the browser from trying to parse the import
    const { PrismaClient } = require("@prisma/client");
    
    // Use global prisma instance to avoid multiple connections in development
    const globalForPrisma = global as unknown as { prisma: typeof prisma };
    
    if (globalForPrisma.prisma) {
      prisma = globalForPrisma.prisma;
    } else {
      prisma = new PrismaClient();
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prisma;
      }
    }
  } catch (e) {
    console.error('Failed to initialize Prisma client:', e);
    // Keep using the mock client if initialization fails
  }
}

export { prisma };
export default prisma;
