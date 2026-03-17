import React from "react";

const HelpPage = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: "'Montserrat', 'Arial', sans-serif",
      position: 'relative',
      paddingTop: '70px'
    }}>
      {/* Фоновые декоративные элементы */}
      <div style={{ position: 'fixed', top: '5%', left: '2%', fontSize: '60px', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(-10deg)' }}>𓂀</div>
      <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '80px', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(15deg)' }}>𓊹</div>
      <div style={{ position: 'fixed', top: '20%', right: '8%', fontSize: '50px', opacity: 0.05, pointerEvents: 'none' }}>𓋴</div>
      <div style={{ position: 'fixed', bottom: '15%', left: '5%', fontSize: '70px', opacity: 0.05, pointerEvents: 'none', transform: 'rotate(-5deg)' }}>🏜️</div>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Заголовок страницы */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '52px',
            color: '#8B5A2B',
            marginBottom: '15px',
            position: 'relative',
            display: 'inline-block'
          }}>
            🐪 Центр помощи
          </h1>
          <div style={{
            width: '150px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #C0A080, #B76E3C, #C0A080, transparent)',
            margin: '0 auto'
          }}></div>
          <p style={{
            fontSize: '18px',
            color: '#B76E3C',
            marginTop: '15px'
          }}>
            Мы всегда рядом, чтобы сделать ваше путешествие идеальным
          </p>
        </div>

        {/* Основной контент */}
        <div style={{
          background: 'rgba(255, 248, 240, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '40px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(139, 69, 19, 0.15)',
          border: '2px solid #C0A080',
          marginBottom: '30px'
        }}>
          
          {/* Контакты */}
          <section style={{ marginBottom: '50px' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '36px',
              color: '#8B5A2B',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              borderBottom: '2px solid #D2B48C',
              paddingBottom: '10px'
            }}>
              <span style={{ fontSize: '40px' }}>𓊹</span>
              Свяжитесь с нами
            </h2>
            
            <div style={{
              background: 'rgba(210, 180, 140, 0.2)',
              borderRadius: '30px',
              padding: '30px',
              textAlign: 'center',
              marginBottom: '30px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px', color: '#B76E3C' }}>📞</div>
              <p style={{
                fontSize: '24px',
                color: '#8B5A2B',
                fontFamily: "'Cormorant Garamond', serif",
                marginBottom: '15px'
              }}>
                Если возникли проблемы, вы можете обратиться в Telegram:
              </p>
              <div style={{
                display: 'inline-block',
                background: '#FFF8F0',
                border: '3px solid #B76E3C',
                borderRadius: '50px',
                padding: '15px 40px',
                margin: '10px 0'
              }}>
                <span style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#8B5A2B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '32px' }}>📱</span>
                  @valera_V14
                </span>
              </div>
              <p style={{
                color: '#B76E3C',
                marginTop: '15px',
                fontSize: '16px'
              }}>
                Оператор онлайн с 7:00 до 23:00 по московскому времени
              </p>
            </div>
          </section>

          {/* Быстрая помощь */}
          <section style={{ marginBottom: '50px' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '36px',
              color: '#8B5A2B',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              borderBottom: '2px solid #D2B48C',
              paddingBottom: '10px'
            }}>
              <span style={{ fontSize: '40px' }}>𓋴</span>
              Быстрая помощь
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {[
                {
                  icon: '✈️',
                  title: 'Изменение дат тура',
                  desc: 'Хотите перенести путешествие? Мы поможем изменить даты без лишних комиссий.'
                },
                {
                  icon: '🏨',
                  title: 'Проблемы с отелем',
                  desc: 'Не понравился номер? Свяжитесь с нами, и мы решим вопрос с администрацией отеля.'
                },
                {
                  icon: '🎫',
                  title: 'Возврат билетов',
                  desc: 'Не можете лететь? Расскажем, как оформить возврат или обмен авиабилетов.'
                },
                {
                  icon: '🛡️',
                  title: 'Страховой случай',
                  desc: 'Помощь в оформлении страховки и взаимодействии со страховой компанией.'
                },
                {
                  icon: '🛄',
                  title: 'Потеря багажа',
                  desc: 'Подскажем, что делать, если багаж потерян, и поможем с документами.'
                },
                {
                  icon: '📝',
                  title: 'Визовые вопросы',
                  desc: 'Нужна консультация по визе? Наши специалисты помогут разобраться.'
                }
              ].map((item, index) => (
                <div key={index} style={{
                  background: '#FFF8F0',
                  border: '2px solid #D2B48C',
                  borderRadius: '25px',
                  padding: '25px',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(183, 110, 60, 0.2)';
                  e.currentTarget.style.borderColor = '#B76E3C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#D2B48C';
                }}>
                  <div style={{ fontSize: '42px', marginBottom: '15px', textAlign: 'center' }}>{item.icon}</div>
                  <h3 style={{
                    color: '#8B5A2B',
                    fontSize: '20px',
                    marginBottom: '10px',
                    textAlign: 'center',
                    fontFamily: "'Cormorant Garamond', serif"
                  }}>{item.title}</h3>
                  <p style={{ color: '#B76E3C', fontSize: '14px', lineHeight: '1.5', textAlign: 'center' }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Часто задаваемые вопросы */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '36px',
              color: '#8B5A2B',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              borderBottom: '2px solid #D2B48C',
              paddingBottom: '10px'
            }}>
              <span style={{ fontSize: '40px' }}>𓂀</span>
              Часто задаваемые вопросы
            </h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {[
                {
                  q: 'Как изменить даты уже оплаченного тура?',
                  a: 'Напишите нам в Telegram @valera_V14 с указанием номера брони и желаемых дат. Мы проверим возможность переноса и свяжемся с вами в течение 2 часов.'
                },
                {
                  q: 'Что делать, если рейс задержали?',
                  a: 'Сохраните все документы и посадочные талоны. Свяжитесь с нами, и мы поможем получить компенсацию от авиакомпании.'
                },
                {
                  q: 'Можно ли вернуть деньги за тур?',
                  a: 'Условия возврата зависят от правил отеля и авиакомпании. Напишите нам, и мы рассчитаем точную сумму возврата.'
                },
                {
                  q: 'Нужна ли виза для поездки?',
                  a: 'Информация по визам есть на странице каждой страны в нашем каталоге. Если остались вопросы — обращайтесь в поддержку.'
                },
                {
                  q: 'Как оставить отзыв о туре?',
                  a: 'Мы будем рады вашему отзыву! Напишите его в Telegram или на почту, и мы опубликуем его на сайте.'
                }
              ].map((faq, index) => (
                <div key={index} style={{
                  background: '#FFF8F0',
                  border: '1px solid #D2B48C',
                  borderRadius: '15px',
                  padding: '20px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '10px'
                  }}>
                    <span style={{
                      background: '#B76E3C',
                      color: '#FFF8F0',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      ?
                    </span>
                    <span style={{ color: '#8B5A2B', fontSize: '18px', fontWeight: '500' }}>{faq.q}</span>
                  </div>
                  <p style={{ color: '#B76E3C', fontSize: '15px', marginLeft: '45px', lineHeight: '1.5' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Секция подписки */}
        <section className="newsletter" style={{
          padding: '50px 30px',
          background: 'linear-gradient(135deg, #C0A080, #8B5A2B)',
          color: '#FFF8F0',
          textAlign: 'center',
          borderRadius: '40px',
          border: '2px solid #D2B48C',
          position: 'relative',
          overflow: 'hidden',
          marginTop: '40px'
        }}>
          {/* Декоративные элементы */}
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 30}px`,
              opacity: 0.1,
              transform: 'rotate(' + Math.random() * 360 + 'deg)',
              color: '#FFD700',
              pointerEvents: 'none'
            }}>
              {['🐪', '🏜️', '🌴', '✨', '𓂀', '𓊹'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
          
          <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontSize: '36px',
              marginBottom: '15px',
              fontFamily: "'Cormorant Garamond', serif"
            }}>
              📬 Остались вопросы?
            </h2>
            <p style={{
              fontSize: '18px',
              marginBottom: '25px',
              color: '#F5F0E5'
            }}>
              Напишите нам, и мы поможем в ближайшее время!
            </p>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => window.location.href = 'https://t.me/valera_V14'}
                style={{
                  padding: '12px 35px',
                  fontSize: '16px',
                  background: '#B76E3C',
                  color: '#FFF8F0',
                  border: '2px solid #FFF8F0',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8B5A2B';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#B76E3C';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Написать в Telegram
              </button>
              <button
  onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=vm96276915@gmail.com', '_blank')}
  style={{
    padding: '12px 35px',
    fontSize: '16px',
    background: '#B76E3C',
    color: '#FFF8F0',
    border: '2px solid #FFF8F0',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = '#8B5A2B';
    e.currentTarget.style.transform = 'scale(1.05)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = '#B76E3C';
    e.currentTarget.style.transform = 'scale(1)';
  }}
>
  📧 Написать на почту
</button>
              
            </div>
          </div>
        </section>

        {/* Дополнительные контакты */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 248, 240, 0.5)',
          borderRadius: '30px',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#8B5A2B' }}>📞</div>
            <div style={{ color: '#8B5A2B', fontWeight: '500' }}>+7 (901) 339-95-22</div>
            <div style={{ color: '#B76E3C', fontSize: '12px' }}>Пн-Пт: 7:00 - 23:00</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#8B5A2B' }}>📧</div>
            <div style={{ color: '#8B5A2B', fontWeight: '500' }}>vm96276915@gmail.com</div>
            <div style={{ color: '#B76E3C', fontSize: '12px' }}>Ответ за 2 часа</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#8B5A2B' }}>📍</div>
            <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Москва, ул. Пальмовая, 13</div>
            <div style={{ color: '#B76E3C', fontSize: '12px' }}>Офис 305</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HelpPage };