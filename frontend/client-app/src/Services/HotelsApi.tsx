/* eslint-disable no-throw-literal */
import axios from "axios";
import { AddressMainInfoDto } from "./AddressApi";

const API_URL = "http://localhost:5050/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Базовый DTO для создания отеля
export interface CreateHotelDto {
    name: string;
    stars: number;
    imageHotel?: string | null;
    details?: string | null;
    hotelRoomId?: number | null;
    addressId: number;
}

// DTO для обновления отеля
export interface UpdateHotelDto extends CreateHotelDto {
    id: number;
}

// Основная информация об отеле
export interface HotelMainInfoDto {
    id: number;
    name?: string | null;
    stars?: number | null;
    countNight?: number | null;
    description?: string | null;
    imageHotel?: string | null;
}

// Информация об адресе
export interface ResponseInfoAddressHotelOrRoomDto extends AddressMainInfoDto {
    region?: string | null;
    street?: string | null;
    house?: string | null;
    apartment?: string | null;
}

// Информация о комнате
export interface ResponseMainInfoHotelRooms {
    id: number;
    nameRoom?: string | null;
    details?: string | null;
    floor?: number | null;
    imageRoom?: string | null;
    typeRoom?: string | null;
}

// Полный DTO ответа с информацией об отеле
export interface ResponseHotelDto extends HotelMainInfoDto {
    address?: ResponseInfoAddressHotelOrRoomDto | null;
    mainInfo?: ResponseMainInfoHotelRooms[] | null;
}

export interface Hotels {
    id: number;
    name: string;
    stars: number;
    timeOfStay: string;
    imageHotel: string;
    details: string;
    addressId?: number | null;
    ticketsId?: number | null;
    hotelRoomsId?: number | null;
};

export const getAllHotels = async (): Promise<Hotels[]> => {
    const response = await api.get<Hotels[]>(`/Hotels`);
    return response.data;
};

export const createHotel = async (userId: number, request: CreateHotelDto): Promise<void> => {
    try {
        await api.post(`/Hotels/create-hotel?userId=${userId}`, request);
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

// UPDATE - обновление отеля
export const updateHotel = async (userId: number, request: UpdateHotelDto): Promise<void> => {
    try {
        await api.put(`/Hotels/update-hotel?userId=${userId}`, request);
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

// DELETE - удаление отеля
export const deleteHotel = async (hotelId: number, userId: number): Promise<void> => {
    try {
        await api.delete(`/Hotels/delete-hotel?hotelId=${hotelId}&userId=${userId}`);
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

// GET - получение информации об отеле по tourId
export const getCurrentHotelInfo = async (tourId: number): Promise<ResponseHotelDto[]> => {
    try {
        const response = await api.get<ResponseHotelDto[]>(`/Hotels/get-current-hotel-info?tourId=${tourId}`);
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