import React, { useState } from "react";
import maldivImage from '../Images/Maldiv.jpg';
import italiaImage from '../Images/Italia.jpeg';
import baliImage from '../Images/Bali.jpg';

// Дополнительные изображения для новых туров (используем заглушки, если нет файлов)
const placeholderImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300";

const HotTourPage = () => {
  const [sortBy, setSortBy] = useState('default');

  // Массив с данными о горящих турах (все, у которых hot = true)
  const hotTours = [
    {
      id: 1,
      country: "Мальдивы",
      city: "Мале",
      area: "Северный Мале",
      hotelName: "Conrad Maldives Rangali",
      departureCity: "Москвы",
      date: "18/03/2026",
      nights: 7,
      mealType: "Завтраки",
      oldPrice: 220000,
      newPrice: 180000,
      discount: 18,
      image: maldivImage,
      rating: 4.8,
      type: "Пляжный",
      description: "Райский отдых на белоснежных пляжах"
    },
    {
      id: 2,
      country: "Индонезия",
      city: "Денпасар",
      area: "Убуд",
      hotelName: "Four Seasons Resort Bali",
      departureCity: "Москвы",
      date: "20/03/2026",
      nights: 10,
      mealType: "Завтраки",
      oldPrice: 150000,
      newPrice: 120000,
      discount: 20,
      image: baliImage,
      rating: 4.9,
      type: "Оздоровительный",
      description: "Йога-тур и духовные практики"
    },
    {
      id: 3,
      country: "Египет",
      city: "Каир",
      area: "Гиза",
      hotelName: "Four Seasons Cairo",
      departureCity: "Москвы",
      date: "15/03/2026",
      nights: 8,
      mealType: "Все включено",
      oldPrice: 110000,
      newPrice: 85000,
      discount: 23,
      image: placeholderImage,
      rating: 4.6,
      type: "Пляжный",
      description: "Тайны пирамид и отдых на Красном море"
    },
    {
      id: 4,
      country: "Турция",
      city: "Анталья",
      area: "Кемер",
      hotelName: "Rixos Sungate",
      departureCity: "Москвы",
      date: "16/03/2026",
      nights: 7,
      mealType: "Все включено",
      oldPrice: 90000,
      newPrice: 65000,
      discount: 28,
      image: placeholderImage,
      rating: 4.5,
      type: "Пляжный",
      description: "Всё включено для всей семьи"
    },
    {
      id: 5,
      country: "Таиланд",
      city: "Бангкок",
      area: "Пхукет",
      hotelName: "Banyan Tree Phuket",
      departureCity: "Москвы",
      date: "22/03/2026",
      nights: 10,
      mealType: "Завтраки",
      oldPrice: 170000,
      newPrice: 135000,
      discount: 21,
      image: placeholderImage,
      rating: 4.7,
      type: "Экзотический",
      description: "Экзотика и джунгли"
    },
    {
      id: 6,
      country: "ОАЭ",
      city: "Дубай",
      area: "Jumeirah",
      hotelName: "Burj Al Arab",
      departureCity: "Москвы",
      date: "25/03/2026",
      nights: 6,
      mealType: "Завтраки",
      oldPrice: 190000,
      newPrice: 155000,
      discount: 18,
      image: placeholderImage,
      rating: 4.9,
      type: "Шопинг",
      description: "Роскошь и небоскрёбы"
    },
    {
      id: 7,
      country: "Греция",
      city: "Афины",
      area: "Санторини",
      hotelName: "Canaves Oia Suites",
      departureCity: "Москвы",
      date: "28/03/2026",
      nights: 7,
      mealType: "Завтраки",
      oldPrice: 145000,
      newPrice: 115000,
      discount: 21,
      image: placeholderImage,
      rating: 4.8,
      type: "Экскурсионный",
      description: "Острова и античная культура"
    }
  ];

  // Функция для форматирования цен
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  // Сортировка туров
  const sortedTours = [...hotTours].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.newPrice - b.newPrice;
    } else if (sortBy === 'price-desc') {
      return b.newPrice - a.newPrice;
    } else if (sortBy === 'discount') {
      return b.discount - a.discount;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
      minHeight: '100vh',
      padding: '20px',
      paddingTop: '70px'
    }}>
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
          
          {/* Декоративная линия */}
          <div style={{
            width: '150px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #C0A080, transparent)',
            margin: '0 auto'
          }}></div>
        </div>

        {/* Панель сортировки */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '30px',
          gap: '15px'
        }}>
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
            <option value="rating">По рейтингу</option>
          </select>
        </div>

        {/* Сетка горящих туров */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          {sortedTours.map((tour) => (
            <div
              key={tour.id}
              style={{
                background: 'rgba(255, 248, 240, 0.9)',
                border: '2px solid #D2B48C',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                height: '480px',
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
                -{tour.discount}%
              </div>

              {/* Изображение */}
              <div style={{
                height: '200px',
                overflow: 'hidden',
                position: 'relative',
                borderBottom: '2px solid #D2B48C'
              }}>
                <img
                  src={tour.image}
                  alt={tour.hotelName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                
                {/* Рейтинг на изображении */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#FFD700',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>⭐</span>
                  <span>{tour.rating}</span>
                </div>
              </div>

              {/* Контент */}
              <div style={{
                padding: '20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Локация */}
                <div style={{
                  color: '#8B5A2B',
                  fontSize: '14px',
                  marginBottom: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span>📍</span>
                  <span>{tour.country}, {tour.city}, {tour.area}</span>
                </div>

                {/* Название отеля */}
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#8B5A2B',
                  fontFamily: "'Cormorant Garamond', serif"
                }}>
                  {tour.hotelName}
                </h3>

                {/* Описание */}
                <p style={{
                  color: '#B76E3C',
                  fontSize: '14px',
                  marginBottom: '10px',
                  fontStyle: 'italic'
                }}>
                  {tour.description}
                </p>

                {/* Детали тура */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginBottom: '15px',
                  fontSize: '13px',
                  color: '#8B5A2B'
                }}>
                  <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>
                    ✈️ из {tour.departureCity}
                  </span>
                  <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>
                    📅 {tour.date}
                  </span>
                  <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>
                    🌙 {tour.nights} ночей
                  </span>
                  <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>
                    🍽️ {tour.mealType}
                  </span>
                  <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>
                    🏷️ {tour.type}
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
                      {formatPrice(tour.oldPrice)}
                    </span>
                    <span style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#8B5A2B'
                    }}>
                      {formatPrice(tour.newPrice)}
                    </span>
                  </div>
                </div>

                {/* Кнопка */}
                <button
                  onClick={() => alert(`Вы выбрали тур в ${tour.hotelName}!`)}
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
                  𓊹 Выбрать тур
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительная информация */}
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
          {/* Декоративные элементы */}
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

        {/* Статистика */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(255, 248, 240, 0.5)',
          borderRadius: '20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', color: '#8B5A2B' }}>7</div>
            <div style={{ color: '#B76E3C', fontSize: '14px' }}>Горящих туров</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', color: '#8B5A2B' }}>🔥</div>
            <div style={{ color: '#B76E3C', fontSize: '14px' }}>Скидка до 28%</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', color: '#8B5A2B' }}>🐪</div>
            <div style={{ color: '#B76E3C', fontSize: '14px' }}>7 стран</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HotTourPage };