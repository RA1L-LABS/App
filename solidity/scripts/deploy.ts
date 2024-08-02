import 'colors'
// import '@oasisprotocol/sapphire-hardhat'
import '@nomicfoundation/hardhat-toolbox'
import hre, { network, ethers } from 'hardhat/internal/lib/hardhat-lib'
import { read, write } from 'fs-jetpack'

export interface ContractState {
  deployerAddress: string
  creditData: string
  disclosure: string
  sbt: string
  access: string
  ra1l: string
}

async function deploy() {
  console.log('Deploying to network'.green.bold, network.name)
  const state = JSON.parse(read('contracts.json') || '{}') as ContractState
  const [deployer] = await ethers.getSigners()
  await hre.run('compile')

  state.deployerAddress = deployer.address

  // Deploy AccessControl contract
  const RA1L = await hre.ethers.getContractFactory('RA1L')
  const ra1l = await RA1L.deploy()
  console.log('Successfully Deployed RA1L Contract'.green.bold, ra1l.target)

  state.ra1l = ra1l.target.toString()

  await ra1l.setPartner('0x780c516592dF289ba5ECeAafb39Ec39D685BB70B', true)
  console.log(
    'Successfully Set Partner'.green.bold,
    '0x780c516592dF289ba5ECeAafb39Ec39D685BB70B'
  )

  // Save state to file
  write('contracts.json', JSON.stringify(state, null, 2))
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
