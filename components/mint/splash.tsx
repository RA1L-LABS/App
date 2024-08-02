import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { setProgress, setStep } from 'redux/slice/mint'
import { useDispatch } from 'redux/store'
import { get, post } from 'superagent'
import { useAccount, useSignMessage } from 'wagmi'

export interface SplashI {}

export function Splash({}: SplashI) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const {
    data: signMessageData,
    error,
    signMessage,
    variables
  } = useSignMessage()

  useEffect(() => {
    if (variables?.message && signMessageData) {
      completeSignature()
    }
  }, [signMessageData, variables?.message])

  async function completeSignature() {
    try {
      const payload = await post('/api/wallet/sign').send({
        message: variables?.message,
        signature: signMessageData
      })
      console.log('Signature Complete', payload.body.result)
      if (payload.body.result.toLowerCase() === (address || '').toLowerCase()) {
        dispatch(setProgress(2))
        dispatch(setStep(2))
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  async function signatureRequest() {
    setLoading(true)
    try {
      const payload = await get('/api/wallet/challenge')
      const message = payload.body.result
      await signMessage({
        message
      })
    } catch (error) {
      console.error(error)

      setLoading(false)
    }
  }

  return (
    <div className="mint-splash">
      <h2>Mint Your KYC Token</h2>
      <p>
        Before you can mint a KYC token and create your RA1L profile. You need
        to sign a signature that verifies your wallet.
      </p>
      {address ? (
        <a
          className={`button${loading ? ' loading' : ''}`}
          onClick={(e) => signatureRequest()}
        >
          {loading ? <CgSpinner className="spinner" /> : 'Verify Wallet'}
        </a>
      ) : (
        <a className="button loading">Connect Wallet</a>
      )}
    </div>
  )
}

export default Splash
