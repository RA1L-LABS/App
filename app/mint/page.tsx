'use client'
import Kyc from 'components/mint/kyc'
import Splash from 'components/mint/splash'
import Token from 'components/mint/token'
import { useSelector } from 'redux/store'

export interface MintPageI {}

export default function MintPage({}: MintPageI) {
  const step = useSelector((state) => state.mint.step)

  if (step === 1) {
    return <Splash />
  }
  if (step === 2) {
    return <Kyc />
  }
  if (step === 3) {
    return <Token />
  }
}
