"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useUserData } from "@/hooks/useUserData";
import { Loader2Icon } from "lucide-react";
import timeAgo from "@/helpers/timeAgo";

export default function Notifications() {
    const { notifications, loading, error, reload } = useUserData();

    useEffect(() => {
        const markAsRead = async () => {
            try {
                const response = await fetch('/api/user/notifications', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    reload();
                }
            } catch (error) {
                console.error('Error updating notifications:', error);
            }
        };

        markAsRead();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2Icon className="animate-spin h-8 w-8 text-[#194dbe]" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="text-center py-8">
                    <p className="text-red-600">{error}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-8xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                        <p className="text-gray-500 mt-1">Your recent notifications and updates</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-6 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                                >
                                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                    <p className="mt-1 text-gray-500">{notification.message}</p>
                                    <p className="mt-2 text-sm text-gray-400">{timeAgo(notification.created_at)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}