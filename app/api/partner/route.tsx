import { NextRequest } from 'next/server'
import prisma from 'prisma/client'
import { getSession } from 'util/session'

export async function GET(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const address = searchParams.get('address') || ''
    const network = searchParams.get('network') || ''

    const result = await prisma.partner.findUnique({
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

export async function POST(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const { address, network, name, description } = await req.json()

    await prisma.partner.upsert({
      where: {
        address_network: {
          address,
          network
        }
      },
      update: {
        name,
        description
      },
      create: {
        address,
        network,
        name,
        description
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
