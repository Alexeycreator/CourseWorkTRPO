import React, { useState } from "react";
import { Link } from 'react-router-dom';

const PrivacyTermsPage = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      position: 'relative',
      zIndex: 2
    }}>
      {/* Фоновые декоративные элементы */}
      <div style={{ position: 'fixed', top: '10%', left: '2%', fontSize: '60px', opacity: 0.03, pointerEvents: 'none' }}>⚖️</div>
      <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '80px', opacity: 0.03, pointerEvents: 'none' }}>📜</div>
      
      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '48px',
          color: '#8B5A2B',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <span>⚖️</span> Правовая информация <span>📜</span>
        </h1>
        <div style={{
          width: '150px',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #C0A080, #B76E3C, #C0A080, transparent)',
          margin: '0 auto'
        }}></div>
        <p style={{
          color: '#B76E3C',
          marginTop: '15px',
          fontSize: '16px'
        }}>
          Последнее обновление: 4 марта 2026 года
        </p>
      </div>

      {/* Переключатель вкладок */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => setActiveTab('privacy')}
          style={{
            padding: '12px 40px',
            background: activeTab === 'privacy' ? '#B76E3C' : 'transparent',
            color: activeTab === 'privacy' ? '#FFF8F0' : '#8B5A2B',
            border: '2px solid',
            borderColor: activeTab === 'privacy' ? '#B76E3C' : '#C0A080',
            borderRadius: '40px',
            fontSize: '18px',
            fontWeight: activeTab === 'privacy' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'privacy') {
              e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'privacy') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span>🔒</span> Политика конфиденциальности
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          style={{
            padding: '12px 40px',
            background: activeTab === 'terms' ? '#B76E3C' : 'transparent',
            color: activeTab === 'terms' ? '#FFF8F0' : '#8B5A2B',
            border: '2px solid',
            borderColor: activeTab === 'terms' ? '#B76E3C' : '#C0A080',
            borderRadius: '40px',
            fontSize: '18px',
            fontWeight: activeTab === 'terms' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'terms') {
              e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'terms') {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span>📋</span> Условия пользования
        </button>
      </div>

      {/* Основной контент */}
      <div style={{
        background: 'rgba(255, 248, 240, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '40px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(139, 69, 19, 0.15)',
        border: '2px solid #C0A080'
      }}>
        
        {/* ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ */}
        {activeTab === 'privacy' && (
          <>
            {/* Введение */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                color: '#8B5A2B',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '2px solid #D2B48C',
                paddingBottom: '10px'
              }}>
                <span>📜</span> Введение
              </h2>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#5A3E2B',
                marginBottom: '15px'
              }}>
                Туроператор <strong style={{ color: '#B76E3C' }}>«Шелковые барханы»</strong> (далее — «Компания») уделяет большое внимание защите персональных данных наших клиентов и посетителей сайта. Настоящая Политика конфиденциальности описывает, как мы собираем, используем и защищаем информацию, которую вы предоставляете при использовании нашего сайта и услуг.
              </p>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#5A3E2B'
              }}>
                Используя наш сайт и услуги, вы соглашаетесь с условиями настоящей Политики конфиденциальности. Если вы не согласны с какими-либо положениями, пожалуйста, не используйте наш сайт и не предоставляйте нам свои данные.
              </p>
            </section>

            {/* Какую информацию мы собираем */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                color: '#8B5A2B',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '2px solid #D2B48C',
                paddingBottom: '10px'
              }}>
                <span>📋</span> Какую информацию мы собираем
              </h2>
              
              <div style={{
                background: '#FFF8F0',
                borderRadius: '20px',
                padding: '20px',
                border: '2px solid #D2B48C',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#8B5A2B', fontSize: '20px', marginBottom: '15px', fontFamily: "'Cormorant Garamond', serif" }}>
                  Личная информация
                </h3>
                <ul style={{ color: '#5A3E2B', lineHeight: '1.8', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}><strong>ФИО</strong> — для оформления бронирований и договоров</li>
                  <li style={{ marginBottom: '8px' }}><strong>Контактные данные</strong> (email, телефон) — для связи по вопросам бронирования и рассылки</li>
                  <li style={{ marginBottom: '8px' }}><strong>Паспортные данные</strong> — для оформления туров, авиабилетов и страховок</li>
                  <li style={{ marginBottom: '8px' }}><strong>Дата рождения</strong> — для определения возраста и специальных предложений</li>
                  <li style={{ marginBottom: '8px' }}><strong>Адрес регистрации</strong> — для оформления документов</li>
                </ul>
              </div>

              <div style={{
                background: '#FFF8F0',
                borderRadius: '20px',
                padding: '20px',
                border: '2px solid #D2B48C'
              }}>
                <h3 style={{ color: '#8B5A2B', fontSize: '20px', marginBottom: '15px', fontFamily: "'Cormorant Garamond', serif" }}>
                  Автоматически собираемая информация
                </h3>
                <ul style={{ color: '#5A3E2B', lineHeight: '1.8', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}><strong>IP-адрес</strong> — для обеспечения безопасности и аналитики</li>
                  <li style={{ marginBottom: '8px' }}><strong>Тип браузера и устройства</strong> — для оптимизации отображения сайта</li>
                  <li style={{ marginBottom: '8px' }}><strong>Cookies</strong> — для запоминания предпочтений и улучшения работы сайта</li>
                  <li style={{ marginBottom: '8px' }}><strong>История поиска и просмотров</strong> — для персонализации предложений</li>
                </ul>
              </div>
            </section>

            {/* Как мы используем информацию */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                color: '#8B5A2B',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '2px solid #D2B48C',
                paddingBottom: '10px'
              }}>
                <span>🔍</span> Как мы используем вашу информацию
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                {[
                  { icon: '✈️', title: 'Оформление туров', desc: 'Для бронирования отелей, авиабилетов и трансферов' },
                  { icon: '📞', title: 'Связь с клиентом', desc: 'Для подтверждения бронирований и решения вопросов' },
                  { icon: '📧', title: 'Рассылка предложений', desc: 'Для отправки специальных предложений и новостей (с вашего согласия)' },
                  { icon: '🔒', title: 'Безопасность', desc: 'Для предотвращения мошенничества и защиты ваших данных' },
                  { icon: '📊', title: 'Аналитика', desc: 'Для улучшения работы сайта и персонализации' },
                  { icon: '⚖️', title: 'Исполнение законов', desc: 'Для соблюдения требований законодательства РФ' }
                ].map((item, index) => (
                  <div key={index} style={{
                    background: '#FFF8F0',
                    borderRadius: '15px',
                    padding: '20px',
                    border: '2px solid #D2B48C',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(183, 110, 60, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px', textAlign: 'center' }}>{item.icon}</div>
                    <h3 style={{ color: '#8B5A2B', fontSize: '18px', marginBottom: '8px', textAlign: 'center' }}>{item.title}</h3>
                    <p style={{ color: '#B76E3C', fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Защита информации */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                color: '#8B5A2B',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '2px solid #D2B48C',
                paddingBottom: '10px'
              }}>
                <span>🛡️</span> Защита информации
              </h2>

              <div style={{
                background: 'linear-gradient(135deg, rgba(210, 180, 140, 0.2), rgba(183, 110, 60, 0.2))',
                borderRadius: '20px',
                padding: '25px'
              }}>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#5A3E2B', marginBottom: '15px' }}>
                  Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения:
                </p>
                <ul style={{ color: '#5A3E2B', lineHeight: '1.8', columns: '2', columnGap: '30px' }}>
                  <li style={{ marginBottom: '8px' }}>✓ Использование SSL-шифрования</li>
                  <li style={{ marginBottom: '8px' }}>✓ Регулярное обновление систем безопасности</li>
                  <li style={{ marginBottom: '8px' }}>✓ Ограниченный доступ сотрудников</li>
                  <li style={{ marginBottom: '8px' }}>✓ Мониторинг подозрительной активности</li>
                  <li style={{ marginBottom: '8px' }}>✓ Резервное копирование данных</li>
                  <li style={{ marginBottom: '8px' }}>✓ Соответствие требованиям ФЗ-152</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                color: '#8B5A2B',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '2px solid #D2B48C',
                paddingBottom: '10px'
              }}>
                <span>🍪</span> Использование Cookies
              </h2>

              <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: '1' }}>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#5A3E2B' }}>
                    Наш сайт использует файлы cookie для улучшения работы и персонализации. Продолжая использовать сайт, вы соглашаетесь с использованием cookie-файлов. Вы можете отключить cookies в настройках браузера, но это может повлиять на функциональность сайта.
                  </p>
                </div>
                <div style={{
                  background: '#FFF8F0',
                  borderRadius: '15px',
                  padding: '15px',
                  border: '2px solid #D2B48C',
                  minWidth: '200px'
                }}>
                  <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '5px' }}>🍪</div>
                  <p style={{ color: '#8B5A2B', fontSize: '13px', textAlign: 'center' }}>
                    Мы используем необходимые cookies и cookies для аналитики
                  </p>
                </div>
              </div>
            </section>

            {/* Контакты для вопросов о конфиденциальности */}
            <section style={{
              background: 'linear-gradient(135deg, #C0A080, #B76E3C)',
              borderRadius: '20px',
              padding: '30px',
              marginTop: '30px',
              color: '#FFF8F0'
            }}>
              <h3 style={{
                fontSize: '24px',
                marginBottom: '15px',
                fontFamily: "'Cormorant Garamond', serif",
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>📬</span> Вопросы о конфиденциальности?
              </h3>
              <p style={{ marginBottom: '20px', fontSize: '16px' }}>
                Если у вас есть вопросы о том, как мы обрабатываем ваши данные:
              </p>
              <div style={{
                display: 'flex',
                gap: '30px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📧</span> vm96276915@gmail.com
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📞</span> +7 (901) 339-95-22
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⏰</span> Пн-Пт 7:00-23:00
                </div>
              </div>
            </section>
          </>
        )}

        {/* УСЛОВИЯ ПОЛЬЗОВАНИЯ */}
        {activeTab === 'terms' && (
          <>
            {/* Общие положения */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                color: '#8B5A2B',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '2px solid #D2B48C',
                paddingBottom: '10px'
              }}>
                <span>⚖️</span> Общие положения
              </h2>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#5A3E2B',
                marginBottom: '15px'
              }}>
                Настоящие Условия пользования регулируют отношения между туроператором <strong style={{ color: '#B76E3C' }}>«Шелковые барханы»</strong> (далее — «Компания») и пользователями сайта. Используя сайт, вы подтверждаете, что ознакомились и согласны с данными условиями.
              </p>
            </section>

            {/* Правила бронирования */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                color: '#8B5A2B',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '2px solid #D2B48C',
                paddingBottom: '10px'
              }}>
                <span>📅</span> Правила бронирования
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {[
                  {
                    title: 'Подтверждение брони',
                    desc: 'Бронирование считается подтвержденным после получения от вас 100% предоплаты или согласно условиям договора.'
                  },
                  {
                    title: 'Изменение дат',
                    desc: 'Изменение дат тура возможно не позднее 14 дней до начала при наличии свободных мест.'
                  },
                  {
                    title: 'Аннуляция тура',
                    desc: 'При аннуляции тура применяются штрафные санкции согласно условиям договора и правилам отелей/авиакомпаний.'
                  },
                  {
                    title: 'Документы',
                    desc: 'Все необходимые документы (ваучеры, билеты, страховки) направляются на email не позднее чем за 24 часа до вылета.'
                  }
                ].map((item, index) => (
                  <div key={index} style={{
                    background: '#FFF8F0',
                    borderRadius: '15px',
                    padding: '20px',
                    border: '2px solid #D2B48C'
                  }}>
                    <h3 style={{ color: '#8B5A2B', fontSize: '18px', marginBottom: '10px' }}>{item.title}</h3>
                    <p style={{ color: '#B76E3C', fontSize: '14px', lineHeight: '1.6' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Оплата и возвраты */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                color: '#8B5A2B',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '2px solid #D2B48C',
                paddingBottom: '10px'
              }}>
                <span>💰</span> Оплата и возвраты
              </h2>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div style={{
                  background: '#FFF8F0',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '2px solid #D2B48C'
                }}>
                  <h3 style={{ color: '#8B5A2B', fontSize: '18px', marginBottom: '10px' }}>Способы оплаты</h3>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#F0E5D5', padding: '5px 15px', borderRadius: '20px', color: '#8B5A2B' }}>💳 Банковские карты</span>
                    <span style={{ background: '#F0E5D5', padding: '5px 15px', borderRadius: '20px', color: '#8B5A2B' }}>🏦 Банковский перевод</span>
                    <span style={{ background: '#F0E5D5', padding: '5px 15px', borderRadius: '20px', color: '#8B5A2B' }}>📱 Электронные кошельки</span>
                    <span style={{ background: '#F0E5D5', padding: '5px 15px', borderRadius: '20px', color: '#8B5A2B' }}>💵 Наличные в офисе</span>
                  </div>
                </div>

                <div style={{
                  background: '#FFF8F0',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '2px solid #D2B48C'
                }}>
                  <h3 style={{ color: '#8B5A2B', fontSize: '18px', marginBottom: '10px' }}>Условия возврата</h3>
                  <ul style={{ color: '#5A3E2B', lineHeight: '1.8' }}>
                    <li>При отказе за 30+ дней — возврат 100% (за вычетом фактических расходов)</li>
                    <li>При отказе за 15-29 дней — возврат 70%</li>
                    <li>При отказе за 7-14 дней — возврат 50%</li>
                    <li>При отказе менее чем за 7 дней — возврат не производится</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Обязанности сторон */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                color: '#8B5A2B',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '2px solid #D2B48C',
                paddingBottom: '10px'
              }}>
                <span>🤝</span> Обязанности сторон
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
              }}>
                <div style={{
                  background: '#FFF8F0',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '2px solid #D2B48C'
                }}>
                  <h3 style={{ color: '#8B5A2B', fontSize: '18px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🏢</span> Обязанности компании
                  </h3>
                  <ul style={{ color: '#5A3E2B', lineHeight: '1.8' }}>
                    <li>Предоставить услуги в соответствии с договором</li>
                    <li>Информировать об изменениях</li>
                    <li>Обеспечить безопасность</li>
                    <li>Помочь в экстренных ситуациях</li>
                  </ul>
                </div>

                <div style={{
                  background: '#FFF8F0',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '2px solid #D2B48C'
                }}>
                  <h3 style={{ color: '#8B5A2B', fontSize: '18px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>👤</span> Обязанности клиента
                  </h3>
                  <ul style={{ color: '#5A3E2B', lineHeight: '1.8' }}>
                    <li>Своевременно оплатить тур</li>
                    <li>Предоставить достоверные данные</li>
                    <li>Иметь загранпаспорт и визы</li>
                    <li>Соблюдать правила страны пребывания</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Ответственность */}
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px',
                color: '#8B5A2B',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderBottom: '2px solid #D2B48C',
                paddingBottom: '10px'
              }}>
                <span>⚠️</span> Ответственность
              </h2>

              <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#5A3E2B', marginBottom: '15px' }}>
                Компания не несет ответственности за:
              </p>
              <ul style={{ color: '#5A3E2B', lineHeight: '1.8', marginLeft: '20px' }}>
                <li>Действия консульских служб (отказ в визе)</li>
                <li>Задержки рейсов по вине авиакомпаний</li>
                <li>Погодные условия и форс-мажор</li>
                <li>Действия клиента, нарушающие правила</li>
              </ul>
            </section>

            {/* Контакты для вопросов об условиях */}
            <section style={{
              background: 'linear-gradient(135deg, #C0A080, #B76E3C)',
              borderRadius: '20px',
              padding: '30px',
              marginTop: '30px',
              color: '#FFF8F0'
            }}>
              <h3 style={{
                fontSize: '24px',
                marginBottom: '15px',
                fontFamily: "'Cormorant Garamond', serif",
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>📞</span> Вопросы по условиям?
              </h3>
              <p style={{ marginBottom: '20px', fontSize: '16px' }}>
                Если у вас есть вопросы по условиям бронирования:
              </p>
              <div style={{
                display: 'flex',
                gap: '30px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📧</span> vm96276915@gmail.com 
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📞</span> +7 (901) 339-95-22
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⏰</span> Пн-Пт 7:00-23:00
                </div>
              </div>
            </section>
          </>
        )}

        {/* Общая информация для обеих вкладок */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(210, 180, 140, 0.1)',
          borderRadius: '20px',
          border: '2px dashed #C0A080',
          textAlign: 'center'
        }}>
          <p style={{ color: '#8B5A2B', fontSize: '14px', marginBottom: '10px' }}>
            <span>🏜️</span> Туроператор «Шелковые барханы» — ваши ворота в мир удивительных путешествий <span>🐪</span>
          </p>
          <p style={{ color: '#B76E3C', fontSize: '13px' }}>
            Все права защищены © 2015-2026
          </p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyTermsPage;