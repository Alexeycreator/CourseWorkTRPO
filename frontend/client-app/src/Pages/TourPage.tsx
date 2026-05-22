import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { getCurrentMainTour, CurrentTourDto, getAllTours, Tours } from '../Services/ToursApi';
import { getCurrentHotelInfo } from '../Services/HotelsApi';
import NavBar from '../Components/NavBar';
import { Address, getAddressById } from '../Services/AddressApi';
import { clientApi, UserResponse } from '../Services/IndexAuth';
import { Passports, getInfoPassport } from '../Services/PassportApi';
import TicketPayment from '../TicketPayment';
import { HotelMainInfoDto } from '../Services/HotelsApi';
import { getSafeImageUrl, PLACEHOLDERS } from "../Components/OptimizedImage";
import Loader from "../Components/Loader";
import { createTicket } from "../Services/TicketsApi";
import { useCurrency } from '../Contexts/CurrencyContext';

// Интерфейс для location.state
interface LocationState {
    openBooking?: boolean;
}

const DELETED_PASSPORTS_KEY = 'deletedPassports';

const getDeletedPassportIds = (): number[] => {
    try { return JSON.parse(localStorage.getItem(DELETED_PASSPORTS_KEY) || '[]'); }
    catch { return []; }
};

const TourPage = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');

    const [selectedTour, setSelectedTour] = useState<CurrentTourDto | null>(null);
    const [errorTour, setErrorTour] = useState<string | null>(null);
    const [isHotTour, setIsHotTour] = useState<boolean>(false);

    const [addressTour, setAddressTour] = useState<Address | null>(null);

    const [convertedPrice, setConvertedPrice] = useState<number>(0);

    // Состояния для модального окна оплаты
    const [showPayment, setShowPayment] = useState(false);
    const [clientData, setClientData] = useState<UserResponse | null>(null);
    const [passportData, setPassportData] = useState<Passports | null>(null);
    const [addressData, setAddressData] = useState<Address | null>(null);

    // Состояние для отеля
    const [hotel, setHotel] = useState<HotelMainInfoDto | null>(null);

    // Состояние для проверки документов
    const [hasValidDocuments, setHasValidDocuments] = useState(false);
    const [documentsChecked, setDocumentsChecked] = useState(false);
    const [hotelRoomId, setHotelRoomId] = useState<number>(1)

    const [showAuthToast, setShowAuthToast] = useState(false);

    const { selectedCurrency, currentRate, signCurrency, setCurrency } = useCurrency();

    const handleCurrencyChange = (currency: string, rate: number) => {
        setCurrency(currency, rate);
    };

    // Функция для расчета цены со скидкой (20% для горящих туров)
    const getDiscountedPrice = (price: number | null | undefined): number => {
        if (!price) return 0;
        if (isHotTour) {
            return price * 0.8; // 20% скидка
        }
        return price;
    };

    const fetchTour = async () => {
        try {
            setLoading(true);
            if (id) {
                const tourData = await getCurrentMainTour(Number(id));

                // Получаем информацию о том, является ли тур горящим из отдельного API
                try {
                    const allTours = await getAllTours();
                    const tourInfo = allTours.find(t => t.id === Number(id));
                    if (tourInfo) {
                        setIsHotTour(tourInfo.hotTour === true);
                    }
                } catch (err) {
                    console.log('Не удалось загрузить информацию о горящем туре');
                }

                let addressData = null;

                if (tourData.hotels && tourData.hotels.length > 0) {
                    const firstHotel = tourData.hotels[0];
                    setHotel(firstHotel);
                    try {
                        // Если в отеле есть поле hotelRoomsId
                        if ((firstHotel as any).hotelRoomsId) {
                            setHotelRoomId((firstHotel as any).hotelRoomsId);
                        } else {
                            // Если нет, нужно получить дополнительную информацию об отеле
                            const hotelFullInfo = await getCurrentHotelInfo(tourData.id);
                            if (hotelFullInfo && hotelFullInfo.length > 0 && hotelFullInfo[0].mainInfo && hotelFullInfo[0].mainInfo.length > 0) {
                                setHotelRoomId(hotelFullInfo[0].mainInfo[0].id);
                            }
                        }
                    } catch (err) {
                        console.log('Не удалось получить hotelRoomId');
                        setHotelRoomId(1); // fallback
                    }
                }

                // Получаем адрес тура (если есть)
                if (tourData.addresses && tourData.addresses.length > 0) {
                    try {
                        addressData = await getAddressById(tourData.addresses[0].id);
                    } catch (addrErr) {
                        // Тихая обработка - адрес не обязателен
                    }
                }

                setSelectedTour(tourData);
                setAddressTour(addressData);
                setErrorTour(null);

                // Устанавливаем цены
                if (tourData.price) {
                    const discounted = getDiscountedPrice(tourData.price);
                    setConvertedPrice(discounted / currentRate);
                }

                if (tourData.hotels && tourData.hotels.length > 0) {
                    setHotel(tourData.hotels[0]);
                } else {
                    try {
                        const hotelsData = await getCurrentHotelInfo(tourData.id);
                        if (hotelsData && hotelsData.length > 0) {
                            setHotel(hotelsData[0]);
                        }
                    } catch (hotelErr: any) {
                        setErrorTour(`Не удалось загрузить отель: ${hotelErr.serverMessage || hotelErr.message}`);
                        setHotel(null);
                    }
                }
            }
        } catch (err: any) {
            if (err.statusCode === 404 || err.response?.status === 404) {
                navigate('/404', { replace: true });
            } else {
                const errorMessage = err.serverMessage || err.response?.data?.message || err.message || 'Ошибка загрузки данных';
                setErrorTour(errorMessage);
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

            // Получаем паспорт через API метод
            try {
                const passportInfo = await getInfoPassport(user.id);

                // Проверяем, не удален ли паспорт локально
                const deletedIds = getDeletedPassportIds();

                if (passportInfo && !deletedIds.includes(passportInfo.id)) {
                    const passport: Passports = {
                        id: passportInfo.id,
                        seria: passportInfo.seria,
                        number: passportInfo.number,
                        type: passportInfo.type,
                        issuedBy: passportInfo.issuedBy,
                        departmentCode: passportInfo.departmentCode,
                        dateOfIssue: passportInfo.dateOfIssue.toString()
                    };
                    setPassportData(passport);
                    setHasValidDocuments(true);

                    if (passportInfo.address) {
                        const address: Address = {
                            id: passportInfo.address.id,
                            country: passportInfo.address.country || '',
                            region: passportInfo.address.region || '',
                            city: passportInfo.address.city || '',
                            street: passportInfo.address.street || '',
                            house: passportInfo.address.house || '',
                            apartment: passportInfo.address.apartment ? parseInt(passportInfo.address.apartment, 10) : null
                        };
                        setAddressData(address);
                    }
                } else {
                    // Паспорт не найден или удален локально
                    setPassportData(null);
                    setAddressData(null);
                    setHasValidDocuments(false);
                }
            } catch (err) {
                // Паспорт не найден
                setPassportData(null);
                setAddressData(null);
                setHasValidDocuments(false);
            }
        } catch (error) {
            setErrorTour('Ошибка загрузки данных клиента');
        } finally {
            setDocumentsChecked(true);
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
            const discounted = getDiscountedPrice(selectedTour.price);
            setConvertedPrice(discounted / currentRate);
        }
    }, [selectedTour, currentRate, selectedCurrency, isHotTour]);

    useEffect(() => {
        const state = location.state as LocationState;
        if (state?.openBooking) {
            const timer = setTimeout(() => {
                handleBooking();
                window.history.replaceState({}, document.title);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [location]);

    const parseDateForNights = (dateStr: string | null | undefined): Date | null => {
        if (!dateStr) return null;
        try {
            // Формат YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                const [year, month, day] = dateStr.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                if (!isNaN(date.getTime())) return date;
            }
            // Формат DD.MM.YYYY
            if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
                const [day, month, year] = dateStr.split('.').map(Number);
                const date = new Date(year, month - 1, day);
                if (!isNaN(date.getTime())) return date;
            }
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) return date;
            return null;
        } catch { return null; }
    };

    const calculateNightsCount = (startDate: string | null | undefined, endDate: string | null | undefined): number => {
        if (!startDate || !endDate) return 0;

        let start: Date | null = null;
        let end: Date | null = null;

        // Парсим дату начала
        if (startDate.includes('.')) {
            // Формат DD.MM.YYYY
            const [day, month, year] = startDate.split('.').map(Number);
            start = new Date(year, month - 1, day);
        } else if (startDate.includes('-')) {
            // Формат YYYY-MM-DD
            const [year, month, day] = startDate.split('-').map(Number);
            start = new Date(year, month - 1, day);
        } else {
            start = new Date(startDate);
        }

        // Парсим дату окончания
        if (endDate.includes('.')) {
            // Формат DD.MM.YYYY
            const [day, month, year] = endDate.split('.').map(Number);
            end = new Date(year, month - 1, day);
        } else if (endDate.includes('-')) {
            // Формат YYYY-MM-DD
            const [year, month, day] = endDate.split('-').map(Number);
            end = new Date(year, month - 1, day);
        } else {
            end = new Date(endDate);
        }

        // Проверяем валидность дат
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
        if (end <= start) return 0;

        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays; // Возвращает количество дней = количество ночей
    };

    const calculatePrice = (tourPrice: number | null | undefined, currencyRate: number): string => {
        if (!tourPrice) return '0';
        const discountedPrice = getDiscountedPrice(tourPrice);
        const totalPrice = discountedPrice / currencyRate;
        return Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(totalPrice);
    };

    const handleBooking = () => {
        if (!isAuthenticated) {
            setShowAuthToast(true);
            setTimeout(() => {
                setShowAuthToast(false);
                window.dispatchEvent(new CustomEvent('openAuthModal'));
            }, 2000);
            return;
        }

        if (!documentsChecked) {
            alert('Пожалуйста, подождите, данные проверяются...');
            return;
        }

        if (!hasValidDocuments || !passportData) {
            const message = 'Для бронирования тура необходимо добавить паспортные данные.\n\nПерейти в личный кабинет для добавления документов?';
            if (window.confirm(message)) {
                navigate(`/account/${user?.id}`);
            }
            return;
        }

        if (!clientData) {
            alert('Ошибка загрузки данных клиента. Пожалуйста, обновите страницу.');
            return;
        }
        setShowPayment(true);
    };

    const parseDate = (dateStr: string | null | undefined): Date | null => {
        if (!dateStr) return null;

        // Формат YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return isNaN(date.getTime()) ? null : date;
        }

        // Формат DD.MM.YYYY
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split('.').map(Number);
            const date = new Date(year, month - 1, day);
            return isNaN(date.getTime()) ? null : date;
        }

        // Стандартный парсинг
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
    };

    // Функция расчета ночей (как в MainPage.tsx)
    const calculateNights = (startDate: string | null | undefined, endDate: string | null | undefined): number | null => {
        const start = parseDate(startDate);
        const end = parseDate(endDate);
        if (!start || !end || end <= start) return null;
        const diffTime = end.getTime() - start.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Функция отображения ночей (как в MainPage.tsx)
    const getNightsDisplay = (tour: CurrentTourDto): string => {
        if (tour.countNights != null && tour.countNights > 0) {
            return `${tour.countNights} ночей`;
        }
        if (tour.startDot && tour.endDot) {
            const nights = calculateNights(tour.startDot, tour.endDot);
            if (nights != null && nights >= 0) {
                return nights === 0 ? 'Однодневный тур' : `${nights - 1} ночей`;
            }
        }
        return 'Количество ночей не указано';
    };

    // Исправленный handleSubmitBooking
    const handleSubmitBooking = async (ticketData: any) => {
        if (!clientData?.id || !selectedTour) {
            throw new Error('Недостаточно данных для бронирования');
        }

        if (!passportData) {
            throw new Error('Для бронирования необходимы паспортные данные');
        }

        if (!hotelRoomId || hotelRoomId <= 0) {
            throw new Error('Не удалось определить номер в отеле для бронирования');
        }

        // Парсим даты
        let startDate: Date;
        let endDate: Date;

        // Получаем дату начала
        const parsedStartDate = parseDate(selectedDate || selectedTour.startDot);
        if (!parsedStartDate) {
            throw new Error('Некорректная дата начала тура');
        }
        startDate = parsedStartDate;

        // Получаем дату окончания
        const parsedEndDate = parseDate(selectedTour.endDot);
        if (!parsedEndDate) {
            throw new Error('Некорректная дата окончания тура');
        }
        endDate = parsedEndDate;

        try {
            await createTicket(clientData.id, {
                price: convertedPrice,
                departureTime: startDate,
                arrivalTime: endDate,
                dateSale: new Date(),
                hotelRoomsId: hotelRoomId,
                tourId: selectedTour.id
            });
            setShowPayment(false);
        } catch (error: any) {
            const errorMessage = error.serverMessage || error.message || 'Произошла ошибка при бронировании. Пожалуйста, попробуйте позже.';

            if (errorMessage.toLowerCase().includes('паспорт') || errorMessage.toLowerCase().includes('passport')) {
                alert('Для бронирования необходимы паспортные данные. Пожалуйста, добавьте их в личном кабинете.');
                navigate(`/account/${user?.id}`);
            } else {
                alert(errorMessage);
            }
            throw error;
        }
    };

    if (loading) {
        return <Loader message="Загрузка информации о туре..." fullScreen />;
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
                    border: '2px solid #C0A080',
                    position: 'relative'
                }}>
                    {/* Метка горящего тура */}
                    {isHotTour && (
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: '#B76E3C',
                            color: '#FFF8F0',
                            padding: '8px 20px',
                            borderRadius: '30px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            zIndex: 10
                        }}>
                            🔥 Горящий тур
                        </div>
                    )}

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
                                src={getSafeImageUrl(selectedTour.imageTour, 'tour')}
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
                                                src={getSafeImageUrl(hotel.imageHotel, 'hotel')}
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
                                                <span style={{ color: '#B76E3C' }}>⏱ {getNightsDisplay(selectedTour) || 0}</span>
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

                                {/* Предупреждение о необходимости документов */}
                                {isAuthenticated && documentsChecked && !hasValidDocuments && (
                                    <div style={{
                                        background: '#FFF3CD',
                                        border: '1px solid #FFC107',
                                        borderRadius: '10px',
                                        padding: '12px',
                                        marginBottom: '15px',
                                        fontSize: '13px',
                                        color: '#856404'
                                    }}>
                                        ⚠️ Для бронирования необходимо добавить паспортные данные в{' '}
                                        <Link
                                            to={`/account/${user?.id}`}
                                            style={{
                                                color: '#856404',
                                                textDecoration: 'underline',
                                                fontWeight: 'bold'
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/account/${user?.id}`);
                                            }}
                                        >
                                            личном кабинете
                                        </Link>
                                    </div>
                                )}

                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    {/* Старая цена (зачеркнутая) для горящих туров */}
                                    {isHotTour && selectedTour.price && selectedTour.price > 0 && (
                                        <div>
                                            <span style={{
                                                fontSize: '20px',
                                                color: '#B76E3C',
                                                textDecoration: 'line-through'
                                            }}>
                                                {Intl.NumberFormat('ru-RU', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(selectedTour.price / currentRate)} {signCurrency}
                                            </span>
                                        </div>
                                    )}
                                    {/* Новая цена */}
                                    <span style={{
                                        fontSize: '36px',
                                        fontWeight: '700',
                                        color: isHotTour ? '#B76E3C' : '#8B5A2B'
                                    }}>
                                        {calculatePrice(selectedTour.price, currentRate)} {signCurrency}
                                    </span>
                                    {/* Индикатор скидки */}
                                    {isHotTour && (
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#28a745',
                                            marginTop: '5px'
                                        }}>
                                            🔥 Скидка 20% на горящий тур!
                                        </div>
                                    )}
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
                                        <span style={{ color: '#B76E3C' }}>{getNightsDisplay(selectedTour)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    disabled={isAuthenticated && documentsChecked && !hasValidDocuments}
                                    style={{
                                        width: '100%',
                                        padding: '15px',
                                        background: isAuthenticated && documentsChecked && !hasValidDocuments
                                            ? '#CCCCCC'
                                            : 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                                        color: '#FFF8F0',
                                        border: '2px solid #D2B48C',
                                        borderRadius: '30px',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        cursor: isAuthenticated && documentsChecked && !hasValidDocuments ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s',
                                        opacity: isAuthenticated && documentsChecked && !hasValidDocuments ? 0.7 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!(isAuthenticated && documentsChecked && !hasValidDocuments)) {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                        }
                                    }}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {isAuthenticated && documentsChecked && !hasValidDocuments
                                        ? 'Необходимы документы'
                                        : 'Забронировать'}
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
                    price: selectedTour.price || 0,
                    hotTour: isHotTour
                } : null}
                clientData={clientData}
                passportData={passportData}
                addressData={addressData}
                convertedPrice={convertedPrice}
                currencySymbol={signCurrency}
                hotelRoomId={hotelRoomId}
            />
            {showAuthToast && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#8B5A2B',
                    color: '#FFF8F0',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    fontSize: '16px',
                    fontWeight: '500',
                    zIndex: 3000,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    animation: 'fadeInUp 0.3s ease-out',
                    whiteSpace: 'nowrap'
                }}>
                    🔐 Для бронирования необходимо войти или зарегистрироваться
                </div>
            )}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export { TourPage };