import React from "react";

const HotTourPage = () => {
  // Массив с данными о турах
  const tours = [
    {
      country: "Турция",
      city: "Аланья",
      area: "Окурджалар",
      hotelName: "JUSTINIANO DE LUXE RESORT",
      departureCity: "Москвы",
      date: "16/03/2026",
      nights: 7,
      mealType: "Все включено",
      oldPrice: 143470,
      newPrice: 130430,
      discount: 10,
      image: "https://via.placeholder.com/300x180/4B0082/ffffff?text=JUSTINIANO"
    },
    {
      country: "Турция",
      city: "Кемер",
      area: "Бельдиби",
      hotelName: "ROBINSON CLUB KEMER",
      departureCity: "Москвы",
      date: "18/03/2026",
      nights: 7,
      mealType: "Все включено",
      oldPrice: 156890,
      newPrice: 142500,
      discount: 9,
      image: "https://via.placeholder.com/300x180/4B0082/ffffff?text=ROBINSON"
    },
    {
      country: "Египет",
      city: "Шарм-эль-Шейх",
      area: "Наама-Бей",
      hotelName: "RIXOS SHARM EL SHEIKH",
      departureCity: "Москвы",
      date: "15/03/2026",
      nights: 7,
      mealType: "Все включено",
      oldPrice: 167800,
      newPrice: 152990,
      discount: 9,
      image: "https://via.placeholder.com/300x180/4B0082/ffffff?text=RIXOS"
    }
  ];

  // Функция для форматирования цен
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  return (
    <div style={{
      padding: '40px 20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Заголовок страницы */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#333',
          marginBottom: '20px',
          textAlign: 'center',
          position: 'relative'
        }}>
          🔥 Горящие туры
          <span style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '4px',
            backgroundColor: '#ff6b00',
            borderRadius: '2px'
          }}></span>
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: '18px',
          color: '#666',
          marginBottom: '40px'
        }}>
          Специальные предложения с максимальными скидками!
        </p>

        {/* Горизонтальные карточки туров */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {tours.map((tour, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              display: 'flex',
              overflow: 'hidden',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              transition: 'transform 0.3s, box-shadow 0.3s',
              height: '220px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,107,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            }}>
              {/* Левая часть - изображение */}
              <div style={{
                width: '280px',
                height: '100%',
                backgroundColor: '#4B0082',
                position: 'relative',
                backgroundImage: `url(${tour.image})`,
                backgroundSize: 'cover',
                flexShrink: 0
              }}>
                {/* Бейдж Рекомендуем */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#FFD700',
                  color: '#333',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Рекомендуем
                </div>
                
                {/* Бейдж со скидкой */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#ff6b00',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  -{tour.discount}%
                </div>
              </div>

              {/* Правая часть - контент */}
              <div style={{
                padding: '20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Верхняя часть с локацией и названием */}
                <div>
                  <div style={{
                    color: '#666',
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    {tour.country}, {tour.city}, {tour.area}
                  </div>

                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1a1a1a'
                  }}>
                    {tour.hotelName}
                  </h3>
                </div>

                {/* Средняя часть с информацией о туре */}
                <div style={{
                  display: 'flex',
                  gap: '40px',
                  marginBottom: '15px'
                }}>
                  {/* Левая колонка информации */}
                  <div>
                    <div style={{
                      fontSize: '14px',
                      color: '#333',
                      marginBottom: '6px'
                    }}>
                      из {tour.departureCity} {tour.date}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#333',
                      marginBottom: '10px'
                    }}>
                      {tour.nights} ночей • {tour.mealType}
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '14px'
                    }}>
                      <span style={{ color: '#ff6b00', fontWeight: '500' }}>Тур с перелетом</span>
                      <span style={{ color: '#999' }}>Только отель</span>
                    </div>
                  </div>

                  {/* Правая колонка с ценами */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        color: '#999',
                        textDecoration: 'line-through'
                      }}>
                        {formatPrice(tour.oldPrice)}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#1a1a1a'
                    }}>
                      {formatPrice(tour.newPrice)}
                    </div>
                  </div>
                </div>

                {/* Нижняя часть с кнопкой */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 'auto'
                }}>
                  <button style={{
                    backgroundColor: '#ff6b00',
                    color: 'white',
                    border: 'none',
                    padding: '10px 30px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    minWidth: '140px'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e65100'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6b00'}
                    onClick={() => alert(`Вы выбрали тур в ${tour.hotelName}!`)}
                  >
                    Выбрать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительная информация */}
        <div style={{
          marginTop: '50px',
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#333',
            marginBottom: '15px'
          }}>
            🎯 Не нашли подходящий тур?
          </h2>
          <p style={{
            color: '#666',
            marginBottom: '20px',
            fontSize: '16px'
          }}>
            Оставьте заявку, и мы подберем для вас индивидуальное предложение!
          </p>
          <button style={{
            backgroundColor: '#4B0082',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2E1B3F'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4B0082'}
            onClick={() => alert('Спасибо! Скоро мы свяжемся с вами.')}
          >
            Подобрать тур
          </button>
        </div>
      </div>
    </div>
  );
};

export { HotTourPage };