"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import timeAgo from "@/helpers/timeAgo";
import { useEffect, useMemo, useState } from "react";

type RecordType =
  | "ILLNESS"
  | "ALLERGY"
  | "MEDICATION"
  | "TEST_RESULT"
  | "PROCEDURE"
  | "IMMUNIZATION"
  | "NOTE"
  | "OTHER";

interface MedicalRecord {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  data: string;
  hash?: string | null;
  createdAt: string;
  type?: RecordType;
  warningNotes?: string | null;
}

export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<RecordType>("ILLNESS");
  const [warningNotes, setWarningNotes] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [staffDepartment, setStaffDepartment] = useState("");
  const [staffLicenseNumber, setStaffLicenseNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const staffDataJson = useMemo(
    () =>
      JSON.stringify({
        staffName,
        staffRole,
        staffDepartment,
        staffLicenseNumber,
      }),
    [staffName, staffRole, staffDepartment, staffLicenseNumber]
  );

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/records");
      if (!res.ok) throw new Error("Failed to fetch records");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setType("ILLNESS");
    setWarningNotes("");
    setStaffName("");
    setStaffRole("");
    setStaffDepartment("");
    setStaffLicenseNumber("");
  };

  const handleCreateOrUpdate = async () => {
    try {
      setSubmitting(true);
      const payload = {
        title,
        description: description || undefined,
        type,
        warningNotes: warningNotes || undefined,
        data: staffDataJson,
      };

      let res: Response;
      if (editingId) {
        res = await fetch(`/api/records/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Failed to submit record");
      await fetchRecords();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (r: MedicalRecord) => {
    setEditingId(r.id);
    setTitle(r.title);
    setDescription(r.description || "");
    setType(r.type || "ILLNESS");
    setWarningNotes(r.warningNotes || "");
    try {
      const parsed = JSON.parse(r.data || "{}");
      setStaffName(parsed.staffName || "");
      setStaffRole(parsed.staffRole || "");
      setStaffDepartment(parsed.staffDepartment || "");
      setStaffLicenseNumber(parsed.staffLicenseNumber || "");
    } catch {
      setStaffName("");
      setStaffRole("");
      setStaffDepartment("");
      setStaffLicenseNumber("");
    }
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    try {
      const res = await fetch(`/api/records/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete record");
      await fetchRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const typeBadgeColor = (t?: RecordType) => {
    switch (t) {
      case "ILLNESS":
        return "bg-red-100 text-red-700";
      case "ALLERGY":
        return "bg-yellow-100 text-yellow-700";
      case "MEDICATION":
        return "bg-blue-100 text-blue-700";
      case "TEST_RESULT":
        return "bg-purple-100 text-purple-700";
      case "PROCEDURE":
        return "bg-indigo-100 text-indigo-700";
      case "IMMUNIZATION":
        return "bg-green-100 text-green-700";
      case "NOTE":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#194dbe]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-[#194dbe] text-white rounded-lg hover:bg-[#153fa0]"
          >
            Add Record
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                  placeholder="e.g., Acute Bronchitis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as RecordType)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                >
                  {[
                    "ILLNESS",
                    "ALLERGY",
                    "MEDICATION",
                    "TEST_RESULT",
                    "PROCEDURE",
                    "IMMUNIZATION",
                    "NOTE",
                    "OTHER",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                  rows={3}
                  placeholder="Symptoms, diagnosis, etc."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Warning Notes</label>
                <textarea
                  value={warningNotes}
                  onChange={(e) => setWarningNotes(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                  rows={2}
                  placeholder="e.g., Severe allergy to penicillin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medical Staff Name</label>
                <input
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  value={staffDepartment}
                  onChange={(e) => setStaffDepartment(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input
                  value={staffLicenseNumber}
                  onChange={(e) => setStaffLicenseNumber(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleCreateOrUpdate}
                className="px-4 py-2 bg-[#194dbe] text-white rounded-lg hover:bg-[#153fa0]"
                disabled={submitting}
              >
                {editingId ? "Update Record" : "Create Record"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {records.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-600">No records found.</p>
            <p className="text-sm text-gray-500 mt-2">Create a record to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ul className="divide-y divide-gray-100">
              {records.map((r) => (
                <li key={r.id} className="py-4 flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{r.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${typeBadgeColor(r.type)}`}>
                        {r.type || "OTHER"}
                      </span>
                    </div>
                    {r.description && (
                      <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                    )}
                    {r.warningNotes && (
                      <p className="text-sm mt-1 text-red-600">⚠ {r.warningNotes}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(r.createdAt)}</p>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <button
                      onClick={() => startEdit(r)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
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