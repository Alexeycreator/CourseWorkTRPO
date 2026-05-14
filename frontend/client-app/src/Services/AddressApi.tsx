import axios from "axios";

const API_URL = "http://localhost:5050/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface AddressMainInfoDto {
    id: number;
    country?: string | null;
    city?: string | null;
};

export interface Address {
    id: number;
    country: string;
    region: string;
    city: string;
    street: string;
    house: string;
    apartment?: number | null;
}

// Получить все адреса
export const getAddresses = async (): Promise<Address[]> => {
    const response = await api.get<Address[]>('/Addresses');
    return response.data;
};

// Получить адрес по ID
export const getAddressById = async (id: number): Promise<Address> => {
    try {
        const response = await api.get<Address>(`/Addresses/${id}`);
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