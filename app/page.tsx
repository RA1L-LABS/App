'use client'

import Link from 'next/link'

function App() {
  return (
    <div className="container page splash-page">
      <h1>Welcome to RA1L</h1>
      <Link href="/mint" className="button">
        Click Here To Mint
      </Link>
    </div>
  )
}

export default App
