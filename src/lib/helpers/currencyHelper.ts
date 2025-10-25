
interface CurrencyRates {
    [key: string]: number;
}

interface StoredRates {
    rates: CurrencyRates;
    timestamp: number;
}

const STORAGE_KEY = 'currency_rates';
const EXPIRY_HOURS = 12;
const EXPIRY_MS = EXPIRY_HOURS * 60 * 60 * 1000; // 12 hours in milliseconds

export const fetchCurrencyRates = async (): Promise<CurrencyRates> => {
    // Check if running in a browser environment
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser) {
        const storedData = localStorage.getItem(STORAGE_KEY);
 
        if (storedData) {
            const { rates, timestamp }: StoredRates = JSON.parse(storedData);
            const currentTime = Date.now();
            if (currentTime - timestamp < EXPIRY_MS) {
                console.log('fetching from localStorage 📦');
                return rates;
            } else {
                console.log('stored rates expired');
            }
        }
    } else {
        console.log('Running on server, skipping localStorage');
    }

    try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
        if (!response.ok) {
            throw new Error('Failed to fetch currency rates');
        }

        const responseData = await response.json();
        const rates = responseData.usd;
        console.log('fetching from API');

        if (isBrowser) {
            const dataToStore: StoredRates = {
                rates,
                timestamp: Date.now(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
        }

        return rates;
    } catch (error) {
        console.error('Error fetching currency rates:', error);
        return {};
    }
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string, rates: CurrencyRates): number => {
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === 'USD') return amount * (rates[toCurrency.toLowerCase()] || 1);
    if (toCurrency === 'USD') return amount / (rates[fromCurrency.toLowerCase()] || 1);
    const toUSD = amount / (rates[fromCurrency.toLowerCase()] || 1);
    return toUSD * (rates[toCurrency.toLowerCase()] || 1);
};