import RA1L from 'util/RA1L.json'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import Confirm from 'components/profile/confirm'
import AccountType from 'types/prisma/Account'
import RequestType from 'types/prisma/Request'
import { get, patch } from 'superagent'
import { getContract, hexConverter } from 'util/wallet'
import { useAccount } from 'wagmi'
import { CgSpinner } from 'react-icons/cg'

export interface DisclosureI {
  data: AccountType
}

export function Disclosure({ data }: DisclosureI) {
  const [tab, setTab] = useState('approved' as 'approved' | 'requests')
  const [toggle, setToggle] = useState(false)
  const [popup, setPopup] = useState(false)
  const { address, chainId } = useAccount()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [requests, setRequests] = useState([] as RequestType[])

  const approved = requests.filter(
    (request) => request.approved || data.autoApprove
  )
  const pending = requests.filter(
    (request) => !request.approved && !data.autoApprove
  )

  async function approve(item: RequestType, approved: boolean) {
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
      if (approved) {
        const tx = await contract.approveDisclosure(item.address)
      } else {
        const tx = await contract.revokeDisclosure(item.address)
      }

      const payload = await patch('/api/disclosure').send({
        id: item.id,
        approved
      })
      setRequests(
        requests.map((request) => {
          if (request.id === item.id) {
            return {
              ...request,
              approved
            }
          }
          return request
        })
      )
    } catch (error) {
      console.error(error)
      setError(true)
    }
    setLoading(false)
  }

  async function getRequests() {
    setLoading(true)
    setError(false)
    try {
      const payload = await get('/api/disclosure').query({
        address,
        network: hexConverter(chainId || '')
      })
      setRequests(payload.body.result || [])
    } catch (error) {
      console.error(error)
      setError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (address) {
      getRequests()
    }
  }, [address])

  useEffect(() => {
    setToggle(data.autoApprove || false)
  }, [data])

  return (
    <>
      <Confirm
        popup={popup}
        setPopup={setPopup}
        toggle={toggle}
        setToggle={setToggle}
        data={data}
      />
      <div className="profile-disclosure">
        <div className="disclosure-toggle" onClick={(e) => setPopup(true)}>
          <p>Manually Approve Requests</p>
          <div className={`disclosure-toggle-ball${toggle ? ' toggle' : ''}`}>
            <div className="inner-ball" />
          </div>
          <p>Auto Approve All Requests</p>
        </div>

        <div className="disclosure-tabs">
          <a
            className={`button disclosure-tab${
              tab === 'approved' ? ' active' : ''
            }`}
            onClick={() => setTab('approved')}
          >
            Approved
          </a>
          <a
            className={`button disclosure-tab${
              tab === 'requests' ? ' active' : ''
            }`}
            onClick={() => setTab('requests')}
          >
            Requests
          </a>
        </div>

        {tab === 'approved' && (
          <>
            <h2>Approved Disclosures</h2>
            <p>
              The following are partners that you have disclosed your
              information to.
            </p>
            <div className="pd-list">
              <div className="pd-item pd-header">
                <div className="pd-c"></div>
                <div className="pd-c">Partner Name</div>
                <div className="pd-c"></div>
              </div>
              {approved.map((item, index) => (
                <div className="pd-item" key={index}>
                  <div className="pd-c"></div>
                  <div className="pd-c">{item.partner?.name}</div>
                  <div className="pd-c buttons">
                    <a
                      className={`button${
                        data.autoApprove || loading ? ' loading' : ''
                      }`}
                      onClick={(e) => approve(item, false)}
                    >
                      {loading ? <CgSpinner className="spinner" /> : 'Revoke'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'requests' && (
          <>
            <h2>Disclosure Requests</h2>
            <p>
              The following are partners that want you to disclose your RA1L
              profile to them.
            </p>
            <div className="pd-list">
              <div className="pd-item pd-header">
                <div className="pd-c"></div>
                <div className="pd-c">Partner Name</div>
                <div className="pd-c"></div>
              </div>
              {pending.map((item, index) => (
                <div className="pd-item" key={index}>
                  <div className="pd-c"></div>
                  <div className="pd-c">{item.partner?.name}</div>
                  <div className="pd-c buttons">
                    <a
                      className={`button${loading ? ' loading' : ''}`}
                      onClick={(e) => approve(item, true)}
                    >
                      {loading ? <CgSpinner className="spinner" /> : 'Approve'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Disclosure
