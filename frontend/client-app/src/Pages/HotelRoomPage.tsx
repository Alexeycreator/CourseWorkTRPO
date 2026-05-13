import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getMainTours } from '../Services/ToursApi';
import NavBar from '../Components/NavBar';
import { PLACEHOLDERS, getSafeImageUrl } from '../Components/OptimizedImage';
import { useAuth } from '../Contexts/AuthContext';

interface Hotel {
    id: number;
    name: string;
    stars: number;
    timeOfStay?: number | null;
    imageHotel: string;
    details: string | null;
    addressId?: number | null;
    ticketsId?: number | null;
    hotelRoomsId?: number | null;
}

interface Address {
    id: number;
    country: string;
    region: string;
    city: string;
    street: string;
    house: string;
    apartment?: number | null;
}

interface HotelRoom {
    id: number;
    nameRoom: string;
    details: string | null;
    floor: number;
    imageRoom: string | null;
    typeRoom?: string;
}

const HotelRoomPage = () => {
    const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';
    
    // Получаем tourId из query параметров
    const queryParams = new URLSearchParams(location.search);
    const tourIdFromQuery = queryParams.get('tourId');
    
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [room, setRoom] = useState<HotelRoom | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [associatedTourId, setAssociatedTourId] = useState<number | null>(tourIdFromQuery ? Number(tourIdFromQuery) : null);

    useEffect(() => {
        const fetchData = async () => {
            if (!hotelId || !roomId) return;
            try {
                setLoading(true);
                
                const hotelResponse = await axios.get<Hotel>(`${API_URL}/api/Hotels/${hotelId}`);
                const hotelData = hotelResponse.data;
                setHotel(hotelData);

                const roomResponse = await axios.get<HotelRoom>(`${API_URL}/api/HotelRooms/${roomId}`);
                setRoom(roomResponse.data);

                const addressId = (hotelData as any).addressId ?? (hotelData as any).AddressId;
                if (addressId) {
                    try {
                        const addressResponse = await axios.get<Address>(`${API_URL}/api/Addresses/${addressId}`);
                        setAddress(addressResponse.data);
                    } catch (addrErr) {
                        console.warn('Адрес не найден:', addrErr);
                    }
                }

                if (!associatedTourId) {
                    const ticketsId = (hotelData as any).ticketsId ?? (hotelData as any).TicketsId;
                    if (ticketsId) {
                        try {
                            const allTours = await getMainTours();
                            const foundTour = allTours.find(tour => tour.id === ticketsId);
                            if (foundTour) {
                                setAssociatedTourId(foundTour.id);
                            }
                        } catch (tourErr) {
                            console.warn('Ошибка поиска тура:', tourErr);
                        }
                    }
                }

                setError(null);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
                setError('Не удалось загрузить информацию о номере');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [hotelId, roomId, API_URL]);

    // ГЛАВНАЯ ФУНКЦИЯ: переход на тур и открытие окна бронирования
    const handleBookClick = () => {
       
        if (associatedTourId) {
            // Передаем state с openBooking: true для открытия TicketPayment
            navigate(`/catalog/tour/${associatedTourId}`, { 
                state: { openBooking: true }
            });
        } else {
            const confirm = window.confirm(
                'Не удалось найти связанный тур. Перейти в каталог для выбора тура?'
            );
            if (confirm) {
                navigate('/catalog');
            }
        }
    };

    const handleBackToHotel = () => {
        if (associatedTourId) {
            navigate(`/hotel/${hotelId}?tourId=${associatedTourId}`);
        } else {
            navigate(`/hotel/${hotelId}`);
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
                    <h2 style={{ color: '#8B5A2B' }}>Загрузка номера...</h2>
                </div>
            </div>
        );
    }

    if (error || !hotel || !room) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
                minHeight: '100vh'
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
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏨</div>
                    <h2 style={{ color: '#8B5A2B', fontSize: '32px', marginBottom: '20px' }}>
                        {error || 'Номер не найден'}
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
            minHeight: '100vh'
        }}>
            <NavBar />

            <div style={{ position: 'fixed', top: '10%', left: '2%', fontSize: '40px', opacity: 0.05, pointerEvents: 'none' }}>𓂀</div>
            <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '50px', opacity: 0.05, pointerEvents: 'none' }}>𓊹</div>

            <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                position: 'relative', 
                zIndex: 2,
                paddingTop: '90px',
                paddingRight: '20px',
                paddingBottom: '40px',
                paddingLeft: '20px'
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
                                Тур #{associatedTourId}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <Link to={`/hotel/${hotel.id}${associatedTourId ? `?tourId=${associatedTourId}` : ''}`} style={{ color: '#B76E3C', textDecoration: 'none' }}>
                        {hotel.name}
                    </Link>
                    <span>/</span>
                    <span>{room.nameRoom}</span>
                </div>

                <div style={{
                    background: 'rgba(255, 248, 240, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '40px',
                    padding: '40px',
                    boxShadow: '0 20px 40px rgba(139, 69, 19, 0.15)',
                    border: '2px solid #C0A080'
                }}>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '42px',
                        color: '#8B5A2B',
                        marginBottom: '10px'
                    }}>
                        {room.nameRoom}
                    </h1>
                    <p style={{ color: '#B76E3C', fontSize: '18px', marginBottom: '30px' }}>
                        {hotel.name}, {address?.country || ''}, {address?.city || ''}
                    </p>

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
                                src={getSafeImageUrl(room.imageRoom, API_URL, 'room')}
                                alt={room.nameRoom}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = PLACEHOLDERS.room;
                                    (e.target as HTMLImageElement).onerror = null;
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                        <div>
                            <section style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    color: '#8B5A2B',
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '10px',
                                    marginBottom: '15px'
                                }}>📝 Описание номера</h2>
                                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#5A3E2B' }}>
                                    {room.details || 'Описание отсутствует'}
                                </p>
                            </section>

                            <section>
                                <h2 style={{
                                    fontSize: '28px',
                                    color: '#8B5A2B',
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '10px',
                                    marginBottom: '15px'
                                }}>📊 Характеристики</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                    <div style={{ background: '#FFF8F0', border: '1px solid #D2B48C', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '24px', color: '#B76E3C' }}>🛏️</span>
                                        <p style={{ color: '#8B5A2B', marginTop: '5px' }}>{room.nameRoom}</p>
                                    </div>
                                    <div style={{ background: '#FFF8F0', border: '1px solid #D2B48C', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '24px', color: '#B76E3C' }}>🏗️</span>
                                        <p style={{ color: '#8B5A2B', marginTop: '5px' }}>Этаж: {room.floor}</p>
                                    </div>
                                    {room.typeRoom && (
                                        <div style={{ background: '#FFF8F0', border: '1px solid #D2B48C', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '24px', color: '#B76E3C' }}>🏷️</span>
                                            <p style={{ color: '#8B5A2B', marginTop: '5px' }}>{room.typeRoom}</p>
                                        </div>
                                    )}
                                </div>
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
                                        ? 'Нажмите, чтобы вернуться к туру и оформить бронирование'
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
                                    {associatedTourId ? '📅 Забронировать тур' : '🎫 Выбрать тур →'}
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
                                {associatedTourId && (
                                    <p style={{ 
                                        fontSize: '12px', 
                                        color: '#28a745', 
                                        marginTop: '10px',
                                        fontStyle: 'italic'
                                    }}>
                                        Нажмите для бронирования
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
                        <button
                            onClick={handleBackToHotel}
                            style={{
                                padding: '12px 30px',
                                background: 'transparent',
                                color: '#8B5A2B',
                                border: '2px solid #C0A080',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192, 160, 128, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                            ← Вернуться к отелю
                        </button>
                        
                        {/* {associatedTourId && (
                            <button
                                onClick={handleBookClick}
                                style={{
                                    padding: '12px 30px',
                                    background: '#C0A080',
                                    color: '#FFF8F0',
                                    border: '2px solid #8B5A2B',
                                    borderRadius: '30px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#8B5A2B'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#C0A080'}>
                                🐪 Забронировать →
                            </button>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelRoomPage;