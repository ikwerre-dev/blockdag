"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function PrivacyPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({
    name: true,
    email: false,
    phone: false,
    bloodType: true,
    address: false,
  });

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch("/api/card", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.card?.visibleFields) {
          setVisibleFields({ ...visibleFields, ...data.card.visibleFields });
        }
      } catch (e) {
        setError("Failed to load privacy settings");
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleField = (key: string) => {
    setVisibleFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const save = async () => {
    try {
      const res = await fetch("/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibleFields }),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Privacy settings saved");
    } catch (e) {
      setError("Failed to save privacy settings");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Privacy Settings</h1>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#194dbe]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <p className="text-sm text-gray-600 mb-4">Choose which information appears on your medical card.</p>
            <div className="space-y-3">
              {Object.entries(visibleFields).map(([key, val]) => (
                <label key={key} className="flex items-center">
                  <input type="checkbox" checked={val} onChange={() => toggleField(key)} className="mr-3" />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
            <button onClick={save} className="mt-6 px-4 py-2 bg-[#194dbe] text-white rounded-lg">Save</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}