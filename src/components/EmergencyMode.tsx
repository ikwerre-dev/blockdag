"use client";
import { useState } from "react";

export default function EmergencyMode() {
  const [mode, setMode] = useState<"idle" | "prompt" | "unlocked">("idle");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onUnlock = () => {
    if (code.trim() === "1234") {
      setMode("unlocked");
      setError(null);
    } else {
      setError("Invalid code");
    }
  };

  return (
    <div className="mt-10">
      {mode === "idle" && (
        <button
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          onClick={() => setMode("prompt")}
        >
          Emergency Mode
        </button>
      )}

      {mode === "prompt" && (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-red-300">
          <div className="flex items-center gap-3">
            <input
              type="password"
              placeholder="Enter emergency code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              onClick={onUnlock}
            >
              Unlock
            </button>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      )}

      {mode === "unlocked" && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-700">Emergency Medical Information</h3>
          <p className="text-sm text-red-600 mt-1">Provided for emergency responders. Non-sensitive placeholder data.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-800">Next of Kin</h4>
              <div className="mt-2 text-sm text-gray-700">
                <div>Name: Jane Doe</div>
                <div>Relationship: Sister</div>
                <div>Phone: +1 (555) 234-5678</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-800">Allergies</h4>
              <div className="mt-2 text-sm text-gray-700">Penicillin, Peanuts/Tree Nuts</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-800">Current Medications</h4>
              <div className="mt-2 text-sm text-gray-700">Metformin 500mg, Lisinopril 10mg</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-800">Known Conditions</h4>
              <div className="mt-2 text-sm text-gray-700">Type 2 Diabetes, Hypertension</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-600">Blood Type: O+</div>
        </div>
      )}
    </div>
  );
}