
/**
 * This file provides a mock implementation of @prisma/client for browser environments
 * where the actual Prisma client cannot be used.
 */

// Create a standardized mock model operation function
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

// Export a PrismaClient constructor that returns a mock client
exports.PrismaClient = function() {
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
      return await ops(this);
    },
  };
};

// Export a default object for ESM imports
module.exports = exports;
