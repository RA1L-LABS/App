'use client'
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi'

export interface SwitchI {}

export function Switch({}: SwitchI) {
  const { address, chainId } = useAccount()
  const { chains, switchChain } = useSwitchChain()
  const { disconnect } = useDisconnect()

  function displaySwitch() {
    return (
      chains.filter((chain) => chain.id === chainId).length === 0 &&
      (address || '').length > 0
    )
  }

  if (displaySwitch()) {
    return (
      <div className="popup visible">
        <div className="popup-content panel swap-network">
          <h2>Switch to a valid Network</h2>
          {chains.map((chain) => (
            <a
              className="button"
              onClick={(e) => switchChain({ chainId: chain.id })}
              key={chain.id}
            >
              {chain.name}
            </a>
          ))}

          <a className="link" onClick={(e) => disconnect()}>
            Or disconnect and try a different wallet
          </a>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default Switch
