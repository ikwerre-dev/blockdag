"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function InsurancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Insurance</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-600">No insurance information yet.</p>
          <p className="text-sm text-gray-500 mt-1">Add your insurance provider details to streamline care.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}