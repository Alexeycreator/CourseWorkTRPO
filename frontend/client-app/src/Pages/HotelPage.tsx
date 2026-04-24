import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getTours } from '../Services/ToursApi';
import NavBar from '../Components/NavBar';

interface Hotel {
    id: number;
    name: string;
    stars: number;
    timeOfStay: number;
    imageHotel: string;
    details: string | null;
    address_Id?: number | null;
    tickets_Id?: number | null;
    hotelRooms_Id?: number | null;
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
}

const HotelPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [room, setRoom] = useState<HotelRoom | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [associatedTourId, setAssociatedTourId] = useState<number | null>(null);

    useEffect(() => {
        const fetchHotelData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const hotelResponse = await axios.get<Hotel>(`${API_URL}/api/Hotels/${id}`);
                const hotelData = hotelResponse.data;
                setHotel(hotelData);

                const addressId = (hotelData as any).address_Id ?? (hotelData as any).Address_Id;
                if (addressId) {
                    const addressResponse = await axios.get<Address>(`${API_URL}/api/Addresses/${addressId}`);
                    setAddress(addressResponse.data);
                }

                const roomId = (hotelData as any).hotelRooms_Id ?? (hotelData as any).HotelRooms_Id;
                if (roomId) {
                    const roomResponse = await axios.get<HotelRoom>(`${API_URL}/api/HotelRooms/${roomId}`);
                    setRoom(roomResponse.data);
                }

                if (hotelData.tickets_Id) {
                    const allTours = await getTours();
                    const foundTour = allTours.find(tour => tour.tickets_Id === hotelData.tickets_Id);
                    if (foundTour) setAssociatedTourId(foundTour.id);
                }

                setError(null);
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить данные об отеле');
            } finally {
                setLoading(false);
            }
        };
        fetchHotelData();
    }, [id, API_URL]);

    const handleBookClick = () => {
        if (associatedTourId) {
            navigate(`/catalog/tour/${associatedTourId}`, { state: { openBooking: true } });
        } else {
            alert('Не удалось найти тур, связанный с этим отелем.');
        }
    };

    if (loading) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '70px'
            }}>
                <NavBar />
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>🐪</div>
                    <style>{`
                        @keyframes pulse {
                            0% { opacity: 0.6; transform: scale(1); }
                            50% { opacity: 1; transform: scale(1.1); }
                            100% { opacity: 0.6; transform: scale(1); }
                        }
                    `}</style>
                    <h2 style={{ color: '#8B5A2B' }}>Загрузка информации об отеле...</h2>
                </div>
            </div>
        );
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
                                    {'★'.repeat(hotel.stars)}{'☆'.repeat(5 - hotel.stars)}
                                </div>
                                <span>•</span>
                                <span>📍 {address?.country || 'Страна не указана'}, {address?.city || 'Город не указан'}</span>
                                {hotel.timeOfStay && (
                                    <>
                                        <span>•</span>
                                        <span>⏱ {hotel.timeOfStay} дней</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Изображение отеля */}
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
                                src={`${API_URL}/${hotel.imageHotel}`}
                                alt={hotel.name}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=No+Image';
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
                        {/* Левая колонка - описание и номер */}
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

                            {/* Блок номера с ограничением ширины */}
                            {room && (
                                <section style={{ maxWidth: '300px' }}>
                                    <h2 style={{
                                        fontSize: '28px',
                                        color: '#8B5A2B',
                                        marginBottom: '15px',
                                        fontFamily: "'Cormorant Garamond', serif",
                                        borderBottom: '2px solid #D2B48C',
                                        paddingBottom: '10px'
                                    }}>
                                        🛏️ Номер отеля
                                    </h2>
                                    <div style={{
                                        background: '#FFF8F0',
                                        borderRadius: '20px',
                                        padding: '20px',
                                        border: '2px solid #D2B48C'
                                    }}>
                                        {room.imageRoom && (
                                            <img
                                                src={`${API_URL}/${room.imageRoom}`}
                                                alt={room.nameRoom}
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '200px',
                                                    objectFit: 'cover',
                                                    borderRadius: '15px',
                                                    marginBottom: '15px',
                                                    border: '2px solid #D2B48C'
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image';
                                                }}
                                            />
                                        )}
                                        <h3 style={{
                                            fontSize: '22px',
                                            color: '#8B5A2B',
                                            marginBottom: '8px',
                                            fontFamily: "'Cormorant Garamond', serif"
                                        }}>
                                            {room.nameRoom}
                                        </h3>
                                        <p style={{ color: '#B76E3C', marginBottom: '10px' }}>
                                            Этаж: {room.floor}
                                        </p>
                                        <p style={{ color: '#5A3E2B', fontSize: '14px', lineHeight: '1.6' }}>
                                            {room.details || 'Подробности отсутствуют'}
                                        </p>
                                        <Link to={`/hotel-room/${hotel.id}/${room.id}`} style={{ textDecoration: 'none' }}>
                                            <button style={{
                                                marginTop: '15px',
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
                                                Подробнее о номере →
                                            </button>
                                        </Link>
                                    </div>
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
                                    Нажмите, чтобы перейти к бронированию тура
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
                                    Забронировать тур
                                </button>
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
                                ← Вернуться к турам
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelPage;