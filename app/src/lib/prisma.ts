type PrismaClientType = any;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType };

function createPrismaClient() {
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
