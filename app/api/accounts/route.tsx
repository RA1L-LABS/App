import { NextRequest } from 'next/server'
import prisma from 'prisma/client'
import { getSession } from 'util/session'

export async function GET(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const network = searchParams.get('network') || ''
    const result = await prisma.account.findMany({
      where: {
        network
      },
      select: {
        address: true,
        age: true,
        country: true
      }
    })

    return Response.json(
      {
        status: 'OK',
        result
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      {
        status: 'ERROR',
        error
      },
      { status: 500 }
    )
  }
}
