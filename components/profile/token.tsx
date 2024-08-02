import AccountType from 'types/prisma/Account'
import { useAccount } from 'wagmi'

export interface TokenI {
  data: AccountType
}

export function Token({ data }: TokenI) {
  const { chainId, address } = useAccount()

  return (
    <div className="profile-token">
      <h2>Your RA1L Token</h2>
      <div className="profile-labels">
        <div className="profile-label">
          <p>Verification Status</p>
          <p>{data.status?.toUpperCase()}</p>
        </div>
        <div className="profile-label">
          <p>Verification Type</p>
          <p>{data.personaClass?.toUpperCase()}</p>
        </div>
        <div className="profile-label">
          <p>Country</p>
          <p>{data.country?.toUpperCase()}</p>
        </div>
        <div className="profile-label profile-label-full">
          <p>Mint Transaction</p>
          <p>
            <a
              href={`https://explorer.oasis.io/${
                chainId === 23294 ? 'mainnet' : 'testnet'
              }/sapphire/tx/${data.nftTx}`}
              target={data.nftTx}
            >
              {data.nftTx}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Token
