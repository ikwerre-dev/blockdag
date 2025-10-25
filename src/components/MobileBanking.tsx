"use client";
import Image from "next/image";
import { Smartphone, Check } from "lucide-react";

const MobileBanking = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="bg-blue-100 p-3 rounded-md inline-block mb-4">
              <Smartphone className="w-6 h-6 text-[#194dbe]" />
            </div>
            <h2 className="text-3xl font-bold text-[#194dbe] mb-4">Banking at Your Fingertips</h2>
            <p className="text-gray-700 mb-6">
              Your banking experience anytime, anywhere. Get your money moving with our simple to use,
              accessible mobile app. As good as a bank branch within your phone!
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 mr-3 text-[#194dbe]">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-gray-700">Bill Payments, Funds Transfer, QR payments</p>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-3 text-[#194dbe]">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-gray-700">Credit card payments and Order food</p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="relative">
              <Image
                src="/images/1.png"
                alt="Mobile Banking"
                width={800}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileBanking;