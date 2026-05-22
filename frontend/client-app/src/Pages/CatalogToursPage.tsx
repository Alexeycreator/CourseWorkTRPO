import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { ToursDto, getAllTours } from "../Services/ToursApi";
import NavBar from "../Components/NavBar";
import { getSafeImageUrl, PLACEHOLDERS } from "../Components/OptimizedImage";
import Loader from "../Components/Loader";
import { useCurrency } from '../Contexts/CurrencyContext';

const CatalogToursPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [toursData, setToursData] = useState<ToursDto[]>([]);
  const [filteredTours, setFilteredTours] = useState<ToursDto[]>([]);
  const [loadingTour, setLoadingTour] = useState(true);
  const [errorTour, setErrorTour] = useState<string | null>(null);

  const { selectedCurrency, currentRate, signCurrency, setCurrency } = useCurrency();

  const handleCurrencyChange = (currency: string, rate: number) => {
    setCurrency(currency, rate);
  };

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) return date;
      }
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) return date;
      }
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) return date;
      return null;
    } catch { return null; }
  };

  const calculateNights = (startDate: string, endDate: string): number | null => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (!start || !end || end <= start) return null;
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getNightsDisplay = (tour: ToursDto): string => {
    if (tour.countNights != null && tour.countNights > 0) return `${tour.countNights} ночей`;
    if (tour.startDot && tour.endDot) {
      const nights = calculateNights(tour.startDot, tour.endDot);
      if (nights != null && nights >= 0) return nights === 0 ? 'Однодневный тур' : `${nights} ночей`;
    }
    return 'Количество ночей не указано';
  };

  const calculatePrice = (tourPrice: number | null | undefined): string => {
    const totalPrice = (tourPrice || 0) / currentRate;
    return Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalPrice);
  };

  const fetchTours = async () => {
    try {
      setLoadingTour(true);
      const allTours = await getAllTours();
      const tours = allTours.filter(tour => tour.hotTour !== true);
      setToursData(tours);
      setFilteredTours(tours);
      setErrorTour(null);
    } catch (err: any) {
      setErrorTour(err.serverMessage || err.message || "Не удалось загрузить туры");
    } finally {
      setLoadingTour(false);
    }
  };

  const filterTours = () => {
    let filtered = [...toursData];
    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(tour => {
        const fields = [tour.nameTour, tour.startDot, tour.endDot, tour.type, tour.details].filter(f => f && typeof f === 'string');
        return fields.some(f => f?.toLowerCase().includes(query));
      });
    }
    setFilteredTours(filtered);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) setSearchQuery(searchParam);
  }, [location.search]);

  useEffect(() => { filterTours(); }, [searchQuery, toursData]);
  useEffect(() => { fetchTours(); }, []);

  if (loadingTour) return <Loader message="Загрузка туров..." fullScreen />;

  if (errorTour) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)', minHeight: '100vh', padding: '20px', paddingTop: '70px' }}>
        <NavBar onCurrencyChange={handleCurrencyChange} />
        <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', background: 'rgba(255,248,240,0.9)', borderRadius: '30px', padding: '40px', border: '2px solid #C0A080' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#8B5A2B' }}>Ошибка загрузки</h2>
          <p style={{ color: '#B76E3C' }}>{errorTour}</p>
          <button onClick={fetchTours} style={{ padding: '12px 30px', background: '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>Попробовать снова</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)', minHeight: '100vh', padding: '20px', paddingTop: '100px' }}>
      <NavBar onCurrencyChange={handleCurrencyChange} />
      <div className="container py-4" style={{ position: 'relative', zIndex: 2 }}>
        <div className="text-center mb-4">
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', color: '#8B5A2B' }}>𓊖 Каталог туров</h1>
          <p style={{ color: '#B76E3C', fontSize: '18px' }}>Найди своё идеальное путешествие 🐪</p>
        </div>
        <div className="mb-4" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
          <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,248,240,0.9)', borderRadius: '50px', padding: '5px', border: '2px solid #C0A080' }}>
            <span style={{ display: 'flex', alignItems: 'center', paddingLeft: '15px', fontSize: '20px', color: '#B76E3C' }}>🔍</span>
            <input type="text" placeholder="Поиск по названию, городу, описанию..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '12px 10px', border: 'none', borderRadius: '40px', backgroundColor: 'transparent', color: '#8B5A2B', fontSize: '16px', outline: 'none' }} />
            {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#B76E3C', padding: '0 15px' }}>✕</button>}
          </div>
        </div>
        <div className="mb-3"><p style={{ color: '#8B5A2B' }}>Найдено туров: {filteredTours.length}</p></div>
        <div className="row g-4">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100" style={{ background: 'rgba(255,248,240,0.9)', border: '2px solid #D2B48C', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(139,69,19,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <img src={getSafeImageUrl(tour.imageTour, 'tour')} alt={tour.nameTour || 'Тур'} style={{ width: '100%', height: '200px', objectFit: 'cover', borderBottom: '2px solid #D2B48C' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDERS.tour; (e.target as HTMLImageElement).onerror = null; }} />
                <div className="card-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#8B5A2B', fontSize: '22px', fontFamily: "'Cormorant Garamond', serif" }}>{tour.nameTour}</h3>
                  <p style={{ color: '#8B5A2B', fontSize: '14px', marginBottom: '10px' }}>{tour.details}</p>
                  <div className="d-flex gap-2 mb-2" style={{ color: '#8B5A2B', fontSize: '13px' }}><span>📍 {tour.startDot} → {tour.endDot}</span><span>•</span><span>🏷️ {tour.type}</span></div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span style={{ color: '#8B5A2B', fontSize: '24px', fontWeight: '600' }}>{calculatePrice(tour.price)} {signCurrency}</span>
                    <span style={{ color: '#B76E3C', fontSize: '14px' }}>{getNightsDisplay(tour)}</span>
                  </div>
                  <div className="d-flex gap-2" style={{ marginTop: 'auto' }}>
                    <a href={`/catalog/tour/${tour.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <button style={{ width: '100%', background: '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', padding: '8px', fontSize: '14px', cursor: 'pointer' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#8B5A2B'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#C0A080'; }}>𓊹 Подробнее</button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredTours.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8B5A2B' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏜️</div>
            <h3>По вашему запросу ничего не найдено</h3>
            <button onClick={() => setSearchQuery('')} style={{ marginTop: '20px', padding: '10px 30px', background: '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>Сбросить поиск</button>
          </div>
        )}
      </div>
    </div>
  );
};

export { CatalogToursPage };