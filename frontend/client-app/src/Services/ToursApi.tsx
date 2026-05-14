/* eslint-disable no-throw-literal */
import React from "react";
import axios from "axios";
import { HotelMainInfoDto } from './HotelsApi';
import { AddressMainInfoDto } from "./AddressApi";

const apiUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: apiUrl || "http://localhost:5050/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

// каждая модель соответсвует модели DTO или БД на сервере
// Базовый DTO для тура
export interface ToursDto {
    id: number;
    imageTour?: string | null;
    nameTour?: string | null;
    details?: string | null;
    startDot?: string | null;
    endDot?: string | null;
    type?: string | null;
    price?: number | null;
    countNights?: number | null;
}

// DTO для горящего тура (наследуется от ToursDto)
export interface HotToursDto extends ToursDto {
    oldPrice?: number | null;
    nowPrice?: number | null;
}

// Полный DTO для тура с детальной информацией
export interface CurrentTourDto extends ToursDto {
    addresses?: AddressMainInfoDto[] | null;
    hotels?: HotelMainInfoDto[] | null;
    description?: string | null;
    separately?: string | null;
    included?: string | null;
    program?: string | null;
}

// Полный DTO для горящего тура с детальной информацией
export interface CurrentHotTourDto extends HotToursDto {
    addresses?: AddressMainInfoDto[] | null;
    hotels?: HotelMainInfoDto[] | null;
    description?: string | null;
    separately?: string | null;
    included?: string | null;
    program?: string | null;
}

// Базовый DTO для создания тура
export interface CreateTourDto {
    nameTour: string;
    startDot: string; // DateOnly в ISO формате (YYYY-MM-DD)
    endDot: string;
    details: string;
    typeTour: string;
    hotTour: boolean;
    price: number;
    description: string;
    program: string;
    included: string;
    separately: string;
    imageTour: string;
    hotelsId: number;
}

// DTO для обновления тура (наследуется от CreateTourDto)
export interface UpdateTourDto extends CreateTourDto {
    id: number;
}

export interface Tours {
    id: number;
    name: string;
    startDot: string;
    endDot: string;
    details: string;
    imageTour: string;
    description: string;
    separately: string;
    included: string;
    program: string;
    type: string;
    hotTour: boolean;
    price: number;
    ticketsId?: number | null;
    transfersId?: number | null;
};

export const getAllTours = async (): Promise<Tours[]> => {
    const response = await api.get<Tours[]>(`/Tours`);
    return response.data;
};

// каждый метод соответствует методам контроллера на сервере
export const getMainTours = async (): Promise<ToursDto[]> => {
    try {
        const response = await api.get<ToursDto[]>(`/Tours/get-main-tours`);
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

export const getCurrentMainTour = async (tourId: number): Promise<CurrentTourDto> => {
    try {
        const response = await api.get<CurrentTourDto>(`/Tours/get-current-main-tour?tourId=${tourId}`);
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

export const getHotTours = async (): Promise<HotToursDto[]> => {
    try {
        const response = await api.get<HotToursDto[]>(`/Tours/get-hot-tours`);
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

export const getCurrentHotTour = async (hotTourId: number): Promise<CurrentHotTourDto> => {
    try {
        const response = await api.get<CurrentHotTourDto>(`/Tours/get-current-hot-tour?hotTourId=${hotTourId}`);
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

export const createTour = async (userId: number, request: CreateTourDto): Promise<void> => {
    try {
        await api.post(`/Tours/create-tour?userId=${userId}`, request);
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

// UPDATE - обновление тура
export const updateTour = async (userId: number, request: UpdateTourDto): Promise<void> => {
    try {
        await api.put(`/Tours/update-tour?userId=${userId}`, request);
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

// DELETE - удаление тура
export const deleteTour = async (tourId: number, hotelId: number, userId: number): Promise<void> => {
    try {
        await api.delete(`/Tours/delete-tour?tourId=${tourId}&hotelId=${hotelId}&userId=${userId}`);
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