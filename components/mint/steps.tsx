'use client'
import { useEffect } from 'react'
import { setProgress, setStep } from 'redux/slice/mint'
import { useDispatch, useSelector } from 'redux/store'
import { useAccount } from 'wagmi'

export interface StepsI {}

export function Steps({}: StepsI) {
  const { address, chainId } = useAccount()
  const dispatch = useDispatch()
  const progress = useSelector((state) => state.mint.progress)

  useEffect(() => {
    dispatch(setStep(1))
    dispatch(setProgress(1))
  }, [address, chainId])

  return (
    <div className="mint-steps">
      <a className="mint-step active" onClick={(e) => dispatch(setStep(1))}>
        Verify Wallet
      </a>
      <a
        className={`mint-step${progress >= 2 ? ' active' : ''}`}
        onClick={(e) => dispatch(setStep(2))}
      >
        Verify ID
      </a>
      <a
        className={`mint-step${progress >= 3 ? ' active' : ''}`}
        onClick={(e) => dispatch(setStep(3))}
      >
        Mint Token
      </a>
    </div>
  )
}

export default Steps
