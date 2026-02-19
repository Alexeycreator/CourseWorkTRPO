import axios from "axios";
import { Ticket } from "./TicketsApi";
import { Transfer } from "./TransfersApi";

const API_URL = "http://localhost:5027/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Tour {
    id: number;
    name: string;
    startDot: string;
    endDot: string;
    details: string;
    imageTour: string;
    tickets_Id: number | null;
    transfers_Id: number | null;
    ticket?: Ticket;
    transfer?: Transfer;
}


export const getTours = async (): Promise<Tour[]> => {
    const response = await api.get<Tour[]>('/Tour');
    return response.data;
};


export const getTourById = async (id: number): Promise<Tour> => {
    const response = await api.get<Tour>(`/Tour/${id}`);
    return response.data;
};

export const createTour = async (tourData: {
    name: string;
    startDot: string;
    endDot: string;
    details: string;
    imageTour: string;
    tickets_Id?: number | null;
    transfers_Id?: number | null;
}): Promise<Tour> => {
    const response = await api.post<Tour>('/Tour', tourData);
    return response.data;
};

export const updateTour = async (id: number, tourData: {
    name: string;
    startDot: string;
    endDot: string;
    details: string;
    imageTour: string;
    tickets_Id?: number | null;
    transfers_Id?: number | null;
}): Promise<Tour> => {
    const response = await api.put<Tour>(`/Tour/${id}`, tourData);
    return response.data;
};

export const deleteTour = async (id: number): Promise<void> => {
    await api.delete(`/Tour/${id}`);
};

export default api;