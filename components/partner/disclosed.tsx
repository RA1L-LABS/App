import { useEffect, useState } from 'react'
import Account from 'components/partner/account'
import RequestType from 'types/prisma/Request'
import { useAccount } from 'wagmi'
import { get } from 'superagent'
import { hexConverter } from 'util/wallet'

export interface DisclosedI {}

export function Disclosed({}: DisclosedI) {
  const [popup, setPopup] = useState(false)
  const { address, chainId } = useAccount()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [requests, setRequests] = useState([] as RequestType[])
  const [selected, setSelected] = useState({} as RequestType)

  async function getRequests() {
    setLoading(true)
    setError(false)
    try {
      const payload = await get('/api/disclosure/partner').query({
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

  return (
    <>
      <Account popup={popup} setPopup={setPopup} selected={selected} />
      <div className="partner-disclosed">
        <h2>Disclosed Information</h2>
        <p>
          The following are the disclosed profiles that have approved your
          request to view their information.
        </p>

        <div className="pd-list">
          <div className="pd-item pd-header">
            <div className="pd-c"></div>
            <div className="pd-c">Address</div>
            <div className="pd-c"></div>
          </div>
          {requests.map((item, index) => (
            <div className="pd-item" key={index}>
              <div className="pd-c"></div>
              <div className="pd-c">{item.account}</div>
              <div className="pd-c">
                <a
                  className="button"
                  onClick={(e) => {
                    setSelected(item)
                    setPopup(true)
                  }}
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Disclosed
