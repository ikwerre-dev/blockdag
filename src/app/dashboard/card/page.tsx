"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { useUserData } from "@/hooks/useUserData";
import Image from "next/image";

export default function MedicalCardPage() {
  const { userData, records } = useUserData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState("#194dbe");
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch("/api/card", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.card) {
          setColor(data.card.color || "#194dbe");
          setText(data.card.text || "");
        }
      } catch (e) {
        setError("Failed to load card settings");
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, []);

  const save = async () => {
    try {
      const res = await fetch("/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color, text }),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Card order saved");
    } catch (e) {
      setError("Failed to save card order");
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://VelTrust.com";
  const profileUrl = userData?.id ? `${baseUrl}/view/${userData.id}` : "";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Medical Card</h1>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#194dbe]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {error && <p className="text-red-600 mb-4">{error}</p>}
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm text-gray-700">Card Color</span>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-2 h-10 w-20 p-0 border rounded" />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-700">Card Text</span>
                  <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g., ICE: Call 555-1234" className="mt-2 w-full border rounded px-3 py-2" />
                </label>
                <button onClick={save} className="px-4 py-2 bg-[#194dbe] text-white rounded-lg">Save</button>
              </div>

              {/* Recent records under settings */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Recent Scans & Records</h3>
                {records && records.length > 0 ? (
                  <div className="space-y-2">
                    {records.slice(0, 3).map(r => (
                      <div key={r.id} className="border rounded-lg p-3">
                        <div className="font-medium">{r.title}</div>
                        {r.description && <div className="text-sm text-gray-600 mt-1">{r.description}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">No recent records.</div>
                )}
              </div>
            </div>

            {/* Card preview */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-center p-6">
                <div className="relative" style={{ width: 340, height: 214 }}>
                  {/* Blue header card area with doodle */}
                  <div className="absolute inset-0 bg-[#194dbe] rounded-xl" style={{ backgroundColor: color }}></div>
                  <Image
                    src={'/doodle.png'}
                    fill
                    alt="doodle"
                    draggable={false}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="z-0 absolute opacity-5 object-cover rounded-xl"
                  />
                  {/* Top-right logo overlay */}
                  <Image src="/logo-transparent.png" alt="logo" width={60} height={20} className="absolute top-3 right-3 z-10 opacity-90" />

                  <div className="absolute inset-0 p-4 text-white z-10 flex flex-col justify-between">
                    <div>
                      <div className="text-xl font-bold">{userData?.first_name ?? ""} {userData?.last_name ?? ""}</div>
                      <div className="text-xs opacity-80">@{userData?.p2p_code || "handle"}</div>
                      <div className="text-xs mt-2 opacity-90">{userData?.email || ""}</div>
                      <div className="text-xs mt-2">{text || "Customize your ICE or helpful note here"}</div>
                    </div>
                    <div className="flex items-center justify-between text-xs opacity-90">
                      <span>Encrypted</span>
                      {profileUrl && (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(profileUrl)}`}
                          alt="Profile QR"
                          className="rounded"
                          style={{ width: 48, height: 48 }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                {userData?.id && (
                  <Link href={`/view/${userData.id}`} className="inline-block text-[#194dbe] underline">Public card link</Link>
                )}
                {profileUrl && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>Scan the QR to open</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}