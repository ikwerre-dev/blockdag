"use client";
import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowUpRight, ArrowDownLeft, Search, Loader2Icon } from "lucide-react";
import { X } from "lucide-react";
import Receipt from "@/components/receipt/Receipt";

interface Transaction {
    id: number;
    sender_id?: number;
    recipient_id?: number;
    sender?: string;
    recipient?: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    type: string;
    transaction_hash: string;
}

interface Filters {
    [key: string]: string;
    status: string;
    type: string;
    search: string;
}

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Filters>({
        status: "",
        type: "",
        search: "",
    });

    const fetchTransactions = useCallback(async () => {
        try {
            const queryParams = new URLSearchParams(filters as Record<string, string>);
            const response = await fetch(`/api/admin/transactions?${queryParams}`);
            const data = await response.json();
            setTransactions(data.transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const getStatusClasses = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "paid":
                return "bg-green-100 text-green-800";
            case "unpaid":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!selectedTransaction) return;

        try {
            setIsUpdatingStatus(true);
            const response = await fetch(`/api/admin/transactions/${selectedTransaction.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            // Update local state
            setTransactions(prev => prev.map(t =>
                t.id === selectedTransaction.id ? { ...t, status: newStatus } : t
            ));
            setSelectedTransaction(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsUpdatingStatus(false);
        }
    };
    if (loading) return (<div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2Icon className="text-[#194dbe] animate-spin" size={50} />
    </div>);
    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Transactions Management</h1>

                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-between items-start sm:items-center mb-6">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
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
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] text-sm"
                            >
                                <option value="">All Types</option>
                                <option value="p2p">P2P Transfer</option>
                                <option value="international">International Transfer</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 space-y-2 sm:space-y-0 cursor-pointer"
                                onClick={() => setSelectedTransaction(transaction)}
                            >
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-3 sm:mr-4 ${transaction.sender_id ? "bg-red-100" : "bg-green-100"
                                        }`}>
                                        {transaction.sender_id ? (
                                            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                        ) : (
                                            <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm sm:text-base text-gray-800">
                                            {transaction.sender || transaction.recipient}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            {new Date(transaction.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-medium text-sm sm:text-base ${transaction.sender_id ? "text-red-600" : "text-green-600"
                                        }`}>
                                        {transaction.sender_id ? "-" : "+"}
                                        {transaction.amount} {transaction.currency}
                                    </p>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClasses(transaction.status)
                                        }`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Transaction Details Modal */}
                    {selectedTransaction && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800">Transaction Details</h2>
                                    <button
                                        onClick={() => setSelectedTransaction(null)}
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    <Receipt transaction={{
                                        id: selectedTransaction.id.toString(),
                                        type: (selectedTransaction.sender_id == selectedTransaction.recipient) ? "sent" : selectedTransaction.sender_id ? "sent" : "received",
                                        amount: selectedTransaction.amount,
                                        currency: selectedTransaction.currency,
                                        sender: selectedTransaction.sender,
                                        recipient: selectedTransaction.recipient,
                                        date: selectedTransaction.created_at,
                                        status: selectedTransaction.status,
                                        hash: selectedTransaction.transaction_hash,
                                    }}
                                        minimal={true}
                                    />

                                    <div className="flex items-center space-x-4">
                                        <select
                                            value={selectedTransaction.status}
                                            onChange={(e) => handleStatusUpdate(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] text-sm"
                                            disabled={isUpdatingStatus}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="unpaid">Unpaid</option>
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