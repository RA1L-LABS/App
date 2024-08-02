import RA1L from 'util/RA1L.json'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import RequestType from 'types/prisma/Request'
import { useAccount } from 'wagmi'
import { CgSpinner } from 'react-icons/cg'
import { getContract } from 'util/wallet'

export interface AccountI {
  popup: boolean
  setPopup(value: boolean): void
  selected: RequestType
}

export function Account({ popup, setPopup, selected }: AccountI) {
  const { address, chainId } = useAccount()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState('')

  async function getData() {
    setLoading(true)
    setError(false)
    try {
      window.ethereum = sapphire.wrap(window.ethereum)
      const provider = sapphire.wrap(
        new ethers.BrowserProvider(window.ethereum)
      )
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(
        getContract(chainId || 0),
        RA1L.abi,
        signer
      )
      const data = await contract.retrieveDisclosure(selected.account)
      setData(data)
      console.log('Retrieved disclosure', data)
    } catch (error) {
      console.error(error)
      setError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (selected.account) {
      getData()
    }
  }, [selected])

  return (
    <div className={`popup${popup ? ' visible' : ''}`}>
      <div className="popup-content popup-account">
        <a className="button close-button" onClick={() => setPopup(false)}>
          Close
        </a>
        <h2>Account Information</h2>
        <textarea
          className="account-info"
          value={JSON.stringify(JSON.parse(data || '{}'), null, 2)}
        />
      </div>
    </div>
  )
}

export default Account
