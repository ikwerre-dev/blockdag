"use client";
import Image from "next/image";
import { Users, Globe, Shield, Award } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState("mission");
  const counterRef = useRef<HTMLDivElement>(null);
  const [countersVisible, setCountersVisible] = useState(false);
  const [counts, setCounts] = useState({
    customers: 0,
    countries: 0,
    transactions: 0,
    experience: 0
  });

  const finalCounts = {
    customers: 2000000,
    countries: 150,
    transactions: 99.9,
    experience: 10
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCountersVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (countersVisible) {
      const duration = 2000;
      const interval = 20;
      const steps = duration / interval;

      const timer = setInterval(() => {
        setCounts(prevCounts => {
          const newCounts = { ...prevCounts };
          let allComplete = true;

          Object.keys(finalCounts).forEach(key => {
            const finalValue = finalCounts[key as keyof typeof finalCounts];
            const currentValue = prevCounts[key as keyof typeof prevCounts];
            const increment = finalValue / steps;

            if (currentValue < finalValue) {
              newCounts[key as keyof typeof newCounts] = Math.min(
                currentValue + increment,
                finalValue
              );
              allComplete = false;
            }
          });

          if (allComplete) {
            clearInterval(timer);
          }

          return newCounts;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [countersVisible]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return num.toFixed(1);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block text-[#194dbe] font-medium mb-2 px-4 py-1 bg-blue-50 rounded-full">About Us</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">A modern, technology-first bank built for you</h2>

            <div className="mb-8">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-3 px-5 font-medium text-sm ${activeTab === 'mission' ? 'text-[#194dbe] border-b-2 border-[#194dbe]' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('mission')}
                >
                  Our Mission
                </button>
                <button
                  className={`py-3 px-5 font-medium text-sm ${activeTab === 'values' ? 'text-[#194dbe] border-b-2 border-[#194dbe]' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('values')}
                >
                  Our Values
                </button>
                <button
                  className={`py-3 px-5 font-medium text-sm ${activeTab === 'story' ? 'text-[#194dbe] border-b-2 border-[#194dbe]' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('story')}
                >
                  Our Story
                </button>
              </div>

              <div className="py-6">
                {activeTab === 'mission' && (
                  <div>
                    <p className="text-gray-700 mb-4">
                      At VelTrust, our mission is to make international money transfers simple, transparent, and secure for everyone.
                      We believe that sending money across borders should be as easy as sending a text message.
                    </p>
                    <p className="text-gray-700">
                      We&apos;re committed to providing the best rates, fastest delivery times, and most reliable service in the industry,
                      ensuring that your money reaches its destination safely and on time.
                    </p>
                  </div>
                )}

                {activeTab === 'values' && (
                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                          <Shield className="w-5 h-5 text-[#194dbe]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Security</h4>
                          <p className="text-sm text-gray-600">Your money and data are protected with bank-level security</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                          <Globe className="w-5 h-5 text-[#194dbe]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Global Access</h4>
                          <p className="text-sm text-gray-600">Send money to over 150 countries worldwide</p>
                        </div>
                      </div>
                      <div className="flex items-start mt-4">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                          <Users className="w-5 h-5 text-[#194dbe]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Customer First</h4>
                          <p className="text-sm text-gray-600">We put our customers at the center of everything we do</p>
                        </div>
                      </div>
                      <div className="flex items-start mt-4">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                          <Award className="w-5 h-5 text-[#194dbe]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Excellence</h4>
                          <p className="text-sm text-gray-600">We strive for excellence in all our services</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'story' && (
                  <div>
                    <p className="text-gray-700 mb-4">
                      Founded in 2013, VelTrust began with a simple idea: international money transfers shouldn&apos;t be complicated or expensive.
                    </p>
                    <p className="text-gray-700">
                      What started as a small team in South Africa has grown into a global company serving millions of customers worldwide.
                      Our journey has been driven by innovation, customer feedback, and a relentless pursuit of making financial services
                      more accessible to everyone.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -z-10 w-full h-full bg-blue-50 rounded-3xl transform -rotate-3 translate-x-4 translate-y-4"></div>
            <Image
              src="/images/5.png"
              alt="VelTrust Team"
              width={600}
              height={400}
              className="rounded-3xl relative z-10"
            />
          </div>
        </div>

        <div ref={counterRef} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#194dbe] mb-2">
              {formatNumber(counts.customers)}
            </div>
            <p className="text-gray-600">Happy Customers</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-[#194dbe] mb-2">
              {formatNumber(counts.countries)}
            </div>
            <p className="text-gray-600">Countries Served</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-[#194dbe] mb-2">
              {counts.transactions.toFixed(1)}%
            </div>
            <p className="text-gray-600">Success Rate</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-[#194dbe] mb-2">
              {counts.experience.toFixed(0)}+
            </div>
            <p className="text-gray-600">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;