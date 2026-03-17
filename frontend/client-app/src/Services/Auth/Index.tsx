import { authApi } from '../../Services/Auth/Requests';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserData } from '../../Services/Auth/Types';

// Экспортируем всё необходимое
export { authApi };
export type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserData };

// Если нужно экспортировать что-то еще
export * from '../../Services/Auth/Requests';
export * from '../../Services/Auth/Types';

// Пустой экспорт для преобразования в модуль (если ничего не экспортируется)
// export {};

// Или можно реэкспортировать конкретные функции
export const login = authApi.login;
export const register = authApi.register;
export const logout = authApi.logout;
export const getCurrentUser = authApi.getCurrentUser;
export const isAuthenticated = authApi.isAuthenticated;
export const getStoredUser = authApi.getStoredUser;