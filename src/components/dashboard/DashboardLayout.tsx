"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import timeAgo from "@/helpers/timeAgo";

import {
    Home,
    Settings,
    User,
    HelpCircle,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronDown,
    Loader2Icon,
    FileText,
    CreditCard,
} from "lucide-react";
import { useUserData } from '@/hooks/useUserData';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [currentPageLabel, setCurrentPageLabel] = useState<string>("");


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const profile = document.getElementById('profile-menu');
            const profileButton = document.getElementById('profile-button');
            const notifications = document.getElementById('notifications-menu');
            const notificationsButton = document.getElementById('notifications-button');

            if (profile && profileButton &&
                !profile.contains(event.target as Node) &&
                !profileButton.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }

            if (notifications && notificationsButton &&
                !notifications.contains(event.target as Node) &&
                !notificationsButton.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                router.push('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Medical Records", href: "/dashboard/records", icon: Settings },
        { name: "Appointments", href: "/dashboard/appointments", icon: Settings },
        { name: "Doctors", href: "/dashboard/doctors", icon: User },
        { name: "Insurance", href: "/dashboard/insurance", icon: Settings },
        { name: "Medical Card", href: "/dashboard/card", icon: Settings },
        { name: "Privacy", href: "/dashboard/privacy", icon: Settings },
        { name: "Profile", href: "/dashboard/profile", icon: User },
        { name: "BlockDag", href: "/dashboard/blockdag", icon: Settings },
        { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
        { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
    ];

    const isActive = (path: string) => {
        if (path === "/dashboard") {
            return pathname === path;
        }
        return pathname?.startsWith(path);
    };

    const getPageLabel = (path: string): string => {
        for (const item of navItems) {
            if (item.href === path) {
                return item.name;
            }
            if ((item as any).subItems) {
                const subItem = (item as any).subItems.find((sub: any) => sub.href === path);
                if (subItem) {
                    return subItem.name;
                }
            }
        }
        return "Dashboard";
    };

    useEffect(() => {
        const currentItem = navItems.find(
            (item) =>
                item.href === pathname ||
                ((item as any).subItems && (item as any).subItems.some((sub: any) => sub.href === pathname))
        );
        if (currentItem) {
            setActiveMenu(pathname);
            if ((currentItem as any).subItems) {
                setExpandedMenus([currentItem.href]);
            } else {
                setExpandedMenus([]);
            }
        }
        setCurrentPageLabel(getPageLabel(pathname ? pathname : "Dashboard"));
    }, [pathname]);


    const { userData, loading, notifications, error } = useUserData();

    if (loading)
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
                <Loader2Icon className="text-[#194dbe] animate-spin" size={50} />
            </div>
        );
    if (error)
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
                <div className="text-[#f00]" >Error: {error}</div>
            </div>
        );

    if (!userData)
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
                <Loader2Icon className="text-[#194dbe] animate-spin" size={50} />
            </div>
        );
    const user = userData;

    const handleNotificationsOpen = async () => {
        setIsNotificationsOpen(!isNotificationsOpen);

        if (!isNotificationsOpen) {
            try {
                const response = await fetch('/api/user/notifications', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    // reload();
                }
            } catch (error) {
                console.error('Error updating notifications:', error);
            }
        }
    };


    return (
        <div className="flex h-screen bg-gray-50">
            <aside
                id="sidebar"
                className={`fixed inset-y-0  realtive left-0 z-50 w-64 bg-[#194dbe] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >

                <div className="flex z-10 flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-[#3a6ad4]">
                        <Link href="/dashboard" className="flex items-center">
                            <Image
                                src="/logo.png"
                                alt="VelTrust Logo"
                                width={50}
                                height={40}
                            />
                        </Link>
                        <button
                            className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 px-2 py-4 overflow-y-auto">
                        <ul className="space-y-1">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${isActive(item.href)
                                            ? "bg-white text-[#194dbe] font-medium"
                                            : "text-white hover:bg-[#3a6ad4]"
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        <span>{item.name}</span>
                                    </Link>

                                    {(item as any).subItems && (
                                        <ul className="ml-10 mt-1 space-y-1">
                                            {(item as any).subItems.map((subItem: any) => (
                                                <li key={subItem.name}>
                                                    <Link
                                                        href={subItem.href}
                                                        className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${pathname === subItem.href
                                                            ? "bg-[#3a6ad4] text-white font-medium"
                                                            : "text-white/80 hover:bg-[#3a6ad4] hover:text-white"
                                                            }`}
                                                    >
                                                        <span className="w-1.5 h-1.5 bg-white/70 rounded-full mr-3"></span>
                                                        <span>{subItem.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t border-[#3a6ad4]">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-white rounded-lg hover:bg-[#3a6ad4] transition-colors">
                            <LogOut className="w-5 h-5 mr-3" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex lg:hidden items-center lg:w-64">
                            <button
                                id="hamburger-button"
                                className="p-2 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-[#194dbe]"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            >
                                <Menu size={24} />
                            </button>
                            <div className="ml-4 lg:hidden">
                                <Image
                                    src="/logo.png"
                                    alt="VelTrust Logo"
                                    width={50}
                                    height={40}
                                />
                            </div>
                        </div>

                        <div className="hidden lg:flex items-start flex-1 px-4 mx-4 lg:mx-0 lg:px-0">

                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button
                                    id="notifications-button"
                                    className="relative p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#194dbe]"
                                    onClick={() => handleNotificationsOpen()}
                                >
                                    <Bell size={20} />
                                    {notifications.some(n => !n.is_read) && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </button>

                                {isNotificationsOpen && (
                                    <div
                                        id="notifications-menu"
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.slice(0, 3).map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`px-4 py-3 hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                                                >
                                                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                                    <p className="text-sm text-gray-500">{notification.message}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.created_at)}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 border-t border-gray-100">
                                            <Link href={'/dashboard/notifications'} className="text-sm text-[#194dbe] hover:text-[#0f3179] font-medium">
                                                see all notifications
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative z-50">
                                <button
                                    id="profile-button"
                                    className="flex items-center space-x-3 focus:outline-none"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#194dbe] flex items-center justify-center text-white">
                                        <span className="text-sm font-medium">{`${(user.first_name || '').toUpperCase().trim().slice(0, 1)}${(user.last_name || '').toUpperCase().trim().slice(0, 1)}` || 'U'}</span>
                                    </div>
                                    {user.address && (
                                        <span
                                            className="hidden sm:inline-block text-xs text-gray-600 max-w-[140px] md:max-w-[200px] truncate"
                                            title={user.address}
                                        >
                                            {user.address}
                                        </span>
                                    )}
                                </button>

                                {isProfileOpen && (
                                    <div
                                        id="profile-menu"
                                        className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-1 z-50 min-w-[12rem] sm:min-w-[18rem] max-w-[90vw]"
                                    >
                                        <div className="px-4 py-2 border-b z-50 border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.first_name || 'User'}</p>
                                            <p className="text-sm text-gray-500 line-clamp-1">{user.email || ''}</p>
                                            {user.address && (
                                                <div className="mt-1">
                                                    <span className="text-xs text-gray-500">Wallet:</span>
                                                    <span
                                                        className="ml-1 text-xs font-mono text-gray-700 block truncate max-w-[80vw] sm:max-w-[18rem]"
                                                        title={user.address}
                                                    >
                                                        {user.address}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="py-1 z-50 bg-white">

                                            <Link
                                                href="/dashboard/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 z-50 hover:bg-gray-50"
                                            >
                                                Profile Settings
                                            </Link>
                                            <Link
                                                href="/dashboard/wallet"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                Wallet Details
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
                {/* Mobile bottom navigation */}
                <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t shadow-sm">
                    <div className="grid grid-cols-5 text-xs">
                        <Link href="/dashboard" className={`flex flex-col items-center py-2 ${isActive('/dashboard') ? 'text-[#194dbe]' : 'text-gray-600'}`}>
                            <Home className="w-5 h-5" />
                            <span>Home</span>
                        </Link>
                        <Link href="/dashboard/records" className={`flex flex-col items-center py-2 ${isActive('/dashboard/records') ? 'text-[#194dbe]' : 'text-gray-600'}`}>
                            <FileText className="w-5 h-5" />
                            <span>Records</span>
                        </Link>
                        <Link href="/dashboard/card" className={`flex flex-col items-center py-2 ${isActive('/dashboard/card') ? 'text-[#194dbe]' : 'text-gray-600'}`}>
                            <CreditCard className="w-5 h-5" />
                            <span>Card</span>
                        </Link>
                        <Link href="/dashboard/profile" className={`flex flex-col items-center py-2 ${isActive('/dashboard/profile') ? 'text-[#194dbe]' : 'text-gray-600'}`}>
                            <User className="w-5 h-5" />
                            <span>Profile</span>
                        </Link>
                        <Link href="/dashboard/blockdag" className={`flex flex-col items-center py-2 ${isActive('/dashboard/blockdag') ? 'text-[#194dbe]' : 'text-gray-600'}`}>
                            <Settings className="w-5 h-5" />
                            <span>BlockDag</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    );
}