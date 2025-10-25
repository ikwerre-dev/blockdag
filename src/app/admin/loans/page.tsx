"use client";
import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowUpRight, ArrowDownLeft, Search, Loader2Icon } from "lucide-react";
import { X } from "lucide-react";

interface Loan {
    id: number;
    user_id: number;
    amount: number;
    reason: string;
    status: string;
    created_at: string;
}

interface Filters {
    [key: string]: string;
    status: string;
    search: string;
}

export default function AdminLoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Filters>({
        status: "",
        search: "",
    });

    const fetchLoans = useCallback(async () => {
        try {
            const queryParams = new URLSearchParams(filters as Record<string, string>);
            const response = await fetch(`/api/admin/loans?${queryParams}`);
            const data = await response.json();
            setLoans(data.loans);
        } catch (error) {
            console.error("Error fetching loans:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const getStatusClasses = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!selectedLoan) return;

        try {
            setIsUpdatingStatus(true);
            const response = await fetch(`/api/admin/loans/${selectedLoan.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            setLoans(prev => prev.map(l =>
                l.id === selectedLoan.id ? { ...l, status: newStatus } : l
            ));
            setSelectedLoan(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
            <Loader2Icon className="text-[#194dbe] animate-spin" size={50} />
        </div>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Loans Management</h1>

                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-between items-start sm:items-center mb-6">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search loans..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] text-sm"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] text-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loans.map((loan) => (
                            <div
                                key={loan.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 space-y-2 sm:space-y-0 cursor-pointer"
                                onClick={() => setSelectedLoan(loan)}
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4">
                                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm sm:text-base text-gray-800">
                                            Loan Request #{loan.id}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            {new Date(loan.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-sm sm:text-base text-gray-800">
                                        {loan.amount}
                                    </p>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClasses(loan.status)}`}>
                                        {loan.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedLoan && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800">Loan Details</h2>
                                    <button
                                        onClick={() => setSelectedLoan(null)}
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <p className="text-gray-500">Amount:</p>
                                            <p className="font-medium text-gray-800">{selectedLoan.amount}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-gray-500">Reason:</p>
                                            <p className="font-medium text-gray-800">{selectedLoan.reason}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-gray-500">Date:</p>
                                            <p className="font-medium text-gray-800">
                                                {new Date(selectedLoan.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <select
                                            value={selectedLoan.status}
                                            onChange={(e) => handleStatusUpdate(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] text-sm"
                                            disabled={isUpdatingStatus}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        {isUpdatingStatus && (
                                            <div className="text-gray-500">Updating...</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}