# Selective Disclosure Solidity Contracts

## Development

```bash
# Install node_modules
yarn
# Compile solidity
npx hardhat compile
# Load Private Key
export PRIVATE_KEY="..."
```

Local Deployment

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Testnet Deployment

```bash
npx hardhat run scripts/deploy.ts --network sapphire-testnet
```

Mainnet Deployment

```bash
npx hardhat run scripts/deploy.ts --network sapphire-mainnet
```
