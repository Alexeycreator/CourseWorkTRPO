import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import { getCurrentMainTour, CurrentTourDto } from '../Services/ToursApi';
import { getTransferById, Transfer } from '../Services/TransfersApi';
import NavBar from '../Components/NavBar';
import { Address, getAddressById } from '../Services/AddressApi';
import { clientApi, UserResponse } from '../Services/IndexAuth';
import { Passport } from '../Services/PassportApi';
import TicketPayment from '../TicketPayment';
import { HotelMainInfoDto } from '../Services/HotelsApi';
import { PLACEHOLDERS, isValidImagePath } from "../Components/OptimizedImage";

const TourPage = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');

    const [selectedTour, setSelectedTour] = useState<CurrentTourDto | null>(null);
    const [selectedTourTransfer, setSelectedTourTransfer] = useState<Transfer | null>(null);
    const [errorTour, setErrorTour] = useState<string | null>(null);

    const [addressTour, setAddressTour] = useState<Address | null>(null);

    // состояния курсов валют
    const [selectedCurrency, setSelectedCurrency] = useState('RUB');
    const [currentRate, setCurrentRate] = useState(1);
    const [signCurrency, setSignCurrency] = useState('₽');

    const [convertedPrice, setConvertedPrice] = useState<number>(0);

    // Состояния для модального окна оплаты
    const [showPayment, setShowPayment] = useState(false);
    const [clientData, setClientData] = useState<UserResponse | null>(null);
    const [passportData, setPassportData] = useState<Passport | null>(null);
    const [addressData, setAddressData] = useState<Address | null>(null);

    // Состояние для отеля
    const [hotel, setHotel] = useState<HotelMainInfoDto | null>(null);

    // TourPage.tsx - ОБНОВЛЕННЫЙ БЛОК ЗАГРУЗКИ ОТЕЛЕЙ

    // В методе fetchTour, замените блок загрузки отелей на:

    const fetchTour = async () => {
        try {
            setLoading(true);
            if (id) {
                const tourData = await getCurrentMainTour(Number(id));
                let transferData = null;
                let addressData = null;

                // Получаем адрес тура (если есть)
                if (tourData.addresses && tourData.addresses.length > 0) {
                    try {
                        addressData = await getAddressById(tourData.addresses[0].id);
                    } catch (addrErr) {
                        console.warn('Адрес не найден:', addrErr);
                    }
                }

                setSelectedTour(tourData);
                setAddressTour(addressData);
                setSelectedTourTransfer(transferData);
                setErrorTour(null);

                // ===== ИСПРАВЛЕННАЯ ЗАГРУЗКА ОТЕЛЕЙ =====
                // API возвращает отели в поле hotels (массив HotelMainInfoDto)
                if (tourData.hotels && tourData.hotels.length > 0) {
                    // Отель уже содержит нужную информацию
                    setHotel(tourData.hotels[0]);
                } else {
                    // Если отели не пришли в tourData, пробуем загрузить через отдельный запрос
                    try {
                        const hotelsResponse = await fetch(`http://localhost:5050/api/Hotels/get-current-hotel-info?tourId=${tourData.id}`, {
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                        });
                        if (hotelsResponse.ok) {
                            const hotelsData = await hotelsResponse.json();
                            if (hotelsData && hotelsData.length > 0) {
                                setHotel(hotelsData[0]);
                            }
                        }
                    } catch (hotelErr) {
                        console.warn('Отель не найден через отдельный запрос:', hotelErr);
                        setHotel(null);
                    }
                }
            }
        } catch (err: any) {
            console.error('Ошибка загрузки тура:', err);
            if (err.response?.status === 404) {
                navigate('/404', { replace: true });
            } else {
                setErrorTour(err.response?.data?.message || 'Ошибка загрузки данных');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchClientData = async () => {
        if (!user?.id) return;
        try {
            const client = await clientApi.getById(Number(user.id));
            setClientData(client);

            // Получаем паспорт через прямой GET запрос
            try {
                const passportInfoResponse = await fetch(`http://localhost:5050/api/Passports/get-info-passport?userId=${user.id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                if (passportInfoResponse.ok) {
                    const passportInfo = await passportInfoResponse.json();
                    if (passportInfo) {
                        const passport: Passport = {
                            id: passportInfo.id,
                            seria: passportInfo.seria,
                            number: passportInfo.number,
                            type: passportInfo.type,
                            issuedBy: passportInfo.issuedBy,
                            departmentCode: passportInfo.departmentCode,
                            dateOfIssue: passportInfo.dateOfIssue
                        };
                        setPassportData(passport);

                        if (passportInfo.address) {
                            const address: Address = {
                                id: passportInfo.address.id,
                                country: passportInfo.address.country || '',
                                region: passportInfo.address.region || '',
                                city: passportInfo.address.city || '',
                                street: passportInfo.address.street || '',
                                house: passportInfo.address.house || '',
                                apartment: passportInfo.address.apartment
                            };
                            setAddressData(address);
                        }
                    }
                }
            } catch (err) {
                console.log('Паспорт не найден:', err);
            }
        } catch (error) {
            console.error('Ошибка загрузки данных клиента:', error);
        }
    };

    useEffect(() => {
        fetchTour();
        if (isAuthenticated) {
            fetchClientData();
        }
    }, [id, user?.id, isAuthenticated]);

    useEffect(() => {
        if (selectedTour?.price) {
            setConvertedPrice(selectedTour.price);
        }
    }, [selectedTour]);

    useEffect(() => {
        if (location.state && (location.state as any).openBooking) {
            const timer = setTimeout(() => {
                setShowPayment(true);
                window.history.replaceState({}, document.title);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [location]);

    const calculateNights = (startDate: string | null | undefined, endDate: string | null | undefined): number => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculatePrice = (tourPrice: number | null | undefined, currencyRate: number): string => {
        const totalPrice = (tourPrice || 0) / currencyRate;
        return Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(totalPrice);
    };

    const handleCurrencyChange = async (currency: string, rate: number) => {
        switch (currency) {
            case "RUB": setSignCurrency('₽'); break;
            case "USD": setSignCurrency('$'); break;
            case "EUR": setSignCurrency('€'); break;
        }
        setSelectedCurrency(currency);
        setCurrentRate(rate);
        if (selectedTour?.price) {
            setConvertedPrice(selectedTour.price / rate);
        }
    };

    const handleBooking = () => {
        if (isAuthenticated && (!clientData || !passportData)) {
            alert('Пожалуйста, обновите страницу или заполните данные в личном кабинете');
            return;
        }
        setShowPayment(true);
    };

    const handleSubmitBooking = async (ticketData: any) => {
        try {
            console.log('Отправка данных бронирования:', ticketData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowPayment(false);
            alert('Тур успешно забронирован! На вашу почту отправлено подтверждение.');
        } catch (error) {
            console.error('Ошибка при бронировании:', error);
            alert('Произошла ошибка при бронировании. Пожалуйста, попробуйте позже.');
            throw error;
        }
    };

    if (loading) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <NavBar />
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>🐪</div>
                    <style>{`
                        @keyframes pulse {
                            0% { opacity: 0.6; transform: scale(1); }
                            50% { opacity: 1; transform: scale(1.1); }
                            100% { opacity: 0.6; transform: scale(1); }
                        }
                    `}</style>
                    <h2 style={{ color: '#8B5A2B' }}>Загрузка информации о туре...</h2>
                </div>
            </div>
        );
    }

    if (errorTour || !selectedTour) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
                minHeight: '100vh',
                padding: '20px',
                paddingTop: '70px'
            }}>
                <NavBar />
                <div style={{
                    maxWidth: '600px',
                    margin: '100px auto',
                    textAlign: 'center',
                    background: 'rgba(255, 248, 240, 0.9)',
                    borderRadius: '30px',
                    padding: '40px',
                    border: '2px solid #C0A080'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                    <h2 style={{ color: '#8B5A2B', marginBottom: '15px' }}>Тур не найден</h2>
                    <p style={{ color: '#B76E3C', marginBottom: '25px' }}>{errorTour || 'Запрашиваемый тур не существует'}</p>
                    <Link to="/catalog">
                        <button style={{
                            padding: '12px 30px',
                            background: '#C0A080',
                            color: '#FFF8F0',
                            border: '2px solid #8B5A2B',
                            borderRadius: '25px',
                            cursor: 'pointer'
                        }}>
                            Вернуться к каталогу
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
            minHeight: '100vh',
            padding: '20px',
            paddingTop: '70px'
        }}>
            <NavBar onCurrencyChange={handleCurrencyChange} />

            <div style={{ position: 'fixed', top: '10%', left: '2%', fontSize: '40px', opacity: 0.05, pointerEvents: 'none' }}>𓂀</div>
            <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '50px', opacity: 0.05, pointerEvents: 'none' }}>𓊹</div>
            <div style={{ position: 'fixed', top: '30%', right: '5%', fontSize: '35px', opacity: 0.05, pointerEvents: 'none' }}>𓋴</div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 2
            }}>
                {/* Хлебные крошки */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    color: '#8B5A2B',
                    flexWrap: 'wrap'
                }}>
                    <Link to="/" style={{ color: '#B76E3C', textDecoration: 'none' }}>Главная</Link>
                    <span>/</span>
                    <Link to="/catalog" style={{ color: '#B76E3C', textDecoration: 'none' }}>Каталог</Link>
                    <span>/</span>
                    <span>{selectedTour.nameTour || 'Тур'}</span>
                </div>

                {/* Основной контент */}
                <div style={{
                    background: 'rgba(255, 248, 240, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '40px',
                    padding: '40px',
                    boxShadow: '0 20px 40px rgba(139, 69, 19, 0.15)',
                    border: '2px solid #C0A080'
                }}>
                    {/* Заголовок */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div>
                            <h1 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '42px',
                                color: '#8B5A2B',
                                marginBottom: '5px'
                            }}>
                                {selectedTour.nameTour}
                            </h1>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ color: '#B76E3C' }}>📍 {addressTour?.country || 'Страна не указана'}, {addressTour?.city || 'Город не указан'}</span>
                                <span style={{ color: '#B76E3C' }}>•</span>
                                <span style={{ color: '#B76E3C' }}>🏷️ {selectedTour.type}</span>
                            </div>
                        </div>
                    </div>

                    {/* Изображение */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{
                            width: '100%',
                            height: '400px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            position: 'relative',
                            background: '#F0E5D5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={selectedTour.imageTour && isValidImagePath(selectedTour.imageTour) ? `${API_URL}/${selectedTour.imageTour}` : PLACEHOLDERS.tour}
                                alt={selectedTour.nameTour || 'Тур'}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = PLACEHOLDERS.tour;
                                    (e.target as HTMLImageElement).onerror = null;
                                }}
                            />
                        </div>
                    </div>

                    {/* Две колонки */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 350px',
                        gap: '40px'
                    }}>
                        {/* Левая колонка - описание */}
                        <div>
                            <section style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '24px',
                                    color: '#8B5A2B',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '8px'
                                }}>
                                    📝 Описание тура
                                </h2>
                                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#5A3E2B' }}>
                                    {selectedTour.description || selectedTour.details}
                                </p>
                            </section>

                            {/* Блок отеля */}
                            {hotel && (
                                <section style={{ marginBottom: '30px' }}>
                                    <h2 style={{
                                        fontSize: '24px',
                                        color: '#8B5A2B',
                                        marginBottom: '15px',
                                        fontFamily: "'Cormorant Garamond', serif",
                                        borderBottom: '2px solid #D2B48C',
                                        paddingBottom: '8px'
                                    }}>
                                        🏨 Проживание в отеле
                                    </h2>
                                    <div style={{
                                        background: '#FFF8F0',
                                        borderRadius: '20px',
                                        padding: '20px',
                                        border: '2px solid #D2B48C',
                                        display: 'flex',
                                        gap: '20px',
                                        alignItems: 'center',
                                        flexWrap: 'wrap'
                                    }}>
                                        {hotel && hotel.imageHotel && (
                                            <img
                                                src={isValidImagePath(hotel.imageHotel) ? `${API_URL}/${hotel.imageHotel}` : PLACEHOLDERS.hotel}
                                                alt={hotel.name || 'Отель'}
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    objectFit: 'cover',
                                                    borderRadius: '15px',
                                                    border: '2px solid #D2B48C'
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = PLACEHOLDERS.hotel;
                                                    (e.target as HTMLImageElement).onerror = null;
                                                }}
                                            />
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                fontSize: '20px',
                                                color: '#8B5A2B',
                                                marginBottom: '8px',
                                                fontFamily: "'Cormorant Garamond', serif"
                                            }}>
                                                {hotel.name}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ color: '#B76E3C' }}>
                                                    {'★'.repeat(hotel.stars || 0)}{'☆'.repeat(5 - (hotel.stars || 0))}
                                                </span>
                                                <span style={{ color: '#B76E3C' }}>•</span>
                                                <span style={{ color: '#B76E3C' }}>⏱ {hotel.countNight || 0} дней</span>
                                            </div>
                                            {hotel.description && (
                                                <p style={{ color: '#5A3E2B', fontSize: '14px', marginBottom: '12px' }}>
                                                    {hotel.description}
                                                </p>
                                            )}
                                            <Link to={`/hotel/${hotel.id}?tourId=${selectedTour?.id}`} style={{ textDecoration: 'none' }}>
                                                <button style={{
                                                    padding: '8px 20px',
                                                    background: '#C0A080',
                                                    color: '#FFF8F0',
                                                    border: '2px solid #8B5A2B',
                                                    borderRadius: '25px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    transition: 'all 0.3s'
                                                }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#8B5A2B'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#C0A080'}>
                                                    Подробнее об отеле →
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {selectedTour.included && selectedTour.included !== 'Не предусмотрено' && (
                                <section style={{ marginBottom: '30px' }}>
                                    <h2 style={{
                                        fontSize: '24px',
                                        color: '#8B5A2B',
                                        marginBottom: '15px',
                                        fontFamily: "'Cormorant Garamond', serif",
                                        borderBottom: '2px solid #D2B48C',
                                        paddingBottom: '8px'
                                    }}>
                                        ✅ В стоимость включено
                                    </h2>
                                    <ul style={{ color: '#5A3E2B', lineHeight: '1.8' }}>
                                        {selectedTour.included.split('\n').filter(item => item.trim() !== '').map((item, index) => (
                                            <li key={index} style={{ marginBottom: '8px' }}>✓ {item.trim()}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {selectedTour.separately && selectedTour.separately !== 'Не предусмотрено' && (
                                <section style={{ marginBottom: '30px' }}>
                                    <h2 style={{
                                        fontSize: '24px',
                                        color: '#8B5A2B',
                                        marginBottom: '15px',
                                        fontFamily: "'Cormorant Garamond', serif",
                                        borderBottom: '2px solid #D2B48C',
                                        paddingBottom: '8px'
                                    }}>
                                        ❌ Дополнительно оплачивается
                                    </h2>
                                    <ul style={{ color: '#5A3E2B', lineHeight: '1.8' }}>
                                        {selectedTour.separately.split('\n').filter(item => item.trim() !== '').map((item, index) => (
                                            <li key={index} style={{ marginBottom: '8px' }}>✗ {item.trim()}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {selectedTour.program && selectedTour.program !== 'Не предусмотрено' && (
                                <section>
                                    <h2 style={{
                                        fontSize: '24px',
                                        color: '#8B5A2B',
                                        marginBottom: '15px',
                                        fontFamily: "'Cormorant Garamond', serif",
                                        borderBottom: '2px solid #D2B48C',
                                        paddingBottom: '8px'
                                    }}>
                                        📅 Программа тура
                                    </h2>
                                    <ul style={{ color: '#5A3E2B', lineHeight: '1.8' }}>
                                        {selectedTour.program.split('\n').filter(item => item.trim() !== '').map((item, index) => (
                                            <li key={index} style={{ marginBottom: '8px' }}>{item.trim()}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>

                        {/* Правая колонка - бронирование */}
                        <div>
                            <div style={{
                                background: '#FFF8F0',
                                borderRadius: '20px',
                                padding: '25px',
                                border: '2px solid #D2B48C',
                                position: 'sticky',
                                top: '90px'
                            }}>
                                <h3 style={{
                                    fontSize: '22px',
                                    color: '#8B5A2B',
                                    marginBottom: '20px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    textAlign: 'center'
                                }}>
                                    Забронировать тур
                                </h3>

                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <span style={{
                                        fontSize: '36px',
                                        fontWeight: '700',
                                        color: '#8B5A2B'
                                    }}>
                                        {calculatePrice(selectedTour.price, currentRate)} {signCurrency}
                                    </span>
                                    <div style={{ color: '#B76E3C', fontSize: '14px', marginTop: '5px' }}>
                                        за {selectedTour.countNights || (selectedTour.startDot && selectedTour.endDot ? calculateNights(selectedTour.startDot, selectedTour.endDot) : 0)} ночей
                                    </div>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                                        📅 Дата вылета
                                    </label>
                                    <select
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '2px solid #D2B48C',
                                            borderRadius: '10px',
                                            backgroundColor: '#FFF8F0',
                                            color: '#8B5A2B',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="">Выберите дату</option>
                                        {selectedTour.startDot && (
                                            <option value={selectedTour.startDot}>
                                                {new Date(selectedTour.startDot).toLocaleDateString('ru-RU')}
                                            </option>
                                        )}
                                    </select>
                                </div>

                                <div style={{
                                    background: '#F0E5D5',
                                    borderRadius: '15px',
                                    padding: '15px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: '#8B5A2B' }}>✈️ Вылет из:</span>
                                        <span style={{ color: '#B76E3C' }}>{selectedTour.startDot || '—'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: '#8B5A2B' }}>📍 Назначение:</span>
                                        <span style={{ color: '#B76E3C' }}>{selectedTour.endDot || '—'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: '#8B5A2B' }}>🌙 Ночей:</span>
                                        <span style={{ color: '#B76E3C' }}>{selectedTour.countNights || calculateNights(selectedTour.startDot, selectedTour.endDot)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                                        color: '#FFF8F0',
                                        border: '2px solid #D2B48C',
                                        borderRadius: '30px',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    Забронировать
                                </button>

                                <p style={{ textAlign: 'center', fontSize: '12px', color: '#B76E3C', marginTop: '15px' }}>
                                    Бесплатная отмена за 14 дней до вылета
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to="/catalog">
                            <button style={{
                                padding: '12px 30px',
                                background: 'transparent',
                                color: '#8B5A2B',
                                border: '2px solid #C0A080',
                                borderRadius: '30px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192, 160, 128, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                ← Вернуться в каталог
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <TicketPayment
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                onSubmit={handleSubmitBooking}
                tour={selectedTour ? {
                    id: selectedTour.id,
                    name: selectedTour.nameTour || '',
                    nameTour: selectedTour.nameTour || '',
                    startDot: selectedTour.startDot || '',
                    endDot: selectedTour.endDot || '',
                    details: selectedTour.details || '',
                    imageTour: selectedTour.imageTour || '',
                    description: selectedTour.description || '',
                    separately: selectedTour.separately || '',
                    included: selectedTour.included || '',
                    program: selectedTour.program || '',
                    type: selectedTour.type || '',
                    typeTour: selectedTour.type || '',
                    price: selectedTour.price || 0
                } : null}
                clientData={clientData}
                passportData={passportData}
                addressData={addressData}
                convertedPrice={convertedPrice}
                currencySymbol={signCurrency}
            />
        </div>
    );
};

export { TourPage };