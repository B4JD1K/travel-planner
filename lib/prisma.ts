import {PrismaClient} from "@/app/generated/prisma/client";

// Tworzę zmienną globalną dla Prisma, aby unikać wielokrotnego tworzenia instancji
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();
// Jeśli Prisma już istnieje globalnie, użyj go; jeśli nie to stwórz nową instancję PrismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
// W trybie development zapisujemy Prisma do globalnego obiektu.
// Dzięki temu przy "hot reloadzie" w Next.js nie tworzy się wiele instancji,
// co mogłoby powodować błędy i wycieki pamięci.
