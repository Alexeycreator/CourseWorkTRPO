import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { getAllTours, Tours } from "../Services/ToursApi";
import NavBar from "../Components/NavBar";
import { getSafeImageUrl, PLACEHOLDERS } from "../Components/OptimizedImage";
import Loader from "../Components/Loader";

interface HotTourItem {
    id: number;
    imageTour?: string | null;
    nameTour?: string | null;
    details?: string | null;
    startDot?: string | null;
    endDot?: string | null;
    type?: string | null;
    oldPrice?: number | null;
    nowPrice?: number | null;
    countNights?: number | null;
    description?: string | null;
}

const HotTourPage = () => {
    const location = useLocation();
    const [sortBy, setSortBy] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [tours, setTours] = useState<HotTourItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedCurrency, setSelectedCurrency] = useState('RUB');
    const [currentRate, setCurrentRate] = useState(1);
    const [signCurrency, setSignCurrency] = useState('₽');

    const handleCurrencyChange = (currency: string, rate: number) => {
        switch (currency) {
            case "RUB": setSignCurrency('₽'); break;
            case "USD": setSignCurrency('$'); break;
            case "EUR": setSignCurrency('€'); break;
        }
        setSelectedCurrency(currency);
        setCurrentRate(rate);
    };

    const parseDate = (dateString: string | null | undefined): Date | null => {
        if (!dateString) return null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return isNaN(date.getTime()) ? null : date;
        }
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
            const [day, month, year] = dateString.split('.').map(Number);
            const date = new Date(year, month - 1, day);
            return isNaN(date.getTime()) ? null : date;
        }
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };

    const calculateNights = (startDate: string | null | undefined, endDate: string | null | undefined): number | null => {
        const start = parseDate(startDate);
        const end = parseDate(endDate);
        if (!start || !end || end <= start) return null;
        const diffTime = end.getTime() - start.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getNightsDisplay = (tour: HotTourItem): string => {
        if (tour.countNights != null && tour.countNights > 0) return `${tour.countNights} ночей`;
        const nights = calculateNights(tour.startDot, tour.endDot);
        if (nights != null && nights >= 0) return nights === 0 ? 'Однодневный тур' : `${nights} ночей`;
        return 'Количество ночей не указано';
    };

    const formatPrice = (price: number | null | undefined) => {
        if (price === null || price === undefined) return `0 ${signCurrency}`;
        const converted = price / currentRate;
        return converted.toLocaleString('ru-RU') + ' ' + signCurrency;
    };

    const calculateDiscount = (oldPrice: number | null | undefined, nowPrice: number | null | undefined): number => {
        if (oldPrice && nowPrice && oldPrice > nowPrice) return Math.round(((oldPrice - nowPrice) / oldPrice) * 100);
        return 0;
    };

    const fetchHotTours = async () => {
        try {
            setLoading(true);
            const allTours = await getAllTours();
            const hotToursList = allTours.filter(tour => tour.hotTour == true);
            if (hotToursList.length === 0) {
                setError("На данный момент горящих туров нет");
                setTours([]);
            } else {
                const formattedTours: HotTourItem[] = hotToursList.map((tour: Tours) => ({
                    id: tour.id, imageTour: tour.imageTour, nameTour: tour.name,
                    details: tour.details, startDot: tour.startDot, endDot: tour.endDot,
                    type: tour.type, countNights: null,
                    oldPrice: tour.price, nowPrice: tour.price ? tour.price * 0.8 : 0,
                    description: tour.description
                }));
                setTours(formattedTours);
                setError(null);
            }
        } catch (err: any) {
            setError(err.serverMessage || err.message || "Не удалось загрузить горящие туры");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) setSearchQuery(searchParam);
    }, [location.search]);

    useEffect(() => { fetchHotTours(); }, []);

    const filterToursBySearch = (toursList: HotTourItem[]): HotTourItem[] => {
        if (!searchQuery.trim()) return toursList;
        const query = searchQuery.toLowerCase().trim();
        return toursList.filter(tour => {
            const fields = [tour.nameTour, tour.startDot, tour.endDot, tour.type, tour.details, tour.description].filter(f => f && typeof f === 'string');
            return fields.some(f => f?.toLowerCase().includes(query));
        });
    };

    const getFilteredAndSortedTours = () => {
        let filtered = filterToursBySearch(tours);
        if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => (a.nowPrice || 0) - (b.nowPrice || 0));
        else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => (b.nowPrice || 0) - (a.nowPrice || 0));
        else if (sortBy === 'discount') filtered = [...filtered].sort((a, b) => calculateDiscount(b.oldPrice, b.nowPrice) - calculateDiscount(a.oldPrice, a.nowPrice));
        return filtered;
    };

    const filteredAndSortedTours = getFilteredAndSortedTours();

    if (loading) return <Loader message="Загрузка горящих туров..." fullScreen />;

    if (error && error !== "На данный момент горящих туров нет") {
        return (
            <div style={{ background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)', minHeight: '100vh', padding: '20px', paddingTop: '70px' }}>
                <NavBar onCurrencyChange={handleCurrencyChange} />
                <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', background: 'rgba(255,248,240,0.9)', borderRadius: '30px', padding: '40px', border: '2px solid #C0A080' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                    <h2 style={{ color: '#8B5A2B' }}>Ошибка загрузки</h2>
                    <p style={{ color: '#B76E3C' }}>{error}</p>
                    <button onClick={fetchHotTours} style={{ padding: '12px 30px', background: '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>Попробовать снова</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)', minHeight: '100vh', padding: '20px', paddingTop: '70px' }}>
            <NavBar onCurrencyChange={handleCurrencyChange} />
            <div style={{ position: 'fixed', top: '10%', left: '2%', fontSize: '40px', opacity: 0.05, pointerEvents: 'none' }}>𓂀</div>
            <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '50px', opacity: 0.05, pointerEvents: 'none' }}>𓊹</div>
            <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', color: '#8B5A2B' }}>🔥 Горящие туры</h1>
                    <p style={{ fontSize: '20px', color: '#B76E3C' }}>Специальные предложения с максимальными скидками! 🐪</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,248,240,0.9)', borderRadius: '50px', padding: '5px', border: '2px solid #C0A080' }}>
                            <span style={{ display: 'flex', alignItems: 'center', paddingLeft: '15px', fontSize: '20px', color: '#B76E3C' }}>🔍</span>
                            <input type="text" placeholder="Поиск по горящим турам..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ flex: 1, padding: '12px 10px', border: 'none', borderRadius: '40px', backgroundColor: 'transparent', color: '#8B5A2B', fontSize: '16px', outline: 'none' }} />
                            {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#B76E3C', padding: '0 15px' }}>✕</button>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ color: '#8B5A2B', fontSize: '16px' }}>𓊹 Сортировать:</span>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                            style={{ padding: '8px 20px', border: '2px solid #C0A080', borderRadius: '25px', backgroundColor: '#FFF8F0', color: '#8B5A2B', fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
                            <option value="default">По умолчанию</option>
                            <option value="price-asc">Сначала дешевле</option>
                            <option value="price-desc">Сначала дороже</option>
                            <option value="discount">По размеру скидки</option>
                        </select>
                    </div>
                </div>
                {filteredAndSortedTours.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                        {filteredAndSortedTours.map((tour) => {
                            const discount = calculateDiscount(tour.oldPrice, tour.nowPrice);
                            return (
                                <div key={tour.id} style={{ background: 'rgba(255,248,240,0.9)', border: '2px solid #D2B48C', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s', position: 'relative', display: 'flex', flexDirection: 'column' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(183,110,60,0.2)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                    <div style={{ position: 'absolute', top: '15px', left: '15px', background: '#B76E3C', color: '#FFF8F0', padding: '8px 15px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', zIndex: 2 }}>🔥 Горящий тур</div>
                                    {discount > 0 && <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#8B5A2B', color: '#FFD700', padding: '8px 15px', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', zIndex: 2 }}>-{discount}%</div>}
                                    <div style={{ height: '200px', overflow: 'hidden', borderBottom: '2px solid #D2B48C' }}>
                                        <Link to={`/catalog/tour/${tour.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                                            <img src={getSafeImageUrl(tour.imageTour, 'tour')} alt={tour.nameTour || 'Тур'} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDERS.tour; (e.target as HTMLImageElement).onerror = null; }} />
                                        </Link>
                                    </div>
                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>📍 {tour.startDot || '—'} → {tour.endDot || '—'}</div>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700', color: '#8B5A2B', fontFamily: "'Cormorant Garamond', serif" }}>
                                            <Link to={`/catalog/tour/${tour.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{tour.nameTour}</Link>
                                        </h3>
                                        <p style={{ color: '#B76E3C', fontSize: '14px', marginBottom: '10px', fontStyle: 'italic' }}>{tour.details}</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px', fontSize: '13px', color: '#8B5A2B' }}>
                                            <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>🏷️ {tour.type || '—'}</span>
                                            <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>🌙 {getNightsDisplay(tour)}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 'auto' }}>
                                            <div>
                                                {(tour.oldPrice || 0) > (tour.nowPrice || 0) && <span style={{ fontSize: '16px', color: '#B76E3C', textDecoration: 'line-through', marginRight: '10px' }}>{formatPrice(tour.oldPrice)}</span>}
                                                <span style={{ fontSize: '28px', fontWeight: '700', color: '#8B5A2B' }}>{formatPrice(tour.nowPrice)}</span>
                                            </div>
                                        </div>
                                        <Link to={`/catalog/tour/${tour.id}`} style={{ textDecoration: 'none' }}>
                                            <button style={{ marginTop: '15px', background: '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '30px', padding: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', width: '100%' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#8B5A2B'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#C0A080'; }}>𓊹 Подробнее</button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {filteredAndSortedTours.length === 0 && tours.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8B5A2B' }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏜️</div>
                        <h3>По вашему запросу ничего не найдено</h3>
                        <button onClick={() => setSearchQuery('')} style={{ marginTop: '20px', padding: '10px 30px', background: '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>Сбросить поиск</button>
                    </div>
                )}
                {tours.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8B5A2B' }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏜️</div>
                        <h3>На данный момент горящих туров нет</h3>
                        <Link to="/catalog"><button style={{ marginTop: '20px', padding: '10px 30px', background: '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>Посмотреть все туры</button></Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export { HotTourPage };