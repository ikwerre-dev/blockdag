"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";

interface Doctor {
  id: string;
  userId: string;
  name: string;
  specialty?: string | null;
  phone?: string | null;
  createdAt: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [phone, setPhone] = useState("");

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/doctors");
      if (!res.ok) throw new Error("Failed to fetch doctors");
      setDoctors(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSpecialty("");
    setPhone("");
  };

  const handleSubmit = async () => {
    try {
      const payload = { name, specialty: specialty || undefined, phone: phone || undefined };
      let res: Response;
      if (editingId) {
        res = await fetch(`/api/doctors/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Failed to submit doctor");
      await fetchDoctors();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const startEdit = (d: Doctor) => {
    setEditingId(d.id);
    setName(d.name);
    setSpecialty(d.specialty || "");
    setPhone(d.phone || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this doctor?")) return;
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete doctor");
      await fetchDoctors();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-[#194dbe] text-white rounded-lg hover:bg-[#153fa0]"
          >
            Add Doctor
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialty</label>
                <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={handleSubmit} className="px-4 py-2 bg-[#194dbe] text-white rounded-lg hover:bg-[#153fa0]">
                {editingId ? "Update Doctor" : "Create Doctor"}
              </button>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        )}

        {doctors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-600">No linked providers yet.</p>
            <p className="text-sm text-gray-500 mt-1">Connect your healthcare providers to view and share records.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ul className="divide-y divide-gray-100">
              {doctors.map((d) => (
                <li key={d.id} className="py-4 flex items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{d.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{d.specialty || "General"}</p>
                    {d.phone && <p className="text-xs text-gray-400 mt-1">{d.phone}</p>}
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button onClick={() => startEdit(d)} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Edit</button>
                    <button onClick={() => handleDelete(d.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
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