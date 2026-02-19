import axios from axios;
import { Passport } from .PassportApi;

const API_URL = httplocalhost5027api;

const api = axios.create({
    baseURL API_URL,
    headers {
        'Content-Type' 'applicationjson',
    },
});

export interface Address {
    id number;
    country string;
    region string;
    city string;
    street string;
    house string;
    apartment number  null;
    passport_Id number  null;
    passport Passport;
    hotels Hotel[];
}

 Получить все адреса
export const getAddresses = async () PromiseAddress[] = {
    const response = await api.getAddress[]('Address');
    return response.data;
};

 Получить адрес по ID
export const getAddressById = async (id number) PromiseAddress = {
    const response = await api.getAddress(`Address${id}`);
    return response.data;
};

 Создать адрес
export const createAddress = async (addressData {
    country string;
    region string;
    city string;
    street string;
    house string;
    apartment number  null;
    passport_Id number  null;
}) PromiseAddress = {
    const response = await api.postAddress('Address', addressData);
    return response.data;
};

 Обновить адрес
export const updateAddress = async (id number, addressData {
    country string;
    region string;
    city string;
    street string;
    house string;
    apartment number  null;
    passport_Id number  null;
}) PromiseAddress = {
    const response = await api.putAddress(`Address${id}`, addressData);
    return response.data;
};

 Удалить адрес
export const deleteAddress = async (id number) Promisevoid = {
    await api.delete(`Address${id}`);
};

export default api;