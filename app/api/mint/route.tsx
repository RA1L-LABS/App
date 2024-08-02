import { NextRequest } from 'next/server'
import prisma from 'prisma/client'
import { getSession } from 'util/session'
import { hexConverter } from 'util/wallet'

export async function POST(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const body = await req.json()
    const address = session.address || ''
    const network = hexConverter(body.network)
    const nftTx = body.hash || ''

    await prisma.account.update({
      where: {
        address_network: {
          address,
          network
        }
      },
      data: {
        nftTx
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
