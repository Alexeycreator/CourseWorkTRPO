import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getTours, Tour } from "../Services/ToursApi";
import './MainPage.css';

const MainPage = () => {
    const navigate = useNavigate();
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

    // Функция расчёта количества ночей
    const calculateNights = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Форматирование цены (рубли, без конвертации)
    const formatPrice = (price: number): string => {
        return Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    // Загрузка туров из API
    const fetchTours = async () => {
        try {
            setLoading(true);
            const data = await getTours();
            setTours(data);
            setError(null);
        } catch (err) {
            console.error("Ошибка загрузки туров:", err);
            setError("Не удалось загрузить популярные направления");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const handleFindDoor = () => {
        navigate('/catalog');
    };

    const handleSpecialOffers = () => {
        navigate('/hot-tours');
    };

    // Приглушённые цвета (оставляем без изменений)
    const silkDunesBackground = {
        background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
        position: 'relative' as const,
        overflow: 'hidden'
    };

    const sandTexture = {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
        pointerEvents: 'none' as const,
        mixBlendMode: 'overlay' as const
    };

    const heroSectionStyle = {
        background: 'linear-gradient(135deg, rgba(190, 160, 130, 0.8) 0%, rgba(160, 130, 100, 0.8) 50%, rgba(130, 100, 70, 0.8) 100%)',
        color: '#F8F3E8',
        padding: '70px 20px 50px',
        textAlign: 'center' as const,
        position: 'relative' as const,
        borderBottom: '2px solid #B89A7A',
        boxShadow: '0 4px 15px rgba(120, 90, 60, 0.1)',
        overflow: 'hidden' as const,
        borderRadius: '0 0 40px 40px',
        margin: '0 20px',
    };

    const heroTitleStyle = {
        fontSize: '44px',
        marginBottom: '10px',
        textShadow: '1px 1px 0 #7A5A3A, 0 0 15px #F8F3E8',
        fontWeight: '500',
        letterSpacing: '1px',
        fontFamily: "'Cormorant Garamond', serif"
    };

    const heroSubtitleStyle = {
        fontSize: '18px',
        marginBottom: '25px',
        textShadow: '1px 1px 0 #7A5A3A',
        fontWeight: '300',
        color: '#F8F3E8',
        letterSpacing: '0.5px',
    };

    const heroButtonPrimaryStyle = {
        padding: '12px 30px',
        fontSize: '16px',
        background: '#F5F0E5',
        color: '#8B5A2B',
        border: '2px solid #C0A080',
        borderRadius: '25px',
        cursor: 'pointer',
        marginRight: '15px',
        fontWeight: '500',
        boxShadow: '0 4px 10px rgba(140, 110, 80, 0.2)',
        transition: 'all 0.3s',
        letterSpacing: '0.5px'
    };

    const heroButtonSecondaryStyle = {
        padding: '12px 30px',
        fontSize: '16px',
        background: 'transparent',
        color: '#F5F0E5',
        border: '2px solid #F5F0E5',
        borderRadius: '25px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.3s',
        letterSpacing: '0.5px'
    };

    // Компонент карточки тура (как в CatalogToursPage)
    const TourCard = ({ tour }: { tour: Tour }) => (
        <div
            className="egypt-card"
            style={{
                background: 'rgba(245, 240, 229, 0.7)',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '1px solid #C0A080',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(139, 69, 19, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {tour.hotTour && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: '#B76E3C',
                    color: '#FFF8F0',
                    padding: '5px 15px',
                    borderRadius: '25px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 2
                }}>
                    🔥 Горящий
                </div>
            )}
            <img
                src={`${API_URL}/${tour.imageTour}`}
                alt={tour.name}
                style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderBottom: '2px solid #D2B48C'
                }}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image';
                }}
            />
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{
                    margin: '0 0 5px 0',
                    color: '#8B5A2B',
                    fontSize: '22px',
                    fontFamily: "'Cormorant Garamond', serif"
                }}>
                    {tour.name}
                </h3>
                <p style={{ color: '#8B5A2B', fontSize: '14px', marginBottom: '10px' }}>
                    {tour.details}
                </p>
                <div style={{ color: '#8B5A2B', fontSize: '13px', marginBottom: '15px' }}>
                    <span>📍 {tour.startDot} → {tour.endDot}</span> • <span>🏷️ {tour.type}</span>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto'
                }}>
                    <div>
                        <span style={{
                            color: '#8B5A2B',
                            fontSize: '24px',
                            fontWeight: '600',
                        }}>
                            {formatPrice(tour.price)} ₽
                        </span>
                    </div>
                    <span style={{ color: '#B76E3C', fontSize: '14px' }}>
                        {calculateNights(tour.startDot, tour.endDot)} ночей
                    </span>
                </div>
                <button
                    onClick={() => navigate(`/catalog/tour/${tour.id}`)}
                    style={{
                        marginTop: '15px',
                        padding: '8px 20px',
                        background: '#C0A080',
                        color: '#F5F0E5',
                        border: '1px solid #8B5A2B',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        width: '100%',
                        fontSize: '14px',
                        fontWeight: '400',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#8B5A2B';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#C0A080';
                    }}
                >
                    𓊹 Подробнее
                </button>
            </div>
        </div>
    );

    return (
        <div style={{
            ...silkDunesBackground,
            minHeight: '100vh',
            fontFamily: "'Montserrat', 'Arial', sans-serif",
            display: 'flex',
            flexDirection: 'column' as const,
            paddingTop: '70px'
        }}>
            {/* Фоновые иероглифы */}
            <div className="hieroglyph-bg" style={{ top: '5%', left: '2%' }}>𓂀</div>
            <div className="hieroglyph-bg" style={{ top: '15%', right: '3%' }}>𓊹</div>
            <div className="hieroglyph-bg" style={{ bottom: '10%', left: '5%' }}>𓋴</div>
            <div className="hieroglyph-bg" style={{ bottom: '20%', right: '8%' }}>𓏛</div>

            {/* Текстура песка */}
            <div style={sandTexture} />

            {/* Основной контент */}
            <div style={{ position: 'relative', zIndex: 2, flex: '1 0 auto' }}>
                <main>
                    {/* Hero секция с анимацией (без изменений) */}
                    <section className="hero" style={heroSectionStyle}>
                        <div className="egypt-animation-container">
                            <div className="sun"></div>
                            <div className="dune dune-left"></div>
                            <div className="dune dune-right"></div>
                            <div className="egyptian-sprite"></div>
                            <div className="pyramid"></div>
                            <div style={{ position: 'absolute', bottom: '20px', left: '10px', fontSize: '30px', opacity: 0.3 }}>🌴</div>
                            <div style={{ position: 'absolute', bottom: '15px', right: '150px', fontSize: '35px', opacity: 0.25 }}>🏜️</div>
                            <div style={{ position: 'absolute', top: '30px', left: '50px', fontSize: '20px', opacity: 0.2 }}>🐪</div>
                            <div style={{ position: 'absolute', top: '50px', right: '220px', fontSize: '25px', opacity: 0.2 }}>🐫</div>
                        </div>
                        <div className="hero-content">
                            <h1 style={heroTitleStyle}>🐪 Шелковые барханы 🐪</h1>
                            <p style={heroSubtitleStyle}>Откройте тайны древних цивилизаций 🌅</p>
                            <div className="hero-buttons">
                                <button
                                    className="btn-primary"
                                    onClick={handleFindDoor}
                                    style={heroButtonPrimaryStyle}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#E5D5C5'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = '#F5F0E5'; }}
                                >
                                    👑 Найти тур
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={handleSpecialOffers}
                                    style={heroButtonSecondaryStyle}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245, 240, 229, 0.2)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    🔥 Горящие предложения
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Почему выбирают нас (без изменений) */}
                    <section className="advantages" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px', color: '#8B5A2B', fontFamily: "'Cormorant Garamond', serif" }}>
                            𓊹 Почему выбирают нас?
                        </h2>
                        <div className="advantages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            {[
                                { icon: '𓊹', title: '10+ лет', desc: 'Опыт поколений' },
                                { icon: '𓊖', title: '50+ стран', desc: 'По всему миру' },
                                { icon: '𓋴', title: '1000+ туров', desc: 'Уникальных' },
                                { icon: '𓂀', title: '24/7', desc: 'Поддержка' }
                            ].map((item, index) => (
                                <div key={index} className="egypt-card" style={{ textAlign: 'center', padding: '25px', background: 'rgba(245, 240, 229, 0.5)', borderRadius: '15px', border: '1px solid #C0A080', transition: 'all 0.3s' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.background = 'rgba(245, 240, 229, 0.8)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(245, 240, 229, 0.5)'; }}>
                                    <span style={{ fontSize: '48px', marginBottom: '15px', display: 'block' }}>{item.icon}</span>
                                    <h3 style={{ marginBottom: '5px', color: '#8B5A2B', fontSize: '18px' }}>{item.title}</h3>
                                    <p style={{ color: '#8B5A2B', fontSize: '14px' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Популярные направления (динамические туры из API) */}
                    <section className="special-offers" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '30px', color: '#8B5A2B', fontFamily: "'Cormorant Garamond', serif" }}>
                            𓊖 Популярные направления
                        </h2>

                        {loading && (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>🐪</div>
                                <style>{`
                                    @keyframes pulse {
                                        0% { opacity: 0.6; transform: scale(1); }
                                        50% { opacity: 1; transform: scale(1.1); }
                                        100% { opacity: 0.6; transform: scale(1); }
                                    }
                                `}</style>
                                <h3 style={{ color: '#8B5A2B' }}>Загрузка туров...</h3>
                            </div>
                        )}

                        {error && (
                            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255, 248, 240, 0.9)', borderRadius: '30px', maxWidth: '500px', margin: '0 auto' }}>
                                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                                <h3 style={{ color: '#8B5A2B' }}>{error}</h3>
                                <button onClick={fetchTours} style={{ marginTop: '20px', padding: '10px 30px', background: '#C0A080', color: '#FFF8F0', border: 'none', borderRadius: '25px', cursor: 'pointer' }}>Повторить</button>
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                {tours.slice(0, 3).map((tour) => (
                                    <TourCard key={tour.id} tour={tour} />
                                ))}
                            </div>
                        )}

                        {!loading && !error && tours.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#8B5A2B' }}>
                                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏜️</div>
                                <h3>Нет доступных туров</h3>
                                <p>Попробуйте зайти позже</p>
                            </div>
                        )}
                    </section>

                    {/* Отзывы (без изменений) */}
                    <section className="reviews" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px', color: '#8B5A2B', fontFamily: "'Cormorant Garamond', serif" }}>
                            𓋴 Отзывы путешественников
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {[
                                { name: 'Есения', text: 'Незабываемый отдых! Помирились с мужем именно благодаря вам!', place: 'Мальдивы' },
                                { name: 'Валерий', text: 'Всё на высшем уровне! Будто по Спару хожу.', place: 'Италия' }
                            ].map((review, index) => (
                                <div key={index} className="egypt-card" style={{ padding: '20px', background: 'rgba(245, 240, 229, 0.7)', borderRadius: '15px', border: '1px solid #C0A080', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '-10px', left: '20px', fontSize: '30px', background: '#F5F0E5', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #C0A080' }}>
                                        {index === 0 ? '𓁐' : '𓁤'}
                                    </div>
                                    <p style={{ fontSize: '14px', fontStyle: 'italic', margin: '20px 0 10px 0', color: '#8B5A2B' }}> "{review.text}" </p>
                                    <p style={{ fontWeight: '500', color: '#B76E3C', fontSize: '14px' }}> — {review.name}, {review.place} </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Подписка (без изменений) */}
                    <section className="newsletter" style={{ padding: '60px 20px', margin: '40px 0', background: 'linear-gradient(135deg, #C0A080, #8B5A2B)', color: '#F5F0E5', textAlign: 'center' }}>
                        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                            <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>𓂀 Рассылка</h2>
                            <p style={{ fontSize: '16px', marginBottom: '20px' }}>Горящие предложения первыми</p>
                            <form style={{ display: 'flex', gap: '10px', justifyContent: 'center' }} onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder="Ваш email" style={{ padding: '10px 15px', fontSize: '14px', border: '2px solid #F5F0E5', borderRadius: '25px', width: '250px', outline: 'none', backgroundColor: 'rgba(245, 240, 229, 0.2)', color: '#F5F0E5' }} />
                                <button type="submit" style={{ padding: '10px 25px', fontSize: '14px', background: '#F5F0E5', color: '#8B5A2B', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: '500' }}>𓊹 Подписаться</button>
                            </form>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default MainPage;