import axios from "axios";
import { Client } from "./ClientApi";
import { CurrencyRatesTicket } from "./CurrencyRates_TicketsApi";
import { Employee } from "./EmployeesApi";

const API_URL = "http://localhost:5027/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Ticket {
    id: number;
    price: number;
    departureTime: string;
    arrivalTime: string;
    dateSale: string;
    client_Id: number | null;
    client?: Client;
    currencyRatesTickets?: CurrencyRatesTicket[];
    employees?: Employee[];
}

export const getTickets = async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/Ticket');
    return response.data;
};

export const getTicketById = async (id: number): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/Ticket/${id}`);
    return response.data;
};

export const createTicket = async (ticketData: {
    price: number;
    departureTime: string;
    arrivalTime: string;
    dateSale: string;
    client_Id?: number | null;
}): Promise<Ticket> => {
    const response = await api.post<Ticket>('/Ticket', ticketData);
    return response.data;
};

export const updateTicket = async (id: number, ticketData: {
    price: number;
    departureTime: string;
    arrivalTime: string;
    dateSale: string;
    client_Id?: number | null;
}): Promise<Ticket> => {
    const response = await api.put<Ticket>(`/Ticket/${id}`, ticketData);
    return response.data;
};

export const deleteTicket = async (id: number): Promise<void> => {
    await api.delete(`/Ticket/${id}`);
};

export const getEmployeesByTicketId = async (ticketId: number): Promise<Employee[]> => {
    const response = await api.get<Employee[]>(`/Ticket/${ticketId}/employees`);
    return response.data;
};

export default api;