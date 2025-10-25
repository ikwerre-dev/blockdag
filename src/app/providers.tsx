"use client"
import React from 'react'
import { WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { defaultWagmiConfig } from '@web3modal/wagmi'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { blockdag } from '@/lib/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''
// Include BlockDAG alongside Ethereum chains
const chains = [mainnet, sepolia, blockdag] as const
const metadata = {
  name: 'Bivo Health',
  description: 'Web3 Medical Data Platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  icons: ['https://bivohealth.com/favicon.png']
}

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

if (projectId) {
  createWeb3Modal({ wagmiConfig, projectId })
}

// Create a single QueryClient instance for React Query
const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  )
}