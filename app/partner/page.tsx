'use client'
import Approved from 'components/partner/approved'
import Disclosed from 'components/partner/disclosed'
import Profile from 'components/partner/profile'
import Request from 'components/partner/request'
import { useState } from 'react'

export interface PartnerPageI {}

export default function PartnerPage({}: PartnerPageI) {
  const [tab, setTab] = useState(
    'profile' as 'profile' | 'disclosed' | 'request'
  )

  return (
    <div className="container page">
      <Approved />
      <div className="partner-tabs">
        <a
          className={`button partner-tab${tab === 'profile' ? ' active' : ''}`}
          onClick={(e) => setTab('profile')}
        >
          Profile
        </a>
        <a
          className={`button partner-tab${
            tab === 'disclosed' ? ' active' : ''
          }`}
          onClick={(e) => setTab('disclosed')}
        >
          Disclosed
        </a>
        <a
          className={`button partner-tab${tab === 'request' ? ' active' : ''}`}
          onClick={(e) => setTab('request')}
        >
          Request
        </a>
      </div>
      {tab === 'profile' && <Profile />}
      {tab === 'disclosed' && <Disclosed />}
      {tab === 'request' && <Request />}
    </div>
  )
}
