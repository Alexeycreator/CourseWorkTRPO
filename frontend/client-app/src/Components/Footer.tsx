import React, { useEffect, useState } from 'react';
import { getCurrencyRates } from '../Services/CurrencyRatesApi';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [currencyRatesOptions, setCurrencyRatesOptions] = useState<Array<{code: string, rate: number}>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
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

    return (
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
                            <Link to="/information#mission" style={{ color: '#F5F0E5', fontSize: '14px', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.3s' }}
                                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
                                Миссия и цели
                            </Link>
                        </li>
                        <li style={{ marginBottom: '8px' }}>
                            <Link to="/information#quality" style={{ color: '#F5F0E5', fontSize: '14px', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.3s' }}
                                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}>
                                Качество продукта
                            </Link>
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
                            <Link to="/account" style={{ color: '#F5F0E5', fontSize: '14px', textDecoration: 'none', opacity: 0.9, transition: 'opacity 0.3s' }}
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
                            <span>📧</span> info@silkdunes.ru
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

                {/* Курсы валют и соцсети */}
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

            {/* Нижняя часть с копирайтом и доп. информацией */}
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

            {/* Дополнительная информация о компании */}
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
    );
};

export default Footer;