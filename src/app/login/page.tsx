"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAccount } from "wagmi"
import { useWeb3Modal } from "@web3modal/wagmi/react"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()

  const connectWallet = async () => {
    try {
      await open()
    } catch (e) {
      setError("Failed to open wallet modal")
    }
  }

  const loginWithWallet = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet to continue")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login failed")
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-[#194dbe] relative">
        <div className="absolute inset-0 bg-[#194dbe] opacity-90"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <Image
            src="/logo.png"
            alt="VelTrust Logo"
            width={50}
            height={40}
          />          <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-xl mb-8 max-w-md text-center">Access your account to manage and share your health data securely.</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <Image src="/logo.png" alt="Bivo Health Logo" width={160} height={50} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

          <div className="mb-6 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Wallet Status</div>
                <div className="font-mono text-gray-900">{isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}</div>
              </div>
              <button type="button" onClick={connectWallet} className="py-2 px-4 rounded-lg border border-[#194dbe] text-[#194dbe] hover:bg-blue-50">
                {isConnected ? "Change Wallet" : "Connect Wallet"}
              </button>
            </div>
          </div>

          <button type="button" onClick={loginWithWallet} disabled={loading || !isConnected} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#194dbe] hover:bg-[#0d2d70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#194dbe] disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in with Wallet"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account? <Link href="/register" className="font-medium text-[#194dbe] hover:text-[#0d2d70]">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}