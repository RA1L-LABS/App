import { NextRequest } from 'next/server'
import { getSession } from 'util/session'
import { recoverMessageAddress } from 'viem'

export async function POST(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const { signature, message } = await req.json()
    const address = await recoverMessageAddress({
      message,
      signature
    })

    session.address = address
    session.challenge = ''
    await session.save()

    return Response.json(
      {
        status: 'OK',
        result: address
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
