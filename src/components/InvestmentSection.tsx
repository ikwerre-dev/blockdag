"use client";
import Image from "next/image";
import { Shield, Check } from "lucide-react";
import { useState } from "react";

const InvestmentSection = () => {
    const [hovered, setHovered] = useState<string | null | number>(null);

    return (
        <section className="py-16  px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="inline-block text-[#194dbe] font-medium mb-2">
                        Safe Investments
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">The Better Way to Save & Invest</h2>
                    <p className="text-gray-700 max-w-2xl">
                        VelTrust helps over 2 million customers achieve their financial goals by helping them save and invest with ease.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2">
                        <div className="relative">
                            <div className="absolute -z-10 w-full h-full bg-blue-100 rounded-2xl transform -rotate-2 translate-x-4 translate-y-4"></div>
                            <Image
                                src="/images/2.png"
                                alt="Safe Investments"
                                width={800}
                                height={400}
                                className="rounded-2xl border-2 border-white relative z-10 transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                    </div>

                    <div className="md:w-1/2 space-y-6">
                        <p className="text-gray-700">
                            Put that extra cash to use without putting it at risk with VelTrust.
                        </p>

                        <div
                            className="flex items-start bg-white p-4 rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#194dbe] hover:bg-blue-50/30"
                            onMouseEnter={() => setHovered(1)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div className={`p-3 rounded-full mr-4 transition-colors duration-300 ${hovered === 1 ? 'bg-[#194dbe] text-white' : 'bg-blue-100 text-[#194dbe]'}`}>
                                <Check className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Profitable to invest</h3>
                                <p className="text-gray-600">Easy to manage with our intuitive dashboard and tools</p>
                            </div>
                        </div>

                        <div
                            className="flex items-start bg-white p-4 rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#194dbe] hover:bg-blue-50/30"
                            onMouseEnter={() => setHovered(2)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div className={`p-3 rounded-full mr-4 transition-colors duration-300 ${hovered === 2 ? 'bg-[#194dbe] text-white' : 'bg-blue-100 text-[#194dbe]'}`}>
                                <Check className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Highest Returns</h3>
                                <p className="text-gray-600">Get the best rates on your investments with VelTrust</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InvestmentSection;