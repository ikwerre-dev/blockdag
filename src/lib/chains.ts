import type { Chain } from 'viem'

// Configure via envs; defaults provided for development
const BLOCKDAG_ID = Number(process.env.NEXT_PUBLIC_BLOCKDAG_CHAIN_ID || 1043)
const BLOCKDAG_NAME = process.env.NEXT_PUBLIC_BLOCKDAG_CHAIN_NAME || 'BlockDAG'
const BLOCKDAG_RPC = process.env.NEXT_PUBLIC_BLOCKDAG_RPC_URL || '​https://rpc.awakening.bdagscan.com'
const BLOCKDAG_EXPLORER = process.env.NEXT_PUBLIC_BLOCKDAG_EXPLORER_URL || 'https://awakening.blockdag.network'
const BLOCKDAG_SYMBOL = process.env.NEXT_PUBLIC_BLOCKDAG_SYMBOL || 'BDAG'

export const blockdag: Chain = {
  id: BLOCKDAG_ID,
  name: BLOCKDAG_NAME,
  nativeCurrency: { name: BLOCKDAG_SYMBOL, symbol: BLOCKDAG_SYMBOL, decimals: 18 },
  rpcUrls: {
    default: { http: [BLOCKDAG_RPC] },
    public: { http: [BLOCKDAG_RPC] },
  },
  blockExplorers: {
    default: { name: `${BLOCKDAG_NAME} Explorer`, url: BLOCKDAG_EXPLORER },
  },
}