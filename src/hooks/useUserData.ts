import { convertCurrency, fetchCurrencyRates } from '@/lib/helpers/currencyHelper';
import { useState, useEffect, useCallback } from 'react';

interface UserData {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
    last_login?: string;
    p2p_code?: string;
}

interface Transaction {
    id: number;
    sender_id: number;
    recipient_id: number;
    sender: string;
    recipient: string;
    amount: number;
    currency: string;
    status: string;
    type: string;
    transaction_hash: string;
    meta_data: Record<string, any>;
    created_at: Date;
    description: string;
}

interface Notification {
    id: string | number;
    user_id: string | number;
    type?: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface MedicalRecord {
    id: string;
    user_id: string;
    title: string;
    description?: string | null;
    data: string;
    hash: string;
    created_at: string;
}

interface Wallet {
    id: number;
    user_id: number;
    balance: number;
    currency: string;
    created_at: Date;
    updated_at: Date;
}

export function useUserData() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBalance, setShowBalance] = useState(true);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [rates, setRates] = useState<{ [key: string]: number }>({});
    const [convertedArray, setConvertedArray] = useState<{ from: string; to: string; value: number }[]>([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [userResponse, walletsResponse] = await Promise.all([
                fetch('/api/user/data'),
                fetch('/api/wallets')
            ]);

            if (!userResponse.ok || !walletsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const apiData = await userResponse.json();
            const walletsData = await walletsResponse.json();

            const u = apiData.user || {};
            const mappedUser: UserData = {
                id: u.id ?? '',
                first_name: u.firstName ?? '',
                last_name: u.lastName ?? '',
                email: u.email ?? '',
                phone: u.phone ?? '',
                address: u.address ?? '',
                created_at: u.createdAt ?? new Date().toISOString(),
                updated_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
                p2p_code: ''
            };

            const mappedNotifications: Notification[] = (apiData.notifications ?? []).map((n: any) => ({
                id: n.id,
                user_id: n.userId,
                type: n.type,
                title: n.title,
                message: n.message,
                is_read: Boolean(n.isRead),
                created_at: n.createdAt
            }));

            const mappedRecords: MedicalRecord[] = (apiData.records ?? []).map((r: any) => ({
                id: r.id,
                user_id: r.userId,
                title: r.title,
                description: r.description ?? null,
                data: r.data,
                hash: r.hash,
                created_at: r.createdAt
            }));

            setUserData(mappedUser);
            setTransactions([]);
            setNotifications(mappedNotifications);
            setRecords(mappedRecords);
            setWallet(walletsData.wallets?.[0] || null);
            setWallets(walletsData.wallets || []);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const reload = () => {
        fetchData();
    };

    useEffect(() => {
        const getRates = async () => {
            const data = await fetchCurrencyRates();
            setRates(data);
        };

        getRates();
    }, []);

    const convert = useCallback((amount: number, from: string, to: string) => {
        return convertCurrency(amount, from, to, rates);
    }, [rates]);

    const handleConvert = useCallback((amount: number, from: string, to: string) => {
        const result = convertCurrency(amount, from, to, rates);
        setConvertedArray(prev => [...prev, { from, to, value: result }]);
        return result;
    }, [rates]); 


    const toggleBalanceVisibility = () => {
        setShowBalance(!showBalance);
    };


    return {
        userData,
        transactions,
        wallet,
        wallets,
        notifications,
        records,
        loading,
        error,
        reload,
        handleConvert,
        convert,
        convertedArray,
        showBalance,
        toggleBalanceVisibility
    };

}