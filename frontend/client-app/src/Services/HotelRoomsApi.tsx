import axios from "axios";
import { Hotel } from "./HotelsApi";

const API_URL = "http://localhost:5050/api";

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
    hotels?: Hotel[] | null;
}

export const getHotelRooms = async (): Promise<HotelRoom[]> => {
    const response = await api.get<HotelRoom[]>('/HotelRooms');
    return response.data;
};


export const getHotelRoomById = async (id: number): Promise<HotelRoom> => {
    const response = await api.get<HotelRoom>(`/HotelRooms/${id}`);
    return response.data;
};

export const createHotelRoom = async (roomData: {
    nameRoom: string;
    details?: string | null;
    floor: number;
    imageRoom?: string | null;
}): Promise<HotelRoom> => {
    const response = await api.post<HotelRoom>('/HotelRooms', roomData);
    return response.data;
};

export const updateHotelRoom = async (id: number, roomData: {
    nameRoom: string;
    details?: string | null;
    floor: number;
    imageRoom?: string | null;
}): Promise<HotelRoom> => {
    const response = await api.put<HotelRoom>(`/HotelRooms/${id}`, roomData);
    return response.data;
};

export const deleteHotelRoom = async (id: number): Promise<void> => {
    await api.delete(`/HotelRooms/${id}`);
};

export default api;