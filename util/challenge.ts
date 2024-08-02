import { randomBytes } from 'crypto'

export const ChallengeMessage = `Hello!\n\nWelcome to RA1L. This is a challenge message.\n\nYou need to sign this in order to authenticate.\n\n- WAGMI`

export async function generateChallenge() {
  return `${ChallengeMessage}\n\nChallenge Message: ${randomBytes(32).toString(
    'hex'
  )}`
}
