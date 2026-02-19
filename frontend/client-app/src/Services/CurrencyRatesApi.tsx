import axios from "axios";
import { CurrencyRatesTicket } from "./CurrencyRates_TicketsApi";

const API_URL = "http://localhost:5027/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface CurrencyRate {
    id: number;
    digitalCode: number;
    letterCode: string;
    units: number;
    currency: string;
    rate: number;
    dateReceipt: string;
    currencyRatesTickets?: CurrencyRatesTicket[];
}

// Получить все курсы валют
export const getCurrencyRates = async (): Promise<CurrencyRate[]> => {
    const response = await api.get<CurrencyRate[]>('/CurrencyRate');
    return response.data;
};

// Получить курс валюты по ID
export const getCurrencyRateById = async (id: number): Promise<CurrencyRate> => {
    const response = await api.get<CurrencyRate>(`/CurrencyRate/${id}`);
    return response.data;
};


export const createCurrencyRate = async (rateData: {
    digitalCode: number;
    letterCode: string;
    units: number;
    currency: string;
    rate: number;
    dateReceipt: string;
}): Promise<CurrencyRate> => {
    const response = await api.post<CurrencyRate>('/CurrencyRate', rateData);
    return response.data;
};


export const updateCurrencyRate = async (id: number, rateData: {
    digitalCode: number;
    letterCode: string;
    units: number;
    currency: string;
    rate: number;
    dateReceipt: string;
}): Promise<CurrencyRate> => {
    const response = await api.put<CurrencyRate>(`/CurrencyRate/${id}`, rateData);
    return response.data;
};

export const deleteCurrencyRate = async (id: number): Promise<void> => {
    await api.delete(`/CurrencyRate/${id}`);
};

export default api;