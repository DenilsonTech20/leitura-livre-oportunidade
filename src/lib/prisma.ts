
// This is a dummy implementation for browser environments
// The actual Prisma client is only used server-side

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const isBrowser = typeof window !== 'undefined';

let prisma: any = null;

// Only attempt to import and initialize Prisma on the server side
if (!isBrowser) {
  try {
    // Dynamic import to avoid importing in browser
    const { PrismaClient } = require('@prisma/client');
    
    // We need to check if we're in a browser environment
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
    // Return a mock object with empty methods if Prisma fails to initialize
    prisma = {
      user: { findMany: async () => [] },
      book: { findMany: async () => [] },
      loan: { findMany: async () => [] },
    };
  }
}

export { prisma };
export default prisma;
