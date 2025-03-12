
import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

declare global {
  var prisma: PrismaClient | undefined;
}

// We need to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Only initialize Prisma on the server side
export const prisma = isBrowser
  ? (null as unknown as PrismaClient) // Return null for browser environments
  : global.prisma || new PrismaClient();

// If not in production, attach to global to prevent multiple instances
if (process.env.NODE_ENV !== 'production' && !isBrowser) {
  global.prisma = prisma;
}

export default prisma;
