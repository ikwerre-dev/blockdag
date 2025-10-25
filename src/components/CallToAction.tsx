"use client";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="bg-[#194dbe] text-white py-16 rounded-2xl">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to take control of your health data?</h2>
        <p className="text-white/90 mb-8">Get your NFC card and start securely managing your medical records with Bivo Health.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <button className="bg-white text-[#194dbe] px-6 py-3 rounded-md font-medium hover:bg-gray-100">Get NFC Card</button>
          </Link>
          <Link href="/contact">
            <button className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-[#194dbe]">Learn More</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;