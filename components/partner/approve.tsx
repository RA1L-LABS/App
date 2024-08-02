import RA1L from 'util/RA1L.json'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import AccountType from 'types/prisma/Account'
import { hexConverter, getContract } from 'util/wallet'
import { post } from 'superagent'

export interface ApproveI {
  popup: boolean
  setPopup(value: boolean): void
  data: AccountType[]
  selected: boolean[]
}

export function Approve({ popup, setPopup, data, selected }: ApproveI) {
  const { address, chainId } = useAccount()
  const items = data.filter((_, index) => selected[index])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function requestDisclosure() {
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
      const tx = await contract.requestMultiDisclosure(
        items.map((item) => item.address)
      )
      await post('/api/disclosure').send({
        address,
        network: hexConverter(chainId || ''),
        accounts: items.map((item) => item.address)
      })
      setPopup(false)
    } catch (error) {
      console.error(error)
      setError(true)
    }
    setLoading(false)
  }

  return (
    <div className={`popup${popup ? ' visible' : ''}`}>
      <div className="popup-content popup-approve">
        <h2>Request Disclosure</h2>
        <p>You are requesting disclosure from the following accounts</p>
        <div className="approve-list">
          {items.map((item, index) => (
            <p key={index}>{item.address}</p>
          ))}
        </div>
        <div className="popup-buttons">
          <a className="button button-outline" onClick={(e) => setPopup(false)}>
            Close
          </a>
          <a
            className={`button${loading ? ' loading' : ''}`}
            onClick={(e) => requestDisclosure()}
          >
            {loading ? <CgSpinner className="spinner" /> : 'Send Request'}
          </a>
        </div>
      </div>
    </div>
  )
}

export default Approve
