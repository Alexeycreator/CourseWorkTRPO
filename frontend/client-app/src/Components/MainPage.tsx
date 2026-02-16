import React from "react";
import { useNavigate } from 'react-router-dom';
import maldivImage from '../Images/Maldiv.jpg';
import italiaImage from '../Images/Italia.jpeg';
import baliImage from '../Images/Bali.jpg';

const MainPage = () => {
    const navigate = useNavigate();

    const handleFindDoor = () => {
        navigate('/catalog');
    };

    const handleSpecialOffers = () => {
        navigate('/hot-tours');
    };

    // Стили для создания эффекта "шелковости/шерсти"
    const furBackground = {
        background: 'radial-gradient(circle at 30% 30%, rgba(106, 90, 205, 0.8) 0%, rgba(75, 0, 130, 0.9) 100%)',
        position: 'relative' as const,
        overflow: 'hidden'
    };

    const furTexture = {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
        pointerEvents: 'none' as const,
        mixBlendMode: 'overlay' as const
    };

    // Стили для Hero секции (вынесены отдельно)
    const heroSectionStyle = {
        background: 'linear-gradient(135deg, rgba(147, 112, 219, 0.95) 0%, rgba(106, 90, 205, 0.95) 50%, rgba(72, 61, 139, 0.95) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '120px 20px',
        textAlign: 'center' as const,
        position: 'relative' as const,
        borderBottom: '3px solid #9370DB',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 50px rgba(255,215,0,0.2)',
        overflow: 'hidden' as const,
        borderRadius: '0 0 50px 50px',
        margin: '0 20px',
    };

    const heroTitleStyle = {
        fontSize: '64px',
        marginBottom: '20px',
        textShadow: '3px 3px 0 #4B0082, 0 0 30px #FFD700',
        fontWeight: '800',
        letterSpacing: '2px',
        background: 'linear-gradient(45deg, #FFFFFF, #E6E6FA, #FFD700)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'glow 3s infinite alternate' as const,
    };

    const heroSubtitleStyle = {
        fontSize: '28px',
        marginBottom: '40px',
        textShadow: '2px 2px 0 #4B0082, 0 0 20px #9370DB',
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: '1px',
    };

    const heroButtonPrimaryStyle = {
        padding: '18px 50px',
        fontSize: '20px',
        background: 'linear-gradient(45deg, #9370DB, #6A5ACD)',
        color: 'white',
        border: '3px solid #FFD700',
        borderRadius: '30px',
        cursor: 'pointer',
        marginRight: '20px',
        fontWeight: '700',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4), 0 0 15px #FFD700',
        transition: 'all 0.3s',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        position: 'relative' as const,
        zIndex: 4
    };

    const heroButtonSecondaryStyle = {
        padding: '18px 50px',
        fontSize: '20px',
        background: 'transparent',
        color: 'white',
        border: '3px solid #FFD700',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: '700',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        transition: 'all 0.3s',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        backdropFilter: 'blur(5px)',
        position: 'relative' as const,
        zIndex: 4
    };

    // Стили для чешуек Рэндалла
    const randallScales = {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='scaleGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%234B0082' stop-opacity='0.4'/%3E%3Cstop offset='50%25' stop-color='%239370DB' stop-opacity='0.6'/%3E%3Cstop offset='100%25' stop-color='%236A5ACD' stop-opacity='0.4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M40 10 L70 30 L70 50 L40 70 L10 50 L10 30 Z' fill='url(%23scaleGrad)' stroke='%23FFD700' stroke-width='1' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '120px 100px',
        backgroundRepeat: 'repeat',
        pointerEvents: 'none' as const,
        mixBlendMode: 'overlay' as const,
        animation: 'scaleMove 15s infinite linear',
        borderRadius: 'inherit',
    };

    return (
        <div style={{ 
            ...furBackground,
            minHeight: '100vh',
            fontFamily: "'Poppins', 'Arial', sans-serif"
        }}>
            {/* Анимации */}
            <style>
                {`
                    @keyframes glow {
                        0% { text-shadow: 3px 3px 0 #4B0082, 0 0 30px #FFD700; }
                        100% { text-shadow: 3px 3px 0 #4B0082, 0 0 60px #9370DB, 0 0 90px #FFD700; }
                    }
                    @keyframes scaleMove {
                        0% { background-position: 0 0; }
                        100% { background-position: 200px 200px; }
                    }
                `}
            </style>

            {/* Текстура шерсти поверх всего */}
            <div style={furTexture} />
            
            {/* Основной контент (поверх текстуры) */}
            <div style={{ position: 'relative', zIndex: 2 }}>
                <main>
                    {/* Hero секция с градиентом как у Салли */}
                    <section className="hero" style={heroSectionStyle}>
                        {/* Чешуйки Рэндалла */}
                        <div style={randallScales} />
                        
                        {/* Декоративные элементы как пятна на шкуре Салли */}
                        <div style={{
                            position: 'absolute',
                            top: '10%',
                            left: '5%',
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'rgba(147, 112, 219, 0.3)',
                            filter: 'blur(40px)'
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '10%',
                            right: '5%',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: 'rgba(123, 104, 238, 0.3)',
                            filter: 'blur(50px)'
                        }} />
                        
                        {/* Дополнительный слой с мерцанием */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at 30% 40%, rgba(255,215,0,0.1) 0%, transparent 50%)',
                            pointerEvents: 'none',
                        }} />
                        
                        <div className="hero-content" style={{ position: 'relative', zIndex: 3 }}>
                            <h1 style={heroTitleStyle}>
                                🪀 Корпорация Монстров 🪀
                            </h1>
                            <p style={heroSubtitleStyle}>
                                Салли и Майк приглашают в путешествие!
                            </p>
                            <div className="hero-buttons">
                                <button 
                                    className="btn-primary" 
                                    onClick={handleFindDoor}
                                    style={heroButtonPrimaryStyle}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5), 0 0 25px #FFD700';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4), 0 0 15px #FFD700';
                                    }}
                                >
                                    🚪 Найти дверь
                                </button>
                                <button 
                                    className="btn-secondary" 
                                    onClick={handleSpecialOffers}
                                    style={heroButtonSecondaryStyle}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.background = 'rgba(255,215,0,0.2)';
                                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5), 0 0 20px #FFD700';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)';
                                    }}
                                >
                                    🔥 Спецпредложения
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Остальная часть главной страницы (без изменений) */}
                    {/* Почему выбирают нас */}
                    <section className="advantages" style={{
                        padding: '80px 20px',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        marginTop: '40px'
                    }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '42px',
                            marginBottom: '50px',
                            color: '#E6E6FA',
                            textShadow: '2px 2px 0 #4B0082'
                        }}>
                            🏆 Почему мы лучшие монстры? 🏆
                        </h2>
                        <div className="advantages-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '30px'
                        }}>
                            {[
                                { icon: '🏢', title: 'Корпорация с историей', desc: 'С 2001 года пугаем детей' },
                                { icon: '🚪', title: 'Миллионы дверей', desc: 'Лучшие направления' },
                                { icon: '🏆', title: 'Рекордсмены по страху', desc: 'Самые страшные туры' },
                                { icon: '💚', title: 'Команда профессионалов', desc: 'Салли, Майк и другие' }
                            ].map((item, index) => (
                                <div key={index} className="advantage" style={{
                                    textAlign: 'center',
                                    padding: '30px',
                                    background: 'linear-gradient(135deg, rgba(147,112,219,0.2), rgba(106,90,205,0.3))',
                                    borderRadius: '20px',
                                    border: '1px solid #9370DB',
                                    transition: 'transform 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <span style={{ fontSize: '64px', marginBottom: '20px', display: 'block' }}>{item.icon}</span>
                                    <h3 style={{ marginBottom: '10px', color: '#E6E6FA' }}>{item.title}</h3>
                                    <p style={{ color: '#D8BFD8' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Спецпредложения месяца */}
                    <section className="special-offers" style={{
                        padding: '80px 20px',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '42px',
                            marginBottom: '20px',
                            color: '#E6E6FA',
                            textShadow: '2px 2px 0 #4B0082'
                        }}>
                            🚪 Двери в удивительные миры 🚪
                        </h2>
                        <p style={{
                            textAlign: 'center',
                            fontSize: '20px',
                            color: '#D8BFD8',
                            marginBottom: '50px'
                        }}>
                            Каждая дверь ведет в уникальное приключение!
                        </p>
                        
                        <div className="offers-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '40px'
                        }}>
                            {[
                                { img: maldivImage, title: 'Мальдивы', desc: 'Райский отдых', price: '180 000 ₽', door: '🚪🔵' },
                                { img: italiaImage, title: 'Италия', desc: 'Экскурсионный тур', price: '95 000 ₽', door: '🚪🟢' },
                                { img: baliImage, title: 'Бали', desc: 'Йога-тур', price: '120 000 ₽', door: '🚪🟣' }
                            ].map((tour, index) => (
                                <div key={index} className="offer-card" style={{
                                    background: 'linear-gradient(145deg, rgba(147,112,219,0.2), rgba(106,90,205,0.4))',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                    border: '2px solid #9370DB',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(147,112,219,0.5)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                                }}>
                                    {/* Номер двери как в Корпорации монстров */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: '#4B0082',
                                        color: 'white',
                                        padding: '5px 15px',
                                        borderRadius: '15px',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        zIndex: 2
                                    }}>
                                        {tour.door}
                                    </div>
                                    
                                    <img
                                        src={tour.img}
                                        alt={tour.title}
                                        style={{
                                            width: '100%',
                                            height: '250px',
                                            objectFit: 'cover',
                                            borderBottom: '3px solid #9370DB'
                                        }}
                                    />
                                    <div style={{ padding: '25px' }}>
                                        <h3 style={{ 
                                            margin: '0 0 10px 0', 
                                            color: '#E6E6FA',
                                            fontSize: '28px'
                                        }}>{tour.title}</h3>
                                        <p style={{ color: '#D8BFD8', margin: '0 0 15px 0' }}>{tour.desc}</p>
                                        <p style={{
                                            fontSize: '28px',
                                            fontWeight: 'bold',
                                            color: '#FFD700',
                                            margin: '0 0 20px 0',
                                            textShadow: '1px 1px 0 #4B0082'
                                        }}>{tour.price}</p>
                                        <button 
                                            onClick={() => navigate('/tour/1')}
                                            style={{
                                                padding: '12px 25px',
                                                background: 'linear-gradient(45deg, #9370DB, #6A5ACD)',
                                                color: 'white',
                                                border: '2px solid #E6E6FA',
                                                borderRadius: '25px',
                                                cursor: 'pointer',
                                                width: '100%',
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                transition: 'transform 0.3s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            Открыть дверь 🚪
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Отзывы */}
                    <section className="reviews" style={{
                        padding: '80px 20px',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        background: 'rgba(147,112,219,0.1)',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '42px',
                            marginBottom: '50px',
                            color: '#E6E6FA',
                            textShadow: '2px 2px 0 #4B0082'
                        }}>
                            😱 Отзывы наших "жертв" 😱
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: '30px'
                        }}>
                            {[
                                { name: 'Есения', text: 'Самый лучший отдых! Даже страшно не было!', place: 'Турция', avatar: '👧' },
                                { name: 'Валерий', text: 'Очень страшно, хоть и весело! По пути в Спар заскочу!', place: 'Египет', avatar: '👦' }
                            ].map((review, index) => (
                                <div key={index} style={{
                                    padding: '30px',
                                    background: 'linear-gradient(135deg, rgba(147,112,219,0.3), rgba(106,90,205,0.3))',
                                    borderRadius: '20px',
                                    border: '2px solid #9370DB',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '-15px',
                                        left: '30px',
                                        fontSize: '40px',
                                        background: '#4B0082',
                                        borderRadius: '50%',
                                        width: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '3px solid #9370DB'
                                    }}>
                                        {review.avatar}
                                    </div>
                                    <p style={{ 
                                        fontSize: '18px', 
                                        fontStyle: 'italic', 
                                        margin: '30px 0 20px 0',
                                        color: 'white'
                                    }}>
                                        "{review.text}"
                                    </p>
                                    <p style={{ 
                                        fontWeight: 'bold', 
                                        color: '#FFD700',
                                        fontSize: '18px'
                                    }}>
                                        — {review.name}, {review.place}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Подписка на новости */}
                    <section className="newsletter" style={{
                        padding: '80px 20px',
                        margin: '40px 0',
                        background: 'linear-gradient(135deg, #4B0082, #6A5ACD)',
                        color: 'white',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Декоративные элементы как конфетти */}
                        {[...Array(20)].map((_, i) => (
                            <div key={i} style={{
                                position: 'absolute',
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                fontSize: `${20 + Math.random() * 30}px`,
                                opacity: 0.1,
                                transform: 'rotate(' + Math.random() * 360 + 'deg)',
                                color: '#FFD700'
                            }}>
                                {['🚪', '👻', '💚', '🪀'][Math.floor(Math.random() * 4)]}
                            </div>
                        ))}
                        
                        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                            <h2 style={{
                                fontSize: '42px',
                                marginBottom: '20px',
                                textShadow: '2px 2px 0 #4B0082'
                            }}>
                                📬 Подпишитесь на рассылку страха
                            </h2>
                            <p style={{
                                fontSize: '20px',
                                marginBottom: '30px',
                                color: '#D8BFD8'
                            }}>
                                Получайте горящие двери первыми! 🔥
                            </p>
                            <form style={{
                                display: 'flex',
                                gap: '10px',
                                justifyContent: 'center',
                                flexWrap: 'wrap' as const
                            }}>
                                <input
                                    type="email"
                                    placeholder="Ваш email"
                                    style={{
                                        padding: '15px',
                                        fontSize: '16px',
                                        border: '3px solid #9370DB',
                                        borderRadius: '30px',
                                        width: '300px',
                                        outline: 'none'
                                    }}
                                />
                                <button type="submit" style={{
                                    padding: '15px 40px',
                                    fontSize: '18px',
                                    background: 'linear-gradient(45deg, #9370DB, #FFD700)',
                                    color: '#4B0082',
                                    border: 'none',
                                    borderRadius: '30px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'transform 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                    Подписаться 🚪
                                </button>
                            </form>
                        </div>
                    </section>
                </main>

                {/* Футер с логотипом Корпорации */}
                <footer style={{
                    background: 'linear-gradient(0deg, #2E1B3F, #4B0082)',
                    color: 'white',
                    padding: '40px 20px',
                    marginTop: 'auto',
                    borderTop: '3px solid #9370DB',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#9370DB',
                        padding: '10px 30px',
                        borderRadius: '30px',
                        fontSize: '24px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}>
                        👻 Салли-турс 👻
                    </div>
                    
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px',
                        paddingTop: '30px'
                    }}>
                        <div>
                            <h3 style={{ color: '#FFD700', marginBottom: '20px' }}>Корпорация монстров</h3>
                            <p style={{ color: '#D8BFD8' }}>Путешествия со страхом и смехом!</p>
                        </div>
                        <div>
                            <h3 style={{ color: '#FFD700', marginBottom: '20px' }}>Контакты</h3>
                            <p style={{ color: '#D8BFD8' }}>📍 Монстрополис, ул. Страха, 13</p>
                            <p style={{ color: '#D8BFD8' }}>📞 +7 (999) 123-45-67</p>
                        </div>
                        <div>
                            <h3 style={{ color: '#FFD700', marginBottom: '20px' }}>Мы в соцсетях</h3>
                            <div style={{ display: 'flex', gap: '15px', fontSize: '30px' }}>
                                <span>👻</span>
                                <span>💚</span>
                                <span>🚪</span>
                                <span>🪀</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{
                        textAlign: 'center',
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop: '1px solid #9370DB',
                        color: '#D8BFD8'
                    }}>
                        <p>© 2026 Корпорация монстров. Все двери защищены.</p>
                        <p style={{ fontSize: '14px', marginTop: '10px' }}>
                            С любовью от Салли и Майка 💚
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default MainPage;