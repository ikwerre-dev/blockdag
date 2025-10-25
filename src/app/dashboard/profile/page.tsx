"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Save, Loader2Icon } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import Image from "next/image";
import { TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
  last_login: Date;
  p2p_code: string;
}

export default function Profile() {
  const { userData, loading, error, convert, reload } = useUserData();
  const [editedUser, setEditedUser] = useState<UserData | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state for saving

  // 20 currency conversions
  const conversions = [
    { to: "eur", from: "usd", label: "Euro", flag: "eu" },
    { to: "gbp", from: "usd", label: "British Pound", flag: "gb" },
    { to: "jpy", from: "usd", label: "Japanese Yen", flag: "jp" },
    { to: "cny", from: "usd", label: "Chinese Yuan", flag: "cn" },
    { to: "zar", from: "usd", label: "South African Rand", flag: "za" },
    { to: "aud", from: "usd", label: "Australian Dollar", flag: "au" },
    { to: "cad", from: "usd", label: "Canadian Dollar", flag: "ca" },
    { to: "chf", from: "usd", label: "Swiss Franc", flag: "ch" },
    { to: "inr", from: "usd", label: "Indian Rupee", flag: "in" },
    { to: "brl", from: "usd", label: "Brazilian Real", flag: "br" },
    { to: "mxn", from: "usd", label: "Mexican Peso", flag: "mx" },
    { to: "sgd", from: "usd", label: "Singapore Dollar", flag: "sg" },
    { to: "hkd", from: "usd", label: "Hong Kong Dollar", flag: "hk" },
    { to: "krw", from: "usd", label: "South Korean Won", flag: "kr" },
    { to: "nzd", from: "usd", label: "New Zealand Dollar", flag: "nz" },
    { to: "sek", from: "usd", label: "Swedish Krona", flag: "se" },
    { to: "nok", from: "usd", label: "Norwegian Krone", flag: "no" },
    { to: "rub", from: "usd", label: "Russian Rubles", flag: "ru" },
    { to: "try", from: "usd", label: "Turkish Lira", flag: "tr" },
    { to: "aed", from: "usd", label: "UAE Dirham", flag: "ae" },
  ];

  // State for ticker animation
  const [visibleConversions, setVisibleConversions] = useState(conversions.slice(0, 5));
  const [nextConversionIndex, setNextConversionIndex] = useState(5);

  // Initialize editedUser when userData is loaded
  useEffect(() => {
    if (userData) {
      setEditedUser({
        id: userData.id,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email,
        phone: userData.phone || "",
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        last_login: userData.last_login,
        p2p_code: userData.p2p_code || "",
      });
    }
  }, [userData]);

  // Ticker animation logic
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleConversions((prev) => {
        const newConversions = [...prev.slice(1)]; // Remove the first item
        const nextConversion = conversions[nextConversionIndex % conversions.length];
        newConversions.push(nextConversion); // Append the next conversion
        return newConversions;
      });
      setNextConversionIndex((prev) => (prev + 1) % conversions.length);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [nextConversionIndex]);

  if (loading || !editedUser) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2Icon className="text-blue-700 animate-spin" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const handleChange = (field: keyof UserData, value: string) => {
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    setIsSaving(true); // Start saving state
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: editedUser.first_name,
          last_name: editedUser.last_name,
          phone: editedUser.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setIsEditing(false);
      toast.success("Profile updated successfully");
      reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setIsSaving(false); // End saving state
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
            <p className="text-gray-500 mt-1">Manage your account information</p>
          </div>

          <div className="p-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-700 focus:border-blue-700"
                      value={editedUser.first_name}
                      onChange={(e) => handleChange("first_name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-700 focus:border-blue-700"
                      value={editedUser.last_name}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      value={editedUser.email}
                      disabled={true}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-700 focus:border-blue-700"
                      value={editedUser.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      P2P Code
                    </label>
                    <input
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      value={editedUser.p2p_code}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created At
                    </label>
                    <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
                      {new Date(editedUser.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Updated
                    </label>
                    <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
                      {new Date(editedUser.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Login
                    </label>
                    <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
                      {new Date(editedUser.last_login).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-6 py-2 font-medium rounded-lg transition-colors ${
                    isEditing
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
                <button
                  onClick={handleSave}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center transition-colors ${
                    isEditing
                      ? isSaving
                        ? "bg-blue-500 text-white cursor-not-allowed"
                        : "bg-blue-700 text-white hover:bg-blue-800 border-2 border-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isEditing || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Rates */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Exchange Rates</h2>
              <span className="text-sm text-gray-500">Updated just now</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-hidden">
              {visibleConversions.map(({ from, to, label, flag }, index) => {
                const value = convert(1, from, to);

                return (
                  <div
                    key={`${from}-${to}-${index}`}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg animate-ticker"
                  >
                    <div className="flex items-center">
                      <div className="w-8 relative h-8 mr-3 border border-[#194dbe40] rounded-full overflow-hidden">
                        <Image
                          src={`https://flagcdn.com/w320/${flag}.png`}
                          alt={from.toUpperCase()}
                          fill
                          className="object-cover absolute"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{`${from.toUpperCase()}/${to.toUpperCase()}`}</p>
                        <p className="text-sm text-gray-500">{label}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {value.toFixed(2)} {to.toUpperCase()}
                      </p>
                      {value < 1 ? (
                        <p className="text-xs text-green-600 flex items-center justify-end">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {((1 - value) * 100).toFixed(2)}%
                        </p>
                      ) : (
                        <p className="text-xs text-red-600 flex items-center justify-end">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {((value - 1) * 100).toFixed(2)}%
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for ticker animation */}
      <style jsx>{`
        .animate-ticker {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </DashboardLayout>
  );
}