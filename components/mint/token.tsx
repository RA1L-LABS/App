import RA1L from 'util/RA1L.json'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { useRouter } from 'next/navigation'
import { get, post } from 'superagent'
import { hexConverter, getContract, getRpc } from 'util/wallet'
import { useSelector } from 'redux/store'

export interface TokenI {}

export function Token({}: TokenI) {
  const { address, chainId } = useAccount()
  const router = useRouter()
  const [supplyLoading, setSupplyLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const data = useSelector((state) => state.mint.data)
  const [supply, setSupply] = useState(0)

  async function getSupply() {
    setSupplyLoading(true)
    try {
      const payload = await get('/api/mint/total').query({
        network: hexConverter(chainId || '')
      })
      const { result } = payload.body
      console.log('Supply', result)
      setSupply(result)
    } catch (error) {
      console.error(error)
    }
    setSupplyLoading(false)
  }

  useEffect(() => {
    getSupply()
  }, [chainId])

  async function mintToken() {
    setLoading(true)
    try {
      window.ethereum = sapphire.wrap(window.ethereum)
      console.log(
        'Minting Token for Contract',
        getContract(chainId || 0),
        'to',
        address
      )
      const provider = sapphire.wrap(
        new ethers.BrowserProvider(window.ethereum)
      )
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        getContract(chainId || 0),
        RA1L.abi,
        signer
      )
      const tx = await contract.mint(JSON.stringify(data))
      console.log('Tx Minted')
      console.log(tx)
      const hash = tx.hash
      await post('/api/mint').send({
        hash,
        network: hexConverter(chainId || '')
      })
      router.push('/profile')
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  async function freeMint() {
    setLoading(true)
    try {
      console.log(chainId, hexConverter(chainId || ''))
      console.log(getRpc(chainId || 0))
      await post('/api/mint/free').send({
        address,
        network: chainId,
        data: JSON.stringify(data)
      })
      router.push('/profile')
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="mint-token">
      <h2>Mint Your Token</h2>
      {supplyLoading ? (
        <div className="loading-overlay">
          <CgSpinner className="spinner" />
        </div>
      ) : (
        <>
          <p>
            You have successfully verified your identity. Press the button below
            to mint your KYC Token. {supply}/500 free mints have been claimed.
          </p>
          {supply !== 0 && supply < 500 ? (
            <a
              className={`button${loading ? ' loading' : ''}`}
              onClick={(e) => freeMint()}
            >
              {loading ? <CgSpinner className="spinner" /> : 'Claim Free Mint'}
            </a>
          ) : (
            <a
              className={`button${loading ? ' loading' : ''}`}
              onClick={(e) => mintToken()}
            >
              {loading ? <CgSpinner className="spinner" /> : 'Mint Now'}
            </a>
          )}

          {error && (
            <p className="error">
              There was an issue minting your token. Try again.
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default Token
