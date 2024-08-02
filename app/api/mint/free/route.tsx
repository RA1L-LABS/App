import RA1L from 'util/RA1L.json'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { ethers } from 'ethers'
import { NextRequest } from 'next/server'
import { getSession } from 'util/session'
import { getContract, getRpc, hexConverter, PRIVATE_KEY } from 'util/wallet'
import prisma from 'prisma/client'

export async function POST(req: NextRequest) {
  const session = await getSession()
  const { searchParams } = new URL(req.url)

  try {
    const { network, data } = await req.json()
    const address = session.address || ''

    console.log(network)
    console.log(getRpc(network || 0))

    const wallet = new ethers.Wallet(
      PRIVATE_KEY,
      new ethers.JsonRpcProvider(getRpc(network || 0))
    )
    const signer = await sapphire.wrapEthersSigner(wallet)

    const contract = new ethers.Contract(
      getContract(network || 0),
      RA1L.abi,
      signer
    )
    const tx = await contract.mintFor(address, data)
    console.log('Tx Minted')
    console.log(tx)
    const hash = tx.hash

    await prisma.account.update({
      where: {
        address_network: {
          address,
          network: hexConverter(network || 0)
        }
      },
      data: {
        nftTx: hash
      }
    })

    return Response.json(
      {
        status: 'OK'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      {
        status: 'ERROR',
        error
      },
      { status: 500 }
    )
  }
}
