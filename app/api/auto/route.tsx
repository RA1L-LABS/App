import { NextRequest } from 'next/server'
import prisma from 'prisma/client'
import { getSession } from 'util/session'

export async function POST(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const { id, toggle } = await req.json()

    await prisma.account.update({
      where: {
        id
      },
      data: {
        autoApprove: toggle
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
