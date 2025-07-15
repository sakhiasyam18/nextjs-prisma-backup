// app/lib/prisma.ts
import { PrismaClient } from '../app/generated/prisma';

declare global {
  // allow global `var` across module reloads in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // you can set logging here, e.g. log: ['query', 'error'],
  });

// In development, reuse the client across HMR:
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
