"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, User, Phone, Check } from "lucide-react"
import Image from "next/image"
import { useAccount } from "wagmi"
import { useWeb3Modal } from "@web3modal/wagmi/react"

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [userType, setUserType] = useState<"user" | "provider">("user")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError("Please fill in all fields")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const nextStep = () => {
    if (validateStep1()) {
      setError("")
      setStep(2)
    }
  }

  const prevStep = () => {
    setError("")
    setStep(1)
  }

  const connectWallet = async () => {
    try {
      await open()
    } catch (e) {
      setError("Failed to open wallet modal")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !address) {
      setError("Please connect your wallet to continue")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          type: userType,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      router.push("/login?registered=true")
      // Keep loader shown until route changes
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-[#194dbe] relative">
        <div className="absolute inset-0 bg-[#194dbe] opacity-90"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <Image src="/logo.png" alt="Bivo Health Logo" width={180} height={60} className="mb-12" />
          <h1 className="text-3xl font-bold mb-6">Join Bivo Health</h1>
          <p className="text-xl mb-8 max-w-md text-center">
            Create your account to securely manage and share your health data.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <Image src="/logo.png" alt="Bivo Health Logo" width={160} height={50} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h2>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-[#194dbe] text-white' : 'bg-gray-200 text-gray-500'} mr-2`}>1</div>
              <div className={`h-1 flex-1 ${step >= 2 ? 'bg-[#194dbe]' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-[#194dbe] text-white' : 'bg-gray-200 text-gray-500'} ml-2`}>2</div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Profile</span>
              <span className="text-xs text-gray-500">Wallet</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserType('user')}
                      className={`py-2 px-3 rounded-lg border ${userType === 'user' ? 'border-[#194dbe] bg-blue-50' : 'border-gray-300'} flex items-center justify-center`}
                    >
                      <Check className={`mr-2 h-4 w-4 ${userType === 'user' ? 'text-[#194dbe]' : 'text-transparent'}`} />
                      User
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('provider')}
                      className={`py-2 px-3 rounded-lg border ${userType === 'provider' ? 'border-[#194dbe] bg-blue-50' : 'border-gray-300'} flex items-center justify-center`}
                    >
                      <Check className={`mr-2 h-4 w-4 ${userType === 'provider' ? 'text-[#194dbe]' : 'text-transparent'}`} />
                      Provider
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] sm:text-sm"
                        placeholder="First Name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] sm:text-sm"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#194dbe] hover:bg-[#0d2d70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#194dbe]"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-6 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Wallet Status</div>
                      <div className="font-mono text-gray-900">
                        {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={connectWallet}
                      className="py-2 px-4 rounded-lg border border-[#194dbe] text-[#194dbe] hover:bg-blue-50"
                    >
                      {isConnected ? 'Change Wallet' : 'Connect Wallet'}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4 mb-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#194dbe]"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#194dbe] hover:bg-[#0d2d70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#194dbe] disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#194dbe] hover:text-[#0d2d70]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}