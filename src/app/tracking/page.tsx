"use client"

import { useState } from "react";
import { Search } from "lucide-react";
import Receipt from "@/components/receipt/Receipt";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [transaction, setTransaction] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!trackingId.trim()) {
      setError("Please enter a tracking ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/transactions/track/${trackingId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Transaction not found");
      }

      setTransaction(data.transaction);
    } catch (err: any) {
      setError(err.message || "Failed to find transaction");
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="VelTrust Logo"
            width={200}
            height={50}
            className="mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Track Your Transaction
          </h1>
          <p className="text-gray-600">
            Enter your tracking ID to view transaction details
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe]"
                placeholder="Enter tracking ID..."
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full mt-3 bg-[#194dbe] text-white py-2 px-4 rounded-lg hover:bg-[#194dbe]/90 transition-colors"
            >
              Track Transaction
            </button>
            {error && (
              <p className="mt-2 text-center text-red-600 text-sm">{error}</p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#194dbe] mx-auto"></div>
          </div>
        )}

        {/* Receipt */}
        {transaction && <Receipt transaction={transaction} />}

        {/* Back to Dashboard Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[#194dbe] hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}