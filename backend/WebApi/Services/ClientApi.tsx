import axios from "axios";
import { Passport } from "./PassportApi";
import { Ticket } from "./TicketsApi";

const API_URL = "http://localhost:5027/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Client {
    id: number;
    surName: string;
    firstName: string;
    middleName: string;
    phoneNumber: string;
    email: string;
    login: string;
    password: string;
    passport_Id: number | null;
    passport?: Passport;
    tickets?: Ticket[];
}

export const getClients = async (): Promise<Client[]> => {
    const response = await api.get<Client[]>('/Client');
    return response.data;
};

export const getClientById = async (id: number): Promise<Client> => {
    const response = await api.get<Client>(`/Client/${id}`);
    return response.data;
};

export const createClient = async (clientData: {
    surName: string;
    firstName: string;
    middleName: string;
    phoneNumber: string;
    email: string;
    login: string;
    password: string;
    passport_Id?: number | null;
}): Promise<Client> => {
    const response = await api.post<Client>('/Client', clientData);
    return response.data;
};

export const updateClient = async (id: number, clientData: {
    surName: string;
    firstName: string;
    middleName: string;
    phoneNumber: string;
    email: string;
    login: string;
    password: string;
    passport_Id?: number | null;
}): Promise<Client> => {
    const response = await api.put<Client>(`/Client/${id}`, clientData);
    return response.data;
};

export const deleteClient = async (id: number): Promise<void> => {
    await api.delete(`/Client/${id}`);
};

export const getClientTickets = async (clientId: number): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>(`/Client/${clientId}/tickets`);
    return response.data;
};

export const getClientPassport = async (clientId: number): Promise<Passport> => {
    const response = await api.get<Passport>(`/Client/${clientId}/passport`);
    return response.data;
};

export const checkLoginUnique = async (login: string): Promise<boolean> => {
    const response = await api.get<boolean>(`/Client/check-login?login=${login}`);
    return response.data;
};

export const checkEmailUnique = async (email: string): Promise<boolean> => {
    const response = await api.get<boolean>(`/Client/check-email?email=${email}`);
    return response.data;
};

export const authenticateClient = async (login: string, password: string): Promise<Client | null> => {
    const response = await api.post<Client | null>('/Client/authenticate', { login, password });
    return response.data;
};

export const searchClientsBySurname = async (surname: string): Promise<Client[]> => {
    const response = await api.get<Client[]>(`/Client/search?surname=${surname}`);
    return response.data;
};

export default api;