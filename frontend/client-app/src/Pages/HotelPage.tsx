import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { getMainTours, ToursDto } from '../Services/ToursApi';
import { getAllHotels } from '../Services/HotelsApi';
import { getCurrentInfoHotelRoom } from '../Services/HotelRoomsApi';
import { getAddressById, Address } from '../Services/AddressApi';
import NavBar from '../Components/NavBar';
import { getSafeImageUrl, PLACEHOLDERS } from '../Components/OptimizedImage';
import Loader from '../Components/Loader';

// Используем существующие интерфейсы из API вместо кастомных
interface ExtendedHotel {
    id: number;
    name: string;
    stars: number;
    timeOfStay: string;
    imageHotel: string;
    details: string;
    addressId?: number | null;
    ticketsId?: number | null;
    hotelRoomsId?: number | null;
}

const HotelPage = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const tourIdFromQuery = queryParams.get('tourId');

    const [hotel, setHotel] = useState<ExtendedHotel | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [associatedTourId, setAssociatedTourId] = useState<number | null>(tourIdFromQuery ? Number(tourIdFromQuery) : null);
    const [loadingRooms, setLoadingRooms] = useState(false);

    const fetchHotelRooms = async (hotelRoomsId: number | null | undefined) => {
        setLoadingRooms(true);
        try {
            if (hotelRoomsId) {
                try {
                    const roomData = await getCurrentInfoHotelRoom(hotelRoomsId);
                    if (roomData) {
                        setRooms([roomData]);
                        return;
                    }
                } catch (err) {
                    // Тихая обработка
                }
            }
            setRooms([]);
        } catch (err) {
            setRooms([]);
        } finally {
            setLoadingRooms(false);
        }
    };

    useEffect(() => {
        const fetchHotelData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                setError(null);

                // Получаем ВСЕ отели через существующий метод getAllHotels
                const allHotels = await getAllHotels();
                const foundHotel = allHotels.find(h => h.id === Number(id));
                
                if (!foundHotel) {
                    throw new Error('Отель не найден');
                }
                
                setHotel(foundHotel as ExtendedHotel);

                // Получаем адрес, если есть addressId
                if (foundHotel.addressId) {
                    try {
                        const addressData = await getAddressById(foundHotel.addressId);
                        setAddress(addressData);
                    } catch (err) {
                        // Тихая обработка
                    }
                }

                // Получаем комнаты отеля через hotelRoomsId
                await fetchHotelRooms(foundHotel.hotelRoomsId);

                // Если tourId не передан, пытаемся найти связанный тур через ticketsId
                if (!associatedTourId && foundHotel.ticketsId) {
                    try {
                        const allTours = await getMainTours();
                        const foundTour = allTours.find((tour: ToursDto) => tour.id === foundHotel.ticketsId);
                        if (foundTour) {
                            setAssociatedTourId(foundTour.id);
                        }
                    } catch (tourErr) {
                        // Тихая обработка
                    }
                }
            } catch (err: any) {
                setError(err.serverMessage || err.message || 'Не удалось загрузить данные об отеле');
            } finally {
                setLoading(false);
            }
        };

        fetchHotelData();
    }, [id]);

    const handleBookClick = () => {
        if (associatedTourId) {
            navigate(`/catalog/tour/${associatedTourId}`, { state: { openBooking: true } });
        } else {
            navigate('/catalog');
        }
    };

    if (loading) {
        return <Loader message="Загрузка информации об отеле..." fullScreen />;
    }

    if (error || !hotel) {
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
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏨</div>
                    <h2 style={{ color: '#8B5A2B', fontSize: '32px', marginBottom: '20px' }}>
                        {error || 'Отель не найден'}
                    </h2>
                    <Link to="/catalog">
                        <button style={{
                            padding: '12px 30px',
                            background: '#B76E3C',
                            color: '#FFF8F0',
                            border: '2px solid #8B5A2B',
                            borderRadius: '30px',
                            cursor: 'pointer'
                        }}>
                            Вернуться к турам
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
            paddingTop: '80px'
        }}>
            <NavBar />

            <div style={{ position: 'fixed', top: '10%', left: '2%', fontSize: '40px', opacity: 0.05, pointerEvents: 'none' }}>𓂀</div>
            <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '50px', opacity: 0.05, pointerEvents: 'none' }}>𓊹</div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 2
            }}>
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
                    {associatedTourId && (
                        <>
                            <Link to={`/catalog/tour/${associatedTourId}`} style={{ color: '#B76E3C', textDecoration: 'none' }}>
                                Тур
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span>{hotel.name}</span>
                </div>

                <div style={{
                    background: 'rgba(255, 248, 240, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '40px',
                    padding: '40px',
                    boxShadow: '0 20px 40px rgba(139, 69, 19, 0.15)',
                    border: '2px solid #C0A080'
                }}>
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
                                marginBottom: '10px'
                            }}>
                                {hotel.name}
                            </h1>
                            <div style={{
                                display: 'flex',
                                gap: '15px',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                color: '#B76E3C',
                                fontSize: '16px'
                            }}>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {'★'.repeat(hotel.stars || 0)}{'☆'.repeat(5 - (hotel.stars || 0))}
                                </div>
                                <span>•</span>
                                <span>📍 {address?.country || 'Страна не указана'}, {address?.city || 'Город не указан'}</span>
                                {hotel.timeOfStay && (
                                    <>
                                        <span>•</span>
                                        <span>⏱ {hotel.timeOfStay}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <div style={{
                            width: '100%',
                            height: '450px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            border: '2px solid #D2B48C',
                            background: '#F0E5D5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={getSafeImageUrl(hotel.imageHotel, 'hotel')}
                                alt={hotel.name || 'Отель'}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = PLACEHOLDERS.hotel;
                                    (e.target as HTMLImageElement).onerror = null;
                                }}
                            />
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 350px',
                        gap: '40px'
                    }}>
                        <div>
                            <section style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    color: '#8B5A2B',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '10px'
                                }}>
                                    📝 Об отеле
                                </h2>
                                <p style={{
                                    fontSize: '16px',
                                    lineHeight: '1.8',
                                    color: '#5A3E2B'
                                }}>
                                    {hotel.details || 'Описание отсутствует'}
                                </p>
                                {address && (
                                    <p style={{
                                        marginTop: '15px',
                                        fontSize: '15px',
                                        color: '#B76E3C',
                                        fontStyle: 'italic'
                                    }}>
                                        📍 Адрес: {address.country}, {address.city}, {address.street} {address.house}
                                        {address.apartment ? `, кв. ${address.apartment}` : ''}
                                    </p>
                                )}
                            </section>

                            <section>
                                <h2 style={{
                                    fontSize: '28px',
                                    color: '#8B5A2B',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '10px'
                                }}>
                                    🛏️ Номера отеля
                                </h2>

                                {loadingRooms ? (
                                    <div style={{ textAlign: 'center', padding: '40px' }}>
                                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                                        <p style={{ color: '#8B5A2B' }}>Загрузка номеров...</p>
                                    </div>
                                ) : rooms.length > 0 ? (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                        gap: '20px'
                                    }}>
                                        {rooms.map((room) => (
                                            <div key={room.id} style={{
                                                background: '#FFF8F0',
                                                borderRadius: '20px',
                                                padding: '20px',
                                                border: '2px solid #D2B48C',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(183, 110, 60, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}>
                                                {room.imageRoom && (
                                                    <img
                                                        src={getSafeImageUrl(room.imageRoom, 'room')}
                                                        alt={room.nameRoom || 'Номер'}
                                                        style={{
                                                            width: '100%',
                                                            height: '150px',
                                                            objectFit: 'cover',
                                                            borderRadius: '15px',
                                                            marginBottom: '15px',
                                                            border: '2px solid #D2B48C'
                                                        }}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = PLACEHOLDERS.room;
                                                            (e.target as HTMLImageElement).onerror = null;
                                                        }}
                                                    />
                                                )}
                                                <h3 style={{
                                                    fontSize: '20px',
                                                    color: '#8B5A2B',
                                                    marginBottom: '8px',
                                                    fontFamily: "'Cormorant Garamond', serif"
                                                }}>
                                                    {room.nameRoom}
                                                </h3>
                                                {room.typeRoom && (
                                                    <p style={{ color: '#B76E3C', marginBottom: '5px', fontSize: '14px' }}>
                                                        Тип: {room.typeRoom}
                                                    </p>
                                                )}
                                                <p style={{ color: '#B76E3C', marginBottom: '10px', fontSize: '14px' }}>
                                                    Этаж: {room.floor}
                                                </p>
                                                <p style={{ color: '#5A3E2B', fontSize: '14px', lineHeight: '1.6' }}>
                                                    {room.details || 'Подробности отсутствуют'}
                                                </p>
                                                <Link
                                                    to={`/hotel-room/${hotel.id}/${room.id}${associatedTourId ? `?tourId=${associatedTourId}` : ''}`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <button style={{
                                                        marginTop: '15px',
                                                        padding: '8px 20px',
                                                        background: '#C0A080',
                                                        color: '#FFF8F0',
                                                        border: '2px solid #8B5A2B',
                                                        borderRadius: '25px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'all 0.3s',
                                                        width: '100%'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#8B5A2B'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = '#C0A080'}>
                                                        Подробнее о номере →
                                                    </button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        background: '#FFF8F0',
                                        borderRadius: '20px',
                                        border: '2px solid #D2B48C'
                                    }}>
                                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🛏️</div>
                                        <p style={{ color: '#8B5A2B', fontSize: '18px', marginBottom: '10px' }}>
                                            Информация о номерах временно отсутствует
                                        </p>
                                        <p style={{ color: '#B76E3C', fontSize: '14px' }}>
                                            Пожалуйста, свяжитесь с нами для получения подробной информации о номерах
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>

                        <div>
                            <div style={{
                                background: '#FFF8F0',
                                borderRadius: '20px',
                                padding: '25px',
                                border: '2px solid #D2B48C',
                                position: 'sticky',
                                top: '90px',
                                textAlign: 'center'
                            }}>
                                <h3 style={{
                                    fontSize: '22px',
                                    color: '#8B5A2B',
                                    marginBottom: '20px',
                                    fontFamily: "'Cormorant Garamond', serif"
                                }}>
                                    Забронировать
                                </h3>
                                <p style={{ color: '#B76E3C', marginBottom: '15px' }}>
                                    {associatedTourId
                                        ? 'Нажмите, чтобы перейти к бронированию тура'
                                        : 'Выберите тур в каталоге'
                                    }
                                </p>
                                <button
                                    onClick={handleBookClick}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: '#B76E3C',
                                        color: '#FFF8F0',
                                        border: '2px solid #8B5A2B',
                                        borderRadius: '30px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#8B5A2B'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#B76E3C'}
                                >
                                    {associatedTourId ? 'Забронировать тур' : 'Выбрать тур →'}
                                </button>
                                {!associatedTourId && (
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#B76E3C',
                                        marginTop: '10px',
                                        fontStyle: 'italic'
                                    }}>
                                        ⚡ Нажмите, чтобы перейти в каталог
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to={associatedTourId ? `/catalog/tour/${associatedTourId}` : "/catalog"}>
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
                                {associatedTourId ? '← Вернуться к туру' : '← Вернуться к турам'}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelPage;