/* eslint-disable no-throw-literal */
import axios from "axios";
import { Address } from "./AddressApi";

const API_URL = "http://localhost:5050/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Passport {
    id: number;
    seria: number;
    number: number;
    type: string;
    issuedBy: string;
    departmentCode: string;
    dateOfIssue: string;
    dateOfExpiry?: string; //загранпаспорт
    gender?: string; // ДОБАВЛЕНО: Пол
    placeOfBirth?: string; // ДОБАВЛЕНО: Место рождения
    addresses?: Address[] | null;
}

export interface CreatePassportDto {
    seria: number;
    number: number;
    type: string;
    issuedBy: string;
    departmentCode: string;
    dateOfIssue: Date;
};

export interface UpdatePassportDto extends CreatePassportDto {
    id: number;
};

export const createPassport = async (userId: number, request: CreatePassportDto): Promise<void> => {
    try {
        const response = await api.post('/Passports/create-passport-data', request, {
            params: { userId }
        });
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.log('Ошибка ответа:', error.response.data);
            console.log('Статус:', error.response.status);
            throw {
                ...error,
                serverMessage: error.response.data?.message || 'Неизвестная ошибка',
                statusCode: error.response.status
            };
        } else if (error.request) {
            throw { message: 'Нет ответа от сервера', isNetworkError: true };
        } else {
            throw { message: error.message, isSetupError: true };
        }
    }
};

export const updatePassport = async (userId: number, request: UpdatePassportDto): Promise<void> => {
    try {
        const response = await api.put('/Passports/update-passport', request, {
            params: { userId }
        });
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.log('Ошибка ответа:', error.response.data);
            console.log('Статус:', error.response.status);
            throw {
                ...error,
                serverMessage: error.response.data?.message || 'Неизвестная ошибка',
                statusCode: error.response.status
            };
        } else if (error.request) {
            throw { message: 'Нет ответа от сервера', isNetworkError: true };
        } else {
            throw { message: error.message, isSetupError: true };
        }
    }
};

export const deletePassport = async (passportId: number, userId: number): Promise<void> => {
    try {
        const response = await api.delete('/Passports/delete-passport', {
            params: {
                passportId,
                userId
            }
        });
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            console.log('Ошибка ответа:', error.response.data);
            console.log('Статус:', error.response.status);
            throw {
                ...error,
                serverMessage: error.response.data?.message || 'Неизвестная ошибка',
                statusCode: error.response.status
            };
        } else if (error.request) {
            throw { message: 'Нет ответа от сервера', isNetworkError: true };
        } else {
            throw { message: error.message, isSetupError: true };
        }
    }
};