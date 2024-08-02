import { useEffect, useState } from 'react'
import Approve from 'components/partner/approve'
import AccountType from 'types/prisma/Account'
import { get } from 'superagent'
import { hexConverter } from 'util/wallet'
import { useAccount } from 'wagmi'

export interface RequestI {}

export function Request({}: RequestI) {
  const { address, chainId } = useAccount()
  const [popup, setPopup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [country, setCountry] = useState('US')
  const [minYear, setMinYear] = useState(1900)
  const [maxYear, setMaxYear] = useState(2004)
  const [data, setData] = useState([] as AccountType[])
  const [selected, setSelected] = useState([] as boolean[])

  async function getData() {
    setLoading(true)
    setError(false)
    try {
      const payload = await get('/api/accounts').query({
        network: hexConverter(chainId || '')
      })
      setData(payload.body.result)
    } catch (error) {
      console.error(error)
      setError(true)
    }
    setLoading(false)
  }

  function toggleAll() {
    const allChecked = selected.every((s) => s)
    setSelected(selected.map((s) => !allChecked))
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    setSelected(new Array(data.length).fill(false))
  }, [data])

  return (
    <>
      <Approve
        popup={popup}
        setPopup={setPopup}
        data={data}
        selected={selected}
      />
      <div className="partner-request">
        <h2>Request Disclosure By Trait</h2>
        <p>
          Request disclosure from many accounts at once by filtering accounts by
          traits. This is based on country and age.
        </p>
        <div className="request-filters">
          <div className="request-filter">
            <p>Country</p>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value={''}>Select Country</option>
              <option value={'US'}>United States</option>
              <option value={'CA'}>Canada</option>
              <option value={'MX'}>Mexico</option>
              <option value={'UK'}>United Kingdom</option>
            </select>
          </div>
          <div className="request-filter">
            <p>Minimum Birth Year</p>
            <input
              type="number"
              value={minYear}
              min={1900}
              max={2004}
              onChange={(e) => setMinYear(e.target.valueAsNumber)}
            />
          </div>
          <div className="request-filter">
            <p>Maximum Birth Year</p>
            <input
              type="number"
              value={maxYear}
              min={1900}
              max={2004}
              onChange={(e) => setMaxYear(e.target.valueAsNumber)}
            />
          </div>
        </div>
        <p className="request-status">
          {selected.filter((s) => s).length} accounts selected
        </p>
        <div className="pd-list pd-list-request">
          <div className="pd-item pd-header" onClick={(e) => toggleAll()}>
            <div className="pd-c">
              <input type="checkbox" checked={selected.every((s) => s)} />
            </div>
            <div className="pd-c">Address</div>
            <div className="pd-c">Birth Year</div>
            <div className="pd-c">Country</div>
            <div className="pd-c">Status</div>
          </div>
          {data.map((item, index) => (
            <div
              className="pd-item"
              key={index}
              onClick={(e) =>
                setSelected(selected.map((s, i) => (i === index ? !s : s)))
              }
            >
              <div className="pd-c">
                <input type="checkbox" checked={selected[index]} />
              </div>
              <div className="pd-c">{item.address}</div>
              <div className="pd-c">{item.age}</div>
              <div className="pd-c">{item.country}</div>
              <div className="pd-c">Available</div>
            </div>
          ))}
        </div>

        <a
          className="button button-disclosure"
          onClick={(e) => {
            if (selected.filter((s) => s).length > 0) {
              setPopup(true)
            }
          }}
        >
          Request Disclosure
        </a>
      </div>
    </>
  )
}

export default Request
