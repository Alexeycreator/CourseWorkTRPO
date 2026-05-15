import React, { useEffect, useState } from 'react';
import { getCurrencyRates } from '../Services/CurrencyRatesApi';
import { Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

const Footer = () => {
    const { user } = useAuth();
    const [currencyRatesOptions, setCurrencyRatesOptions] = useState<Array<{ code: string, rate: number }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAuthWarning, setShowAuthWarning] = useState(false);

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedToday = `${day}.${month}.${year}`;

    useEffect(() => {
        const fetchRates = async () => {
            try {
                setLoading(true);
                const rates = await getCurrencyRates();

                const todayRates = rates
                    .filter(r => r.dateReceipt === formattedToday)
                    .filter(r => r.letterCode === "USD" || r.letterCode === "EUR")
                    .map(r => ({ code: r.letterCode, rate: r.rate }));

                setCurrencyRatesOptions(todayRates);
                setError(null);
            } catch (err) {
                console.error("Ошибка загрузки курсов валют:", err);
                setError("Не удалось загрузить курсы валют");
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, [formattedToday]);

    // Функция для прокрутки к секции на странице Information
    const handleScrollToSection = (sectionId: string) => {
        // Если мы уже на странице information
        if (window.location.pathname === '/information') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Если мы на другой странице - переходим и передаем параметр в URL
            window.location.href = `/information#${sectionId}`;
        }
    };

    const handleAccountClick = (e: React.MouseEvent) => {
        if (!user) {
            e.preventDefault();
            setShowAuthWarning(true);
        }
    };

    const closeAuthWarning = () => {
        setShowAuthWarning(false);
    };

    const openAuthModal = () => {
        setShowAuthWarning(false);
        window.dispatchEvent(new CustomEvent('openAuthModal'));
    };

    const openRegistrationModal = () => {
        setShowAuthWarning(false);
        window.dispatchEvent(new CustomEvent('openRegistrationModal'));
    };

    return (
        <>
            <footer style={{
                background: 'linear-gradient(0deg, #8B5A2B, #C0A080)',
                color: '#F5F0E5',
                padding: '40px 20px 30px',
                marginTop: 'auto',
                borderTop: '2px solid #A07850',
                position: 'relative',
                boxShadow: '0 -5px 20px rgba(139, 69, 19, 0.1)'
            }}>
                {/* Декоративный верхний элемент */}
                <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#F5F0E5',
                    padding: '8px 30px',
                    borderRadius: '30px',
                    fontSize: '22px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    color: '#8B5A2B',
                    fontFamily: "'Cormorant Garamond', serif",
                    border: '2px solid #B76E3C',
                    whiteSpace: 'nowrap',
                    zIndex: 10
                }}>
                    🐪 Шелковые барханы 🐪
                </div>

                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '30px',
                    paddingTop: '30px'
                }}>
                    {/* О нас */}
                    <div>
                        <h4 style={{
                            color: '#F5F0E5',
                            marginBottom: '15px',
                            fontSize: '18px',
                            fontFamily: "'Cormorant Garamond', serif",
                            borderBottom: '2px solid rgba(245, 240, 229, 0.3)',
                            paddingBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>🏜️</span> О компании
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>
                                <Link to="/information" style={{ color: '#F5F0E5', fontSize: '14px', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
                                    О нас
                                </Link>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <button
                                    onClick={() => handleScrollToSection('mission')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#F5F0E5',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        opacity: 0.9,
                                        transition: 'opacity 0.3s',
                                        padding: 0,
                                        fontFamily: 'inherit'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                                >
                                    Миссия и цели
                                </button>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <button
                                    onClick={() => handleScrollToSection('quality')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#F5F0E5',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        opacity: 0.9,
                                        transition: 'opacity 0.3s',
                                        padding: 0,
                                        fontFamily: 'inherit'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
                                >
                                    Качество продукта
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Туристам */}
                    <div>
                        <h4 style={{
                            color: '#F5F0E5',
                            marginBottom: '15px',
                            fontSize: '18px',
                            fontFamily: "'Cormorant Garamond', serif",
                            borderBottom: '2px solid rgba(245, 240, 229, 0.3)',
                            paddingBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>🧳</span> Туристам
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '8px' }}>
                                <Link to="/catalog" style={{ color: '#F5F0E5', fontSize: '14px', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
                                    Все туры
                                </Link>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <Link to="/hot-tours" style={{ color: '#F5F0E5', fontSize: '14px', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
                                    Горящие предложения
                                </Link>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <Link
                                    to={user ? `/account/${user.id}` : "#"}
                                    onClick={handleAccountClick}
                                    style={{ color: '#F5F0E5', fontSize: '14px', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
                                    Личный кабинет
                                </Link>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                                <Link to="/help" style={{ color: '#F5F0E5', fontSize: '14px', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
                                    Помощь
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Контакты */}
                    <div>
                        <h4 style={{
                            color: '#F5F0E5',
                            marginBottom: '15px',
                            fontSize: '18px',
                            fontFamily: "'Cormorant Garamond', serif",
                            borderBottom: '2px solid rgba(245, 240, 229, 0.3)',
                            paddingBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>📞</span> Контакты
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                <span>📧</span> vm96276915@gmail.com
                            </li>
                            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                <span>📱</span> +7 (901) 339-95-22
                            </li>
                            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                <span>📍</span> Москва, ул. Пальмовая, 13
                            </li>
                            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                                <span>⏰</span> Пн-Пт: 7:00 - 23:00
                            </li>
                        </ul>
                    </div>

                    {/* Курсы валют */}
                    <div>
                        <h4 style={{
                            color: '#F5F0E5',
                            marginBottom: '15px',
                            fontSize: '18px',
                            fontFamily: "'Cormorant Garamond', serif",
                            borderBottom: '2px solid rgba(245, 240, 229, 0.3)',
                            paddingBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span>💰</span> Курсы валют
                        </h4>
                        <div style={{ marginBottom: '15px' }}>
                            <p style={{ fontSize: '13px', marginBottom: '5px', opacity: 0.8 }}>на {formattedToday}</p>
                            {loading ? (
                                <p style={{ fontSize: '14px', fontStyle: 'italic' }}>Загрузка...</p>
                            ) : error ? (
                                <p style={{ fontSize: '14px', color: '#ff9999' }}>{error}</p>
                            ) : (
                                currencyRatesOptions.map((rate, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '5px 0',
                                        borderBottom: index < currencyRatesOptions.length - 1 ? '1px solid rgba(245, 240, 229, 0.2)' : 'none'
                                    }}>
                                        <span style={{ fontWeight: '600' }}>{rate.code}</span>
                                        <span>{rate.rate.toFixed(2)} ₽</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Нижняя часть с копирайтом */}
                <div style={{
                    maxWidth: '1200px',
                    margin: '30px auto 0',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(245, 240, 229, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '15px',
                    fontSize: '12px',
                    color: '#F5F0E5',
                    opacity: 0.8
                }}>
                    <div>© 2026 Шелковые барханы. Все права защищены.</div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link to="/legal" style={{ color: '#F5F0E5', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                            Политика конфиденциальности
                        </Link>
                        <span style={{ color: '#F5F0E5', opacity: 0.5 }}>|</span>
                        <Link to="/legal" style={{ color: '#F5F0E5', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}>
                            Условия использования
                        </Link>
                    </div>
                </div>

                {/* Дополнительная информация */}
                <div style={{
                    maxWidth: '1200px',
                    margin: '15px auto 0',
                    textAlign: 'center',
                    fontSize: '11px',
                    color: '#F5F0E5',
                    opacity: 0.6
                }}>
                    <p>
                        🐪 Туроператор «Шелковые барханы» предлагает лучшие туры по всему миру с 2015 года.
                        Более 10 000 довольных клиентов, 40+ стран, 5000+ отелей-партнеров.
                    </p>
                </div>
            </footer>

            {/* Модальное окно предупреждения */}
            {showAuthWarning && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 3000,
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#F8F0E0',
                        borderRadius: '30px',
                        padding: '40px',
                        maxWidth: '500px',
                        width: '100%',
                        position: 'relative',
                        border: '2px solid #C0A080',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '60px',
                            marginBottom: '20px'
                        }}>
                            🔐🐪
                        </div>

                        <h2 style={{
                            color: '#8B5A2B',
                            fontSize: '22px',
                            fontFamily: "'Cormorant Garamond', serif",
                            marginBottom: '20px',
                            whiteSpace: 'pre-line'
                        }}>
                            Вход в аккаунт не выполнен!{'\n'}Пожалуйста войдите в аккаунт или зарегистрируйтесь
                        </h2>

                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={openAuthModal}
                                style={{
                                    padding: '12px 25px',
                                    background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                                    color: '#FFF8F0',
                                    border: '2px solid #D2B48C',
                                    borderRadius: '40px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 5px 15px rgba(183, 110, 60, 0.3)',
                                    flex: '1',
                                    minWidth: '140px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                Войти
                            </button>
                            <button
                                onClick={openRegistrationModal}
                                style={{
                                    padding: '12px 25px',
                                    background: 'transparent',
                                    color: '#8B5A2B',
                                    border: '2px solid #D2B48C',
                                    borderRadius: '40px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    flex: '1',
                                    minWidth: '140px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                Регистрация
                            </button>
                        </div>

                        <button
                            onClick={closeAuthWarning}
                            style={{
                                padding: '10px 30px',
                                marginTop: '15px',
                                background: 'transparent',
                                color: '#8B5A2B',
                                border: 'none',
                                fontSize: '14px',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                opacity: 0.7,
                                transition: 'opacity 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '0.7';
                            }}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;