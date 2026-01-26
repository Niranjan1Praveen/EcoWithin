import { PrismaClient } from '@prisma/client'

// Prisma 7+ automatically reads from process.env.DATABASE_URL
const prisma = new PrismaClient()

export default prisma