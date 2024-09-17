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
  '2SeFqJPiM5MoTh3PdDBJn2jveCsYYk7GSMuABJ3zvpzc',
)

export const STABLE_POOL_IDL = programs