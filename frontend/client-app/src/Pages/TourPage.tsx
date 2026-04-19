import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { getTourById, Tour } from '../Services/ToursApi';
import { getTicketById, Ticket } from '../Services/TicketsApi';
import { getTransferById, Transfer } from '../Services/TransfersApi';
import NavBar from '../Components/NavBar';
import { Address, getAddressById } from '../Services/AddressApi';
import { getClientById } from '../Services/ClientApi';
import { getPassportById, Passport } from '../Services/PassportApi';
import TicketPayment from '../TicketPayment';

const TourPage = () => {
    const { id } = useParams<{ id: string }>();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');

    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
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
    const [clientData, setClientData] = useState<any>(null);
    const [passportData, setPassportData] = useState<Passport | null>(null);
    const [addressData, setAddressData] = useState<Address | null>(null);

    const fetchTour = async () => {
        try {
            setLoading(true);
            if (id) {
                const tourData = await getTourById(Number(id));
                let transferData = null;
                let addressData = null;
                
                if (tourData.transfers_Id) {
                    transferData = await getTransferById(Number(tourData.transfers_Id));
                }
                if (tourData.id) {
                    addressData = await getAddressById(tourData.id);
                }
                
                setSelectedTour(tourData);
                setAddressTour(addressData);
                setSelectedTourTransfer(transferData);
                console.log("Tour: ", tourData);
                console.log("TourTransfer: ", transferData);
                console.log("TourAddress: ", addressData);
                setErrorTour(null);
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
            const client = await getClientById(Number(user.id));
            setClientData(client);
            if (client.passport_Id) {
                const passport = await getPassportById(client.passport_Id);
                setPassportData(passport);
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

    const calculateNights = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculatePrice = (tourPrice: number, currencyRate: number): string => {
        const totalPrice = tourPrice / currencyRate;
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

    // ИЗМЕНЕНА ФУНКЦИЯ handleBooking - убрана проверка авторизации
    const handleBooking = () => {
        // Проверка на наличие данных клиента (если пользователь авторизован)
        if (isAuthenticated && (!clientData || !passportData)) {
            alert('Пожалуйста, обновите страницу или заполните данные в личном кабинете');
            return;
        }
        // Открываем окно оплаты даже для неавторизованных пользователей
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

            {/* Фоновые иероглифы */}
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
                    <span>{selectedTour.name}</span>
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
                                {selectedTour.name}
                            </h1>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ color: '#B76E3C' }}>📍 {addressTour?.country}, {addressTour?.city}</span>
                                <span style={{ color: '#B76E3C' }}>•</span>
                                <span style={{ color: '#B76E3C' }}>🏷️ {selectedTour.type}</span>
                                {selectedTour.hotTour && (
                                    <span style={{ background: '#B76E3C', color: '#FFF8F0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>🔥 Горящий тур</span>
                                )}
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
                                src={`${API_URL}/${selectedTour.imageTour}`}
                                alt={selectedTour.name}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=No+Image';
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
                                        {selectedTour.included.split('.').filter(item => item.trim() !== '').map((item, index) => (
                                            <li key={index} style={{ marginBottom: '8px' }}>✓ {item.trim()}.</li>
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
                                        {selectedTour.separately.split('.').filter(item => item.trim() !== '').map((item, index) => (
                                            <li key={index} style={{ marginBottom: '8px' }}>✗ {item.trim()}.</li>
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
                                        {selectedTour.program.split(';').filter(item => item.trim() !== '').map((item, index) => (
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
                                        {calculatePrice(Number(selectedTour.price), currentRate)} {signCurrency}
                                    </span>
                                    <div style={{ color: '#B76E3C', fontSize: '14px', marginTop: '5px' }}>
                                        за {calculateNights(selectedTour.startDot, selectedTour.endDot)} ночей
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
                                        <option value={selectedTour.startDot}>{new Date(selectedTour.startDot).toLocaleDateString('ru-RU')}</option>
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
                                        <span style={{ color: '#B76E3C' }}>{selectedTour.startDot}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: '#8B5A2B' }}>📍 Назначение:</span>
                                        <span style={{ color: '#B76E3C' }}>{selectedTour.endDot}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: '#8B5A2B' }}>🌙 Ночей:</span>
                                        <span style={{ color: '#B76E3C' }}>{calculateNights(selectedTour.startDot, selectedTour.endDot)}</span>
                                    </div>
                                    {selectedTourTransfer && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#8B5A2B' }}>🚌 Трансфер:</span>
                                            <span style={{ color: '#B76E3C' }}>{selectedTourTransfer.name}</span>
                                        </div>
                                    )}
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
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    Забронировать
                                </button>

                                <p style={{
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    color: '#B76E3C',
                                    marginTop: '15px'
                                }}>
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
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(192, 160, 128, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}>
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
                tour={selectedTour}
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