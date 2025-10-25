"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";

interface Doctor { id: string; name: string; }
interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  date: string;
  reason?: string | null;
  notes?: string | null;
  doctor?: Doctor;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [aRes, dRes] = await Promise.all([fetch("/api/appointments"), fetch("/api/doctors")]);
      if (!aRes.ok || !dRes.ok) throw new Error("Failed to fetch data");
      const aData = await aRes.json();
      const dData = await dRes.json();
      setAppointments(aData);
      setDoctors(dData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setDoctorId("");
    setDate("");
    setReason("");
    setNotes("");
  };

  const handleSubmit = async () => {
    try {
      const payload = { doctorId, date, reason: reason || undefined, notes: notes || undefined };
      let res: Response;
      if (editingId) {
        res = await fetch(`/api/appointments/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Failed to submit appointment");
      await fetchAll();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const startEdit = (a: Appointment) => {
    setEditingId(a.id);
    setDoctorId(a.doctorId);
    setDate(a.date.split("T")[0]);
    setReason(a.reason || "");
    setNotes(a.notes || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete appointment");
      await fetchAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 bg-[#194dbe] text-white rounded-lg hover:bg-[#153fa0]">Add Appointment</button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">{error}</div>}

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor</label>
                <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2">
                  <option value="">Select a doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <input value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" placeholder="e.g., Follow-up" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" rows={3} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={handleSubmit} className="px-4 py-2 bg-[#194dbe] text-white rounded-lg hover:bg-[#153fa0]">{editingId ? "Update Appointment" : "Create Appointment"}</button>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-600">No upcoming appointments.</p>
            <p className="text-sm text-gray-500 mt-1">Your scheduled appointments will appear here when available.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ul className="divide-y divide-gray-100">
              {appointments.map((a) => (
                <li key={a.id} className="py-4 flex items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{a.doctor?.name || doctors.find(d => d.id === a.doctorId)?.name || "Unknown Doctor"}</p>
                    <p className="text-sm text-gray-600 mt-1">{new Date(a.date).toLocaleDateString()}</p>
                    {a.reason && <p className="text-sm text-gray-600 mt-1">Reason: {a.reason}</p>}
                    {a.notes && <p className="text-xs text-gray-400 mt-1">{a.notes}</p>}
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button onClick={() => startEdit(a)} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Edit</button>
                    <button onClick={() => handleDelete(a.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
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