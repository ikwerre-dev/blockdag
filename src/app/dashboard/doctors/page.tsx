"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DoctorsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-600">No linked providers yet.</p>
          <p className="text-sm text-gray-500 mt-1">Connect your healthcare providers to view and share records.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}