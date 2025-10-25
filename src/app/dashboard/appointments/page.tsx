"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-600">No upcoming appointments.</p>
          <p className="text-sm text-gray-500 mt-1">Your scheduled appointments will appear here when available.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}