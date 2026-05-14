/* eslint-disable no-throw-literal */
import axios from "axios";
import { Address } from './AddressApi';
import { ResponseInfoAddressHotelOrRoomDto } from "./HotelsApi";
import { get } from "http";

const API_URL = "http://localhost:5050/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Passports {
    id: number;
    seria: number;
    number: number;
    type: string;
    issuedBy: string;
    departmentCode: string;
    dateOfIssue: string;
}

export interface CreatePassportDto {
    seria: number;
    number: number;
    type: string;
    issuedBy: string;
    departmentCode: string;
    dateOfIssue: Date;
    address?: Address | null;
};

export interface UpdatePassportDto extends CreatePassportDto {
    id: number;
    passportId: number;
};

export interface ResponsePassportInfoDto {
    id: number;
    seria: number;
    number: number;
    type: string;
    issuedBy: string;
    departmentCode: string;
    dateOfIssue: Date;
    address: ResponseInfoAddressHotelOrRoomDto;
};

export const getAllPassports = async (): Promise<Passports[]> => {
    const response = await api.get<Passports[]>(`/Passports`);
    return response.data;
};

export const createPassport = async (userId: number, request: CreatePassportDto): Promise<void> => {
    try {
        await api.post(`/Passports/create-passport-data?userId=${userId}`, request);
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
        await api.put(`/Passports/update-passport?userId=${userId}`, request);
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
        await api.delete(`/Passports/delete-passport?passportId=${passportId}&userId=${userId}`);
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

export const getInfoPassport = async (userId: number): Promise<ResponsePassportInfoDto> => {
    try {
        const response = await api.get<ResponsePassportInfoDto>(`/Passports/get-info-passport?userId=${userId}`);
        return response.data
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