"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Search, ChevronDown, Mail, Phone, MessageCircle, ExternalLink, HelpCircle } from "lucide-react";

export default function Help() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//code.jivosite.com/widget/x7KsQpUrzR';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
            <p className="text-gray-500 mt-1">Find answers or contact our support team</p>
          </div>

          <div className="grid gap-6 p-6">
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-800">Contact Us</h2>
              
              <div className="grid grid-cols-1 gap-5">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <MessageCircle className="w-5 h-5 text-[#194dbe] mr-2" />
                    <h3 className="font-medium text-gray-800">Live Chat</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Chat with our support team in real-time. The chat widget will appear in the bottom right corner of your screen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}