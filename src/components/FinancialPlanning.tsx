"use client";
import Link from "next/link";
import { Home, Car, BookOpen, Briefcase, Check } from "lucide-react";
import { useState } from "react";

const FinancialPlanning = () => {
   const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  return (
    <section className="py-[10rem] px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <div className="text-[#194dbe] font-medium mb-2">
              Financial Planning
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Let's plan your finances the right way</h2>
            <p className="text-gray-700 mb-6">
              Lending that doesn't weigh you down. We know how hard is it to start something new, 
              that's why we have the perfect plan for you.
            </p>
            
            <Link href="/login">
              <button className="bg-[#194dbe] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium">
                Apply for a loan
              </button>
            </Link>
          </div>
          
          <div className="md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div 
                className="bg-white p-6 rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#194dbe] hover:bg-blue-50/30"
                onMouseEnter={() => setHoveredCard('home')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full mr-3 transition-colors duration-300 ${hoveredCard === 'home' ? 'bg-[#194dbe] text-white' : 'bg-blue-100 text-[#194dbe]'}`}>
                    <Home className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Home Loans</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-green-500 mr-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-gray-700">Lowest interest rates</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-green-500 mr-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-gray-700">Fast Loan Processing</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-white p-6 rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#194dbe] hover:bg-blue-50/30"
                onMouseEnter={() => setHoveredCard('car')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full mr-3 transition-colors duration-300 ${hoveredCard === 'car' ? 'bg-[#194dbe] text-white' : 'bg-blue-100 text-[#194dbe]'}`}>
                    <Car className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Car Loans</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-green-500 mr-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-gray-700">Competitive rates</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-green-500 mr-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-gray-700">Quick Easy</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-white p-6 rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#194dbe] hover:bg-blue-50/30"
                onMouseEnter={() => setHoveredCard('education')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full mr-3 transition-colors duration-300 ${hoveredCard === 'education' ? 'bg-[#194dbe] text-white' : 'bg-blue-100 text-[#194dbe]'}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Education Loans</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-green-500 mr-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-gray-700">Pay back conveniently</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-green-500 mr-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-gray-700">Fast Loan Processing</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-white p-6 rounded-xl border border-gray-100 transition-all duration-300 hover:border-[#194dbe] hover:bg-blue-50/30"
                onMouseEnter={() => setHoveredCard('business')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full mr-3 transition-colors duration-300 ${hoveredCard === 'business' ? 'bg-[#194dbe] text-white' : 'bg-blue-100 text-[#194dbe]'}`}>
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Business Loans</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="text-green-500 mr-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-gray-700">Easy Approvals</p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-green-500 mr-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-gray-700">Full Assistance</p>
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

export default FinancialPlanning;