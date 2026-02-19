import axios from "axios";
import { Address } from "./AddressApi";
import { Client } from "./ClientApi";

const API_URL = "http://localhost:5050/api";

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
    addresses?: Address[] | null;
    clients?: Client[] | null;
}

export const getPassports = async (): Promise<Passport[]> => {
    const response = await api.get<Passport[]>('/Passports');
    return response.data;
};

export const getPassportById = async (id: number): Promise<Passport> => {
    const response = await api.get<Passport>(`/Passports/${id}`);
    return response.data;
};

export const createPassport = async (passportData: {
    seria: number;
    number: number;
    type: string;
}): Promise<Passport> => {
    const response = await api.post<Passport>('/Passports', passportData);
    return response.data;
};

export const updatePassport = async (id: number, passportData: {
    seria: number;
    number: number;
    type: string;
}): Promise<Passport> => {
    const response = await api.put<Passport>(`/Passports/${id}`, passportData);
    return response.data;
};

export const deletePassport = async (id: number): Promise<void> => {
    await api.delete(`/Passports/${id}`);
};

export const getAddressesByPassportId = async (passportId: number): Promise<Address[]> => {
    const response = await api.get<Address[]>(`/Passports/${passportId}/addresses`);
    return response.data;
};

export const getClientsByPassportId = async (passportId: number): Promise<Client[]> => {
    const response = await api.get<Client[]>(`/Passports/${passportId}/clients`);
    return response.data;
};

export default api;