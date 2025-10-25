"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Shield, Heart, CreditCard, Database } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16  px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f0f8f5]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <div className="text-[#194dbe] font-medium mb-3 inline-block bg-blue-100 px-4 py-1 rounded-full">
              <span className="flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Secure. Decentralized. Accessible
              </span>
            </div>
            
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#194dbe] mb-6 leading-tight">
              Your Health Data, Your Control
            </h1>
            
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Store and access your medical records securely on the BlockDAG blockchain. Empower yourself and your healthcare providers with NFC-enabled card access.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <button className="bg-[#194dbe] text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all font-medium">
                  Get Your NFC Card
                </button>
              </Link>
              
              <Link href="/login">
                <button className="border-2 border-[#194dbe] text-[#194dbe] px-8 py-3 rounded-md hover:bg-[#194dbe] hover:text-white transition-all font-medium">
                  Access Records
                </button>
              </Link>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 mb-4">Platform Features</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <Database className="w-5 h-5 text-[#194dbe]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Blockchain Storage</p>
                    <p className="text-sm text-gray-600">Secure on-chain medical data</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <CreditCard className="w-5 h-5 text-[#194dbe]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">NFC Card Access</p>
                    <p className="text-sm text-gray-600">Instant record access</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <Shield className="w-5 h-5 text-[#194dbe]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Privacy First</p>
                    <p className="text-sm text-gray-600">You control data access</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <Heart className="w-5 h-5 text-[#194dbe]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Hospital Integration</p>
                    <p className="text-sm text-gray-600">Seamless provider access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="relative">
              <div className="bg-gradient-to-br from-[#194dbe] to-[#0f3179] rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Heart className="w-6 h-6 text-[#194dbe]" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Medical Record</p>
                        <p className="text-sm text-gray-500">Blockchain Verified</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-[#194dbe] rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patient ID:</span>
                      <span className="font-medium">BH-2024-001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">Today</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Access Level:</span>
                      <span className="font-medium text-[#194dbe]">Full Control</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-center mb-3">
                    <CreditCard className="w-8 h-8 text-white mr-2" />
                    <span className="text-white font-medium">NFC Card Ready</span>
                  </div>
                  <p className="text-white/80 text-sm text-center">
                    Tap your NFC card for instant access to your medical records
                  </p>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-12 h-12 bg-[#194dbe] rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;