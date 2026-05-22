import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
    selectedCurrency: string;
    currentRate: number;
    signCurrency: string;
    setCurrency: (currency: string, rate: number) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = 'selectedCurrency';
const RATE_STORAGE_KEY = 'currentRate';

const getSignCurrency = (currency: string): string => {
    switch (currency) {
        case 'RUB': return '₽';
        case 'USD': return '$';
        case 'EUR': return '€';
        default: return '₽';
    }
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
        const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
        return saved && ['RUB', 'USD', 'EUR'].includes(saved) ? saved : 'RUB';
    });

    const [currentRate, setCurrentRate] = useState<number>(() => {
        const saved = localStorage.getItem(RATE_STORAGE_KEY);
        return saved ? parseFloat(saved) : 1;
    });

    const [signCurrency, setSignCurrency] = useState<string>(() => {
        return getSignCurrency(selectedCurrency);
    });

    const setCurrency = (currency: string, rate: number) => {
        setSelectedCurrency(currency);
        setCurrentRate(rate);
        setSignCurrency(getSignCurrency(currency));

        localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
        localStorage.setItem(RATE_STORAGE_KEY, rate.toString());
    };

    return (
        <CurrencyContext.Provider value={{
            selectedCurrency,
            currentRate,
            signCurrency,
            setCurrency
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within CurrencyProvider');
    }
    return context;
};