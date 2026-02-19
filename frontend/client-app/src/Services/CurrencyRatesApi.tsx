import axios from "axios";
//import { CurrencyRatesTicket } from "./CurrencyRates_TicketsApi";

const API_URL = "http://localhost:5050/api";

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
    //currencyRatesTickets?: CurrencyRatesTicket[] ;
}

// Получить все курсы валют
export const getCurrencyRates = async (): Promise<CurrencyRate[]> => {
    const response = await api.get<CurrencyRate[]>('/CurrencyRates');
    return response.data;
};

// Получить курс валюты по ID
export const getCurrencyRateById = async (id: number): Promise<CurrencyRate> => {
    const response = await api.get<CurrencyRate>(`/CurrencyRates/${id}`);
    return response.data;
};

export default api;