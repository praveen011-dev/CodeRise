import {PrismaClient} from "../generated/prisma/index.js"

const globalForPrisma=globalThis;

const db = globalForPrisma.prisma ||new PrismaClient();

if(process.env.NODE_ENV !== "production") globalForPrisma.primsa=db

export {db}
    