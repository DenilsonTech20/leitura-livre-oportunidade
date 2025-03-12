
// This file provides mock implementations for Prisma in browser environments
// It's used as an alias target in vite.config.ts

// Mock PrismaClient constructor
export function PrismaClient() {
  return createMockPrismaClient();
}

// Create a comprehensive mock of the Prisma client
function createMockPrismaClient() {
  // Generic mock function for database operations
  const mockDbOperation = async () => {
    console.log('Mock Prisma operation called in browser');
    return {};
  };

  // Create mock models with common methods
  const createMockModel = () => ({
    findUnique: mockDbOperation,
    findMany: async () => [],
    findFirst: mockDbOperation,
    create: mockDbOperation,
    update: mockDbOperation,
    upsert: mockDbOperation,
    delete: mockDbOperation,
    count: async () => 0,
  });

  // Return a mock Prisma client with models
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
}

// Default export
export default {
  PrismaClient
};
