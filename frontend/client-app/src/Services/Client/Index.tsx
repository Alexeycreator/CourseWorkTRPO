// src/Services/Client/Index.tsx
import { clientApi } from '../../Services/Client/Requests';
import type { 
  ClientResponse, 
  CreateClientRequest, 
  UpdateClientRequest, 
  SearchClientsParams 
} from '../../Services/Client/Types';

// Экспортируем все типы
export type { 
  ClientResponse, 
  CreateClientRequest, 
  UpdateClientRequest, 
  SearchClientsParams 
};

// Экспортируем сам объект clientApi
export { clientApi };

// Экспортируем функции через реэкспорт (ОДИН РАЗ!)
export const getAllClients = clientApi.getAll;
export const getClientById = clientApi.getById;
export const createClient = clientApi.create; // Только одно объявление!
export const updateClient = clientApi.update;
export const deleteClient = clientApi.delete;
export const getClientTickets = clientApi.getTickets;
export const getClientPassport = clientApi.getPassport;
export const checkLoginUnique = clientApi.checkLoginUnique;
export const checkEmailUnique = clientApi.checkEmailUnique;
export const searchClientsBySurname = clientApi.searchBySurname;

// НЕ НАДО повторно экспортировать createClient еще раз!
// Уберите этот блок, если он есть:
/*
export {
  getAllClients as getClients,  // Если это createClient - ошибка!
  // ...
}
*/