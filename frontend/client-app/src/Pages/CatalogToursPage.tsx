import React, { useState, FormEvent, useRef, useEffect } from "react";
import { Link } from 'react-router-dom'; // Добавляем импорт Link
import { getAddresses } from "../Services/AddressApi";
import { getTours, Tour } from "../Services/ToursApi";
import NavBar from "../Components/NavBar";

const CatalogToursPage = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [nights, setNights] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");

  // api сервера
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

  // состояния городов
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loadingCity, setLoadingCity] = useState(true);
  const [errorCity, setErrorCity] = useState<string | null>(null);

  // состояния туров
  const [toursData, setToursData] = useState<Tour[]>([]);
  const [loadingTour, setLoadingTour] = useState(true);
  const [errorTour, setErrorTour] = useState<string | null>(null);

  // состояния курсов валют
  const [selectedCurrency, setSelectedCurrency] = useState('RUB');
  const [currentRate, setCurrentRate] = useState(1);
  const [signCurrency, setSignCurrency] = useState('₽');

  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);

  const [guestSelectorPosition, setGuestSelectorPosition] = useState({ top: 0, left: 0, width: 0 });
  const [dateSelectorPosition, setDateSelectorPosition] = useState({ top: 0, left: 0, width: 0 });

  const guestSelectorRef = useRef<HTMLDivElement>(null);
  const guestDisplayRef = useRef<HTMLDivElement>(null);
  const dateSelectorRef = useRef<HTMLDivElement>(null);
  const dateDisplayRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // для формирования даты
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedToday = `${day}.${month}.${year}`;

  // Функция для расчета количества дней
  const calculateNights = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Разница в миллисекундах
    const diffTime = Math.abs(end.getTime() - start.getTime());

    // Конвертируем в дни (1 день = 24 * 60 * 60 * 1000 мс)
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
  }

  const handleCurrencyChange = async (currency: string, rate: number) => {
    console.log(`Валюта изменена на: ${currency}, курс: ${rate}`);
    switch (currency) {
      case "RUB": setSignCurrency('₽');
        break;
      case "USD": setSignCurrency('$');
        break;
      case "EUR": setSignCurrency('€');
        break;
    }
    setSelectedCurrency(currency);
    setCurrentRate(rate);
  };

  const fetchCities = async () => {
    try {
      setLoadingCity(true);
      const addresses = await getAddresses();

      const cities = addresses
        .map(addr => addr.city)
        .filter((city, index, self) =>
          city && self.indexOf(city) === index
        )
        .sort();

      setCityOptions(cities);
      setErrorCity(null);
    } catch (err) {
      console.error("Ошибка загрузки городов:", err);
      setErrorCity("Не удалось загрузить список городов");
    } finally {
      setLoadingCity(false);
    }
  };

  const fetchTours = async () => {
    try {
      setLoadingTour(true);
      const tours = await getTours();

      console.log("Загруженные туры: ", tours);
      setToursData(tours)
      setErrorTour(null);
    }
    catch (err) {
      console.error("Ошибка загрузки туров: ", err);
      setErrorTour("Не удалось загрузить туры");
    }
    finally {
      setLoadingTour(false);
    }
  };

  // для выбора городов
  useEffect(() => {
    fetchCities();
  }, []);

  // для отображения туров
  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestSelectorRef.current &&
        !guestSelectorRef.current.contains(event.target as Node) &&
        guestDisplayRef.current &&
        !guestDisplayRef.current.contains(event.target as Node)
      ) {
        setIsGuestSelectorOpen(false);
      }
      if (
        dateSelectorRef.current &&
        !dateSelectorRef.current.contains(event.target as Node) &&
        dateDisplayRef.current &&
        !dateDisplayRef.current.contains(event.target as Node)
      ) {
        setIsDateSelectorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateGuestSelectorPosition = () => {
    if (guestDisplayRef.current && formRef.current) {
      const displayRect = guestDisplayRef.current.getBoundingClientRect();
      const formRect = formRef.current.getBoundingClientRect();
      setGuestSelectorPosition({
        top: displayRect.bottom - formRect.top,
        left: displayRect.left - formRect.left - 50,
        width: displayRect.width + 100,
      });
    }
  };

  const updateDateSelectorPosition = () => {
    if (dateDisplayRef.current && formRef.current) {
      const displayRect = dateDisplayRef.current.getBoundingClientRect();
      const formRect = formRef.current.getBoundingClientRect();
      setDateSelectorPosition({
        top: displayRect.bottom - formRect.top,
        left: displayRect.left - formRect.left - 50,
        width: displayRect.width + 100,
      });
    }
  };

  useEffect(() => {
    if (isGuestSelectorOpen) {
      updateGuestSelectorPosition();
      const handleResizeOrScroll = () => updateGuestSelectorPosition();
      window.addEventListener('resize', handleResizeOrScroll);
      window.addEventListener('scroll', handleResizeOrScroll, true);
      return () => {
        window.removeEventListener('resize', handleResizeOrScroll);
        window.removeEventListener('scroll', handleResizeOrScroll, true);
      };
    }
  }, [isGuestSelectorOpen]);

  useEffect(() => {
    if (isDateSelectorOpen) {
      updateDateSelectorPosition();
      const handleResizeOrScroll = () => updateDateSelectorPosition();
      window.addEventListener('resize', handleResizeOrScroll);
      window.addEventListener('scroll', handleResizeOrScroll, true);
      return () => {
        window.removeEventListener('resize', handleResizeOrScroll);
        window.removeEventListener('scroll', handleResizeOrScroll, true);
      };
    }
  }, [isDateSelectorOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { departure, destination, startDate, endDate, adults, children, nights };
    console.log("Данные для тура:", formData);
  };

  const getGuestsDisplayText = () => {
    const parts = [];
    parts.push(`${adults} ${adults === 1 ? 'взрослый' : 'взрослых'}`);
    if (children > 0) {
      parts.push(`${children} ${children === 1 ? 'ребенок' : 'детей'}`);
    }
    return parts.join(', ');
  };

  const getDatesDisplayText = () => {
    if (startDate && endDate) {
      const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
      };
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return "Выберите даты";
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (endDate && newStart > endDate) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    if (startDate && newEnd < startDate) {
      return;
    }
    setEndDate(newEnd);
  };

  const handleApplyDates = () => {
    if (startDate && endDate) {
      setIsDateSelectorOpen(false);
    } else {
      alert("Пожалуйста, выберите обе даты");
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
      minHeight: '100vh',
      padding: '20px',
      paddingTop: '70px'
    }}>
      {/* Для получения курсов в зависимости от выбора в селекторе */}
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

        {/* Форма поиска и фильтров */}
        <div className="mb-5">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{
              background: 'rgba(245, 240, 230, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '2px solid #C0A080',
              borderRadius: '50px',
              padding: '25px',
              boxShadow: '0 10px 30px rgba(139, 69, 19, 0.1)'
            }}
          >
            <div className="d-flex flex-wrap gap-3 align-items-end">
              {/* Откуда */}
              <div style={{ minWidth: "160px" }} className="flex-grow-1">
                <small style={{ color: '#8B5A2B', marginBottom: '5px', display: 'block' }}>Откуда</small>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  list="cities"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  placeholder="Город вылета..."
                  style={{
                    border: '2px solid #D2B48C',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B'
                  }}
                />
              </div>

              {/* Куда */}
              <div style={{ minWidth: "160px" }} className="flex-grow-1">
                <small style={{ color: '#8B5A2B', marginBottom: '5px', display: 'block' }}>Куда</small>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  list="cities"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Город назначения..."
                  style={{
                    border: '2px solid #D2B48C',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B'
                  }}
                />
              </div>

              <datalist id="cities">
                {cityOptions.map(city => <option key={city} value={city} />)}
              </datalist>

              {/* Даты */}
              <div style={{ minWidth: "200px" }} className="flex-grow-1">
                <small style={{ color: '#8B5A2B', marginBottom: '5px', display: 'block' }}>Даты</small>
                <div
                  ref={dateDisplayRef}
                  className="form-control rounded-pill d-flex align-items-center justify-content-between"
                  onClick={() => {
                    updateDateSelectorPosition();
                    setIsDateSelectorOpen(!isDateSelectorOpen);
                    if (isGuestSelectorOpen) setIsGuestSelectorOpen(false);
                  }}
                  style={{
                    cursor: 'pointer',
                    border: '2px solid #D2B48C',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    pointerEvents: 'none'
                  }}
                >
                  <span>{getDatesDisplayText()}</span>
                  <span style={{ color: '#B76E3C' }}>▼</span>
                </div>
              </div>

              {/* Туристы */}
              <div style={{ minWidth: "200px" }} className="flex-grow-1">
                <small style={{ color: '#8B5A2B', marginBottom: '5px', display: 'block' }}>Туристы</small>
                <div
                  ref={guestDisplayRef}
                  className="form-control rounded-pill d-flex align-items-center justify-content-between"
                  onClick={() => {
                    updateGuestSelectorPosition();
                    setIsGuestSelectorOpen(!isGuestSelectorOpen);
                    if (isDateSelectorOpen) setIsDateSelectorOpen(false);
                  }}
                  style={{
                    cursor: 'pointer',
                    border: '2px solid #D2B48C',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B',
                    pointerEvents: 'none'
                  }}
                >
                  <span>{getGuestsDisplayText()}</span>
                  <span style={{ color: '#B76E3C' }}>▼</span>
                </div>
              </div>

              {/* Ночей */}
              <div style={{ minWidth: "25px", maxWidth: '75px'}} className="flex-grow-1">
                <small style={{ color: '#8B5A2B', marginBottom: '5px', display: 'block' }}>Ночей</small>
                <input
                  type="number"
                  className="form-control rounded-pill"
                  min="1"
                  value={nights}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setNights(val >= 1 ? val : 1);
                  }}
                  style={{
                    border: '2px solid #D2B48C',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B'
                  }}
                />
              </div>
              {/* Кнопка */}
              <div style={{
                minWidth: "140px",
                paddingTop: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <button
                  type="submit"
                  style={{
                    background: '#C0A080',
                    color: '#FFF8F0',
                    border: '2px solid #8B5A2B',
                    borderRadius: '30px',
                    padding: '10px 25px',
                    width: 'auto',
                    fontWeight: '500',
                    transition: 'all 0.3s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8B5A2B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#C0A080';
                  }}
                >
                  Подобрать тур
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Строка поиска по турам */}
        <div className="mb-4">
          <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="🐪 Поиск по странам, городам, описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: '2px solid #C0A080',
                backgroundColor: '#FFF8F0',
                color: '#8B5A2B',
                padding: '12px 20px',
                fontSize: '16px'
              }}
            />
            <span style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#B76E3C',
              fontSize: '20px'
            }}>
              🔍
            </span>
          </div>
        </div>

        {/* Результаты поиска */}
        <div className="mb-3">
          <p style={{ color: '#8B5A2B' }}>
            Найдено туров: {toursData.length}
          </p>
        </div>

        {/* Сетка туров */}
        <div className="row g-4">
          {toursData.map((tour) => (
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
                {/* Бейдж "Горящий тур" */}
                {/* {tour.hot && (
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
                )} */}

                {/* Бейдж со скидкой */}
                {/* {tour.oldPrice && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#8B5A2B',
                    color: '#FFD700',
                    padding: '5px 15px',
                    borderRadius: '25px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 2
                  }}>
                    -{Math.round((1 - tour.price / tour.oldPrice) * 100)}%
                  </div>
                )} */}

                <img
                  src={`${API_URL}/${tour.imageTour}`}
                  alt={tour.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderBottom: '2px solid #D2B48C'
                  }} />

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
                    {/* <div style={{ color: '#B76E3C' }}>
                      <span>⭐</span> {tour.rating}
                    </div> */}
                  </div>

                  <p style={{ color: '#8B5A2B', fontSize: '14px', marginBottom: '10px' }}>
                    {tour.details}
                  </p>

                  <div className="d-flex gap-2 mb-2" style={{ color: '#8B5A2B', fontSize: '13px' }}>
                    {/* <span>📍 {tour.country}</span>
                    <span>•</span>
                    <span>🏙️ {tour.city}</span>
                    <span>•</span>
                    <span>🗺️ {tour.type}</span> */}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      {/* {tour.oldPrice && (
                        <span style={{
                          color: '#B76E3C',
                          fontSize: '14px',
                          textDecoration: 'line-through',
                          marginRight: '10px'
                        }}>
                          {formatPrice(tour.oldPrice)}
                        </span>
                      )} */}
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
                    <Link to={`/tour/${tour.id}`} style={{ flex: 1, textDecoration: 'none' }}>
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
                    <button
                      style={{
                        background: 'transparent',
                        color: '#8B5A2B',
                        border: '2px solid #C0A080',
                        borderRadius: '25px',
                        padding: '8px 15px',
                        fontSize: '14px',
                        transition: 'all 0.3s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(192, 160, 128, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      💚 В избранное
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Если ничего не найдено */}
        {toursData.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#8B5A2B'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏜️</div>
            <h3>По вашему запросу ничего не найдено</h3>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        )}

        {/* Выпадающий блок выбора туристов */}
        {isGuestSelectorOpen && (
          <div
            ref={guestSelectorRef}
            style={{
              position: 'absolute',
              zIndex: 1000,
              top: guestSelectorPosition.top,
              left: guestSelectorPosition.left,
              width: guestSelectorPosition.width,
              background: '#FFF8F0',
              border: '2px solid #C0A080',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(139, 69, 19, 0.1)'
            }}
          >
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ color: '#8B5A2B' }}>Взрослые</span>
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '2px solid #C0A080',
                      background: 'transparent',
                      color: '#8B5A2B',
                      cursor: 'pointer'
                    }}
                  >
                    −
                  </button>
                  <span style={{ margin: '0 15px', minWidth: '20px', textAlign: 'center', color: '#8B5A2B' }}>
                    {adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdults(prev => prev + 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '2px solid #C0A080',
                      background: 'transparent',
                      color: '#8B5A2B',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ color: '#8B5A2B' }}>Дети</span>
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '2px solid #C0A080',
                      background: 'transparent',
                      color: '#8B5A2B',
                      cursor: 'pointer'
                    }}
                  >
                    −
                  </button>
                  <span style={{ margin: '0 15px', minWidth: '20px', textAlign: 'center', color: '#8B5A2B' }}>
                    {children}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChildren(prev => prev + 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '2px solid #C0A080',
                      background: 'transparent',
                      color: '#8B5A2B',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsGuestSelectorOpen(false)}
              style={{
                width: '100%',
                padding: '10px',
                background: '#C0A080',
                color: '#FFF8F0',
                border: '2px solid #8B5A2B',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              Готово
            </button>
          </div>
        )}

        {/* Выпадающий блок выбора дат */}
        {isDateSelectorOpen && (
          <div
            ref={dateSelectorRef}
            style={{
              position: 'absolute',
              zIndex: 1000,
              top: dateSelectorPosition.top,
              left: dateSelectorPosition.left,
              width: dateSelectorPosition.width,
              background: '#FFF8F0',
              border: '2px solid #C0A080',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(139, 69, 19, 0.1)'
            }}
          >
            <div className="mb-3">
              <div className="mb-2">
                <label style={{ color: '#8B5A2B', marginBottom: '5px', display: 'block' }}>С:</label>
                <input
                  type="date"
                  className="form-control rounded-pill"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={formattedToday}
                  style={{
                    border: '2px solid #D2B48C',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B'
                  }}
                />
              </div>
              <div>
                <label style={{ color: '#8B5A2B', marginBottom: '5px', display: 'block' }}>По:</label>
                <input
                  type="date"
                  className="form-control rounded-pill"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={startDate || formattedToday}
                  style={{
                    border: '2px solid #D2B48C',
                    backgroundColor: '#FFF8F0',
                    color: '#8B5A2B'
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplyDates}
              style={{
                width: '100%',
                padding: '10px',
                background: '#C0A080',
                color: '#FFF8F0',
                border: '2px solid #8B5A2B',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              Применить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { CatalogToursPage };