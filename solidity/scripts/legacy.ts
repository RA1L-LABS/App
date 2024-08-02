import 'colors'
import '@oasisprotocol/sapphire-hardhat'
import '@nomicfoundation/hardhat-toolbox'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import { getContractAddress } from '@ethersproject/address'
import hre, { network, ethers } from 'hardhat/internal/lib/hardhat-lib'
import { read, write } from 'fs-jetpack'
export interface ContractState {
  deployerAddress: string
  creditData: string
  disclosure: string
  sbt: string
  access: string
}

async function predictContractAddress(
  deployer: HardhatEthersSigner,
  nonce: number
) {
  const futureAddress = getContractAddress({
    from: deployer.address,
    nonce
  })
  return futureAddress
}

async function deploy() {
  console.log('Deploying to network'.green.bold, network.name)
  const state = JSON.parse(read('contracts.json') || '{}') as ContractState
  const [deployer] = await ethers.getSigners()
  await hre.run('compile')

  state.deployerAddress = deployer.address

  // Predict AccessControl address
  const deployerNonce = await deployer.getNonce()
  const predictedAccessAddress = await predictContractAddress(
    deployer,
    deployerNonce + 6
  )
  console.log(
    'Predicted AccessControl Contract Address'.green.bold,
    predictedAccessAddress
  )

  // Deploy CreditData contract
  const CreditData = await hre.ethers.getContractFactory('CreditData')
  const creditData = await CreditData.deploy()
  console.log(
    'Successfully Deployed Credit Data Contract'.green.bold,
    creditData.target
  )

  // Deploy Disclosure contract with the predicted AccessControl address
  const Disclosure = await hre.ethers.getContractFactory('Disclosure')
  const disclosureTx = await Disclosure.getDeployTransaction(
    creditData.target,
    predictedAccessAddress
  )
  const estimatedGas = await ethers.provider.estimateGas(disclosureTx)
  console.log('Disclosure Gas Limit'.green.bold, estimatedGas * 2n)
  const disclosure = await Disclosure.deploy(
    creditData.target,
    predictedAccessAddress,
    {
      gasLimit: estimatedGas * 2n
    }
  )
  console.log(
    'Successfully Deployed Disclosure Contract'.green.bold,
    disclosure.target
  )

  // Deploy CreditSBTv1 contract
  const Sbt = await hre.ethers.getContractFactory('CreditSBTv1')
  const sbt = await Sbt.deploy(creditData.target)
  console.log('Successfully Deployed SBT Contract'.green.bold, sbt.target)

  await creditData.setDisclosure(disclosure.target)
  await creditData.setSbt(sbt.target)
  await creditData.setWriter(deployer.address)
  console.log('Configured Credit Data contract'.green.bold)

  // Update state with contract addresses
  state.creditData = creditData.target.toString()
  state.disclosure = disclosure.target.toString()
  state.sbt = sbt.target.toString()

  // Deploy AccessControl contract
  const Access = await hre.ethers.getContractFactory('AccessControl')
  const access = await Access.deploy(state.disclosure)
  console.log(
    'Successfully Deployed AccessControl Contract'.green.bold,
    access.target
  )

  state.access = access.target.toString()

  // Save state to file
  write('contracts.json', JSON.stringify(state, null, 2))
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
