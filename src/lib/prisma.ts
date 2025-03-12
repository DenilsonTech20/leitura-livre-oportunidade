// This is a dummy implementation for browser environments
// The actual Prisma client is only used server-side

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const isBrowser = typeof window !== 'undefined';

// Create a mock Prisma client for browser environments
const mockPrismaClient = {
  user: { 
    findMany: async () => [],
    upsert: async () => ({}),
    create: async () => ({}),
    update: async () => ({})
  },
  book: { 
    findMany: async () => [],
    upsert: async () => ({}),
    create: async () => ({}),
    update: async () => ({})
  },
  loan: { 
    findMany: async () => [],
    upsert: async () => ({}),
    create: async () => ({}),
    update: async () => ({})
  },
};

let prisma: any = mockPrismaClient; // Default to mock for browser

// Only attempt to import and initialize Prisma on the server side
if (!isBrowser) {
  try {
    // Use require to avoid the import being processed by Vite
    const { PrismaClient } = require('@prisma/client');
    
    if (global.prisma) {
      prisma = global.prisma;
    } else {
      prisma = new PrismaClient();
      if (process.env.NODE_ENV !== 'production') {
        global.prisma = prisma;
      }
    }
  } catch (e) {
    console.error('Failed to initialize Prisma client:', e);
    // Keep using the mock client if initialization fails
  }
}

export { prisma };
export default prisma;
