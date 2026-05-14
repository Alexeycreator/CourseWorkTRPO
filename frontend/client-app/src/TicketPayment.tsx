import React, { useState, useEffect } from 'react';
import { UserResponse } from './Services/IndexAuth';
import { Passport } from './Services/PassportApi';
import { Address } from './Services/AddressApi';
import { createTicket } from './Services/TicketsApi';

// Расширенный интерфейс для тура с поддержкой разных типов
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

interface TicketData {
    price: number;
    departureTime: Date;
    arrivalTime: Date;
    dateSale: Date;
    client_Id?: number | null;
}

interface TicketPaymentProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (ticketData: TicketData) => Promise<void>;
    tour?: ExtendedTour | null;
    clientData?: UserResponse | null;
    passportData?: Passport | null;
    addressData?: Address | null;
    convertedPrice?: number;
    currencySymbol?: string;
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
    currencySymbol = '₽'
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

    useEffect(() => {
        if (isOpen && clientData && passportData) {
            setFormData({
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
            });
        }
    }, [isOpen, clientData, passportData]);

    useEffect(() => {
        if (isOpen) {
            const today = new Date();
            const defaultStart = new Date(today);
            defaultStart.setDate(today.getDate() + 1);
            const defaultEnd = new Date(defaultStart);
            defaultEnd.setDate(defaultStart.getDate() + 7);

            setDepartureDate(getDateString(defaultStart));
            setArrivalDate(getDateString(defaultEnd));
        }
    }, [isOpen]);

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

        if (!formData.surName.trim()) newErrors.surName = 'Фамилия обязательна';
        if (!formData.firstName.trim()) newErrors.firstName = 'Имя обязательно';
        if (!formData.gender) newErrors.gender = 'Выберите пол';
        if (!formData.birthday) newErrors.birthday = 'Дата рождения обязательна';

        if (!formData.passportSeries) newErrors.passportSeries = 'Серия паспорта обязательна';
        else if (!/^\d{4}$/.test(formData.passportSeries)) newErrors.passportSeries = 'Серия должна состоять из 4 цифр';

        if (!formData.passportNumber) newErrors.passportNumber = 'Номер паспорта обязателен';
        else if (!/^\d{6}$/.test(formData.passportNumber)) newErrors.passportNumber = 'Номер должен состоять из 6 цифр';

        if (!formData.issuedBy) newErrors.issuedBy = 'Кем выдан обязательно';
        if (!formData.dateOfIssue) newErrors.dateOfIssue = 'Дата выдачи обязательна';

        if (formData.dateOfIssue) {
            const issueDate = new Date(formData.dateOfIssue);
            const today = new Date();
            if (issueDate > today) {
                newErrors.dateOfIssue = 'Дата выдачи не может быть в будущем';
            }
        }

        if (!formData.departmentCode) newErrors.departmentCode = 'Код подразделения обязателен';
        else if (!/^\d{3}-\d{3}$/.test(formData.departmentCode)) newErrors.departmentCode = 'Формат: 000-000';

        if (!formData.phoneNumber) newErrors.phoneNumber = 'Телефон обязателен';
        else if (!/^(\+7|7|8)\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Формат: 8XXXXXXXXXX, 7XXXXXXXXXX или +7XXXXXXXXXX';
        }

        if (!formData.email) newErrors.email = 'Email обязателен';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email некорректен';

        if (!departureDate) newErrors.departureDate = 'Дата начала тура обязательна';
        if (!arrivalDate) newErrors.arrivalDate = 'Дата окончания тура обязательна';

        if (departureDate && arrivalDate) {
            const start = new Date(departureDate);
            const end = new Date(arrivalDate);

            if (start >= end) {
                newErrors.arrivalDate = 'Дата окончания должна быть позже даты начала';
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (start < today) {
                newErrors.departureDate = 'Дата начала не может быть в прошлом';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

    // Безопасное получение названия тура
    const getTourName = (): string => {
        if (tour) {
            if ('nameTour' in tour && tour.nameTour) return tour.nameTour;
            if ('name' in tour && tour.name) return tour.name;
        }
        return 'Бронирование';
    };

    // Безопасное получение ID тура
    const getTourId = (): number => {
        if (tour && 'id' in tour && tour.id) return tour.id;
        return 0;
    };

    // Безопасное получение типа тура
    const getTourType = (): string => {
        if (tour) {
            if ('type' in tour && tour.type) return tour.type;
            if ('typeTour' in tour && tour.typeTour) return tour.typeTour;
        }
        return 'Экскурсионный';
    };

    // Безопасное получение дат
    const getTourStartDot = (): string => {
        if (tour && 'startDot' in tour && tour.startDot) return tour.startDot;
        return '';
    };

    const getTourEndDot = (): string => {
        if (tour && 'endDot' in tour && tour.endDot) return tour.endDot;
        return '';
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

            // Создаем билет через API
            await createTicket(clientData.id, {
                price: convertedPrice,
                departureTime: new Date(departureDate),
                arrivalTime: new Date(arrivalDate),
                dateSale: new Date(),
                hotelRoomsId: 1,
                tourId: getTourId()
            });

            // Вызываем onSubmit для дополнительной логики
            await onSubmit({
                price: convertedPrice,
                departureTime: new Date(departureDate),
                arrivalTime: new Date(arrivalDate),
                dateSale: new Date(),
                client_Id: clientData?.id || null
            });

            onClose();
            setShowLoading(true);

            setTimeout(() => {
                setShowLoading(false);
                setShowSuccess(true);
            }, 2000);

        } catch (error: any) {
            setErrors(prev => ({
                ...prev,
                submit: error.serverMessage || error.message || 'Ошибка при оформлении тура. Пожалуйста, попробуйте позже.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        window.location.reload();
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
                                        <div style={{ color: '#B76E3C', fontWeight: 'bold', fontSize: '18px' }}>{formatPrice(convertedPrice)}</div>
                                    </div>
                                    {tour && (
                                        <>
                                            <div>
                                                <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Тип тура</div>
                                                <div style={{ color: '#5D3A1A' }}>{getTourType()}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Даты</div>
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
                                    🪪 Паспортные данные
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Серия паспорта *</label>
                                        <input type="text" name="passportSeries" value={formData.passportSeries} onChange={handleInputChange} placeholder="1234" maxLength={4}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.passportSeries ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.passportSeries && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.passportSeries}</div>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Номер паспорта *</label>
                                        <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} placeholder="123456" maxLength={6}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.passportNumber ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.passportNumber && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.passportNumber}</div>}
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Кем выдан *</label>
                                        <input type="text" name="issuedBy" value={formData.issuedBy} onChange={handleInputChange}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.issuedBy ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.issuedBy && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.issuedBy}</div>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Дата выдачи *</label>
                                        <input type="date" name="dateOfIssue" value={formData.dateOfIssue} max={getDateString(new Date())} onChange={handleInputChange}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.dateOfIssue ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.dateOfIssue && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.dateOfIssue}</div>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Код подразделения *</label>
                                        <input type="text" name="departmentCode" value={formData.departmentCode} onChange={handleInputChange} placeholder="000-000"
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.departmentCode ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
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
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Дата начала *</label>
                                        <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} min={getDateString(new Date())}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.departureDate ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.departureDate && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.departureDate}</div>}
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>Дата окончания *</label>
                                        <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} min={departureDate}
                                            style={{ width: '100%', padding: '10px', border: `2px solid ${errors.arrivalDate ? '#dc3545' : '#D2B48C'}`, borderRadius: '10px', backgroundColor: '#FFF8F0', color: '#5D3A1A' }} />
                                        {errors.arrivalDate && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.arrivalDate}</div>}
                                    </div>
                                </div>
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
                                <button type="submit" disabled={isSubmitting}
                                    style={{ padding: '12px 40px', background: isSubmitting ? '#C0A080' : 'linear-gradient(135deg, #B76E3C, #8B5A2B)', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '25px', fontSize: '16px', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.transform = 'scale(1.05)'; }}
                                    onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.transform = 'scale(1)'; }}>
                                    {isSubmitting ? <>⏳ Оформление...</> : <>✅ Оформить тур</>}
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