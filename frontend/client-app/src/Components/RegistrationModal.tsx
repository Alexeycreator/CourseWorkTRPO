import React, { useState, useEffect } from 'react';
import { authApi, UserData } from '../Services/IndexAuth';

interface RegistrationFormData {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phoneRaw: string;
    phoneFormatted: string;
    gender: 'male' | 'female';
    birthDay: string;
    birthMonth: string;
    birthYear: string;
    age: number;
    login: string;
    password: string;
    confirmPassword: string;
    isReadOnly: boolean;
}

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: UserData) => void;
    onSwitchToAuth: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    onSwitchToAuth,
}) => {
    const initialForm: RegistrationFormData = {
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phoneRaw: '',
        phoneFormatted: '',
        gender: 'male',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        age: 0,
        login: '',
        password: '',
        confirmPassword: '',
        isReadOnly: false,
    };

    const [form, setForm] = useState<RegistrationFormData>(initialForm);
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [registeredUser, setRegisteredUser] = useState<UserData | null>(null);

    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
    ];
    const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

    useEffect(() => {
        if (!isOpen) {
            setForm(initialForm);
            setStep(1);
            setError(null);
            setFieldErrors({});
            setShowPassword(false);
            setShowSuccessModal(false);
            setRegisteredUser(null);
        }
    }, [isOpen]);

    const calculateAge = (day: string, month: string, year: string): number => {
        if (!day || !month || !year) return 0;
        const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const filterLettersOnly = (value: string) => value.replace(/[^а-яА-Яa-zA-Z]/g, '');
    const filterLogin = (value: string) => value.replace(/[^a-zA-Z0-9_]/g, '');

    const formatPhone = (digits: string): string => {
        let cleaned = digits.replace(/\D/g, '');
        if (cleaned.length === 0) return '';
        if (cleaned.startsWith('8')) cleaned = '7' + cleaned.slice(1);
        if (!cleaned.startsWith('7')) cleaned = '7' + cleaned;
        const phoneDigits = cleaned.slice(0, 11);
        let formatted = '+7';
        if (phoneDigits.length > 1) formatted += ' (' + phoneDigits.slice(1, 4);
        if (phoneDigits.length >= 4) formatted += ') ' + phoneDigits.slice(4, 7);
        if (phoneDigits.length >= 7) formatted += '-' + phoneDigits.slice(7, 9);
        if (phoneDigits.length >= 9) formatted += '-' + phoneDigits.slice(9, 11);
        return formatted;
    };

    const handlePhoneChange = (value: string) => {
        const digits = value.replace(/\D/g, '');
        const rawDigits = digits.slice(0, 11);
        const formatted = formatPhone(rawDigits);
        setForm(prev => ({ ...prev, phoneRaw: rawDigits, phoneFormatted: formatted }));
        if (fieldErrors.phone) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.phone;
                return newErrors;
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let filteredValue = value;

        switch (name) {
            case 'firstName':
            case 'lastName':
            case 'middleName':
                filteredValue = filterLettersOnly(value);
                setForm(prev => ({ ...prev, [name]: filteredValue }));
                break;
            case 'login':
                filteredValue = filterLogin(value);
                setForm(prev => ({ ...prev, [name]: filteredValue }));
                break;
            case 'phone':
                handlePhoneChange(value);
                return;
            default:
                const checked = (e.target as HTMLInputElement).checked;
                setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : filteredValue }));
                break;
        }

        if (name === 'birthDay' || name === 'birthMonth' || name === 'birthYear') {
            setForm(prev => {
                const newForm = { ...prev, [name]: filteredValue };
                const age = calculateAge(
                    name === 'birthDay' ? filteredValue : newForm.birthDay,
                    name === 'birthMonth' ? filteredValue : newForm.birthMonth,
                    name === 'birthYear' ? filteredValue : newForm.birthYear
                );
                return { ...newForm, age };
            });
        }

        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep1 = (): boolean => {
        const errors: Record<string, string> = {};

        const lastName = form.lastName || '';
        const firstName = form.firstName || '';
        const email = form.email || '';
        const phoneRaw = form.phoneRaw || '';
        const birthDay = form.birthDay || '';
        const birthMonth = form.birthMonth || '';
        const birthYear = form.birthYear || '';
        const gender = form.gender;

        if (!lastName.trim()) errors.lastName = 'Фамилия обязательна для заполнения';
        else if (lastName.length < 2) errors.lastName = 'Фамилия должна содержать минимум 2 символа';

        if (!firstName.trim()) errors.firstName = 'Имя обязательно для заполнения';
        else if (firstName.length < 2) errors.firstName = 'Имя должно содержать минимум 2 символа';

        if (!email.trim()) {
            errors.email = 'Email обязателен для заполнения';
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            errors.email = 'Введите корректный email (пример: name@domain.ru)';
        }

        if (!phoneRaw.trim()) {
            errors.phone = 'Номер телефона обязателен';
        } else if (phoneRaw.length !== 11) {
            errors.phone = 'Телефон должен содержать 11 цифр (с кодом страны 7)';
        }

        // Подсветка отдельных полей даты
        let birthErrorMessage = '';
        let hasBirthError = false;

        if (!birthDay) {
            errors.birthDayMissing = 'День не выбран';
            hasBirthError = true;
        }
        if (!birthMonth) {
            errors.birthMonthMissing = 'Месяц не выбран';
            hasBirthError = true;
        }
        if (!birthYear) {
            errors.birthYearMissing = 'Год не выбран';
            hasBirthError = true;
        }

        if (!hasBirthError) {
            const age = calculateAge(birthDay, birthMonth, birthYear);
            if (age < 18) {
                birthErrorMessage = 'Регистрация доступна только с 18 лет';
                // при ошибке возраста подсвечиваем все три поля
                errors.birthDayMissing = 'error';
                errors.birthMonthMissing = 'error';
                errors.birthYearMissing = 'error';
                hasBirthError = true;
            }
        }

        if (hasBirthError) {
            if (!birthErrorMessage) {
                birthErrorMessage = 'Выберите день, месяц и год рождения';
            }
            errors.birthDate = birthErrorMessage;
        }

        if (!gender) errors.gender = 'Выберите пол';

        setFieldErrors(errors);
        return Object.keys(errors).filter(k => !['birthDayMissing', 'birthMonthMissing', 'birthYearMissing'].includes(k)).length === 0;
    };

    const validateStep2 = (): boolean => {
        const errors: Record<string, string> = {};
        const login = form.login || '';
        const password = form.password || '';
        const confirmPassword = form.confirmPassword || '';

        if (!login.trim()) {
            errors.login = 'Логин обязателен';
        } else if (login.length < 3) {
            errors.login = 'Логин должен содержать минимум 3 символа';
        } else if (!/^[a-zA-Z0-9_]+$/.test(login)) {
            errors.login = 'Логин может содержать только латинские буквы, цифры и знак подчёркивания';
        } else if (!/[a-zA-Z]/.test(login)) {
            errors.login = 'Логин должен содержать хотя бы одну латинскую букву';
        }

        if (!password) {
            errors.password = 'Пароль обязателен';
        } else if (password.length < 6) {
            errors.password = 'Пароль должен содержать минимум 6 символов';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Пароли не совпадают';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const handleBack = () => setStep(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setLoading(true);
        setError(null);

        try {
            let phoneForServer = form.phoneRaw;
            if (phoneForServer.startsWith('7')) phoneForServer = '+' + phoneForServer;
            else if (phoneForServer.startsWith('8')) phoneForServer = '+' + '7' + phoneForServer.slice(1);
            else phoneForServer = '+7' + phoneForServer;

            const registerData = {
                surName: form.lastName,
                firstName: form.firstName,
                middleName: form.middleName,
                phoneNumber: phoneForServer,
                email: form.email,
                login: form.login,
                password: form.password,
            };

            await authApi.register(registerData);
            const loginResponse = await authApi.login({ login: form.login, password: form.password });
            const fullName = `${loginResponse.user.surName} ${loginResponse.user.firstName} ${loginResponse.user.middleName || ''}`.trim();
            setSuccessMessage(`Вы успешно зарегистрированы!\nДобро пожаловать, ${fullName}!`);
            setRegisteredUser(loginResponse.user);
            setShowSuccessModal(true);
        } catch (err: any) {
            if (err.response?.status === 409) {
                const msg = err.response.data?.message || '';
                if (msg.includes('логин')) setError('Пользователь с таким логином уже существует');
                else if (msg.includes('email')) setError('Пользователь с таким email уже существует');
                else if (msg.includes('телефон')) setError('Пользователь с таким телефоном уже существует');
                else setError('Пользователь уже существует');
            } else {
                setError('Ошибка при регистрации. Попробуйте позже');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        if (registeredUser) onSuccess(registeredUser);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Основное окно регистрации */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000,
                    padding: '20px',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#F8F0E0',
                        borderRadius: '30px',
                        padding: '30px',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative',
                        border: '2px solid #C0A080',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#8B5A2B',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(183, 110, 60, 0.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        ✕
                    </button>

                    <h2
                        style={{
                            textAlign: 'center',
                            color: '#8B5A2B',
                            fontSize: '28px',
                            fontFamily: "'Cormorant Garamond', serif",
                            marginBottom: '20px',
                        }}
                    >
                        🐪 Регистрация туриста
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {step === 1 ? (
                            // Шаг 1: Личные данные
                            <section style={{ marginBottom: '30px' }}>
                                <h3
                                    style={{
                                        fontSize: '20px',
                                        color: '#8B5A2B',
                                        marginBottom: '20px',
                                        fontFamily: "'Cormorant Garamond', serif",
                                        borderBottom: '2px solid #D2B48C',
                                        paddingBottom: '10px',
                                    }}
                                >
                                    📋 Личные данные
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                    {/* Имя */}
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                            Имя <span style={{ color: '#dc3545' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: `2px solid ${fieldErrors.firstName ? '#dc3545' : '#D2B48C'}`,
                                                borderRadius: '15px',
                                                backgroundColor: '#FFF8F0',
                                                color: '#8B5A2B',
                                                fontSize: '15px',
                                                outline: 'none',
                                            }}
                                        />
                                        <div style={{ fontSize: '12px', color: '#B76E3C', marginTop: '4px' }}>Пример: Иван</div>
                                        {fieldErrors.firstName && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px' }}>{fieldErrors.firstName}</div>}
                                    </div>
                                    {/* Фамилия */}
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                            Фамилия <span style={{ color: '#dc3545' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: `2px solid ${fieldErrors.lastName ? '#dc3545' : '#D2B48C'}`,
                                                borderRadius: '15px',
                                                backgroundColor: '#FFF8F0',
                                                color: '#8B5A2B',
                                                fontSize: '15px',
                                                outline: 'none',
                                            }}
                                        />
                                        <div style={{ fontSize: '12px', color: '#B76E3C', marginTop: '4px' }}>Пример: Петров</div>
                                        {fieldErrors.lastName && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px' }}>{fieldErrors.lastName}</div>}
                                    </div>
                                    {/* Отчество */}
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                            Отчество (при наличии)
                                        </label>
                                        <input
                                            type="text"
                                            name="middleName"
                                            value={form.middleName}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '2px solid #D2B48C',
                                                borderRadius: '15px',
                                                backgroundColor: '#FFF8F0',
                                                color: '#8B5A2B',
                                                fontSize: '15px',
                                                outline: 'none',
                                            }}
                                        />
                                        <div style={{ fontSize: '12px', color: '#B76E3C', marginTop: '4px' }}>Пример: Иванович</div>
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                            Email <span style={{ color: '#dc3545' }}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: `2px solid ${fieldErrors.email ? '#dc3545' : '#D2B48C'}`,
                                                borderRadius: '15px',
                                                backgroundColor: '#FFF8F0',
                                                color: '#8B5A2B',
                                                fontSize: '15px',
                                                outline: 'none',
                                            }}
                                        />
                                        <div style={{ fontSize: '12px', color: '#B76E3C', marginTop: '4px' }}>Пример: ivan@mail.ru</div>
                                        {fieldErrors.email && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px' }}>{fieldErrors.email}</div>}
                                    </div>
                                    {/* Телефон */}
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                            Телефон <span style={{ color: '#dc3545' }}>*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phoneFormatted}
                                            onChange={handleChange}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: `2px solid ${fieldErrors.phone ? '#dc3545' : '#D2B48C'}`,
                                                borderRadius: '15px',
                                                backgroundColor: '#FFF8F0',
                                                color: '#8B5A2B',
                                                fontSize: '15px',
                                                outline: 'none',
                                            }}
                                        />
                                        <div style={{ fontSize: '12px', color: '#B76E3C', marginTop: '4px' }}>Пример: +7 (912) 345-67-89</div>
                                        {fieldErrors.phone && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px' }}>{fieldErrors.phone}</div>}
                                    </div>
                                    {/* Пол */}
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                            Пол <span style={{ color: '#dc3545' }}>*</span>
                                        </label>
                                        <div style={{ display: 'flex', gap: '20px', padding: '12px 0' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    checked={form.gender === 'male'}
                                                    onChange={handleChange}
                                                />
                                                Мужской
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    checked={form.gender === 'female'}
                                                    onChange={handleChange}
                                                />
                                                Женский
                                            </label>
                                        </div>
                                        {fieldErrors.gender && <div style={{ color: '#dc3545', fontSize: '12px' }}>{fieldErrors.gender}</div>}
                                    </div>
                                    {/* Дата рождения + возраст */}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 3 }}>
                                                <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                                    Дата рождения <span style={{ color: '#dc3545' }}>*</span>
                                                </label>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <select
                                                        name="birthDay"
                                                        value={form.birthDay}
                                                        onChange={handleChange}
                                                        style={{
                                                            flex: 1,
                                                            padding: '12px',
                                                            border: `2px solid ${fieldErrors.birthDayMissing ? '#dc3545' : '#D2B48C'}`,
                                                            borderRadius: '15px',
                                                            backgroundColor: '#FFF8F0',
                                                            color: '#8B5A2B',
                                                            fontSize: '15px',
                                                        }}
                                                    >
                                                        <option value="">День</option>
                                                        {days.map(day => <option key={day} value={day}>{day}</option>)}
                                                    </select>
                                                    <select
                                                        name="birthMonth"
                                                        value={form.birthMonth}
                                                        onChange={handleChange}
                                                        style={{
                                                            flex: 2,
                                                            padding: '12px',
                                                            border: `2px solid ${fieldErrors.birthMonthMissing ? '#dc3545' : '#D2B48C'}`,
                                                            borderRadius: '15px',
                                                            backgroundColor: '#FFF8F0',
                                                            color: '#8B5A2B',
                                                            fontSize: '15px',
                                                        }}
                                                    >
                                                        <option value="">Месяц</option>
                                                        {months.map((month, idx) => <option key={month} value={idx + 1}>{month}</option>)}
                                                    </select>
                                                    <select
                                                        name="birthYear"
                                                        value={form.birthYear}
                                                        onChange={handleChange}
                                                        style={{
                                                            flex: 1,
                                                            padding: '12px',
                                                            border: `2px solid ${fieldErrors.birthYearMissing ? '#dc3545' : '#D2B48C'}`,
                                                            borderRadius: '15px',
                                                            backgroundColor: '#FFF8F0',
                                                            color: '#8B5A2B',
                                                            fontSize: '15px',
                                                        }}
                                                    >
                                                        <option value="">Год</option>
                                                        {years.map(year => <option key={year} value={year}>{year}</option>)}
                                                    </select>
                                                </div>
                                                {fieldErrors.birthDate && (
                                                    <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>{fieldErrors.birthDate}</div>
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                                    Возраст
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.age ? `${form.age} лет` : '—'}
                                                    disabled
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        border: '2px solid #D2B48C',
                                                        borderRadius: '15px',
                                                        backgroundColor: '#F0E0D0',
                                                        color: '#8B5A2B',
                                                        fontSize: '15px',
                                                        outline: 'none',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        style={{
                                            padding: '12px 40px',
                                            background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                                            color: '#FFF8F0',
                                            border: '2px solid #D2B48C',
                                            borderRadius: '40px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                        }}
                                    >
                                        Далее →
                                    </button>
                                </div>
                            </section>
                        ) : (
                            // Шаг 2: Безопасность (без изменений)
                            <>
                                <section style={{ marginBottom: '30px' }}>
                                    <h3 style={{ fontSize: '20px', color: '#8B5A2B', marginBottom: '20px', fontFamily: "'Cormorant Garamond', serif", borderBottom: '2px solid #D2B48C', paddingBottom: '10px' }}>
                                        🔐 Безопасность
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                                Логин <span style={{ color: '#dc3545' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="login"
                                                value={form.login}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: `2px solid ${fieldErrors.login ? '#dc3545' : '#D2B48C'}`,
                                                    borderRadius: '15px',
                                                    backgroundColor: '#FFF8F0',
                                                    color: '#8B5A2B',
                                                    fontSize: '15px',
                                                }}
                                            />
                                            <div style={{ fontSize: '12px', color: '#B76E3C', marginTop: '4px' }}>Пример: ivan_petrov (только латиница, цифры, символ - "_", обязательно хотя бы одна буква)</div>
                                            {fieldErrors.login && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px' }}>{fieldErrors.login}</div>}
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                                Пароль <span style={{ color: '#dc3545' }}>*</span>
                                            </label>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: `2px solid ${fieldErrors.password ? '#dc3545' : '#D2B48C'}`,
                                                    borderRadius: '15px',
                                                    backgroundColor: '#FFF8F0',
                                                    color: '#8B5A2B',
                                                    fontSize: '15px',
                                                }}
                                            />
                                            <div style={{ fontSize: '12px', color: '#B76E3C', marginTop: '4px' }}>Минимум 6 символов</div>
                                            {fieldErrors.password && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px' }}>{fieldErrors.password}</div>}
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                                Подтвердите пароль <span style={{ color: '#dc3545' }}>*</span>
                                            </label>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    border: `2px solid ${fieldErrors.confirmPassword ? '#dc3545' : '#D2B48C'}`,
                                                    borderRadius: '15px',
                                                    backgroundColor: '#FFF8F0',
                                                    color: '#8B5A2B',
                                                    fontSize: '15px',
                                                }}
                                            />
                                            {fieldErrors.confirmPassword && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '2px' }}>{fieldErrors.confirmPassword}</div>}
                                        </div>
                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B', fontSize: '14px' }}>
                                                <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                                                Показать пароль
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                <section style={{ marginBottom: '30px' }}>
                                    <div style={{ background: '#FFF8F0', borderRadius: '20px', padding: '20px', border: '2px solid #D2B48C' }}>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B5A2B', fontSize: '14px' }}>
                                                <input type="checkbox" checked={true} disabled style={{ cursor: 'not-allowed' }} />
                                                <span>Я согласен на обработку персональных данных <span style={{ color: '#dc3545' }}>*</span></span>
                                            </label>
                                        </div>
                                        <div>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B5A2B', fontSize: '14px' }}>
                                                <input type="checkbox" name="isReadOnly" checked={form.isReadOnly} onChange={handleChange} />
                                                <span>Защита от изменений (данные нельзя будет редактировать без специального разрешения)</span>
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                {error && (
                                    <div style={{ marginBottom: '20px', padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '10px', textAlign: 'center' }}>
                                        {error}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        style={{
                                            padding: '12px 30px',
                                            background: 'transparent',
                                            color: '#8B5A2B',
                                            border: '2px solid #D2B48C',
                                            borderRadius: '40px',
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ← Назад
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            padding: '12px 40px',
                                            background: loading ? '#999' : 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                                            color: '#FFF8F0',
                                            border: '2px solid #D2B48C',
                                            borderRadius: '40px',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            opacity: loading ? 0.7 : 1,
                                        }}
                                    >
                                        {loading ? 'Регистрация...' : '🐪 Зарегистрироваться'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        style={{
                                            padding: '12px 30px',
                                            background: 'transparent',
                                            color: '#8B5A2B',
                                            border: '2px solid #D2B48C',
                                            borderRadius: '40px',
                                            fontSize: '16px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Отмена
                                    </button>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                    <button
                                        type="button"
                                        onClick={onSwitchToAuth}
                                        style={{ background: 'none', border: 'none', color: '#B76E3C', textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                        Уже есть аккаунт? Войти
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>

            {/* Модальное окно успешной регистрации */}
            {showSuccessModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 3000,
                        padding: '20px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#F8F0E0',
                            borderRadius: '30px',
                            padding: '40px',
                            maxWidth: '500px',
                            width: '100%',
                            textAlign: 'center',
                            border: '2px solid #C0A080',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉🐪</div>
                        <h2
                            style={{
                                color: '#8B5A2B',
                                fontSize: '24px',
                                fontFamily: "'Cormorant Garamond', serif",
                                marginBottom: '20px',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {successMessage}
                        </h2>
                        <button
                            onClick={handleCloseSuccess}
                            style={{
                                padding: '15px 40px',
                                background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                                color: '#FFF8F0',
                                border: '2px solid #D2B48C',
                                borderRadius: '40px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 5px 15px rgba(183, 110, 60, 0.3)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            Продолжить
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegistrationModal;