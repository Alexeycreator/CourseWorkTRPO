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

export interface Tickets {
    id: number;
    price: number;
    departureTime: Date;
    arrivalTime: Date;
    dateSale: Date;
};

export const getTicketById = async (id: number): Promise<Tickets> => {
    try {
        const response = await api.get<Tickets>(`/Tickets/${id}`);
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
export const createTicket = async (userId: number, request: CreateTicketsDto): Promise<void> => {
    try {
        await api.post(`/Tickets/create-ticket?userId=${userId}`, request);
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
        await api.put(`/Tickets/update-ticket?userId=${userId}`, request);
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
        await api.delete(`/Tickets/delete-ticket?ticketId=${ticketId}&userid=${userId}`);
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