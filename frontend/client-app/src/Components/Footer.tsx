import React, { useEffect, useState } from 'react';
import { getCurrencyRates } from '../Services/CurrencyRatesApi';

const Footer = () => {

    const [currencyRatesOptions, setCurrencyRatesOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // +1 потому что месяцы с 0
    const year = today.getFullYear();

    const formattedToday = `${day}.${month}.${year}`; // преобразованный формат под приходящий с БД "03.03.2026"

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoading(true);
                const rates = await getCurrencyRates();

                const todayRates = rates
                    .filter(r => { return r.dateReceipt === formattedToday; })
                    .filter(r => { return r.letterCode === "USD" || r.letterCode === "EUR" })
                    .map(r => `${r.letterCode}: ${r.rate.toFixed(2)}`);
                console.log(todayRates);

                setCurrencyRatesOptions(todayRates);
                setError(null);
            } catch (err) {
                console.error("Ошибка загрузки курсов валют:", err);
                setError("Не удалось загрузить список курсов валют");
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    return (
        <footer style={{
            background: 'linear-gradient(0deg, #8B5A2B, #C0A080)',
            color: '#F5F0E5',
            padding: '30px 20px',
            marginTop: 'auto',
            borderTop: '2px solid #A07850',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#F5F0E5',
                padding: '5px 20px',
                borderRadius: '25px',
                fontSize: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                color: '#8B5A2B',
                fontFamily: "'Cormorant Garamond', serif",
                border: '1px solid #C0A080'
            }}>
                𓂀 Шелковые барханы 𓂀
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                paddingTop: '20px'
            }}>
                <div>
                    <h4 style={{ color: '#F5F0E5', marginBottom: '10px', fontSize: '16px' }}>О нас</h4>
                    <p style={{ color: '#F5F0E5', fontSize: '13px' }}>
                        Путешествия с душой
                    </p>
                </div>
                <div>
                    <h4 style={{ color: '#F5F0E5', marginBottom: '10px', fontSize: '16px' }}>Контакты</h4>
                    <p style={{ color: '#F5F0E5', fontSize: '13px' }}>info@silkdunes.ru</p>
                    <p style={{ color: '#F5F0E5', fontSize: '13px' }}>+7 (999) 123-45-67</p>
                </div>
                <div>
                    <h4 style={{ color: '#F5F0E5', marginBottom: '10px', fontSize: '16px' }}>Мы в соцсетях</h4>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '18px' }}>
                        <span>𓊹</span>
                        <span>𓋴</span>
                        <span>𓂀</span>
                    </div>
                </div>
                <div>
                    <h4 style={{ color: '#F5F0E5', marginBottom: '10px', fontSize: '16px' }}>Курсы валют на {formattedToday}</h4>
                    <div>
                        {currencyRatesOptions.map((rate, index) => (<option key={index} value={rate}>{rate}</option>))}
                    </div>
                </div>
            </div>

            <div style={{
                textAlign: 'center',
                marginTop: '20px',
                paddingTop: '15px',
                borderTop: '1px solid #F5F0E5',
                color: '#F5F0E5',
                fontSize: '12px'
            }}>
                <p>© 2026 Шелковые барханы</p>
            </div>
        </footer>
    );
};

export default Footer;