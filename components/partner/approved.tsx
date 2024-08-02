import RA1L from 'util/RA1L.json'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { CgSpinner } from 'react-icons/cg'
import { getContract } from 'util/wallet'

export interface ApprovedI {}

export function Approved({}: ApprovedI) {
  const { address, chainId } = useAccount()
  const [loading, setLoading] = useState(true)
  const [partner, setPartner] = useState(false)

  async function getStatus() {
    window.ethereum = sapphire.wrap(window.ethereum)
    const provider = sapphire.wrap(new ethers.BrowserProvider(window.ethereum))
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(
      getContract(chainId || 0),
      RA1L.abi,
      signer
    )
    const isPartner = await contract.isPartner()
    if (isPartner) {
      setPartner(true)
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
  } else if (!partner) {
    return (
      <div className="invalid-overlay">
        <h2>Not a Partner</h2>
        <p>
          You are not a partner of the RA1L Network. Please request to become a
          partner
        </p>
      </div>
    )
  } else {
    return null
  }
}

export default Approved
