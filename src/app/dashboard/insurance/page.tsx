"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";

interface Insurance {
  id: string;
  userId: string;
  provider: string;
  policyNumber?: string | null;
  coverage?: string | null;
  phone?: string | null;
  createdAt: string;
}

export default function InsurancePage() {
  const [items, setItems] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [provider, setProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [coverage, setCoverage] = useState("");
  const [phone, setPhone] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/insurance");
      if (!res.ok) throw new Error("Failed to fetch insurance");
      setItems(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setProvider("");
    setPolicyNumber("");
    setCoverage("");
    setPhone("");
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        provider,
        policyNumber: policyNumber || undefined,
        coverage: coverage || undefined,
        phone: phone || undefined,
      };
      let res: Response;
      if (editingId) {
        res = await fetch(`/api/insurance/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/insurance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Failed to submit insurance");
      await fetchItems();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const startEdit = (i: Insurance) => {
    setEditingId(i.id);
    setProvider(i.provider);
    setPolicyNumber(i.policyNumber || "");
    setCoverage(i.coverage || "");
    setPhone(i.phone || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this insurance entry?")) return;
    try {
      const res = await fetch(`/api/insurance/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete insurance");
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Insurance</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 bg-[#194dbe] text-white rounded-lg hover:bg-[#153fa0]">Add Insurance</button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>}

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Provider</label>
                <input value={provider} onChange={(e) => setProvider(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Policy Number</label>
                <input value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Coverage</label>
                <input value={coverage} onChange={(e) => setCoverage(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={handleSubmit} className="px-4 py-2 bg-[#194dbe] text-white rounded-lg hover:bg-[#153fa0]">{editingId ? "Update Insurance" : "Create Insurance"}</button>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-600">No insurance information yet.</p>
            <p className="text-sm text-gray-500 mt-1">Add your insurance provider details to streamline care.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ul className="divide-y divide-gray-100">
              {items.map((i) => (
                <li key={i.id} className="py-4 flex items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{i.provider}</p>
                    {i.policyNumber && <p className="text-sm text-gray-600 mt-1">Policy: {i.policyNumber}</p>}
                    {i.coverage && <p className="text-sm text-gray-600 mt-1">Coverage: {i.coverage}</p>}
                    {i.phone && <p className="text-xs text-gray-400 mt-1">{i.phone}</p>}
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button onClick={() => startEdit(i)} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Edit</button>
                    <button onClick={() => handleDelete(i.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}