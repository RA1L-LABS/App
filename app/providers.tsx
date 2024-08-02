'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { WagmiProvider, http, createConfig } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

const oasisTestnet = {
  id: 23295,
  network: 'oasis-testnet',
  name: 'Oasis Testnet',
  nativeCurrency: { name: 'Oasis Token', symbol: 'ROSE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.sapphire.oasis.dev'] },
    public: { http: ['https://testnet.sapphire.oasis.dev'] }
  },
  blockExplorers: {
    default: {
      name: 'Oasis Explorer',
      url: 'https://explorer.oasis.io/testnet/sapphire',
      apiUrl: 'https://explorer.oasis.io/testnet/sapphire'
    }
  },
  testnet: true
}

const oasisMainnet = {
  id: 23294,
  network: 'oasis-mainnet',
  name: 'Oasis Mainnet',
  nativeCurrency: { name: 'Oasis Token', symbol: 'ROSE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sapphire.oasis.io'] },
    public: { http: ['https://sapphire.oasis.io'] }
  },
  blockExplorers: {
    default: {
      name: 'Oasis Explorer',
      url: 'https://explorer.oasis.io/mainnet/sapphire',
      apiUrl: 'https://explorer.oasis.io/mainnet/sapphire'
    }
  },
  testnet: false
}

export const config = createConfig({
  chains: [oasisTestnet, oasisMainnet],
  connectors: [injected(), coinbaseWallet()],
  ssr: true,
  transports: {
    [oasisMainnet.id]: http(),
    [oasisTestnet.id]: http()
  }
})

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers
