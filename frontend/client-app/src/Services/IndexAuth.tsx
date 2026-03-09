export { default as api } from './Core/Axios.config';
export * from './Auth/Types';
export * from './Auth/Requests';
export * from './Client/Types';
export * from './Client/Requests';

// Удобные объекты для импорта
export { authApi } from './Auth/Requests';
export { clientApi } from './Client/Requests';