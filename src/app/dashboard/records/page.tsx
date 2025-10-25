"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useUserData } from "@/hooks/useUserData";
import timeAgo from "@/helpers/timeAgo";

export default function RecordsPage() {
  const { records, loading, error, reload } = useUserData();

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
          <button onClick={reload} className="mt-4 px-4 py-2 bg-[#194dbe] text-white rounded-lg">Try Again</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
        {records.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-600">No records found.</p>
            <p className="text-sm text-gray-500 mt-2">When your provider uploads records, they will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <ul className="divide-y divide-gray-100">
              {records.map((r) => (
                <li key={r.id} className="py-4 flex items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{r.title}</p>
                    {r.description && <p className="text-sm text-gray-600 mt-1">{r.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(r.created_at)}</p>
                  </div>
                  <div className="ml-4">
                    <button className="px-3 py-1 text-sm bg-[#194dbe] text-white rounded-lg">View</button>
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