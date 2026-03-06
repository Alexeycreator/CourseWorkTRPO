import axios from "axios";
import { Tour } from "./ToursApi";

const API_URL = "http://localhost:5050/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Transfer {
    id: number;
    name: string;
    arrival: string;
    departure: string;
    details: string | null;
    tours?: Tour[] | null;
}

export const getTransfers = async (): Promise<Transfer[]> => {
    const response = await api.get<Transfer[]>('/Transfers');
    return response.data;
};

export const getTransferById = async (id: number): Promise<Transfer> => {
    try {
        const response = await api.get<Transfer>(`/Transfers/${id}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.log('Ошибка ответа:', error.response.data);
            console.log('Статус:', error.response.status);

            // eslint-disable-next-line no-throw-literal
            throw {
                ...error,
                serverMessage: error.response.data?.message || 'Неизвестная ошибка',
                statusCode: error.response.status
            };
        } else if (error.request) {
            // eslint-disable-next-line no-throw-literal
            throw { message: 'Нет ответа от сервера', isNetworkError: true };
        } else {
            // eslint-disable-next-line no-throw-literal
            throw { message: error.message, isSetupError: true };
        }
    }
};

export const createTransfer = async (transferData: {
    name: string;
    route: string;
    details?: string | null;
}): Promise<Transfer> => {
    const response = await api.post<Transfer>('/Transfers', transferData);
    return response.data;
};

export const updateTransfer = async (id: number, transferData: {
    name: string;
    route: string;
    details?: string | null;
}): Promise<Transfer> => {
    const response = await api.put<Transfer>(`/Transfers/${id}`, transferData);
    return response.data;
};

export const deleteTransfer = async (id: number): Promise<void> => {
    await api.delete(`/Transfers/${id}`);
};

export const getToursByTransferId = async (transferId: number): Promise<Tour[]> => {
    const response = await api.get<Tour[]>(`/Transfers/${transferId}/tours`);
    return response.data;
};

export default api;