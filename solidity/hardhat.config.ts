// import '@oasisprotocol/sapphire-hardhat'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-verify'
import '@nomicfoundation/hardhat-toolbox'

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      debug: {
        revertStrings: 'debug'
      }
    }
  },
  sourcify: {
    enabled: true
  },
  networks: {
    localhost: {
      url: 'HTTP://127.0.0.1:7545',
      allowUnlimitedContractSize: true
    },
    'arb-sepolia': {
      url: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
      chainId: 421614,
      accounts,
      allowUnlimitedContractSize: true
    },
    'opt-sepolia': {
      url: `https://optimism-sepolia.blockpi.network/v1/rpc/public`,
      chainId: 11155420,
      accounts,
      allowUnlimitedContractSize: true
    },
    'sapphire-mainnet': {
      url: 'https://sapphire.oasis.io',
      chainId: 0x5afe,
      accounts,
      allowUnlimitedContractSize: true
    },
    'sapphire-testnet': {
      url: 'https://testnet.sapphire.oasis.dev',
      chainId: 0x5aff,
      accounts,
      allowUnlimitedContractSize: true
    },
    'polygon-testnet': {
      url: 'https://polygon-mumbai-bor.publicnode.com',
      chainId: 80001,
      accounts
    }
  }
}

export default config
