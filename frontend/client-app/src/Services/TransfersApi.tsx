import axios from "axios";
import { Tour } from "./ToursApi";

const API_URL = "http://localhost:5027/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Transfer {
    id: number;
    name: string;
    route: string;
    details: string | null;
    tours?: Tour[];
}

export const getTransfers = async (): Promise<Transfer[]> => {
    const response = await api.get<Transfer[]>('/Transfer');
    return response.data;
};

export const getTransferById = async (id: number): Promise<Transfer> => {
    const response = await api.get<Transfer>(`/Transfer/${id}`);
    return response.data;
};

export const createTransfer = async (transferData: {
    name: string;
    route: string;
    details?: string | null;
}): Promise<Transfer> => {
    const response = await api.post<Transfer>('/Transfer', transferData);
    return response.data;
};

export const updateTransfer = async (id: number, transferData: {
    name: string;
    route: string;
    details?: string | null;
}): Promise<Transfer> => {
    const response = await api.put<Transfer>(`/Transfer/${id}`, transferData);
    return response.data;
};

export const deleteTransfer = async (id: number): Promise<void> => {
    await api.delete(`/Transfer/${id}`);
};

export const getToursByTransferId = async (transferId: number): Promise<Tour[]> => {
    const response = await api.get<Tour[]>(`/Transfer/${transferId}/tours`);
    return response.data;
};

export default api;