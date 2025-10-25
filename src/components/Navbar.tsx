"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-5">
                    <div className="flex items-center">
                        <Link href="/">
                            <div className="flex items-center text-[#194dbe] font-bold text-xl">
                                <span className="text-2xl font-bold">Bivo Health</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-10">
                        <Link href="/" className="text-[#000] hover:text-opacity-80 transition-all font-medium text-base">Home</Link>
                        <Link href="/about" className="text-[#000] hover:text-opacity-80 transition-all font-medium text-base">About</Link>
                        <Link href="/features" className="text-[#000] hover:text-opacity-80 transition-all font-medium text-base">Features</Link>
                        <Link href="/providers" className="text-[#000] hover:text-opacity-80 transition-all font-medium text-base">For Providers</Link>
                        <Link href="/login" className="text-[#000] hover:text-opacity-80 transition-all font-medium text-base">Login</Link>
                        <Link href="/register">
                            <button className="bg-[#194dbe] text-white px-7 py-3 rounded-full hover:bg-opacity-90 transition-all font-medium text-base">
                                Get NFC Card
                            </button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-[#000] focus:outline-none"
                        >
                            {/* Hamburger Icon */}
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link href="/" className="block px-3 py-2 text-[#000] hover:text-opacity-80 transition-all font-medium text-base">Home</Link>
                            <Link href="/about" className="block px-3 py-2 text-[#000] hover:text-opacity-80 transition-all font-medium text-base">About</Link>
                            <Link href="/features" className="block px-3 py-2 text-[#000] hover:text-opacity-80 transition-all font-medium text-base">Features</Link>
                            <Link href="/providers" className="block px-3 py-2 text-[#000] hover:text-opacity-80 transition-all font-medium text-base">For Providers</Link>
                            <Link href="/login" className="block px-3 py-2 text-[#000] hover:text-opacity-80 transition-all font-medium text-base">Login</Link>
                            <Link href="/register" className="block px-3 py-2">
                                <button className="w-full bg-[#194dbe] text-white px-7 py-3 rounded-full hover:bg-opacity-90 transition-all font-medium text-base">
                                    Get NFC Card
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;