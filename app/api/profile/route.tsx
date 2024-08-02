import { NextRequest } from 'next/server'
import prisma from 'prisma/client'
import { getSession } from 'util/session'
import { hexConverter } from 'util/wallet'

export async function GET(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const address = searchParams.get('address') || ''
    const network = hexConverter(searchParams.get('network') || '')

    const result = await prisma.account.findUnique({
      where: {
        address_network: {
          address,
          network
        }
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
