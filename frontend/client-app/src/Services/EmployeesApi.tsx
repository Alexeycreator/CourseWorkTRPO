import axios from "axios";
import { Ticket } from "./TicketsApi";

const API_URL = "http://localhost:5050/api";

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
    tickets_Id?: number | null;
    ticket?: Ticket | null;
}

export const getEmployees = async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>('/Employees');
    return response.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
    const response = await api.get<Employee>(`/Employees/${id}`);
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
    const response = await api.post<Employee>('/Employees', employeeData);
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
    const response = await api.put<Employee>(`/Employees/${id}`, employeeData);
    return response.data;
};


export const deleteEmployee = async (id: number): Promise<void> => {
    await api.delete(`/Employees/${id}`);
};

export default api;