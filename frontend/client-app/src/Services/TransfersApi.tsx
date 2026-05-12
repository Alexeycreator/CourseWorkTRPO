import axios from "axios";

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