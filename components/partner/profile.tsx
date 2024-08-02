import { useEffect, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { get, post } from 'superagent'
import { hexConverter } from 'util/wallet'
import { useAccount } from 'wagmi'

export interface ProfileI {}

export function Profile({}: ProfileI) {
  const { address, chainId } = useAccount()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function updateProfile() {
    setLoading(true)
    setError(false)
    try {
      const payload = await post('/api/partner').send({
        address,
        network: hexConverter(chainId || ''),
        name,
        description
      })
    } catch (error) {
      console.error(error)
      setError(true)
    }
    setLoading(false)
  }

  async function getData() {
    setLoading(true)
    setError(false)
    try {
      const payload = await get('/api/partner').query({
        address,
        network: hexConverter(chainId || '')
      })
      const { name, description } = payload.body.result
      setName(name || '')
      setDescription(description || '')
    } catch (error) {
      console.error(error)
      setError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (address && chainId) {
      getData()
    }
  }, [address, chainId])

  return (
    <div className="partner-profile">
      <h2>Your Partner Profile</h2>
      <p>When you request disclosure from a customer. This is what they see.</p>
      <div className="partner-form">
        <p>Company Name</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>Company Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <a
          className={`button${loading ? ' loading' : ''}`}
          onClick={(e) => updateProfile()}
        >
          {loading ? <CgSpinner className="spinner" /> : 'Update Profile'}
        </a>
      </div>
    </div>
  )
}

export default Profile
