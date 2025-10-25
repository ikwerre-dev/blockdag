"use client";

import { useState } from "react";
import Link from "next/link";

export default function TestEmail() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [emailType, setEmailType] = useState("welcome");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: emailType,
          email,
          firstName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send test email");
      }

      setResult({
        success: true,
        message: data.message,
      });
    } catch (error) {
      setResult({
        success: false,
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Email Test Page</h1>
          <p className="mt-2 text-sm text-gray-600">
            Use this page to test email functionality
          </p>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
          <p className="text-sm">
            <strong>Note:</strong> This page is for testing purposes only. Make sure your SMTP settings are configured correctly in your .env.local file.
          </p>
        </div>

        {result && (
          <div
            className={`mb-6 p-4 ${
              result.success ? "bg-green-50 text-green-700 border-green-400" : "bg-red-50 text-red-700 border-red-400"
            } border-l-4 rounded`}
          >
            <p className="text-sm">{result.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="emailType" className="block text-sm font-medium text-gray-700 mb-1">
              Email Type
            </label>
            <select
              id="emailType"
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="welcome">Welcome Email</option>
              <option value="login">Login Notification Email</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter recipient email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter recipient's first name"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#194dbe] hover:bg-[#0d2d70] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#194dbe] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Test Email"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[#194dbe] hover:text-[#0d2d70]">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}