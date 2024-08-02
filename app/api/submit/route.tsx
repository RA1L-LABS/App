import { NextRequest } from 'next/server'
import { getSession } from 'util/session'
import prisma from 'prisma/client'
import { hexConverter } from 'util/wallet'

export async function POST(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    if (!session.address) {
      return Response.json(
        {
          status: 'ERROR',
          result: 'No wallet found...'
        },
        { status: 403 }
      )
    }
    const body = await req.json()
    const address = session.address || ''
    const network = hexConverter(body.network)

    await prisma.account.upsert({
      where: {
        address_network: {
          address,
          network
        }
      },
      create: {
        ...body,
        address,
        network
      },
      update: {
        ...body,
        address,
        network
      }
    })

    return Response.json(
      {
        status: 'OK'
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
