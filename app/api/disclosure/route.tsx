import { NextRequest } from 'next/server'
import prisma from 'prisma/client'
import { getSession } from 'util/session'

export async function GET(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const address = searchParams.get('address') || ''
    const network = searchParams.get('network') || ''

    const result = await prisma.request.findMany({
      where: {
        account: address,
        network
      },
      include: {
        partner: true
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
    const { address, network, accounts } = await req.json()

    const result = await prisma.request.createMany({
      data: accounts.map((account: string) => ({
        address,
        network,
        account
      }))
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

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const { id, approved } = await req.json()

    if (approved) {
      const result = await prisma.request.update({
        where: {
          id
        },
        data: {
          approved
        }
      })
    } else {
      const result = await prisma.request.delete({
        where: {
          id
        }
      })
    }

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
