import axios from "axios";
import { Ticket } from "./TicketsApi";
import { Transfer } from "./TransfersApi";

const API_URL = "http://localhost:5050/api";

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
    price: number;
    tickets_Id?: number | null;
    transfers_Id?: number | null;
    ticket?: Ticket | null;
    transfer?: Transfer | null;
}


export const getTours = async (): Promise<Tour[]> => {
    const response = await api.get<Tour[]>('/Tours');
    return response.data;
};


export const getTourById = async (id: number): Promise<Tour> => {
    try {
        const response = await api.get<Tour>(`/Tours/${id}`);
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

export const createTour = async (tourData: {
    name: string;
    startDot: string;
    endDot: string;
    details: string;
    imageTour: string;
    tickets_Id?: number | null;
    transfers_Id?: number | null;
}): Promise<Tour> => {
    const response = await api.post<Tour>('/Tours', tourData);
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
    const response = await api.put<Tour>(`/Tours/${id}`, tourData);
    return response.data;
};

export const deleteTour = async (id: number): Promise<void> => {
    await api.delete(`/Tours/${id}`);
};

export default api;