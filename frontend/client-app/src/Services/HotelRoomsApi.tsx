/* eslint-disable no-throw-literal */
import React from "react";
import axios from "axios";
import { AddressMainInfoDto } from "./AddressApi";

const API_URL = "http://localhost:5050/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ResponseCurrentInfoHotelRoomDto {
    id: number;
    nameRoom?: string | null;
    typeRoom?: string | null;
    description?: string | null;
    floor?: number | null;
    imageRoom?: string | null;
    address?: AddressMainInfoDto | null;
};

export interface CreateHotelRoomsDto {
    nameRoom: string;
    details?: string | null;
    floor: number;
    imageRoom?: string | null;
    typeRoom: string;
};

export interface UpdateHotelRoomsDto extends CreateHotelRoomsDto {
    id: number;
};

export const getCurrentInfoHotelRoom = async (hotelRoomId: number): Promise<ResponseCurrentInfoHotelRoomDto> => {
    try {
        const response = await api.get<ResponseCurrentInfoHotelRoomDto>(`/HotelRooms/get-current-info-hotel-room?hotelRoomId=${hotelRoomId}`);
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

export const createHotelRoom = async (request: CreateHotelRoomsDto, userId: number): Promise<void> => {
    try {
        const response = await api.post(`/HotelRooms/create-hotel-room?userId=${userId}`, request);
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

export const updateHotelRoom = async (request: UpdateHotelRoomsDto, userId: number): Promise<void> => {
    try {
        const response = await api.put(`/HotelRooms/update-hotel-room?userId=${userId}`, request);
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

export const deleteHotelRoom = async (hotelRoomId: number, userId: number): Promise<void> => {
    try {
        const response = await api.delete(`/HotelRooms/delete-hotel-room?hotelRoomId=${hotelRoomId}&userId=${userId}`);
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