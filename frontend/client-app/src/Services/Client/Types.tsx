import { UserData } from '../Auth/Types';

// Для создания клиента (совпадает с RegisterRequest)
export interface CreateClientRequest {
    surName: string;
    firstName: string;
    middleName?: string | null;
    phoneNumber: string;
    email: string;
    login: string;
    password: string;
    passport_Id?: number | null;
}

// Для обновления клиента
export interface UpdateClientRequest {
    surName?: string;
    firstName?: string;
    middleName?: string | null;
    phoneNumber?: string;
    email?: string;
    login?: string;
    password?: string;
    passport_Id?: number | null;
}

// Ответ с данными клиента (без пароля)
export interface ClientResponse extends UserData {
    // Наследуем все поля от UserData
}

// Для поиска по фамилии
export interface SearchClientsParams {
    surname: string;
}

// Для проверки уникальности
export interface CheckUniqueResponse {
    isUnique: boolean;
}