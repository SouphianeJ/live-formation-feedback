type PrismaClientType = any;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType };

function normalizeDatabaseUrl() {
  const rawDatabaseUrl = process.env.DATABASE_URL;
  const rawMongoUrl = process.env.MONGODB_URI;
  const cleanedDatabaseUrl = rawDatabaseUrl?.trim().replace(/^"(.*)"$/, "$1");
  const cleanedMongoUrl = rawMongoUrl?.trim().replace(/^"(.*)"$/, "$1");

  if (cleanedDatabaseUrl) {
    process.env.DATABASE_URL = cleanedDatabaseUrl;
  }

  const databaseIsMongo = cleanedDatabaseUrl?.startsWith("mongo");
  const mongoIsMongo = cleanedMongoUrl?.startsWith("mongo");

  if (!databaseIsMongo && mongoIsMongo) {
    process.env.DATABASE_URL = cleanedMongoUrl;
  }
}

function createPrismaClient() {
  normalizeDatabaseUrl();
  const { PrismaClient } = require("@prisma/client") as {
    PrismaClient: new () => PrismaClientType;
  };
  return new PrismaClient();
}

export const prisma = new Proxy({} as PrismaClientType, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    return globalForPrisma.prisma[prop as keyof PrismaClientType];
  },
}) as PrismaClientType;
