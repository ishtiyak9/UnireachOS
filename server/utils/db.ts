import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { generateId } from "./ids";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Create a PostgreSQL connection pool
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Create Prisma adapter with the pool
  const adapter = new PrismaPg(pool);

  // Create Prisma Client with the adapter (Tactical Alignment)
  const client = new PrismaClient({ adapter });

  // Extend Prisma Client to handle specialized IDs
  return client.$extends({
    query: {
      applicantProfile: {
        async create({ args, query }) {
          args.data.id = args.data.id ?? generateId.applicant();
          return query(args);
        },
      },
      agentProfile: {
        async create({ args, query }) {
          args.data.id = args.data.id ?? generateId.partner();
          return query(args);
        },
      },
    },
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use singleton pattern to avoid multiple instances in development
export const prisma = (globalForPrisma.prisma ??
  prismaClientSingleton()) as any;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
