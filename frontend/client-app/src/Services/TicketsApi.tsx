/* eslint-disable no-throw-literal */
import React from "react";
import axios from "axios";

const API_URL = "http://localhost:5050/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface CreateTicketsDto {
    price: number;
    departureTime: Date;
    arrivalTime: Date;
    dateSale: Date;
    hotelRoomsId: number;
    tourId: number;
};

export interface UpdateTicketsDto extends CreateTicketsDto {
    id: number;
};

export const createTicket = async (userId: number, request: CreateTicketsDto): Promise<void> => {
    try {
        const response = await api.post('/Tickets/create-ticket', request, {
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

export const updateTicket = async (userId: number, request: UpdateTicketsDto): Promise<void> => {
    try {
        const response = await api.put('/Tickets/update-ticket', request, {
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

export const deleteTicket = async (ticketId: number, userId: number): Promise<void> => {
    try {
        const response = await api.delete('/Tickets/delete-ticket', {
            params: {
                ticketId,
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