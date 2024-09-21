import * as anchor from '@project-serum/anchor'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { STABLE_POOL_IDL, STABLE_POOL_PROGRAM_ID } from './const'

export function getProgramInstance(connection: any, wallet: any) {
  if (!wallet.publicKey) throw new WalletNotConnectedError()

  // Log the wallet and connection to debug
  console.log('Wallet:', wallet);
  console.log('Connection:', connection);

  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions(),
  )


  // Log the IDL and Program ID for debugging
  console.log('STABLE_POOL_IDL:', STABLE_POOL_IDL);
  console.log('STABLE_POOL_PROGRAM_ID:', STABLE_POOL_PROGRAM_ID);

  const program = new anchor.Program(STABLE_POOL_IDL as anchor.Idl, STABLE_POOL_PROGRAM_ID, provider)

  // Return the program instance
  return program;
}