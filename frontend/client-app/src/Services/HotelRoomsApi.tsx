import axios from "axios";
import { Hotel } from "./HotelsApi";

const API_URL = "http://localhost:5027/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface HotelRoom {
    id: number;
    nameRoom: string;
    details: string | null;
    floor: number;
    imageRoom: string | null;
    hotels?: Hotel[];
}

export const getHotelRooms = async (): Promise<HotelRoom[]> => {
    const response = await api.get<HotelRoom[]>('/HotelRoom');
    return response.data;
};


export const getHotelRoomById = async (id: number): Promise<HotelRoom> => {
    const response = await api.get<HotelRoom>(`/HotelRoom/${id}`);
    return response.data;
};

export const createHotelRoom = async (roomData: {
    nameRoom: string;
    details?: string | null;
    floor: number;
    imageRoom?: string | null;
}): Promise<HotelRoom> => {
    const response = await api.post<HotelRoom>('/HotelRoom', roomData);
    return response.data;
};

export const updateHotelRoom = async (id: number, roomData: {
    nameRoom: string;
    details?: string | null;
    floor: number;
    imageRoom?: string | null;
}): Promise<HotelRoom> => {
    const response = await api.put<HotelRoom>(`/HotelRoom/${id}`, roomData);
    return response.data;
};

export const deleteHotelRoom = async (id: number): Promise<void> => {
    await api.delete(`/HotelRoom/${id}`);
};

export default api;