import * as anchor from '@project-serum/anchor'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { STABLE_POOL_IDL, STABLE_POOL_PROGRAM_ID } from './const'

export function getProgramInstance(connection: any, wallet: any) {
  if (!wallet.publicKey) throw new WalletNotConnectedError()

  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions(),
  )

  const idl: any = STABLE_POOL_IDL

  const programId = STABLE_POOL_PROGRAM_ID

  const program = new anchor.Program(idl, programId, provider)

  return program
}