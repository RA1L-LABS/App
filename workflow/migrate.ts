import prisma from 'prisma/client'
import { write } from 'fs-jetpack'

export async function start() {
  const requests = await prisma.request.findMany()
  const accounts = await prisma.account.findMany()
  const partners = await prisma.partner.findMany()

  console.log(requests)
  console.log(accounts)
  console.log(partners)
}

await start()
