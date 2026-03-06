import axios from "axios";
import { Passport } from "./PassportApi";
import { Hotel } from "./HotelsApi";

const API_URL = "http://localhost:5050/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Address {
    id: number;
    country: string;
    region: string;
    city: string;
    street: string;
    house: string;
    apartment?: number | null;
    passport_Id?: number | null;
    passport?: Passport | null;
    hotels?: Hotel[] | null;
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

// Создать адрес
export const createAddress = async (addressData: {
    country: string;
    region: string;
    city: string;
    street?: string | null;
    house?: string | null;
    apartment?: number | null;
    passport_Id?: number | null;
    tours_Id?: number | null;
}): Promise<Address> => {
    const response = await api.post<Address>('/Addresses', addressData);
    return response.data;
};

// Обновить адрес
export const updateAddress = async (id: number, addressData: {
    country: string;
    region: string;
    city: string;
    street: string;
    house: string;
    apartment?: number | null;
    passport_Id?: number | null;
}): Promise<Address> => {
    const response = await api.put<Address>(`/Addresses/${id}`, addressData);
    return response.data;
};

// Удалить адрес
export const deleteAddress = async (id: number): Promise<void> => {
    await api.delete(`/Addresses/${id}`);
};

export default api;