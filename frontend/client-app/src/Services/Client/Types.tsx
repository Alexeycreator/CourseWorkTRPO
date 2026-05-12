import { UserData } from '../Auth/Types';

// Для создания клиента (совпадает с CreateUserDto на сервере)
export interface CreateClientRequest {
    surName: string;      // Фамилия
    firstName: string;       // Имя
    middleName?: string | null; // Отчество
    gender: string;          // Пол (обязательное поле)
    birthday: string;        // Дата рождения (обязательное поле)
    phoneNumber: string;     // Телефон
    email: string;           // Email
    login: string;           // Логин
    password: string;        // Пароль
    role: string;            // Роль (обязательное поле)
    position: string;        // Должность (обязательное поле, теперь string, а не optional)
}

// Для обновления клиента
export interface UpdateClientRequest {
    secondName?: string;
    firstName?: string;
    surName?: string | null;
    gender?: string;
    birthday?: string;
    phoneNumber?: string;
    email?: string;
    login?: string;
    password?: string;
    role?: string;
    position?: string | null;
}

// Остальные интерфейсы остаются без изменений
export interface UserResponse extends UserData { }

export interface SearchClientsParams {
    surname: string;
}

export interface CheckUniqueResponse {
    isUnique: boolean;
}

export interface ChangePasswordRequest {
    userId: number;
    oldPassword: string;
    newPassword: string;
}