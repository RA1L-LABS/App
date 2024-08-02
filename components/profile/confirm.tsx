import RA1L from 'util/RA1L.json'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { ethers } from 'ethers'
import { useState } from 'react'
import { getContract } from 'util/wallet'
import { useAccount } from 'wagmi'
import { post } from 'superagent'
import AccountType from 'types/prisma/Account'

export interface ConfirmI {
  popup: boolean
  setPopup(value: boolean): void
  toggle: boolean
  setToggle(value: boolean): void
  data: AccountType
}

export function Confirm({
  popup,
  setPopup,
  toggle,
  setToggle,
  data
}: ConfirmI) {
  const { chainId } = useAccount()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function toggleAuto() {
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
      await contract.toggleApproval(!toggle)

      const payload = await post('/api/auto').send({
        id: data.id,
        toggle: !toggle
      })
      setToggle(!toggle)
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
        <h2>
          {!toggle ? 'Auto Approve Disclosure' : 'Manually Approve Disclosure'}
        </h2>
        {!toggle && (
          <p>
            Approving this will mean that you will automatically approve
            disclosure requests from our trusted partners.
          </p>
        )}
        {toggle && (
          <p>
            Reverting to manual approval means that you have to visit your RA1L
            profile to manually approve each partner that requests your
            information.
          </p>
        )}
        <div className="popup-buttons">
          <a className="button button-outline" onClick={(e) => setPopup(false)}>
            Close
          </a>
          <a
            className={`button ${loading ? 'loading' : ''}`}
            onClick={(e) => toggleAuto()}
          >
            Update
          </a>
        </div>
      </div>
    </div>
  )
}

export default Confirm
