'use client'
import Disclosure from 'components/profile/disclosure'
import Owner from 'components/profile/owner'
import Token from 'components/profile/token'
import AccountType from 'types/prisma/Account'
import { useEffect, useState } from 'react'
import { get } from 'superagent'
import { hexConverter } from 'util/wallet'
import { useAccount } from 'wagmi'

export interface ProfilePageI {}

export default function ProfilePage({}: ProfilePageI) {
  const { address, chainId } = useAccount()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({} as AccountType)

  async function getProfile() {
    setLoading(true)
    try {
      const payload = await get('/api/profile').query({
        address,
        network: hexConverter(chainId || '')
      })
      setData(payload.body.result || {})
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (address) {
      getProfile()
    }
  }, [address])

  return (
    <div className="container page">
      <Owner />
      <Token data={data} />
      <Disclosure data={data} />
    </div>
  )
}
