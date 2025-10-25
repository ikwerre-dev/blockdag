"use client";
import Link from "next/link";
import { ArrowRight, CreditCard, Briefcase, PiggyBank } from "lucide-react";
import { useState } from "react";

const BusinessSolutions = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[#194dbe] font-medium mb-2">Business Banking</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Solutions for Every Business Need</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Power up your business with a full-stack online bank account that fits your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            className="bg-white p-6 rounded-xl border-t-4 border-[#194dbe] transition-all duration-300 hover:bg-white/50"
            onMouseEnter={() => setHoveredCard('checking')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 rounded-full bg-blue-100 text-[#194dbe]">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Popular</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Checking Account</h3>
            <p className="text-gray-600 mb-6 h-24">
              Choose from our checking options that allow you to earn interest, avoid fees, and easily manage your account.
            </p>
            <Link 
              href="/login" 
              className="group flex items-center font-medium text-gray-700 hover:text-[#194dbe]"
            >
              <span className="mr-2">Open Account</span>
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          
          <div 
            className="bg-white p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:bg-white/50"
            onMouseEnter={() => setHoveredCard('savings')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-[#194dbe]"></div>
            <div className="mb-4">
              <div className="p-4 rounded-lg bg-blue-100 text-[#194dbe] inline-block">
                <PiggyBank className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Savings Accounts</h3>
            <p className="text-gray-600 mb-6 h-24">
              Save for your goals and watch your money grow with a CD, a money market account, a savings account. Your future starts now.
            </p>
            <Link 
              href="/login" 
              className="inline-block font-medium text-white bg-[#194dbe] px-4 py-2 rounded-lg hover:bg-[#1543a5] transition-colors"
            >
              Start Saving <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Link>
          </div>
          
          <div 
            className="bg-white p-6 rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-[inset_0_0_0_2px_#194dbe]"
            onMouseEnter={() => setHoveredCard('business')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="mb-4 relative">
              <div className="absolute -z-10 w-12 h-12 bg-blue-200 rounded-lg transform rotate-12 translate-x-1 translate-y-1"></div>
              <div className="relative z-10 p-4 rounded-lg bg-white border border-blue-200 text-[#194dbe]">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Business Account</h3>
            <p className="text-gray-600 mb-6 h-24">
              Take charge of your business banking with a business bank account. Services including virtual cards, team management and more.
            </p>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${hoveredCard === 'business' ? 'bg-[#194dbe]' : 'bg-gray-300'}`}></div>
              <Link 
                href="/login" 
                className="font-medium text-gray-700 hover:text-[#194dbe] underline-offset-4 hover:underline"
              >
                Open Account <ArrowRight className="w-4 h-4 ml-1 inline" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSolutions;