import axios from "axios";
import { Client } from "./ClientApi";
//import { CurrencyRatesTicket } from "./CurrencyRates_TicketsApi";
import { Employee } from "./EmployeesApi";

const API_URL = "http://localhost:5050/api";

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
    client?: Client | null;
    //currencyRatesTickets?: CurrencyRatesTicket[];
    employees?: Employee[] | null;
}

export const getTickets = async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/Tickets');
    return response.data;
};

export const getTicketById = async (id: number): Promise<Ticket> => {
    const response = await api.get<Ticket>(`/Tickets/${id}`);
    return response.data;
};

export const createTicket = async (ticketData: {
    price: number;
    departureTime: string;
    arrivalTime: string;
    dateSale: string;
    client_Id?: number | null;
}): Promise<Ticket> => {
    const response = await api.post<Ticket>('/Tickets', ticketData);
    return response.data;
};

export const updateTicket = async (id: number, ticketData: {
    price: number;
    departureTime: string;
    arrivalTime: string;
    dateSale: string;
    client_Id?: number | null;
}): Promise<Ticket> => {
    const response = await api.put<Ticket>(`/Tickets/${id}`, ticketData);
    return response.data;
};

export const deleteTicket = async (id: number): Promise<void> => {
    await api.delete(`/Tickets/${id}`);
};

export const getEmployeesByTicketId = async (ticketId: number): Promise<Employee[]> => {
    const response = await api.get<Employee[]>(`/Tickets/${ticketId}/employees`);
    return response.data;
};

export default api;