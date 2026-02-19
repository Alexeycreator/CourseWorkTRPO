import axios from "axios";
import { Address } from "./AddressApi";
import { Client } from "./ClientApi";

const API_URL = "http://localhost:5027/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Passport {
    id: number;
    seria: number;
    number: number;
    type: string;
    addresses?: Address[];
    clients?: Client[];
}

export const getPassports = async (): Promise<Passport[]> => {
    const response = await api.get<Passport[]>('/Passport');
    return response.data;
};

export const getPassportById = async (id: number): Promise<Passport> => {
    const response = await api.get<Passport>(`/Passport/${id}`);
    return response.data;
};

export const createPassport = async (passportData: {
    seria: number;
    number: number;
    type: string;
}): Promise<Passport> => {
    const response = await api.post<Passport>('/Passport', passportData);
    return response.data;
};

export const updatePassport = async (id: number, passportData: {
    seria: number;
    number: number;
    type: string;
}): Promise<Passport> => {
    const response = await api.put<Passport>(`/Passport/${id}`, passportData);
    return response.data;
};

export const deletePassport = async (id: number): Promise<void> => {
    await api.delete(`/Passport/${id}`);
};

export const getAddressesByPassportId = async (passportId: number): Promise<Address[]> => {
    const response = await api.get<Address[]>(`/Passport/${passportId}/addresses`);
    return response.data;
};

export const getClientsByPassportId = async (passportId: number): Promise<Client[]> => {
    const response = await api.get<Client[]>(`/Passport/${passportId}/clients`);
    return response.data;
};

export default api;