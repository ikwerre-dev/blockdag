"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {  Edit, Trash2, Eye, Plus, Minus } from "lucide-react";
import { User } from "@/types/admin";
import { useCallback } from "react"; // Add this import

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'wallets'>('profile');
    const [walletAction, setWalletAction] = useState<{ walletId: number; action: 'topup' | 'reduce' } | null>(null);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isWalletActionLoading, setIsWalletActionLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`/api/admin/users?search=${searchTerm}`);
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]); // Add searchTerm as a dependency

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); // Change to use fetchUsers as dependency

    const handleDelete = async (userId: number) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Failed to delete user");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleWalletAction = async (walletId: number, action: 'topup' | 'reduce') => {
        try {
            if (!walletId) throw new Error('Wallet ID is required');
            if (!amount || parseFloat(amount) <= 0) throw new Error('Please enter a valid positive amount');

            setIsWalletActionLoading(true);
            setError(null);

            const response = await fetch(`/api/admin/wallets/${walletId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action,
                    amount: parseFloat(amount),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update wallet');
            }

            // Refresh user data
            if (selectedUser?.id) {
                const userResponse = await fetch(`/api/admin/users/${selectedUser.id}`);
                if (!userResponse.ok) throw new Error('Failed to fetch updated user');
                const userData = await userResponse.json();
                setSelectedUser(userData);
            }

            setWalletAction(null);
            setAmount('');
        } catch (error: unknown) { // Change from any to unknown
            console.error('Error updating wallet:', error);
            setError(error instanceof Error ? error.message : 'An error occurred while updating the wallet');
        } finally {
            setIsWalletActionLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>

                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] text-sm"
                        />
                    </div>

                    <div className="overflow-y-auto max-h-[60vh]">
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading users...</p>
                        ) : users.length === 0 ? (
                            <p className="text-sm text-gray-500">No users found.</p>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="p-2 font-medium text-gray-700">Email</th>
                                        <th className="p-2 font-medium text-gray-700">Name</th>
                                        <th className="p-2 font-medium text-gray-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="p-2 truncate max-w-[150px] sm:max-w-[200px]">
                                                {user.email}
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                {user.first_name} {user.last_name}
                                            </td>
                                            <td className="p-2 flex justify-end space-x-1">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-gray-400 hover:text-gray-600 p-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditUser(user)}
                                                    className="text-gray-400 hover:text-gray-600 p-1"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="text-gray-400 hover:text-red-600 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* View User Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl w-full max-w-full sm:max-w-2xl shadow-2xl">
                            <div className="p-6 sm:p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">User Details</h2>
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex space-x-4 border-b mb-6">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`px-4 py-2 font-medium text-sm sm:text-base ${activeTab === 'profile'
                                            ? 'text-[#194dbe] border-b-2 border-[#194dbe]'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('wallets')}
                                        className={`px-4 py-2 font-medium text-sm sm:text-base ${activeTab === 'wallets'
                                            ? 'text-[#194dbe] border-b-2 border-[#194dbe]'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Wallets
                                    </button>
                                </div>

                                {activeTab === 'profile' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                <p className="text-base sm:text-lg text-gray-900 truncate">{selectedUser.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Name</p>
                                                <p className="text-base sm:text-lg text-gray-900">
                                                    {selectedUser.first_name} {selectedUser.last_name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                                <p className="text-base sm:text-lg text-gray-900">{selectedUser.phone || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">P2P Code</p>
                                                <p className="text-base sm:text-lg text-gray-900">{selectedUser.p2p_code || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'wallets' && (
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Wallets</h3>
                                        {!selectedUser.wallets || !Array.isArray(selectedUser.wallets) || selectedUser.wallets.length === 0 ? (
                                            <p className="text-gray-500">No wallets found.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {(selectedUser.wallets || []).map((wallet) => (
                                                    <div key={wallet.id} className="p-4 bg-gray-50 rounded-lg">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Currency</p>
                                                                <p className="text-base sm:text-lg text-gray-900">{wallet.currency}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Balance</p>
                                                                <p className="text-base sm:text-lg text-gray-900">{wallet.balance}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex space-x-3 mt-3">
                                                            <button
                                                                onClick={() => setWalletAction({ walletId: wallet.id, action: 'topup' })}
                                                                className="flex items-center px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm hover:shadow-md transform hover:scale-105 transition-all"
                                                            >
                                                                <Plus className="w-4 h-4 mr-2" />
                                                                Topup
                                                            </button>
                                                            <button
                                                                onClick={() => setWalletAction({ walletId: wallet.id, action: 'reduce' })}
                                                                className="flex items-center px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm hover:shadow-md transform hover:scale-105 transition-all"
                                                            >
                                                                <Minus className="w-4 h-4 mr-2" />
                                                                Reduce
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {editUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl w-full max-w-full sm:max-w-2xl shadow-2xl">
                            <div className="p-6 sm:p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Edit User</h2>
                                    <button
                                        onClick={() => setEditUser(null)}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                value={editUser.first_name}
                                                onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                value={editUser.last_name}
                                                onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={editUser.email}
                                                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#194dbe] focus:border-[#194dbe] text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-[#194dbe] text-white rounded-lg hover:bg-[#194dbe]/90 transition-colors text-sm"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Wallet Action Modal */}
                {walletAction && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl w-full max-w-full sm:max-w-md shadow-2xl p-6">
                            <h3 className="text-lg sm:text-xl font-semibold mb-4">
                                {walletAction.action === 'topup' ? (
                                    <span className="text-green-600">Topup Wallet</span>
                                ) : (
                                    <span className="text-red-600">Reduce Wallet Balance</span>
                                )}
                            </h3>

                            {error && (
                                <p className="text-red-500 text-sm mb-4">{error}</p>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount to {walletAction.action === 'topup' ? 'add' : 'deduct'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194dbe] focus:border-[#194dbe] text-sm"
                                        placeholder="Enter amount"
                                        min="0"
                                        step="0.01"
                                    />
                                    <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 text-sm">
                                        {selectedUser?.wallets?.find(w => w.id === walletAction.walletId)?.currency || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setWalletAction(null);
                                        setAmount('');
                                        setError(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                                    disabled={isWalletActionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleWalletAction(walletAction.walletId, walletAction.action)}
                                    className={`flex items-center px-6 py-2 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all text-sm ${
                                        walletAction.action === 'topup'
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-red-500 hover:bg-red-600'
                                    }`}
                                    disabled={isWalletActionLoading}
                                >
                                    {isWalletActionLoading ? (
                                        <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    ) : (
                                        walletAction.action === 'topup' ? (
                                            <Plus className="w-4 h-4 mr-2" />
                                        ) : (
                                            <Minus className="w-4 h-4 mr-2" />
                                        )
                                    )}
                                    Confirm {walletAction.action === 'topup' ? 'Topup' : 'Reduction'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}