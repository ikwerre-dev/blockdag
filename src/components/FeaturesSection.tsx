"use client";
import Image from "next/image";
import { Database, Check, Shield, Heart, CreditCard, Users } from "lucide-react";

const FeaturesSection = () => {
    return (
        <section className="py-16  px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <div className="bg-blue-100 p-3 rounded-md inline-block mb-4">
                            <Database className="w-6 h-6 text-[#194dbe]" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#194dbe] text-center mb-4">Powerful Features for Your Health Data</h2>
                        <p className="text-gray-700 mb-6">
                            Your medical records are securely stored on the BlockDAG blockchain, ensuring immutable, 
                            tamper-proof data that you control. Healthcare providers can access your information instantly 
                            with your permission, improving care coordination and emergency response.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="mt-1 mr-3 text-[#194dbe]">
                                    <Check className="w-5 h-5" />
                                </div>
                                <p className="text-gray-700">Blockchain-verified medical records with complete data integrity.</p>
                            </div>

                            <div className="flex items-start">
                                <div className="mt-1 mr-3 text-[#194dbe]">
                                    <Check className="w-5 h-5" />
                                </div>
                                <p className="text-gray-700">NFC card access for instant record retrieval in emergencies.</p>
                            </div>

                            <div className="flex items-start">
                                <div className="mt-1 mr-3 text-[#194dbe]">
                                    <Check className="w-5 h-5" />
                                </div>
                                <p className="text-gray-700">Full patient control over data access and sharing permissions.</p>
                            </div>

                            <div className="flex items-start">
                                <div className="mt-1 mr-3 text-[#194dbe]">
                                    <Check className="w-5 h-5" />
                                </div>
                                <p className="text-gray-700">Seamless integration with hospitals and healthcare providers.</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2">
                        <div className="relative">
                            <div className="bg-gradient-to-br from-[#194dbe] to-[#0f3179] rounded-2xl p-8 shadow-2xl">
                                <div className="bg-white rounded-xl p-6 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <Heart className="w-6 h-6 text-[#194dbe]" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">Patient Dashboard</p>
                                                <p className="text-sm text-gray-500">Real-time Health Data</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 bg-[#194dbe] rounded-full flex items-center justify-center">
                                            <Check className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center mb-2">
                                                <Shield className="w-4 h-4 text-[#194dbe] mr-2" />
                                                <span className="text-sm font-medium">Records</span>
                                            </div>
                                            <p className="text-lg font-bold text-gray-800">24</p>
                                            <p className="text-xs text-gray-500">Stored securely</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center mb-2">
                                                <Users className="w-4 h-4 text-[#194dbe] mr-2" />
                                                <span className="text-sm font-medium">Providers</span>
                                            </div>
                                            <p className="text-lg font-bold text-gray-800">3</p>
                                            <p className="text-xs text-gray-500">Authorized access</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-green-50 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Last Access:</span>
                                            <span className="text-sm text-[#194dbe] font-medium">2 hours ago</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                    <div className="flex items-center justify-center mb-3">
                                        <CreditCard className="w-6 h-6 text-white mr-2" />
                                        <span className="text-white font-medium">NFC Card Active</span>
                                    </div>
                                    <div className="flex justify-between text-white/80 text-sm">
                                        <span>Card ID: BH-001</span>
                                        <span>Status: Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;