import axios from "axios";
import { Ticket } from "./TicketsApi";

const API_URL = "http://localhost:5027/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Employee {
    id: number;
    surName: string;
    firstName: string;
    middleName: string;
    phoneNumber: string;
    email: string;
    position: string;
    tickets_Id: number | null;
    ticket?: Ticket;
}

export const getEmployees = async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>('/Employee');
    return response.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
    const response = await api.get<Employee>(`/Employee/${id}`);
    return response.data;
};


export const createEmployee = async (employeeData: {
    surName: string;
    firstName: string;
    middleName: string;
    phoneNumber: string;
    email: string;
    position: string;
    tickets_Id?: number | null;
}): Promise<Employee> => {
    const response = await api.post<Employee>('/Employee', employeeData);
    return response.data;
};


export const updateEmployee = async (id: number, employeeData: {
    surName: string;
    firstName: string;
    middleName: string;
    phoneNumber: string;
    email: string;
    position: string;
    tickets_Id?: number | null;
}): Promise<Employee> => {
    const response = await api.put<Employee>(`/Employee/${id}`, employeeData);
    return response.data;
};


export const deleteEmployee = async (id: number): Promise<void> => {
    await api.delete(`/Employee/${id}`);
};

export default api;