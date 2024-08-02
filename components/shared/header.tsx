'use client'
import Link from 'next/link'
import { useState } from 'react'
import Wallet from 'components/shared/wallet'

export interface HeaderI {}

export function Header({}: HeaderI) {
  const [popup, setPopup] = useState(false)

  return (
    <>
      <header>
        <div className="container">
          <Link href="/" className="brand">
            <img src="/assets/img/logo.brand.white.jpg" className="logo" />
          </Link>

          <div className="buttons">
            <Link className="link" href="/profile">
              Profile
            </Link>
            <Link className="link" href="/partner">
              Partner
            </Link>
            <Link className="link" href="/mint">
              Mint Now
            </Link>
            <a className="link" onClick={(e) => setPopup(true)}>
              Wallet
            </a>
          </div>
        </div>
      </header>
      <Wallet popup={popup} setPopup={setPopup} />
    </>
  )
}

export default Header
