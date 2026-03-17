import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Те же данные отелей (можно вынести в отдельный файл)
const hotelsData = [
    {
        id: 1,
        name: 'Conrad Maldives Rangali',
        country: 'Мальдивы',
        city: 'Мале',
        rooms: [
            {
                id: 101,
                name: 'Пляжная вилла',
                description: 'Просторная вилла с прямым выходом на пляж',
                fullDescription: 'Эта роскошная вилла расположена прямо на белоснежном пляже и предлагает непревзойденный комфорт и уединение. Из окон открывается потрясающий вид на Индийский океан. Вилла оборудована частным бассейном, открытой террасой с шезлонгами и прямой дорожкой к пляжу.',
                price: 65000,
                area: '85 м²',
                capacity: '2 взрослых',
                images: [
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
                ],
                amenities: [
                    'Частный бассейн',
                    'Кондиционер',
                    'Wi-Fi',
                    'Мини-бар',
                    'Телевизор',
                    'Халаты и тапочки',
                    'Сейф'
                ],
                bedType: 'Кровать King-size',
                maxGuests: 2,
                childrenAllowed: false
            },
            {
                id: 102,
                name: 'Вилла на воде',
                description: 'Роскошная вилла над лагуной с панорамными окнами',
                fullDescription: 'Уникальная вилла, расположенная прямо над бирюзовой лагуной. Панорамные окна и стеклянный пол в гостиной позволяют наблюдать за морской жизнью, не покидая номера. С террасы есть прямой спуск в океан.',
                price: 85000,
                area: '110 м²',
                capacity: '2 взрослых + 1 ребенок',
                images: [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
                ],
                amenities: [
                    'Стеклянный пол',
                    'Частный бассейн',
                    'Прямой спуск в океан',
                    'Кондиционер',
                    'Wi-Fi',
                    'Мини-бар'
                ],
                bedType: 'Кровать King-size',
                maxGuests: 3,
                childrenAllowed: true
            }
        ]
    },
    {
        id: 2,
        name: 'Four Seasons Resort Bali',
        country: 'Индонезия',
        city: 'Убуд',
        rooms: [
            {
                id: 201,
                name: 'Вилла в саду',
                description: 'Уютная вилла с видом на тропический сад',
                fullDescription: 'Вилла расположена в тенистом тропическом саду и предлагает полное единение с природой. Просторная терраса с лежаками и открытый душ создают атмосферу настоящего райского уголка.',
                price: 55000,
                area: '70 м²',
                capacity: '2 взрослых',
                images: [
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
                ],
                amenities: [
                    'Открытый душ',
                    'Терраса',
                    'Кондиционер',
                    'Wi-Fi',
                    'Мини-бар',
                    'Чайная станция'
                ],
                bedType: 'Кровать Queen-size',
                maxGuests: 2,
                childrenAllowed: false
            },
            {
                id: 202,
                name: 'Вилла у реки',
                description: 'Вилла с террасой и видом на реку Аюнг',
                fullDescription: 'Вилла расположена на берегу священной реки Аюнг. Звуки текущей воды и пение птиц создают неповторимую атмосферу умиротворения. Частный бассейн и открытая терраса с видом на реку станут вашим любимым местом для отдыха.',
                price: 75000,
                area: '95 м²',
                capacity: '2 взрослых + 1 ребенок',
                images: [
                    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
                ],
                amenities: [
                    'Частный бассейн',
                    'Вид на реку',
                    'Открытая терраса',
                    'Кондиционер',
                    'Wi-Fi',
                    'Мини-бар'
                ],
                bedType: 'Кровать King-size',
                maxGuests: 3,
                childrenAllowed: true
            }
        ]
    }
];

const HotelRoomPage = () => {
    const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
    const [activeImage, setActiveImage] = useState(0);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);

    // Находим отель и номер
    const hotel = hotelsData.find(h => h.id === Number(hotelId));
    const room = hotel?.rooms.find(r => r.id === Number(roomId));

    if (!hotel || !room) {
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
                        Номер не найден
                    </h2>
                    <Link to={`/hotel/${hotelId}`}>
                        <button style={{
                            padding: '12px 30px',
                            background: '#B76E3C',
                            color: '#FFF8F0',
                            border: '2px solid #8B5A2B',
                            borderRadius: '30px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}>
                            Вернуться к отелю
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
                    <Link to={`/hotel/${hotelId}`} style={{ color: '#B76E3C', textDecoration: 'none' }}>{hotel.name}</Link>
                    <span>/</span>
                    <span>{room.name}</span>
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
                                marginBottom: '10px'
                            }}>
                                {room.name}
                            </h1>
                            <p style={{ color: '#B76E3C', fontSize: '18px' }}>
                                {hotel.name}, {hotel.country}, {hotel.city}
                            </p>
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
                                src={room.images[activeImage]}
                                alt={room.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        {room.images.length > 1 && (
                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                overflowX: 'auto',
                                padding: '5px 0'
                            }}>
                                {room.images.map((img, index) => (
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
                                            alt={`${room.name} ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
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
                                    fontSize: '28px',
                                    color: '#8B5A2B',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '10px'
                                }}>
                                    📝 Описание номера
                                </h2>
                                <p style={{
                                    fontSize: '16px',
                                    lineHeight: '1.8',
                                    color: '#5A3E2B'
                                }}>
                                    {room.fullDescription || room.description}
                                </p>
                            </section>

                            {/* Характеристики */}
                            <section style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    color: '#8B5A2B',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '10px'
                                }}>
                                    📊 Характеристики
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '15px'
                                }}>
                                    <div style={{
                                        background: '#FFF8F0',
                                        border: '1px solid #D2B48C',
                                        borderRadius: '15px',
                                        padding: '15px',
                                        textAlign: 'center'
                                    }}>
                                        <span style={{ fontSize: '24px', color: '#B76E3C' }}>📐</span>
                                        <p style={{ color: '#8B5A2B', fontSize: '16px', marginTop: '5px' }}>
                                            Площадь: {room.area}
                                        </p>
                                    </div>
                                    <div style={{
                                        background: '#FFF8F0',
                                        border: '1px solid #D2B48C',
                                        borderRadius: '15px',
                                        padding: '15px',
                                        textAlign: 'center'
                                    }}>
                                        <span style={{ fontSize: '24px', color: '#B76E3C' }}>👥</span>
                                        <p style={{ color: '#8B5A2B', fontSize: '16px', marginTop: '5px' }}>
                                            {room.capacity}
                                        </p>
                                    </div>
                                    <div style={{
                                        background: '#FFF8F0',
                                        border: '1px solid #D2B48C',
                                        borderRadius: '15px',
                                        padding: '15px',
                                        textAlign: 'center'
                                    }}>
                                        <span style={{ fontSize: '24px', color: '#B76E3C' }}>🛏️</span>
                                        <p style={{ color: '#8B5A2B', fontSize: '16px', marginTop: '5px' }}>
                                            {room.bedType}
                                        </p>
                                    </div>
                                    <div style={{
                                        background: '#FFF8F0',
                                        border: '1px solid #D2B48C',
                                        borderRadius: '15px',
                                        padding: '15px',
                                        textAlign: 'center'
                                    }}>
                                        <span style={{ fontSize: '24px', color: '#B76E3C' }}>👶</span>
                                        <p style={{ color: '#8B5A2B', fontSize: '16px', marginTop: '5px' }}>
                                            {room.childrenAllowed ? 'Можно с детьми' : 'Только взрослые'}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Удобства */}
                            <section style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '28px',
                                    color: '#8B5A2B',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '10px'
                                }}>
                                    🛎️ Удобства в номере
                                </h2>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: '10px'
                                }}>
                                    {room.amenities.map((amenity, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                background: '#FFF8F0',
                                                border: '1px solid #D2B48C',
                                                borderRadius: '20px',
                                                padding: '8px 15px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <span style={{ color: '#B76E3C' }}>✓</span>
                                            <span style={{ color: '#5A3E2B', fontSize: '14px' }}>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
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
                                    Забронировать номер
                                </h3>

                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                    <span style={{
                                        fontSize: '36px',
                                        fontWeight: '700',
                                        color: '#8B5A2B'
                                    }}>
                                        {formatPrice(room.price)}
                                    </span>
                                    <div style={{ color: '#B76E3C', fontSize: '14px', marginTop: '5px' }}>
                                        за ночь
                                    </div>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{
                                        display: 'block',
                                        color: '#8B5A2B',
                                        fontSize: '14px',
                                        marginBottom: '5px'
                                    }}>
                                        📅 Заезд
                                    </label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '2px solid #D2B48C',
                                            borderRadius: '10px',
                                            backgroundColor: '#FFF8F0',
                                            color: '#8B5A2B',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{
                                        display: 'block',
                                        color: '#8B5A2B',
                                        fontSize: '14px',
                                        marginBottom: '5px'
                                    }}>
                                        📅 Выезд
                                    </label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '2px solid #D2B48C',
                                            borderRadius: '10px',
                                            backgroundColor: '#FFF8F0',
                                            color: '#8B5A2B',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        color: '#8B5A2B',
                                        fontSize: '14px',
                                        marginBottom: '5px'
                                    }}>
                                        👥 Гостей
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <button
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            style={{
                                                width: '35px',
                                                height: '35px',
                                                borderRadius: '50%',
                                                border: '2px solid #D2B48C',
                                                background: 'transparent',
                                                color: '#8B5A2B',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            −
                                        </button>
                                        <span style={{ flex: 1, textAlign: 'center', color: '#8B5A2B', fontSize: '16px' }}>
                                            {guests}
                                        </span>
                                        <button
                                            onClick={() => setGuests(Math.min(room.maxGuests, guests + 1))}
                                            style={{
                                                width: '35px',
                                                height: '35px',
                                                borderRadius: '50%',
                                                border: '2px solid #D2B48C',
                                                background: 'transparent',
                                                color: '#8B5A2B',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#B76E3C', marginTop: '5px' }}>
                                        Максимум гостей: {room.maxGuests}
                                    </p>
                                </div>

                                <button
                                    onClick={() => alert(`Спасибо за бронирование ${room.name}! Менеджер свяжется с вами.`)}
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
                                    Бесплатная отмена за 24 часа до заезда
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Кнопка "Вернуться к отелю" */}
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to={`/hotel/${hotelId}`}>
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
                                ← Вернуться к отелю
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelRoomPage;