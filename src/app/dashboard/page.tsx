"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useUserData } from "@/hooks/useUserData";
import timeAgo from "@/helpers/timeAgo";
import { FileText, User, Shield, ChevronRight, CreditCard } from "lucide-react";
import ScansChart from "@/components/ScansChart";

export default function Dashboard() {
  const { userData, records, loading, error, reload } = useUserData();
  const [viewsCount, setViewsCount] = useState<number>(0);
  const [viewsByDay, setViewsByDay] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchViews = async () => {
      if (!userData?.id) return;
      try {
        const res = await fetch(`/api/card?userId=${userData.id}`);
        const data = await res.json();
        const card = data.card || {};
        setViewsCount(card.viewsCount || 0);
        setViewsByDay(card.viewsByDay || {});
      } catch {}
    };
    fetchViews();
  }, [userData?.id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#194dbe]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={reload}
            className="mt-4 px-4 py-2 bg-[#194dbe] text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const firstName = (userData?.first_name || "").trim();
  const lastName = (userData?.last_name || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Welcome";

  const recordsCount = records?.length || 0;
  const appointmentsCount = 0; // Placeholder until appointments data exists

  // moved viewsCount and viewsByDay hooks to the top-level before conditional returns

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
       

          {/* Scans chart with doodle background */}
          <div className="relative overflow-hidden rounded-xl shadow-sm p-6">
            <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: '#194dbe' }}></div>
            <Image
              src={'/doodle.png'}
              fill
              alt="doodle"
              draggable={false}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="z-0 absolute opacity-5 object-cover rounded-xl"
            />
            <Image src="/logo-transparent.png" alt="logo" width={60} height={20} className="absolute top-3 right-3 z-10 opacity-90" />

            <div className="relative z-10">
              <h2 className="text-lg font-medium text-white">Hello, {fullName}</h2>
              <p className="text-sm text-white/80 mt-1">Manage your medical records, appointments, providers, and insurance from one place.</p>
              {/* Stats grid inspired by doodle design */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <div className="text-xs text-white/80">Records Updated</div>
                  <div className="mt-1 text-2xl font-bold text-white">{recordsCount}</div>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <div className="text-xs text-white/80">Appointments</div>
                  <div className="mt-1 text-2xl font-bold text-white">{appointmentsCount}</div>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <div className="text-xs text-white/80">Scanned Times</div>
                  <div className="mt-1 text-2xl font-bold text-white">{viewsCount}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/dashboard/records" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-[#194dbe10] transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-[#194dbe]" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">Update medical records</span>
              </Link>
              <Link href="/dashboard/profile" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-[#194dbe10] transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-[#194dbe]" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">Update profile</span>
              </Link>
              <Link href="/dashboard/privacy" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-[#194dbe10] transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 text-[#194dbe]" />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">Set privacy settings</span>
              </Link>
            </div>
            <div className="mt-4 text-sm text-gray-600">Configure which data appears on your card in Privacy.</div>
          </div>

          {/* Recent records */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Recent Records</h2>
              <Link href="/dashboard/records" className="text-[#194dbe] text-sm font-medium hover:underline flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            {records && records.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {records.slice(0, 5).map((r) => (
                  <li key={r.id} className="py-3 flex items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{r.title}</p>
                      {r.description && <p className="text-sm text-gray-600 mt-0.5">{r.description}</p>}
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(r.created_at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No records yet. When your provider uploads records, they will appear here.</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Order medical card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Medical Card</h2>
            <p className="text-sm text-gray-600 mb-4">Customize and order your medical card; then share your public link.</p>
            <Link href="/dashboard/card" className="inline-flex items-center gap-2 bg-[#194dbe] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              <CreditCard className="w-4 h-4" />
              Order Card
            </Link>
          </div>

          {/* Scans chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium text-gray-800">Card Scans</h2>
              <span className="text-xs text-gray-500">Last 7 days</span>
            </div>
            <ScansChart data={viewsByDay} />
          </div>
          {/* Support card */}
          <div className="bg-gradient-to-r from-[#194dbe] to-[#3a6ad4] rounded-xl shadow-sm p-6 text-white">
            <h2 className="text-lg font-medium mb-2">Need Help?</h2>
            <p className="text-white/80 mb-4">Our support team can assist with accessing records and connecting providers.</p>
            <Link
              href="/dashboard/help"
              className="inline-block bg-white text-[#194dbe] px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}