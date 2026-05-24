import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Déclaration globale pour éviter les fuites de connexions en mode Dev avec HMR
declare const globalThis: {
  prismaGlobal?: PrismaClient;
  pgPoolGlobal?: pg.Pool;
} & typeof global;

// Réutilisation du pool de connexions existant ou création d'un nouveau
const pool = globalThis.pgPoolGlobal ?? new pg.Pool({
  connectionString: databaseUrl,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000, // Augmenté à 30s pour tolérer la latence élevée avec l'Irlande
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.pgPoolGlobal = pool
}

const prismaClientSingleton = () => {
  const adapter = new PrismaPg(pool as any)
  return new PrismaClient({ adapter })
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
