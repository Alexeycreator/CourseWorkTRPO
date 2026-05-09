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
};

export interface CurrentTourDto {
    id: number;
    imageTour?: string | null;
    nameTour?: string | null;
    details?: string | null;
    startDot?: string | null;
    endDot?: string | null;
    type?: string | null;
    price?: number | null;
    countNights?: number | null;
    description?: string | null;
    separately?: string | null;
    included?: string | null;
    program?: string | null;
    hotel?: HotelMainInfoDto[] | null;
    address?: AddressMainInfoDto[] | null;
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