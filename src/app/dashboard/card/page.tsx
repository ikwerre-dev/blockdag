"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { useUserData } from "@/hooks/useUserData";

export default function MedicalCardPage() {
  const { userData } = useUserData();
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
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-[#194dbe] relative text-white p-6 py-[3rem]" style={{ backgroundColor: color }}>
                <Image
                  src={'/doodle.png'}
                  fill
                  alt="doodle"
                  draggable={false}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="z-0 absolute opacity-5 object-cover"
                />
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg z-10 font-medium">Medical Card Preview</h2>
                </div>
                <div className="flex z-10 items-baseline flex-col">
                  <div className="flex items-baseline">
                    <span className="text-2xl z-10 font-bold">{userData?.first_name ?? ""} {userData?.last_name ?? ""}</span>
                    <span className="ml-2 z-10 text-sm opacity-80">@{userData?.p2p_code || "handle"}</span>
                  </div>
                  <div className="flex items-baseline mt-2">
                    <span className="text-sm z-10 opacity-90">{userData?.email || ""}</span>
                    <span className="ml-2 z-10 text-xs opacity-80">Contact</span>
                  </div>
                  <div className="flex items-baseline mt-3">
                    <span className="text-sm z-10">{text || "Customize your ICE or helpful note here"}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                {userData?.id && (
                  <Link href={`/view/${userData.id}`} className="inline-block text-[#194dbe] underline">Public card link</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}