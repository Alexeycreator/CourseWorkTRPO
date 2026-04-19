import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { getTours, Tour } from "../Services/ToursApi";
import NavBar from "../Components/NavBar";

const HotTourPage = () => {
  const location = useLocation();
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

  // Функция для расчета количества дней
  const calculateNights = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Загрузка туров с API
  const fetchTours = async () => {
    try {
      setLoading(true);
      const allTours = await getTours();
      console.log("Загруженные туры: ", allTours);
      
      // Фильтруем только горящие туры (hotTour === true)
      const hotToursData = allTours.filter(tour => tour.hotTour === true);
      setTours(hotToursData);
      setError(null);
    } catch (err: any) {
      console.error("Ошибка загрузки туров:", err);
      
      if (err.code === 'ERR_BAD_REQUEST') {
        setError(err.response?.data?.message || 'Не удалось загрузить горящие туры');
      } else if (err.request) {
        setError('Сервер не отвечает. Проверьте подключение');
      } else {
        setError('Ошибка при загрузке данных');
      }
    } finally {
      setLoading(false);
    }
  };

  // Получение параметра поиска из URL при загрузке страницы
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  useEffect(() => {
    fetchTours();
  }, []);

  // Функция для форматирования цен
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  // Функция для расчета скидки
  const calculateDiscount = (price: number, oldPrice?: number): number => {
    if (oldPrice && oldPrice > price) {
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    }
    // Если нет oldPrice, генерируем случайную скидку для демонстрации
    return Math.floor(Math.random() * 20) + 10;
  };

  // Функция фильтрации туров (только поиск по всем полям)
  const filterToursBySearch = (toursList: Tour[]): Tour[] => {
    if (!searchQuery.trim()) return toursList;
    
    const query = searchQuery.toLowerCase().trim();
    return toursList.filter(tour => {
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
  };

  // Фильтрация и сортировка туров
  const getFilteredAndSortedTours = () => {
    // Сначала фильтруем по поиску
    let filtered = filterToursBySearch(tours);
    
    // Затем сортируем
    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      filtered = [...filtered].sort((a, b) => {
        const discountA = calculateDiscount(a.price);
        const discountB = calculateDiscount(b.price);
        return discountB - discountA;
      });
    }
    
    return filtered;
  };

  const filteredAndSortedTours = getFilteredAndSortedTours();

  // Функция сброса поиска
  const resetSearch = () => {
    setSearchQuery('');
  };

  // Определяем, нужно ли показывать сообщение "нет горящих туров"
  const hasNoHotTours = tours.length === 0 && !loading && !error;
  
  // Определяем, нужно ли показывать сообщение "ничего не найдено"
  const hasNoSearchResults = tours.length > 0 && filteredAndSortedTours.length === 0 && !loading && !error;

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
        minHeight: '100vh',
        padding: '20px',
        paddingTop: '70px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <NavBar />
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>🐪</div>
          <style>{`
            @keyframes pulse {
              0% { opacity: 0.6; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.1); }
              100% { opacity: 0.6; transform: scale(1); }
            }
          `}</style>
          <h2 style={{ color: '#8B5A2B' }}>Загрузка горящих туров...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
        minHeight: '100vh',
        padding: '20px',
        paddingTop: '70px'
      }}>
        <NavBar />
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
          <p style={{ color: '#B76E3C', marginBottom: '25px' }}>{error}</p>
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
      paddingTop: '70px'
    }}>
      <NavBar />
      
      {/* Фоновые иероглифы */}
      <div style={{ position: 'fixed', top: '10%', left: '2%', fontSize: '40px', opacity: 0.05, pointerEvents: 'none' }}>𓂀</div>
      <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '50px', opacity: 0.05, pointerEvents: 'none' }}>𓊹</div>
      <div style={{ position: 'fixed', top: '30%', right: '5%', fontSize: '35px', opacity: 0.05, pointerEvents: 'none' }}>𓋴</div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Заголовок страницы */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '48px',
            color: '#8B5A2B',
            marginBottom: '10px',
            position: 'relative'
          }}>
            🔥 Горящие туры
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#B76E3C',
            marginBottom: '20px'
          }}>
            Специальные предложения с максимальными скидками! 🐪
          </p>
          
          <div style={{
            width: '150px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #C0A080, transparent)',
            margin: '0 auto'
          }}></div>
        </div>

        {/* Поиск и сортировка */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1', maxWidth: '400px' }}>
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
                placeholder="Поиск по горящим турам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  onClick={resetSearch}
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
            <p style={{ fontSize: '12px', color: '#B76E3C', marginTop: '8px', paddingLeft: '15px' }}>
              💡 Можно искать по названию, городу, типу тура и описанию
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: '#8B5A2B', fontSize: '16px' }}>𓊹 Сортировать:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 20px',
                border: '2px solid #C0A080',
                borderRadius: '25px',
                backgroundColor: '#FFF8F0',
                color: '#8B5A2B',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="discount">По размеру скидки</option>
            </select>
          </div>
        </div>

        {/* Результаты поиска */}
        {!hasNoHotTours && !hasNoSearchResults && (
          <div style={{ marginBottom: '20px', color: '#8B5A2B' }}>
            Найдено туров: {filteredAndSortedTours.length}
          </div>
        )}

        {/* Сетка горящих туров */}
        {!hasNoHotTours && !hasNoSearchResults && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
          }}>
            {filteredAndSortedTours.map((tour) => {
              const discount = calculateDiscount(tour.price);
              const oldPrice = Math.round(tour.price / (1 - discount / 100));
              
              return (
                <div
                  key={tour.id}
                  style={{
                    background: 'rgba(255, 248, 240, 0.9)',
                    border: '2px solid #D2B48C',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(183, 110, 60, 0.2)';
                    e.currentTarget.style.borderColor = '#B76E3C';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#D2B48C';
                  }}
                >
                  {/* Бейдж "Горящий тур" */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    background: '#B76E3C',
                    color: '#FFF8F0',
                    padding: '8px 15px',
                    borderRadius: '30px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 4px 10px rgba(183, 110, 60, 0.3)'
                  }}>
                    <span style={{ fontSize: '18px' }}>🔥</span>
                    <span>Горящий тур</span>
                  </div>

                  {/* Бейдж со скидкой */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: '#8B5A2B',
                    color: '#FFD700',
                    padding: '8px 15px',
                    borderRadius: '30px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    zIndex: 2,
                    boxShadow: '0 4px 10px rgba(139, 69, 19, 0.3)'
                  }}>
                    -{discount}%
                  </div>

                  {/* Изображение тура */}
                  <div style={{
                    height: '200px',
                    overflow: 'hidden',
                    position: 'relative',
                    borderBottom: '2px solid #D2B48C'
                  }}>
                    <Link to={`/tour/${tour.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                      <img
                        src={`${API_URL}/${tour.imageTour}`}
                        alt={tour.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </Link>
                  </div>

                  {/* Информация о туре */}
                  <div style={{
                    padding: '20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{
                      color: '#8B5A2B',
                      fontSize: '14px',
                      marginBottom: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span>📍</span>
                      <span>{tour.startDot} → {tour.endDot}</span>
                    </div>

                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#8B5A2B',
                      fontFamily: "'Cormorant Garamond', serif"
                    }}>
                      <Link to={`/tour/${tour.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {tour.name}
                      </Link>
                    </h3>

                    <p style={{
                      color: '#B76E3C',
                      fontSize: '14px',
                      marginBottom: '10px',
                      fontStyle: 'italic'
                    }}>
                      {tour.description || tour.details}
                    </p>

                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginBottom: '15px',
                      fontSize: '13px',
                      color: '#8B5A2B'
                    }}>
                      <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>
                        🏷️ {tour.type}
                      </span>
                      <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>
                        🌙 {calculateNights(tour.startDot, tour.endDot)} ночей
                      </span>
                    </div>

                    {/* Цены */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      marginTop: 'auto'
                    }}>
                      <div>
                        <span style={{
                          fontSize: '16px',
                          color: '#B76E3C',
                          textDecoration: 'line-through',
                          marginRight: '10px'
                        }}>
                          {formatPrice(oldPrice)}
                        </span>
                        <span style={{
                          fontSize: '28px',
                          fontWeight: '700',
                          color: '#8B5A2B'
                        }}>
                          {formatPrice(tour.price)}
                        </span>
                      </div>
                    </div>

                    {/* Кнопка подробнее */}
                    <Link to={`/tour/${tour.id}`} style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          marginTop: '15px',
                          background: '#C0A080',
                          color: '#FFF8F0',
                          border: '2px solid #8B5A2B',
                          borderRadius: '30px',
                          padding: '12px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          width: '100%'
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
              );
            })}
          </div>
        )}

        {/* Сообщение "По вашему запросу ничего не найдено" (есть горящие туры, но не подходят под поиск) */}
        {hasNoSearchResults && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#8B5A2B'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏜️</div>
            <h3>По вашему запросу ничего не найдено</h3>
            <p>Попробуйте изменить параметры поиска</p>
            <button
              onClick={resetSearch}
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

        {/* Сообщение "Нет горящих туров" (нет ни одного горящего тура на сервере) */}
        {hasNoHotTours && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#8B5A2B'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏜️</div>
            <h3>На данный момент горящих туров нет</h3>
            <p>Загляните позже — новые предложения появляются регулярно!</p>
            <Link to="/catalog">
              <button
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
                Посмотреть все туры
              </button>
            </Link>
          </div>
        )}

        {/* Дополнительная информация (показывается всегда, кроме случаев ошибки) */}
        {!error && (
          <div style={{
            marginTop: '60px',
            padding: '40px',
            background: 'rgba(255, 248, 240, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '2px solid #C0A080',
            borderRadius: '30px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              fontSize: '80px',
              opacity: 0.1,
              transform: 'rotate(-15deg)'
            }}>🐪</div>
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-20px',
              fontSize: '80px',
              opacity: 0.1,
              transform: 'rotate(15deg)'
            }}>🏜️</div>

            <h2 style={{
              fontSize: '32px',
              color: '#8B5A2B',
              marginBottom: '15px',
              fontFamily: "'Cormorant Garamond', serif"
            }}>
              🎯 Не нашли подходящий горящий тур?
            </h2>
            
            <p style={{
              color: '#B76E3C',
              marginBottom: '25px',
              fontSize: '18px',
              maxWidth: '600px',
              margin: '0 auto 25px'
            }}>
              Оставьте заявку, и мы подберем для вас индивидуальное предложение со скидкой!
            </p>
            
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <input
                type="email"
                placeholder="Ваш email"
                style={{
                  padding: '12px 25px',
                  border: '2px solid #C0A080',
                  borderRadius: '30px',
                  width: '300px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: '#FFF8F0',
                  color: '#8B5A2B'
                }}
              />
              <button
                onClick={() => alert('Спасибо! Скоро мы свяжемся с вами.')}
                style={{
                  background: '#B76E3C',
                  color: '#FFF8F0',
                  border: '2px solid #8B5A2B',
                  borderRadius: '30px',
                  padding: '12px 40px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8B5A2B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#B76E3C';
                }}
              >
                𓊹 Подобрать тур
              </button>
            </div>
          </div>
        )}

        {/* Статистика (показывается, если есть горящие туры) */}
        {!hasNoHotTours && !error && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(255, 248, 240, 0.5)',
            borderRadius: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', color: '#8B5A2B' }}>{tours.length}</div>
              <div style={{ color: '#B76E3C', fontSize: '14px' }}>Горящих туров</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', color: '#8B5A2B' }}>🔥</div>
              <div style={{ color: '#B76E3C', fontSize: '14px' }}>Скидка до 30%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', color: '#8B5A2B' }}>🐪</div>
              <div style={{ color: '#B76E3C', fontSize: '14px' }}>Лучшие предложения</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { HotTourPage };