import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { getTours, Tour } from "../Services/ToursApi";
import NavBar from "../Components/NavBar";

const CatalogToursPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [toursData, setToursData] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loadingTour, setLoadingTour] = useState(true);
  const [errorTour, setErrorTour] = useState<string | null>(null);

  // состояния курсов валют
  const [selectedCurrency, setSelectedCurrency] = useState('RUB');
  const [currentRate, setCurrentRate] = useState(1);
  const [signCurrency, setSignCurrency] = useState('₽');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

  // Функция для расчета количества дней
  const calculateNights = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // функция расчета цены в зависимости от курса
  const calculatePrice = (tourPrice: number, currencyRate: number): string => {
    const totalPrice = tourPrice / currencyRate;
    return Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(totalPrice);
  };

  const handleCurrencyChange = async (currency: string, rate: number) => {
    console.log(`Валюта изменена на: ${currency}, курс: ${rate}`);
    switch (currency) {
      case "RUB": setSignCurrency('₽'); break;
      case "USD": setSignCurrency('$'); break;
      case "EUR": setSignCurrency('€'); break;
    }
    setSelectedCurrency(currency);
    setCurrentRate(rate);
  };

  const fetchTours = async () => {
    try {
      setLoadingTour(true);
      const tours = await getTours();
      console.log("Загруженные туры: ", tours);
      setToursData(tours);
      setFilteredTours(tours);
      setErrorTour(null);
    } catch (err) {
      console.error("Ошибка загрузки туров: ", err);
      setErrorTour("Не удалось загрузить туры");
    } finally {
      setLoadingTour(false);
    }
  };

  // Функция фильтрации туров (только поиск по всем полям)
  const filterTours = () => {
    let filtered = [...toursData];

    // ПОИСК ПО ВСЕМ ПОЛЯМ (если есть поисковый запрос)
    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(tour => {
        // Проверяем все возможные поля тура
        const searchableFields = [
          tour.name,
          tour.startDot,
          tour.endDot,
          tour.type,
          tour.description,
          tour.details,
          tour.included,
          tour.separately,
          tour.program
        ].filter(field => field && typeof field === 'string');
        
        return searchableFields.some(field => 
          field.toLowerCase().includes(query)
        );
      });
    }

    setFilteredTours(filtered);
  };

  // Получение параметра поиска из URL при загрузке страницы (из поиска в NavBar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  // Применяем фильтрацию при изменении поискового запроса или данных туров
  useEffect(() => {
    filterTours();
  }, [searchQuery, toursData]);

  // для отображения туров
  useEffect(() => {
    fetchTours();
  }, []);

  // Функция сброса фильтров
  const resetFilters = () => {
    setSearchQuery("");
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loadingTour) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '70px'
      }}>
        <NavBar onCurrencyChange={handleCurrencyChange} />
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>🐪</div>
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.6; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.1); }
              100% { opacity: 0.6; transform: scale(1); }
            }
          `}</style>
          <h2 style={{ color: '#8B5A2B' }}>Загрузка туров...</h2>
        </div>
      </div>
    );
  }

  if (errorTour) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
        minHeight: '100vh',
        padding: '20px',
        paddingTop: '70px'
      }}>
        <NavBar onCurrencyChange={handleCurrencyChange} />
        <div style={{
          maxWidth: '600px',
          margin: '100px auto',
          textAlign: 'center',
          background: 'rgba(255, 248, 240, 0.9)',
          borderRadius: '30px',
          padding: '40px',
          border: '2px solid #C0A080'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ color: '#8B5A2B', marginBottom: '15px' }}>Ошибка загрузки</h2>
          <p style={{ color: '#B76E3C', marginBottom: '25px' }}>{errorTour}</p>
          <button
            onClick={fetchTours}
            style={{
              padding: '12px 30px',
              background: '#C0A080',
              color: '#FFF8F0',
              border: '2px solid #8B5A2B',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#8B5A2B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#C0A080';
            }}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
      minHeight: '100vh',
      padding: '20px',
      paddingTop: '100px'
    }}>
      <NavBar onCurrencyChange={handleCurrencyChange} />

      {/* Фоновые иероглифы */}
      <div style={{ position: 'fixed', top: '10%', left: '2%', fontSize: '40px', opacity: 0.05, pointerEvents: 'none' }}>𓂀</div>
      <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '50px', opacity: 0.05, pointerEvents: 'none' }}>𓊹</div>
      <div style={{ position: 'fixed', top: '30%', right: '5%', fontSize: '35px', opacity: 0.05, pointerEvents: 'none' }}>𓋴</div>

      <div className="container py-4" style={{ position: 'relative', zIndex: 2 }}>
        {/* Заголовок */}
        <div className="text-center mb-4">
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '48px',
            color: '#8B5A2B',
            marginBottom: '10px'
          }}>
            𓊖 Каталог туров
          </h1>
          <p style={{ color: '#B76E3C', fontSize: '18px' }}>
            Найди своё идеальное путешествие 🐪
          </p>
        </div>

        {/* Поле поиска (текстовое, для поиска по всем данным тура) */}
        <div className="mb-4" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
          <div style={{
            display: 'flex',
            gap: '10px',
            background: 'rgba(255, 248, 240, 0.9)',
            borderRadius: '50px',
            padding: '5px',
            border: '2px solid #C0A080'
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '15px',
              fontSize: '20px',
              color: '#B76E3C'
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Поиск по названию, городу, описанию, типу тура..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                flex: 1,
                padding: '12px 10px',
                border: 'none',
                borderRadius: '40px',
                backgroundColor: 'transparent',
                color: '#8B5A2B',
                fontSize: '16px',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#B76E3C',
                  padding: '0 15px',
                  borderRadius: '50%'
                }}
              >
                ✕
              </button>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#B76E3C', textAlign: 'center', marginTop: '8px' }}>
            💡 Можно искать по названию, городу отправления/назначения, типу тура и описанию
          </p>
        </div>

        {/* Результаты поиска */}
        <div className="mb-3">
          <p style={{ color: '#8B5A2B' }}>
            Найдено туров: {filteredTours.length}
          </p>
        </div>

        {/* Сетка туров */}
        <div className="row g-4">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100"
                style={{
                  background: 'rgba(255, 248, 240, 0.9)',
                  border: '2px solid #D2B48C',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  position: 'relative'
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

                <div className="card-body" style={{ padding: '20px' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h3 style={{
                      margin: 0,
                      color: '#8B5A2B',
                      fontSize: '22px',
                      fontFamily: "'Cormorant Garamond', serif"
                    }}>
                      {tour.name}
                    </h3>
                  </div>

                  <p style={{ color: '#8B5A2B', fontSize: '14px', marginBottom: '10px' }}>
                    {tour.details}
                  </p>

                  <div className="d-flex gap-2 mb-2" style={{ color: '#8B5A2B', fontSize: '13px' }}>
                    <span>📍 {tour.startDot} → {tour.endDot}</span>
                    <span>•</span>
                    <span>🏷️ {tour.type}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <span style={{
                        color: '#8B5A2B',
                        fontSize: '24px',
                        fontWeight: '600',
                      }}>
                        {calculatePrice(tour.price, currentRate)} {signCurrency}
                      </span>
                    </div>
                    <span style={{ color: '#B76E3C', fontSize: '14px' }}>
                      {calculateNights(tour.startDot, tour.endDot)} ночей
                    </span>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <Link to={`/catalog/tour/${tour.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <button
                        style={{
                          width: '100%',
                          background: '#C0A080',
                          color: '#FFF8F0',
                          border: '2px solid #8B5A2B',
                          borderRadius: '25px',
                          padding: '8px',
                          fontSize: '14px',
                          transition: 'all 0.3s',
                          cursor: 'pointer'
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
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Если ничего не найдено */}
        {filteredTours.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#8B5A2B'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏜️</div>
            <h3>По вашему запросу ничего не найдено</h3>
            <p>Попробуйте изменить параметры поиска</p>
            <button
              onClick={resetFilters}
              style={{
                marginTop: '20px',
                padding: '10px 30px',
                background: '#C0A080',
                color: '#FFF8F0',
                border: '2px solid #8B5A2B',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              Сбросить поиск
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { CatalogToursPage };