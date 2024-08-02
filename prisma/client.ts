import { PrismaClient } from '@prisma/client'

const global: any = {
  prisma: null as PrismaClient | null
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ log: [] })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ log: [] })
  }

  prisma = global.prisma
}

export default prisma
