import { clusterApiUrl, PublicKey } from '@solana/web3.js'
import programs from './programs.json'

export const CLUSTER =
  process.env.REACT_APP_CLUSTER === 'mainnet'
    ? 'mainnet'
    : process.env.REACT_APP_CLUSTER === 'testnet'
    ? 'testnet'
    : 'devnet'

export const SOLANA_HOST = process.env.REACT_APP_SOLANA_API_URL
  ? process.env.REACT_APP_SOLANA_API_URL
  : CLUSTER === 'mainnet'
  ? clusterApiUrl('mainnet-beta')
  : CLUSTER === 'testnet'
  ? clusterApiUrl('testnet')
  : 'https://api.devnet.solana.com'

export const STABLE_POOL_PROGRAM_ID = new PublicKey(
  'DSevVtPrgBKn4cKh1QUS6piPgvsQyDYf3wPz9vN4qZJY',
)

export const STABLE_POOL_IDL = programs