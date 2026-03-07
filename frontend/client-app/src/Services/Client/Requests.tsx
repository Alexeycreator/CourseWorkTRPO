import api from '../Core/Axios.config';
import { Passport } from '../PassportApi';
import { Ticket } from '../TicketsApi';
import { ClientResponse, CreateClientRequest, UpdateClientRequest, SearchClientsParams } from './Types';

export const clientApi = {
    // Получить всех клиентов - GET /api/Clients
    getAll: async (): Promise<ClientResponse[]> => {
        const response = await api.get<ClientResponse[]>('/Clients');
        return response.data;
    },

    // Получить клиента по ID - GET /api/Clients/{id}
    getById: async (id: number): Promise<ClientResponse> => {
        const response = await api.get<ClientResponse>(`/Clients/${id}`);
        return response.data;
    },

    // Создать клиента - POST /api/Clients/register (используем register)
    create: async (data: CreateClientRequest): Promise<ClientResponse> => {
        const response = await api.post<ClientResponse>('/Clients/register', data);
        return response.data;
    },

    // Обновить клиента - PUT /api/Clients/{id}
    update: async (id: number, data: UpdateClientRequest): Promise<void> => {
        await api.put(`/Clients/${id}`, data);
    },

    // Удалить клиента - DELETE /api/Clients/{id}
    delete: async (id: number): Promise<void> => {
        await api.delete(`/Clients/${id}`);
    },

    // Получить билеты клиента - GET /api/Clients/{id}/tickets
    getTickets: async (clientId: number): Promise<Ticket[]> => {
        const response = await api.get<Ticket[]>(`/Clients/${clientId}/tickets`);
        return response.data;
    },

    // Получить паспорт клиента - GET /api/Clients/{id}/passport
    getPassport: async (clientId: number): Promise<Passport> => {
        const response = await api.get<Passport>(`/Clients/${clientId}/passport`);
        return response.data;
    },

    // Проверить уникальность логина - GET /api/Clients/check-login?login={login}
    checkLoginUnique: async (login: string): Promise<boolean> => {
        const response = await api.get<boolean>(`/Clients/check-login?login=${login}`);
        return response.data;
    },

    // Проверить уникальность email - GET /api/Clients/check-email?email={email}
    checkEmailUnique: async (email: string): Promise<boolean> => {
        const response = await api.get<boolean>(`/Clients/check-email?email=${email}`);
        return response.data;
    },

    // Поиск клиентов по фамилии - GET /api/Clients/search?surname={surname}
    searchBySurname: async (params: SearchClientsParams): Promise<ClientResponse[]> => {
        const response = await api.get<ClientResponse[]>(`/Clients/search?surname=${params.surname}`);
        return response.data;
    }
};

// Для обратной совместимости экспортируем отдельно
export const getClients = clientApi.getAll;
export const getClientById = clientApi.getById;
export const createClient = clientApi.create;
export const updateClient = clientApi.update;
export const deleteClient = clientApi.delete;
export const getClientTickets = clientApi.getTickets;
export const getClientPassport = clientApi.getPassport;
export const checkLoginUnique = clientApi.checkLoginUnique;
export const checkEmailUnique = clientApi.checkEmailUnique;
export const searchClientsBySurname = clientApi.searchBySurname;