import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/index.js";

// Adatadore che conneta Prisma con il nostro server MySQL usando .env

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

//Istanza centralizzata del client generata da schema.prisma
const prisma = new PrismaClient({ adapter });

export default prisma;