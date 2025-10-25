"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Users, Wallet, Settings, CreditCard, Shield, LogOut, Menu, X, Banknote } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth");
      if (!response.ok) {
        router.push("/admin/login");
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: Users },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Transactions", href: "/admin/transactions", icon: Wallet }, 
    { name: "Loans", href: "/admin/loans", icon: Banknote }, 
  ];

  // Get current page title from navItems or default to "Admin Panel"
  const currentPage = navItems.find((item) => item.href === pathname)?.name || "Admin Panel";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">{currentPage}</h1>
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-[#194dbe] transition-colors"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span className="text-sm md:text-base font-medium">Logout</span>
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-3 bg-[#194dbe] text-white rounded-full shadow-lg hover:bg-[#3a6ad4] transition-all transform hover:scale-105"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Overlay for Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:sticky md:top-0 z-40 w-64 md:w-72 bg-gradient-to-b from-[#194dbe] to-[#2a5db0] text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:shadow-md ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } h-full md:h-screen md:min-h-screen rounded-r-2xl md:rounded-none flex flex-col`}
        >
          <div className="p-6 border-b border-[#3a6ad4]">
            <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
          </div>
          <nav className="p-6 flex-1">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg text-base md:text-lg font-medium transition-all transform hover:scale-105 ${
                      pathname === item.href
                        ? "bg-white text-[#194dbe] shadow-lg border-l-4 border-[#194dbe]"
                        : "text-white hover:bg-[#3a6ad4] hover:shadow-md"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-6 h-6 mr-4" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-6">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-white hover:bg-[#3a6ad4] rounded-lg transition-all font-medium text-base md:text-lg"
              aria-label="Logout"
            >
              <LogOut className="w-6 h-6 mr-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="py-6 px-2 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}