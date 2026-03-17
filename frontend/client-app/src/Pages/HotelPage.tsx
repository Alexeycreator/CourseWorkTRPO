// HotelPage.tsx - исправленная версия

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Временные данные для демонстрации
const hotelsData = [
    {
        id: 1,
        name: 'Conrad Maldives Rangali',
        stars: 5,
        country: 'Мальдивы',
        city: 'Мале',
        address: 'Rangali Island, 20001, Мальдивы',
        description: 'Роскошный курорт, расположенный на двух частных островах, соединенных мостом. Знаменит первым в мире подводным рестораном Ithaa. Курорт предлагает виллы с прямым выходом к океану и частными бассейнами.',
        longDescription: 'Conrad Maldives Rangali — это воплощение райского отдыха на Мальдивах. Расположенный на двух эксклюзивных островах, курорт предлагает гостям уникальное сочетание роскоши и уединения. Здесь находится знаменитый подводный ресторан Ithaa, где вы сможете пообедать на глубине 5 метров под водой. Для гостей доступны виллы на воде и на пляже с собственными бассейнами и прямым доступом к лагуне.',
        images: [
            'https://images.unsplash.com/photo-1573843981279-9a27c1c3e2a9?w=800',
            'https://images.unsplash.com/photo-1540202404-a2f3c7b1b5e0?w=800',
            'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800',
            'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800'
        ],
        rating: 4.9,
        reviews: 342,
        timeOfStay: '14:00',
        amenities: [
            'Бесплатный Wi-Fi',
            'Спа-центр',
            '5 ресторанов',
            'Бассейн',
            'Фитнес-центр',
            'Водные виды спорта',
            'Дайвинг-центр',
            'Подводный ресторан'
        ],
        rooms: [
            {
                id: 101,
                name: 'Пляжная вилла',
                description: 'Просторная вилла с прямым выходом на пляж',
                price: 65000,
                area: '85 м²',
                capacity: '2 взрослых',
                image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400'
            },
            {
                id: 102,
                name: 'Вилла на воде',
                description: 'Роскошная вилла над лагуной с панорамными окнами',
                price: 85000,
                area: '110 м²',
                capacity: '2 взрослых + 1 ребенок',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
            },
            {
                id: 103,
                name: 'Президентский люкс',
                description: 'Двухуровневая вилла с частным бассейном',
                price: 150000,
                area: '250 м²',
                capacity: '4 взрослых',
                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400'
            }
        ]
    },
    // ... остальные отели
];

const HotelPage = () => {
    const { id } = useParams<{ id: string }>();
    const [activeImage, setActiveImage] = useState(0);

    const hotel = hotelsData.find(h => h.id === Number(id));

    if (!hotel) {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <div style={{
                    background: 'rgba(255, 248, 240, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '40px',
                    padding: '50px',
                    textAlign: 'center',
                    border: '2px solid #C0A080'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏨</div>
                    <h2 style={{ color: '#8B5A2B', fontSize: '32px', marginBottom: '20px' }}>
                        Отель не найден
                    </h2>
                    <Link to="/catalog">
                        <button style={{
                            padding: '12px 30px',
                            background: '#B76E3C',
                            color: '#FFF8F0',
                            border: '2px solid #8B5A2B',
                            borderRadius: '30px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}>
                            Вернуться к турам
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return price.toLocaleString('ru-RU') + ' ₽';
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
            minHeight: '100vh',
            padding: '20px',
            paddingTop: '70px'
        }}>
            {/* Фоновые иероглифы */}
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

                {/* Основной контент */}
                <div style={{
                    background: 'rgba(255, 248, 240, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '40px',
                    padding: '40px',
                    boxShadow: '0 20px 40px rgba(139, 69, 19, 0.15)',
                    border: '2px solid #C0A080'
                }}>
                    {/* Заголовок и звезды */}
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
                                <span>⭐ {hotel.rating} ({hotel.reviews} отзывов)</span>
                                <span>•</span>
                                <span>📍 {hotel.country}, {hotel.city}</span>
                            </div>
                        </div>
                        <div style={{
                            background: '#C0A080',
                            color: '#FFF8F0',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            fontSize: '16px'
                        }}>
                            ⏰ Заезд с {hotel.timeOfStay}
                        </div>
                    </div>

                    {/* Галерея */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{
                            width: '100%',
                            height: '450px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            marginBottom: '15px',
                            border: '2px solid #D2B48C'
                        }}>
                            <img
                                src={hotel.images[activeImage]}
                                alt={hotel.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            overflowX: 'auto',
                            padding: '5px 0'
                        }}>
                            {hotel.images.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    style={{
                                        width: '100px',
                                        height: '70px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: activeImage === index ? '3px solid #B76E3C' : '2px solid transparent',
                                        opacity: activeImage === index ? 1 : 0.7,
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <img
                                        src={img}
                                        alt={`${hotel.name} ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Описание отеля */}
                    <section style={{ marginBottom: '40px' }}>
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
                            color: '#5A3E2B',
                            marginBottom: '15px'
                        }}>
                            {hotel.description}
                        </p>
                        <p style={{
                            fontSize: '16px',
                            lineHeight: '1.8',
                            color: '#5A3E2B'
                        }}>
                            {hotel.longDescription}
                        </p>
                        <p style={{
                            marginTop: '15px',
                            fontSize: '15px',
                            color: '#B76E3C',
                            fontStyle: 'italic'
                        }}>
                            📍 Адрес: {hotel.address}
                        </p>
                    </section>

                    {/* Удобства */}
                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{
                            fontSize: '28px',
                            color: '#8B5A2B',
                            marginBottom: '15px',
                            fontFamily: "'Cormorant Garamond', serif",
                            borderBottom: '2px solid #D2B48C',
                            paddingBottom: '10px'
                        }}>
                            🛎️ Удобства и услуги
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '15px'
                        }}>
                            {hotel.amenities.map((amenity, index) => (
                                <div
                                    key={index}
                                    style={{
                                        background: '#FFF8F0',
                                        border: '1px solid #D2B48C',
                                        borderRadius: '20px',
                                        padding: '10px 15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    <span style={{ color: '#B76E3C' }}>✓</span>
                                    <span style={{ color: '#5A3E2B', fontSize: '14px' }}>{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Номера отеля */}
                    <section style={{ marginBottom: '40px' }}>
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
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '20px'
                        }}>
                            {hotel.rooms.map((room) => (
                                <Link
                                    to={`/hotel-room/${hotel.id}/${room.id}`}
                                    key={room.id}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div style={{
                                        background: '#FFF8F0',
                                        border: '2px solid #D2B48C',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer',
                                        height: '100%'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(183, 110, 60, 0.2)';
                                        e.currentTarget.style.borderColor = '#B76E3C';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = '#D2B48C';
                                    }}>
                                        {room.image && (
                                            <div style={{
                                                height: '160px',
                                                overflow: 'hidden'
                                            }}>
                                                <img
                                                    src={room.image}
                                                    alt={room.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div style={{ padding: '15px' }}>
                                            <h3 style={{
                                                fontSize: '20px',
                                                color: '#8B5A2B',
                                                marginBottom: '8px',
                                                fontFamily: "'Cormorant Garamond', serif"
                                            }}>
                                                {room.name}
                                            </h3>
                                            <p style={{
                                                color: '#B76E3C',
                                                fontSize: '14px',
                                                marginBottom: '10px'
                                            }}>
                                                {room.description}
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '10px',
                                                fontSize: '14px',
                                                color: '#5A3E2B'
                                            }}>
                                                <span>👥 {room.capacity}</span>
                                                <span>📐 {room.area}</span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginTop: '10px'
                                            }}>
                                                <span style={{
                                                    fontSize: '22px',
                                                    fontWeight: '700',
                                                    color: '#8B5A2B'
                                                }}>
                                                    {formatPrice(room.price)}
                                                </span>
                                                <span style={{
                                                    fontSize: '14px',
                                                    color: '#B76E3C'
                                                }}>
                                                    Подробнее →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Кнопка "Вернуться к турам" */}
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