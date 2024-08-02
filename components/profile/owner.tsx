import RA1L from 'util/RA1L.json'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { CgSpinner } from 'react-icons/cg'
import { getContract } from 'util/wallet'

export interface OwnerI {}

export function Owner({}: OwnerI) {
  const { address, chainId } = useAccount()
  const [loading, setLoading] = useState(true)
  const [owner, setOwner] = useState(false)

  async function getStatus() {
    window.ethereum = sapphire.wrap(window.ethereum)
    const provider = sapphire.wrap(new ethers.BrowserProvider(window.ethereum))
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(
      getContract(chainId || 0),
      RA1L.abi,
      signer
    )
    const balance = await contract.balanceOf(address)
    if (balance > 0) {
      setOwner(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (address) {
      getStatus()
    }
  }, [address])

  if (!address) {
    return (
      <div className="invalid-overlay">
        <h2>No Wallet Connected</h2>
        <p>
          You need to connect a wallet to view your profile. Please connect a
          wallet to continue
        </p>
      </div>
    )
  } else if (loading) {
    return (
      <div className="loading-overlay">
        <CgSpinner className="spinner" />
      </div>
    )
  } else if (!owner) {
    return (
      <div className="invalid-overlay">
        <h2>No Token Minted</h2>
        <p>
          You do not own a RA1L Token. Please mint one to view your profile. If
          you just claimed a free mint. It may take a couple minutes to process.
        </p>
      </div>
    )
  } else {
    return null
  }
}

export default Owner
