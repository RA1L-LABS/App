import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export interface WalletI {
  popup: boolean
  setPopup: (popup: boolean) => void
}

export function Wallet({ popup, setPopup }: WalletI) {
  const [err, setError] = useState(false)
  const { address } = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  function label(name: string) {
    if (name === 'Injected') {
      return 'MetaMask'
    }
    return name
  }

  useEffect(() => {
    const timeout = setTimeout(() => setError(false), 3000)
    return () => clearTimeout(timeout)
  }, [err])

  return (
    <div className={`popup${popup ? ' visible' : ''}`}>
      <div className="popup-content popup-wallet">
        <a className="button close-button" onClick={() => setPopup(false)}>
          Close
        </a>
        <h2>Connect Wallet</h2>
        <p>Your wallet is {address ? 'connected' : 'not connected'}</p>
        {address && <p>Connected wallet address {address}</p>}

        {!address && (
          <div className="connect-options">
            {connectors
              .filter((connector) => connector.name !== 'Injected')
              .map((connector) => (
                <button
                  key={connector.uid}
                  className="connect-button"
                  onClick={() => {
                    try {
                      if (address) {
                        disconnect()
                      } else {
                        connect({ connector })
                      }
                    } catch (error) {
                      console.log('error')
                      setError(true)
                    }
                  }}
                  type="button"
                >
                  Connect with {label(connector.name)}
                </button>
              ))}
          </div>
        )}

        {address && (
          <div className="connect-options">
            <button onClick={(e) => disconnect()} className="connect-button">
              Disconnect
            </button>
          </div>
        )}

        {err ||
          (error && (
            <p className="error">
              There was an issue minting your token. Try again.
            </p>
          ))}
      </div>
    </div>
  )
}

export default Wallet
