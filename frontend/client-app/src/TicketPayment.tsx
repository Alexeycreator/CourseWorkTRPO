import React, { useState, useEffect } from 'react';
import { Client } from './Services/ClientApi';
import { Passport } from './Services/PassportApi';
import { Address } from './Services/AddressApi';

interface Tour {
  id?: number;
  name: string;
  startDot: string;
  endDot: string;
  details: string;
  imageTour: string;
  description: string;
  separately: string;
  included: string;
  program: string;
  type: string;
  hotTour: boolean;
  price: number;
  isReadOnly?: boolean;
  tickets_Id?: number | null;
  transfers_Id?: number | null;
}

interface Hotel {
  id?: number;
  name: string;
  stars: number;
  timeOfStay: number;
  imageHotel: string;
  details?: string | null;
  isReadOnly?: boolean;
  address_Id?: number | null;
  tickets_Id?: number | null;
  hotelRooms_Id?: number;
}

interface HotelRoom {
  id?: number;
  nameRoom: string;
  details?: string | null;
  floor: number;
  imageRoom?: string | null;
  isReadOnly?: boolean;
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
  tour?: Tour | null;
  hotel?: Hotel | null;
  room?: HotelRoom | null;
  clientData?: Client | null;
  passportData?: Passport | null;
  addressData?: Address | null;
  convertedPrice?: number;
  currencySymbol?: string;
}

// Функция для получения даты без времени (только YYYY-MM-DD)
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
  hotel,
  room,
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

  // Состояния для анимации загрузки и успешной оплаты
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Загрузка данных клиента при открытии модального окна
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
        birthday: clientData.birthday || '',
        phoneNumber: clientData.phoneNumber || '',
        email: clientData.email || ''
      });
    }
  }, [isOpen, clientData, passportData]);

  // Установка дат по умолчанию (текущая дата + 1 день для начала, + 7 дней для окончания)
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

    // Очищаем ошибку для этого поля
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

    // Валидация ФИО
    if (!formData.surName.trim()) newErrors.surName = 'Фамилия обязательна';
    if (!formData.firstName.trim()) newErrors.firstName = 'Имя обязательно';
    if (!formData.gender) newErrors.gender = 'Выберите пол';
    if (!formData.birthday) newErrors.birthday = 'Дата рождения обязательна';

    // Валидация паспортных данных
    if (!formData.passportSeries) newErrors.passportSeries = 'Серия паспорта обязательна';
    else if (!/^\d{4}$/.test(formData.passportSeries)) newErrors.passportSeries = 'Серия должна состоять из 4 цифр';

    if (!formData.passportNumber) newErrors.passportNumber = 'Номер паспорта обязателен';
    else if (!/^\d{6}$/.test(formData.passportNumber)) newErrors.passportNumber = 'Номер должен состоять из 6 цифр';

    if (!formData.issuedBy) newErrors.issuedBy = 'Кем выдан обязательно';
    if (!formData.dateOfIssue) newErrors.dateOfIssue = 'Дата выдачи обязательна';

    // Проверка даты выдачи (не в будущем)
    if (formData.dateOfIssue) {
      const issueDate = new Date(formData.dateOfIssue);
      const today = new Date();
      if (issueDate > today) {
        newErrors.dateOfIssue = 'Дата выдачи не может быть в будущем';
      }
    }

    if (!formData.departmentCode) newErrors.departmentCode = 'Код подразделения обязателен';
    else if (!/^\d{3}-\d{3}$/.test(formData.departmentCode)) newErrors.departmentCode = 'Формат: 000-000';

    // Валидация контактных данных
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Телефон обязателен';
    else if (!/^(\+7|7|8)\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Формат: 8XXXXXXXXXX, 7XXXXXXXXXX или +7XXXXXXXXXX';
    }

    if (!formData.email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email некорректен';

    // Валидация дат
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

  // Функция для расчета возраста
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Формируем данные для билета
      const ticketData: TicketData = {
        price: tour?.price || hotel?.timeOfStay || 0,
        departureTime: new Date(departureDate),
        arrivalTime: new Date(arrivalDate),
        dateSale: new Date(),
        client_Id: clientData?.id || null
      };

      await onSubmit(ticketData);

      // Закрываем форму оплаты и показываем загрузку
      onClose();
      setShowLoading(true);

      // Через 2 секунды показываем успех
      setTimeout(() => {
        setShowLoading(false);
        setShowSuccess(true);
      }, 2000);

    } catch (error) {
      console.error('Ошибка при оформлении тура:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Ошибка при оформлении тура. Пожалуйста, попробуйте позже.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  if (!isOpen && !showLoading && !showSuccess) return null;

  return (
    <>
      {/* Основное окно оплаты */}
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
            {/* Заголовок */}
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
                  {tour?.name || hotel?.name || 'Бронирование'}
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

            {/* Контент */}
            <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
              {/* Информация о туре */}
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
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px'
                }}>
                  <div>
                    <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Название</div>
                    <div style={{ color: '#5D3A1A', fontWeight: '500' }}>
                      {tour?.name || hotel?.name || 'Тур'}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Стоимость</div>
                    <div style={{ color: '#B76E3C', fontWeight: 'bold', fontSize: '18px' }}>
                      {formatPrice(convertedPrice)}
                    </div>
                  </div>
                  {tour && (
                    <>
                      <div>
                        <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Тип тура</div>
                        <div style={{ color: '#5D3A1A' }}>{tour.type}</div>
                      </div>
                      <div>
                        <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Даты</div>
                        <div style={{ color: '#5D3A1A' }}>{tour.startDot} → {tour.endDot}</div>
                      </div>
                    </>
                  )}
                  {hotel && (
                    <>
                      <div>
                        <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Отель</div>
                        <div style={{ color: '#5D3A1A' }}>{hotel.name}</div>
                      </div>
                      <div>
                        <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Звездность</div>
                        <div style={{ color: '#5D3A1A' }}>{'★'.repeat(hotel.stars)}</div>
                      </div>
                    </>
                  )}
                  {room && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ color: '#8B5A2B', fontSize: '12px', marginBottom: '3px' }}>Номер</div>
                      <div style={{ color: '#5D3A1A' }}>{room.nameRoom} (Этаж {room.floor})</div>
                    </div>
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
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px'
                }}>
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Фамилия *
                    </label>
                    <input
                      type="text"
                      name="surName"
                      value={formData.surName}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.surName ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
                    {errors.surName && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.surName}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Имя *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.firstName ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
                    {errors.firstName && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.firstName}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Отчество
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #D2B48C',
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Пол *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.gender ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    >
                      <option value="">Выберите пол</option>
                      <option value="Мужской">Мужской</option>
                      <option value="Женский">Женский</option>
                    </select>
                    {errors.gender && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.gender}</div>}
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Дата рождения *
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      max={getDateString(new Date())}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.birthday ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
                    {errors.birthday && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.birthday}</div>}
                    {formData.birthday && (
                      <div style={{ color: '#8B5A2B', fontSize: '12px', marginTop: '3px' }}>
                        Возраст: {calculateAge(formData.birthday)} лет
                      </div>
                    )}
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
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px'
                }}>
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Серия паспорта *
                    </label>
                    <input
                      type="text"
                      name="passportSeries"
                      value={formData.passportSeries}
                      onChange={handleInputChange}
                      placeholder="1234"
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.passportSeries ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
                    {errors.passportSeries && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.passportSeries}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Номер паспорта *
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleInputChange}
                      placeholder="123456"
                      maxLength={6}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.passportNumber ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
                    {errors.passportNumber && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.passportNumber}</div>}
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Кем выдан *
                    </label>
                    <input
                      type="text"
                      name="issuedBy"
                      value={formData.issuedBy}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.issuedBy ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
                    {errors.issuedBy && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.issuedBy}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Дата выдачи *
                    </label>
                    <input
                      type="date"
                      name="dateOfIssue"
                      value={formData.dateOfIssue}
                      max={getDateString(new Date())}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.dateOfIssue ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
                    {errors.dateOfIssue && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.dateOfIssue}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Код подразделения *
                    </label>
                    <input
                      type="text"
                      name="departmentCode"
                      value={formData.departmentCode}
                      onChange={handleInputChange}
                      placeholder="000-000"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.departmentCode ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
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
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px'
                }}>
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+7XXXXXXXXXX"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.phoneNumber ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
                    {errors.phoneNumber && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.phoneNumber}</div>}
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px', fontSize: '14px' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@mail.com"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: `2px solid ${errors.email ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '10px',
                        backgroundColor: '#FFF8F0',
                        color: '#5D3A1A'
                      }}
                    />
                    {errors.email && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.email}</div>}
                  </div>
                </div>
              </div>

              {/* Общая ошибка */}
              {errors.submit && (
                <div style={{
                  marginBottom: '20px',
                  padding: '12px',
                  background: '#f8d7da',
                  color: '#721c24',
                  border: '1px solid #f5c6cb',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  {errors.submit}
                </div>
              )}

              {/* Кнопки */}
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '12px 30px',
                    background: 'transparent',
                    color: '#8B5A2B',
                    border: '2px solid #D2B48C',
                    borderRadius: '25px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 40px',
                    background: isSubmitting ? '#C0A080' : 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                    color: '#FFF8F0',
                    border: '2px solid #D2B48C',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span>⏳</span> Оформление...
                    </>
                  ) : (
                    <>
                      <span>✅</span> Оформить тур
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Окно загрузки */}
      {showLoading && (
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
          zIndex: 10000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: '#FFF8F0',
            borderRadius: '30px',
            padding: '40px',
            textAlign: 'center',
            border: '2px solid #C0A080',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{
              fontSize: '60px',
              marginBottom: '20px',
              animation: 'spin 1s linear infinite'
            }}>
              ⏳
            </div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h2 style={{
              color: '#8B5A2B',
              fontSize: '24px',
              fontFamily: "'Cormorant Garamond', serif"
            }}>
              Обработка платежа...
            </h2>
            <p style={{ color: '#B76E3C', marginTop: '10px' }}>
              Пожалуйста, подождите
            </p>
          </div>
        </div>
      )}

      {/* Окно успешной оплаты */}
      {showSuccess && (
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
          zIndex: 10000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: '#FFF8F0',
            borderRadius: '30px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            border: '2px solid #C0A080',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{
              fontSize: '80px',
              marginBottom: '20px'
            }}>
              ✅🎉
            </div>
            <h2 style={{
              color: '#8B5A2B',
              fontSize: '28px',
              fontFamily: "'Cormorant Garamond', serif",
              marginBottom: '15px'
            }}>
              Оплата прошла успешно!
            </h2>
            <p style={{
              color: '#B76E3C',
              fontSize: '16px',
              marginBottom: '25px'
            }}>
              Спасибо за бронирование!<br />
            </p>
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
                boxShadow: '0 5px 15px rgba(183, 110, 60, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Отлично!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketPayment;