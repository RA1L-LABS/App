import { NextRequest } from 'next/server'
import { generateChallenge } from 'util/challenge'
import { getSession } from 'util/session'

export async function GET(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const challenge = await generateChallenge()
    session.challenge = challenge
    await session.save()

    return Response.json(
      {
        status: 'OK',
        result: challenge
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
