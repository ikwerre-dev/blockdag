"use client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function BlockDagPage() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-800">BlockDag</h1>
        <p className="text-sm text-gray-600 mt-2">
          Explore BlockDag-related data and settings for your on-chain integrations.
        </p>
        <div className="mt-4 space-y-3 text-sm text-gray-700">
          <div>
            On-chain storage ensures critical metadata is anchored and verifiable. We use a DAG-style
            structure for efficient linking and retrieval of records.
          </div>
          <div>
            Future updates will include transaction views, anchoring status, and validator information.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}