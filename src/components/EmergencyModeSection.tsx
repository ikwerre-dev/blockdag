"use client";
import Link from "next/link";
import { ShieldAlert, Activity, KeyRound } from "lucide-react";

export default function EmergencyModeSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f8fbff]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-[#194dbe10]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-md">
              <ShieldAlert className="w-6 h-6 text-[#194dbe]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#194dbe]">Emergency Mode</h2>
          </div>
          <p className="text-gray-700 mb-6">
            In emergencies, you can enable a time-limited access mode that lets authorized doctors quickly view critical medical data you choose to share. This access is revocable and logged for transparency.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-5 h-5 text-[#194dbe]" />
                <span className="font-medium text-gray-800">Encrypted by default</span>
              </div>
              <p className="text-sm text-gray-600">Records remain end-to-end encrypted; only the minimum you allow is exposed.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-[#194dbe]" />
                <span className="font-medium text-gray-800">Audited access</span>
              </div>
              <p className="text-sm text-gray-600">Every emergency access is logged with timestamp and provider identity.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-5 h-5 text-[#194dbe]" />
                <span className="font-medium text-gray-800">One-tap revoke</span>
              </div>
              <p className="text-sm text-gray-600">You can disable emergency mode instantly from your dashboard.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/privacy" className="bg-[#194dbe] text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90">
              Configure visibility
            </Link>
            <Link href="/dashboard/records" className="border border-[#194dbe] text-[#194dbe] px-6 py-3 rounded-md font-medium hover:bg-[#194dbe] hover:text-white">
              Manage records
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}