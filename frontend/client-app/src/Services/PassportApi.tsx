import axios from "axios";
import { Address } from "./AddressApi";

const API_URL = "http://localhost:5050/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Passport {
    id: number;
    seria: number;
    number: number;
    type: string;
    issuedBy: string;
    departmentCode: string;
    dateOfIssue: string;
    dateOfExpiry?: string; //загранпаспорт
    gender?: string; // ДОБАВЛЕНО: Пол
    placeOfBirth?: string; // ДОБАВЛЕНО: Место рождения
    addresses?: Address[] | null;
}