"use client";
import Link from "next/link";

const FinalCTA = () => {
    return (
        <section className="py-[10rem] px-4 sm:px-6 lg:px-8 bg-[#f0f8f5]">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-[#194dbe] text-center mb-4">Start your Bivo Health journey today</h2>
                <p className="text-gray-600 text-center mb-6">Secure, decentralized medical records accessible with your NFC card.</p>
                <Link href="/register"><button className="bg-[#194dbe] text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90">Get started</button></Link>
                <Link href="/features"><button className="border border-[#194dbe] text-[#194dbe] px-6 py-3 rounded-md font-medium hover:bg-[#194dbe] hover:text-white">Explore Features</button></Link>
            </div>
        </section>
    );
};

export default FinalCTA;