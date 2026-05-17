import React, { useState, useEffect } from 'react';
import { UserResponse } from './Services/IndexAuth';
import { Passports } from './Services/PassportApi';
import { Address } from './Services/AddressApi';
import { CreateTicketsDto } from './Services/TicketsApi';

interface ExtendedTour {
    id?: number;
    name?: string;
    nameTour?: string;
    startDot?: string;
    endDot?: string;
    details?: string;
    imageTour?: string;
    description?: string;
    separately?: string;
    included?: string;
    program?: string;
    type?: string;
    typeTour?: string;
    hotTour?: boolean;
    price?: number;
    ticketsId?: number | null;
    transfersId?: number | null;
    hotelsId?: number;
}

// Расширенный интерфейс для данных билета с полями для создания
interface TicketData extends CreateTicketsDto {
    client_Id?: number | null;
}

interface TicketPaymentProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (ticketData: TicketData) => Promise<void>;
    tour?: ExtendedTour | null;
    clientData?: UserResponse | null;
    passportData?: Passports | null;
    addressData?: Address | null;
    convertedPrice?: number;
    currencySymbol?: string;
    hotelRoomId?: number;
}

const getDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TicketPayment: React.FC<TicketPaymentProps> = ({
    isOpen,
    onClose,
    onSubmit,
    tour,
    clientData,
    passportData,
    addressData,
    convertedPrice = 0,
    currencySymbol = '₽',
    hotelRoomId = 1
}) => {
    const [formData, setFormData] = useState({
        surName: '',
        firstName: '',
        middleName: '',
        passportSeries: '',
        passportNumber: '',
        issuedBy: '',
        dateOfIssue: '',
        departmentCode: '',
        gender: '',
        birthday: '',
        phoneNumber: '',
        email: ''
    });

    const [departureDate, setDepartureDate] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showLoading, setShowLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [hasDocuments, setHasDocuments] = useState(false);

    // Заполнение формы при открытии
    useEffect(() => {
        if (isOpen) {

            if (clientData && passportData) {
                setHasDocuments(true);
                const newFormData = {
                    surName: clientData.surName || '',
                    firstName: clientData.firstName || '',
                    middleName: clientData.middleName || '',
                    passportSeries: passportData.seria?.toString() || '',
                    passportNumber: passportData.number?.toString() || '',
                    issuedBy: passportData.issuedBy || '',
                    dateOfIssue: passportData.dateOfIssue || '',
                    departmentCode: passportData.departmentCode || '',
                    gender: clientData.gender || '',
                    birthday: clientData.birthday?.toString() || '',
                    phoneNumber: clientData.phoneNumber || '',
                    email: clientData.email || ''
                };
                setFormData(newFormData);
            } else {
                setHasDocuments(false);
                if (clientData) {
                    setFormData(prev => ({
                        ...prev,
                        surName: clientData.surName || '',
                        firstName: clientData.firstName || '',
                        middleName: clientData.middleName || '',
                        gender: clientData.gender || '',
                        birthday: clientData.birthday?.toString() || '',
                        phoneNumber: clientData.phoneNumber || '',
                        email: clientData.email || ''
                    }));
                }
            }

            if (tour) {
                const tourStartDate = parseDate(tour.startDot);
                const tourEndDate = parseDate(tour.endDot);

                if (tourStartDate) {
                    setDepartureDate(getDateString(tourStartDate));
                } else {
                    const today = new Date();
                    const defaultStart = new Date(today);
                    defaultStart.setDate(today.getDate() + 1);
                    setDepartureDate(getDateString(defaultStart));
                }

                if (tourEndDate) {
                    setArrivalDate(getDateString(tourEndDate));
                } else if (tourStartDate) {
                    const defaultEnd = new Date(tourStartDate);
                    defaultEnd.setDate(tourStartDate.getDate() + 7);
                    setArrivalDate(getDateString(defaultEnd));
                } else {
                    const today = new Date();
                    const defaultEnd = new Date(today);
                    defaultEnd.setDate(today.getDate() + 8);
                    setArrivalDate(getDateString(defaultEnd));
                }
            } else {
                const today = new Date();
                const defaultStart = new Date(today);
                defaultStart.setDate(today.getDate() + 1);
                const defaultEnd = new Date(defaultStart);
                defaultEnd.setDate(defaultStart.getDate() + 7);

                setDepartureDate(getDateString(defaultStart));
                setArrivalDate(getDateString(defaultEnd));
            }
        }
    }, [isOpen, clientData, passportData, tour]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        console.log('🔍 Начало валидации');
        console.log('hasDocuments:', hasDocuments);
        console.log('clientData:', clientData);
        console.log('tour:', tour);
        console.log('formData:', formData);

        // Проверка наличия документов
        if (!hasDocuments) {
            newErrors.submit = 'Для бронирования необходимо добавить паспортные данные в личном кабинете';
            setErrors(newErrors);
            return false;
        }

        // Проверка клиентских данных
        if (!clientData?.id) {
            newErrors.submit = 'Данные клиента не загружены. Пожалуйста, обновите страницу.';
            setErrors(newErrors);
            return false;
        }

        if (!tour?.id) {
            newErrors.submit = 'Тур не выбран';
            setErrors(newErrors);
            return false;
        }

        // Пошаговая проверка каждого поля
        if (!formData.surName.trim()) {
            newErrors.surName = 'Фамилия обязательна';
        }
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Имя обязательно';
        }
        if (!formData.gender) {
            newErrors.gender = 'Выберите пол';
        }
        if (!formData.birthday) {
            newErrors.birthday = 'Дата рождения обязательна';
        }

        // Паспортные данные
        if (!formData.passportSeries) {
            newErrors.passportSeries = 'Серия паспорта обязательна';
        } else if (!/^\d{4}$/.test(formData.passportSeries)) {
            newErrors.passportSeries = 'Серия должна состоять из 4 цифр';
        }

        if (!formData.passportNumber) {
            newErrors.passportNumber = 'Номер паспорта обязателен';
        } else if (!/^\d{6}$/.test(formData.passportNumber)) {
            newErrors.passportNumber = 'Номер должен состоять из 6 цифр';
        }

        if (!formData.issuedBy) {
            newErrors.issuedBy = 'Кем выдан обязательно';
        }
        if (!formData.dateOfIssue) {
            newErrors.dateOfIssue = 'Дата выдачи обязательна';
        }
        if (!formData.departmentCode) {
            newErrors.departmentCode = 'Код подразделения обязателен';
        } else if (!/^\d{3}-\d{3}$/.test(formData.departmentCode)) {
            newErrors.departmentCode = 'Формат: 000-000';
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Телефон обязателен';
        } else if (!/^(\+7|7|8)\d{10}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
            newErrors.phoneNumber = 'Формат: +7XXXXXXXXXX, 7XXXXXXXXXX или 8XXXXXXXXXX';
        }

        if (!formData.email) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email некорректен';
        }

        if (!departureDate) {
            newErrors.departureDate = 'Дата начала тура обязательна';
        }
        if (!arrivalDate) {
            newErrors.arrivalDate = 'Дата окончания тура обязательна';
        }

        const isValid = Object.keys(newErrors).length === 0;

        setErrors(newErrors);
        return isValid;
    };

    // Функция для парсинга даты в разных форматах
    const parseDate = (dateStr: string | undefined | null): Date | null => {
        if (!dateStr) return null;

        // Формат DD.MM.YYYY
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split('.').map(Number);
            const date = new Date(year, month - 1, day);
            return isNaN(date.getTime()) ? null : date;
        }

        // Формат YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return isNaN(date.getTime()) ? null : date;
        }

        // Стандартный парсинг
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price) + ' ' + currencySymbol;
    };

    const calculateAge = (birthday: string) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getTourName = (): string => {
        if (tour) {
            if ('nameTour' in tour && tour.nameTour) return tour.nameTour;
            if ('name' in tour && tour.name) return tour.name;
        }
        return 'Бронирование';
    };

    const getTourId = (): number => {
        if (tour && 'id' in tour && tour.id) return tour.id;
        return 0;
    };

    const getTourType = (): string => {
        if (tour) {
            if ('type' in tour && tour.type) return tour.type;
            if ('typeTour' in tour && tour.typeTour) return tour.typeTour;
        }
        return 'Экскурсионный';
    };

    const getTourStartDot = (): string => {
        if (tour && 'startDot' in tour && tour.startDot) return tour.startDot;
        return '';
    };

    const getTourEndDot = (): string => {
        if (tour && 'endDot' in tour && tour.endDot) return tour.endDot;
        return '';
    };

    // Функция для получения отображаемой цены (уже с учетом скидки и валюты)
    const getDisplayPrice = (): string => {
        return formatPrice(convertedPrice);
    };

    // Функция для получения оригинальной цены со скидкой (для отображения зачеркнутой цены)
    const getOriginalPriceForHotTour = (): number | null => {
        if (tour?.hotTour && tour?.price) {
            return tour.price; // Оригинальная цена в RUB
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            if (!clientData?.id) {
                throw new Error('Данные клиента не загружены');
            }

            if (!tour?.id) {
                throw new Error('Тур не выбран');
            }

            // Функция для парсинга даты в формате DD.MM.YYYY
            const parseDate = (dateStr: string): Date | null => {
                if (!dateStr) return null;

                // Проверяем формат DD.MM.YYYY
                if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
                    const [day, month, year] = dateStr.split('.').map(Number);
                    const date = new Date(year, month - 1, day);
                    return isNaN(date.getTime()) ? null : date;
                }

                // Проверяем формат YYYY-MM-DD
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                    const [year, month, day] = dateStr.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return isNaN(date.getTime()) ? null : date;
                }

                // Пробуем стандартный парсинг
                const date = new Date(dateStr);
                return isNaN(date.getTime()) ? null : date;
            };

            // Парсим даты
            let startDate: Date;
            let endDate: Date;

            // Получаем дату начала
            const parsedStartDate = parseDate(departureDate);
            if (!parsedStartDate) {
                console.error('Не удалось распарсить departureDate:', departureDate);
                throw new Error('Некорректная дата начала тура');
            }
            startDate = parsedStartDate;

            // Получаем дату окончания
            const parsedEndDate = parseDate(arrivalDate);
            if (!parsedEndDate) {
                console.error('Не удалось распарсить arrivalDate:', arrivalDate);
                throw new Error('Некорректная дата окончания тура');
            }
            endDate = parsedEndDate;

            // Используем convertedPrice, который уже включает скидку и конвертацию валюты
            await onSubmit({
                price: convertedPrice,
                departureTime: startDate,
                arrivalTime: endDate,
                dateSale: new Date(),
                hotelRoomsId: hotelRoomId,
                tourId: tour.id,
                client_Id: clientData.id
            });

            setShowLoading(true);

            setTimeout(() => {
                setShowLoading(false);
                setShowSuccess(true);
                console.log('✅ Показан экран успеха');
            }, 2000);

        } catch (error: any) {
            console.error('❌ Ошибка в handleSubmit:', error);
            const errorMessage = error.serverMessage || error.message || 'Ошибка при оформлении тура. Пожалуйста, попробуйте позже.';

            // Проверяем, связана ли ошибка с отсутствием паспорта
            if (errorMessage.toLowerCase().includes('паспорт') || errorMessage.toLowerCase().includes('passport') || errorMessage.toLowerCase().includes('документ')) {
                setErrors({
                    submit: 'Для бронирования необходимо добавить паспортные данные в личном кабинете'
                });
            } else {
                setErrors(prev => ({
                    ...prev,
                    submit: errorMessage
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        window.location.reload();
    };

    const handleGoToAccount = () => {
        if (clientData?.id) {
            window.location.href = `/account/${clientData.id}`;
        }
    };

    if (!isOpen && !showLoading && !showSuccess) return null;

    return (
        <>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF5E8 100%)',
                        borderRadius: '30px',
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        border: '2px solid #C0A080',
                        position: 'relative'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                            padding: '20px 30px',
                            borderRadius: '28px 28px 0 0',
                            color: '#FFF8F0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '24px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    🎫 Оформление тура
                                </h2>
                                <p style={{ margin: '5px 0 0', fontSize: '14px', opacity: 0.9 }}>
                                    {getTourName()}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'rgba(255, 248, 240, 0.2)',
                                    border: 'none',
                                    color: '#FFF8F0',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 248, 240, 0.3)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 248, 240, 0.2)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Предупреждение о необходимости документов */}
                        {!hasDocuments && (
                            <div style={{
                                margin: '20px 30px 0',
                                padding: '15px',
                                background: '#FFF3CD',
                                border: '1px solid #FFC107',
                                borderRadius: '10px',
                                color: '#856404',
                                textAlign: 'center'
                            }}>
                                <p style={{ margin: '0 0 10px', fontSize: '14px' }}>
                                    ⚠️ Для бронирования необходимо добавить паспортные данные в личном кабинете
                                </p>
                                <button
                                    onClick={handleGoToAccount}
                                    style={{
                                        padding: '8px 20px',
                                        background: '#FFC107',
                                        color: '#856404',
                                        border: 'none',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Перейти в личный кабинет →
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
                            <div style={{
                                background: '#FFF8F0',
                                borderRadius: '20px',
                                padding: '20px',
                                border: '2px solid #D2B48C',
                                marginBottom: '25px'
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    color: '#B76E3C',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '1px solid #D2B48C',
                                    paddingBottom: '8px'
                                }}>
                                    📋 Информация о бронировании
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Название</div>
                                        <div style={{ color: '#5D3A1A', fontWeight: '500' }}>{getTourName()}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Стоимость</div>
                                        <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                                            {tour?.hotTour && getOriginalPriceForHotTour() && (
                                                <span style={{
                                                    fontSize: '16px',
                                                    color: '#B76E3C',
                                                    textDecoration: 'line-through'
                                                }}>
                                                    {formatPrice(getOriginalPriceForHotTour()!)}
                                                </span>
                                            )}
                                            <span style={{
                                                color: '#B76E3C',
                                                fontWeight: 'bold',
                                                fontSize: '20px'
                                            }}>
                                                {getDisplayPrice()}
                                            </span>
                                        </div>
                                        {tour?.hotTour && (
                                            <div style={{
                                                fontSize: '11px',
                                                color: '#28a745',
                                                marginTop: '4px'
                                            }}>
                                                🔥 Горящий тур со скидкой 20%!
                                            </div>
                                        )}
                                    </div>
                                    {tour && (
                                        <>
                                            <div>
                                                <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Тип тура</div>
                                                <div style={{ color: '#5D3A1A' }}>{getTourType()}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Даты тура</div>
                                                <div style={{ color: '#5D3A1A' }}>{getTourStartDot()} → {getTourEndDot()}</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Личные данные */}
                            <div style={{
                                background: '#FFF8F0',
                                borderRadius: '20px',
                                padding: '20px',
                                border: '2px solid #D2B48C',
                                marginBottom: '25px'
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    color: '#B76E3C',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '1px solid #D2B48C',
                                    paddingBottom: '8px'
                                }}>
                                    👤 Личные данные
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Фамилия *</label>
                                        <input type="text" name="surName" value={formData.surName} onChange={handleInputChange}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.surName ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.surName && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.surName}</div>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Имя *</label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.firstName ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.firstName && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.firstName}</div>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Отчество</label>
                                        <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange}
                                            style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Пол *</label>
                                        <select name="gender" value={formData.gender} onChange={handleInputChange}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.gender ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }}>
                                            <option value="">Выберите пол</option>
                                            <option value="Мужской">Мужской</option>
                                            <option value="Женский">Женский</option>
                                        </select>
                                        {errors.gender && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.gender}</div>}
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Дата рождения *</label>
                                        <input type="date" name="birthday" value={formData.birthday} max={getDateString(new Date())} onChange={handleInputChange}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.birthday ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.birthday && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.birthday}</div>}
                                        {formData.birthday && <div style={{ color: '#8B5A2B', fontSize: '12px', marginTop: '3px' }}>Возраст: {calculateAge(formData.birthday)} лет</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Паспортные данные */}
                            <div style={{
                                background: '#FFF8F0',
                                borderRadius: '20px',
                                padding: '20px',
                                border: '2px solid #D2B48C',
                                marginBottom: '25px',
                                opacity: hasDocuments ? 1 : 0.7
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    color: '#B76E3C',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '1px solid #D2B48C',
                                    paddingBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    🪪 Паспортные данные
                                    {!hasDocuments && (
                                        <span style={{ fontSize: '12px', color: '#dc3545' }}>(необходимо добавить в личном кабинете)</span>
                                    )}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Серия паспорта *</label>
                                        <input type="text" name="passportSeries" value={formData.passportSeries} onChange={handleInputChange} placeholder="1234" maxLength={4}
                                            disabled={!hasDocuments}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.passportSeries ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: hasDocuments ? '#FFF8F0' : '#F5F5F5', color: '#5D3A1A' }} />
                                        {errors.passportSeries && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.passportSeries}</div>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Номер паспорта *</label>
                                        <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} placeholder="123456" maxLength={6}
                                            disabled={!hasDocuments}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.passportNumber ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: hasDocuments ? '#FFF8F0' : '#F5F5F5', color: '#5D3A1A' }} />
                                        {errors.passportNumber && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.passportNumber}</div>}
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Кем выдан *</label>
                                        <input type="text" name="issuedBy" value={formData.issuedBy} onChange={handleInputChange}
                                            disabled={!hasDocuments}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.issuedBy ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: hasDocuments ? '#FFF8F0' : '#F5F5F5', color: '#5D3A1A' }} />
                                        {errors.issuedBy && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.issuedBy}</div>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Дата выдачи *</label>
                                        <input type="date" name="dateOfIssue" value={formData.dateOfIssue} max={getDateString(new Date())} onChange={handleInputChange}
                                            disabled={!hasDocuments}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.dateOfIssue ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: hasDocuments ? '#FFF8F0' : '#F5F5F5', color: '#5D3A1A' }} />
                                        {errors.dateOfIssue && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.dateOfIssue}</div>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Код подразделения *</label>
                                        <input type="text" name="departmentCode" value={formData.departmentCode} onChange={handleInputChange} placeholder="000-000"
                                            disabled={!hasDocuments}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.departmentCode ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: hasDocuments ? '#FFF8F0' : '#F5F5F5', color: '#5D3A1A' }} />
                                        {errors.departmentCode && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.departmentCode}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Контактные данные */}
                            <div style={{
                                background: '#FFF8F0',
                                borderRadius: '20px',
                                padding: '20px',
                                border: '2px solid #D2B48C',
                                marginBottom: '25px'
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    color: '#B76E3C',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '1px solid #D2B48C',
                                    paddingBottom: '8px'
                                }}>
                                    📞 Контактные данные
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Телефон *</label>
                                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+7XXXXXXXXXX"
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.phoneNumber ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.phoneNumber && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.phoneNumber}</div>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Email *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@mail.com"
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.email ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.email && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.email}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Даты поездки */}
                            <div style={{
                                background: '#FFF8F0',
                                borderRadius: '20px',
                                padding: '20px',
                                border: '2px solid #D2B48C',
                                marginBottom: '25px'
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    color: '#B76E3C',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '1px solid #D2B48C',
                                    paddingBottom: '8px'
                                }}>
                                    📅 Даты поездки
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Дата начала</label>
                                        <div style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '2px solid #D2B48C',
                                            borderRadius: '10px',
                                            backgroundColor: '#F5F5F5',
                                            color: '#5D3A1A'
                                        }}>
                                            {departureDate ? new Date(departureDate).toLocaleDateString('ru-RU') : 'Не указана'}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Дата окончания</label>
                                        <div style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '2px solid #D2B48C',
                                            borderRadius: '10px',
                                            backgroundColor: '#F5F5F5',
                                            color: '#5D3A1A'
                                        }}>
                                            {arrivalDate ? new Date(arrivalDate).toLocaleDateString('ru-RU') : 'Не указана'}
                                        </div>
                                    </div>
                                </div>
                                {tour && (
                                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#8B5A2B', textAlign: 'center' }}>
                                        Даты взяты из информации о туре
                                    </div>
                                )}
                            </div>
                            {errors.submit && (
                                <div style={{ marginBottom: '20px', padding: '12px', background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '10px', textAlign: 'center' }}>
                                    {errors.submit}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" onClick={onClose}
                                    style={{ padding: '12px 30px', background: 'transparent', color: '#8B5A2B', border: '2px solid #D2B48C', borderRadius: '25px', fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !hasDocuments}
                                    style={{
                                        padding: '12px 40px',
                                        background: isSubmitting || !hasDocuments ? '#C0A080' : 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                                        color: '#FFF8F0',
                                        border: '2px solid #D2B48C',
                                        borderRadius: '25px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: isSubmitting || !hasDocuments ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        opacity: isSubmitting || !hasDocuments ? 0.7 : 1
                                    }}
                                    onMouseEnter={(e) => { if (!isSubmitting && hasDocuments) e.currentTarget.style.transform = 'scale(1.05)'; }}
                                    onMouseLeave={(e) => { if (!isSubmitting && hasDocuments) e.currentTarget.style.transform = 'scale(1)'; }}>
                                    {!hasDocuments ? '🔒 Нужны документы' : isSubmitting ? '⏳ Оформление...' : '✅ Оформить тур'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showLoading && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(5px)' }}>
                    <div style={{ background: '#FFF8F0', borderRadius: '30px', padding: '40px', textAlign: 'center', border: '2px solid #C0A080', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px', animation: 'spin 1s linear infinite' }}>⏳</div>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                        <h2 style={{ color: '#8B5A2B', fontSize: '24px', fontFamily: "'Cormorant Garamond', serif" }}>Обработка платежа...</h2>
                        <p style={{ color: '#B76E3C', marginTop: '10px' }}>Пожалуйста, подождите</p>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(5px)' }}>
                    <div style={{ background: '#FFF8F0', borderRadius: '30px', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center', border: '2px solid #C0A080', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}>
                        <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅🎉</div>
                        <h2 style={{ color: '#8B5A2B', fontSize: '28px', fontFamily: "'Cormorant Garamond', serif", marginBottom: '15px' }}>Оплата прошла успешно!</h2>
                        <p style={{ color: '#B76E3C', fontSize: '16px', marginBottom: '25px' }}>Спасибо за бронирование!<br />Тур появится в разделе "Мои бронирования"</p>
                        <button onClick={handleCloseSuccess}
                            style={{ padding: '15px 40px', background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '40px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 5px 15px rgba(183, 110, 60, 0.3)' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            Отлично!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default TicketPayment;