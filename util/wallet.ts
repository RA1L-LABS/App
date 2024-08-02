export const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  ''

export const RA1L_CONTRACTS = {
  // TESTNET
  '0x5aff': '0xe47240B6324D446B449a2D1A969A0EEFb5525C03',
  // MAINNET
  '0x5afe': '0xc90a97BbeE6ea51CBddfb0AFC86486b1940BBF6b'
}

export function getContract(chainId: string | number) {
  const conv = hexConverter(chainId)
  if (conv === '0x5aff' || conv === '5aff') {
    return RA1L_CONTRACTS['0x5aff'] as string
  } else {
    return RA1L_CONTRACTS['0x5afe'] as string
  }
}

export function getRpc(chainId: string | number) {
  const conv = hexConverter(chainId)
  if (conv === '0x5aff' || conv === '5aff') {
    return 'https://testnet.sapphire.oasis.dev'
  } else {
    return 'https://sapphire.oasis.io'
  }
}

/*
  Sapphire Testnet - 0x5aff
  Sapphire Mainnet - 0x5afe
*/
export type Chains = '0x5aff' | '0x5afe'

export const targetNetwork = ['0x5aff', '0x5afe']

export function hexConverter(value: string | number): string {
  if (typeof value === 'string') {
    return value
  } else {
    return Number(value).toString(16)
  }
}

export function hexToNumber(value: string | number): number {
  if (typeof value === 'number') {
    return value
  } else {
    return parseInt(value, 16)
  }
}
