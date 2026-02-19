import axios from "axios";
import { Address } from "./AddressApi";
import { Ticket } from "./TicketsApi";
import { HotelRoom } from "./HotelRoomsApi";

const API_URL = "http://localhost:5027/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Hotel {
    id: number;
    name: string;
    stars: number;
    timeOfStay: number;
    imageHotel: string;
    details: string | null;
    address_Id: number | null;
    tickets_Id: number | null;
    hotelRooms_Id: number;
    address?: Address;
    ticket?: Ticket;
    hotelRoom?: HotelRoom;
}

export const getHotels = async (): Promise<Hotel[]> => {
    const response = await api.get<Hotel[]>('/Hotel');
    return response.data;
};

// Получить отель по ID
export const getHotelById = async (id: number): Promise<Hotel> => {
    const response = await api.get<Hotel>(`/Hotel/${id}`);
    return response.data;
};

export const createHotel = async (hotelData: {
    name: string;
    stars: number;
    timeOfStay: number;
    imageHotel: string;
    details?: string | null;
    address_Id?: number | null;
    tickets_Id?: number | null;
    hotelRooms_Id: number;
}): Promise<Hotel> => {
    const response = await api.post<Hotel>('/Hotel', hotelData);
    return response.data;
};

export const updateHotel = async (id: number, hotelData: {
    name: string;
    stars: number;
    timeOfStay: number;
    imageHotel: string;
    details?: string | null;
    address_Id?: number | null;
    tickets_Id?: number | null;
    hotelRooms_Id: number;
}): Promise<Hotel> => {
    const response = await api.put<Hotel>(`/Hotel/${id}`, hotelData);
    return response.data;
};

export const deleteHotel = async (id: number): Promise<void> => {
    await api.delete(`/Hotel/${id}`);
};

export const getHotelsByRoomId = async (roomId: number): Promise<Hotel[]> => {
    const response = await api.get<Hotel[]>(`/HotelRoom/${roomId}/hotels`);
    return response.data;
};

export default api;