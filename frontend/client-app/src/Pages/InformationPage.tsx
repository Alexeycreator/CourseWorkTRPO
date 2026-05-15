import React, { useEffect } from "react";

const InformationPage = () => {
  // Обработка прокрутки к якорям
  useEffect(() => {
    // Функция для обработки кликов из Footer
    const handleScrollToSection = (event: Event) => {
      const customEvent = event as CustomEvent<{ sectionId: string }>;
      const sectionId = customEvent.detail?.sectionId;
      if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          // Небольшая задержка для уверенности, что DOM полностью загружен
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    // Функция для обработки прямых ссылок вида /information#mission
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // убираем #
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    };

    // Добавляем слушатели событий
    window.addEventListener('scrollToSection', handleScrollToSection);
    window.addEventListener('hashchange', handleHashChange);
    
    // Проверяем hash при загрузке страницы
    handleHashChange();

    // Очищаем слушатели при размонтировании компонента
    return () => {
      window.removeEventListener('scrollToSection', handleScrollToSection);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

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
            🐪 О компании «Шелковые барханы»
          </h1>
          <div style={{
            width: '200px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #C0A080, #B76E3C, #C0A080, transparent)',
            margin: '0 auto'
          }}></div>
        </div>

        {/* Основной контент */}
        <div style={{
          background: 'rgba(255, 248, 240, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '40px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(139, 69, 19, 0.15)',
          border: '2px solid #C0A080'
        }}>
          
          {/* Деятельность компании */}
          <section id="about" style={{ marginBottom: '50px' }}>
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
              <span style={{ fontSize: '40px' }}>𓊖</span>
              Деятельность компании
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#5A3E2B',
              marginBottom: '15px'
            }}>
              Бренд <strong style={{ color: '#B76E3C' }}>«Шелковые барханы»</strong> представлен на рынке с 2015 года. Сегодня оператор занимает лидирующие позиции в туристической отрасли и позиционируется как марка надежности, комфорта и восточного гостеприимства. Название компании родилось из желания сочетать роскошь восточных путешествий («барханы») с нежностью и заботой о каждом клиенте («шелковые»).
            </p>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#5A3E2B',
              marginBottom: '15px'
            }}>
              Туроператор <strong style={{ color: '#B76E3C' }}>«Шелковые барханы»</strong> предлагает лучшие курорты и отели в более чем 30 странах мира, среди которых: Турция, Египет, ОАЭ, Таиланд, Мальдивы, Индонезия, Италия, Испания, Греция, Франция, Япония, Кения, Танзания и многие другие. Мы постоянно работаем над открытием новых, уникальных направлений, чтобы удивлять даже самых искушенных путешественников. Компания организует групповые и индивидуальные туры на базе собственных чартерных программ и регулярных рейсов, а также занимается организацией VIP-путешествий, корпоративных мероприятий и тематических туров.
            </p>
          </section>

          {/* Миссия и цели - ДОБАВЛЕН ID "mission" */}
          <section id="mission" style={{ marginBottom: '50px' }}>
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
              Миссия и цели
            </h2>
            <div style={{
              background: 'rgba(210, 180, 140, 0.2)',
              borderRadius: '30px',
              padding: '30px',
              marginBottom: '20px'
            }}>
              <p style={{
                fontSize: '18px',
                fontStyle: 'italic',
                lineHeight: '1.6',
                color: '#8B5A2B',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                «Наша миссия — делать качественный и вдохновляющий отдых доступным, создавая путешествия, которые дарят яркие эмоции и остаются в сердце навсегда. Мы строим отношения с клиентами и партнерами на основе взаимного доверия, уважения и искренней заботы.»
              </p>
            </div>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#5A3E2B',
              marginBottom: '20px'
            }}>
              Основная цель <strong style={{ color: '#B76E3C' }}>«Шелковые барханы»</strong> — дальнейшее повышение качества сервиса и укрепление доверия к бренду. Мы работаем по четырем ключевым направлениям:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {[
                { icon: '👑', title: 'Управление ожиданиями', desc: 'Укрепляем лояльность через прозрачность и предсказуемость каждого тура.' },
                { icon: '📈', title: 'Эффективность продаж', desc: 'Постоянно анализируем рынок, чтобы предлагать лучшие цены и условия.' },
                { icon: '⭐', title: 'Качество управления', desc: 'Внедряем мировые стандарты и инновационные технологии в планирование.' },
                { icon: '🌍', title: 'Расширение географии', desc: 'Ищем новые направления и форматы отдыха для наших путешественников.' }
              ].map((item, index) => (
                <div key={index} style={{
                  background: '#FFF8F0',
                  border: '2px solid #D2B48C',
                  borderRadius: '25px',
                  padding: '20px',
                  textAlign: 'center',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>{item.icon}</div>
                  <h3 style={{ color: '#8B5A2B', marginBottom: '5px', fontSize: '18px' }}>{item.title}</h3>
                  <p style={{ color: '#B76E3C', fontSize: '14px' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Перспективы развития */}
          <section id="development" style={{ marginBottom: '50px' }}>
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
              Перспективы развития
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#5A3E2B',
              marginBottom: '20px'
            }}>
              Специалисты компании <strong style={{ color: '#B76E3C' }}>«Шелковые барханы»</strong> тщательно изучают рынок и прогнозируют дальнейшие направления развития спроса. Мы строим планы на 3, 5 и 10 лет вперед, основываясь на анализе мировых трендов и пожеланиях наших клиентов.
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              justifyContent: 'space-between'
            }}>
              <div style={{
                flex: '1 1 200px',
                background: 'linear-gradient(145deg, #C0A080, #D2B48C)',
                borderRadius: '25px',
                padding: '25px',
                textAlign: 'center',
                color: '#FFF8F0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>✈️</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>40+</div>
                <div>стран мира</div>
              </div>
              <div style={{
                flex: '1 1 200px',
                background: 'linear-gradient(145deg, #B76E3C, #C0A080)',
                borderRadius: '25px',
                padding: '25px',
                textAlign: 'center',
                color: '#FFF8F0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏨</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>5000+</div>
                <div>отелей-партнеров</div>
              </div>
              <div style={{
                flex: '1 1 200px',
                background: 'linear-gradient(145deg, #8B5A2B, #B76E3C)',
                borderRadius: '25px',
                padding: '25px',
                textAlign: 'center',
                color: '#FFF8F0'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>10 000+</div>
                <div>довольных туристов ежегодно</div>
              </div>
            </div>
          </section>

          {/* Качество продукта - ДОБАВЛЕН ID "quality" */}
          <section id="quality" style={{ marginBottom: '50px' }}>
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
              Качество продукта
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#5A3E2B',
              marginBottom: '20px'
            }}>
              Визитной карточкой компании <strong style={{ color: '#B76E3C' }}>«Шелковые барханы»</strong> является неизменно высокое качество предоставляемых услуг. Мы практикуем комплексный подход к качеству на всех этапах — от выбора отеля до встречи в аэропорту.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              <div style={{
                background: '#FFF8F0',
                borderRadius: '20px',
                padding: '20px',
                border: '2px solid #D2B48C',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <span style={{ fontSize: '36px', color: '#B76E3C' }}>🔍</span>
                <div>
                  <h4 style={{ color: '#8B5A2B', marginBottom: '5px' }}>Тщательный отбор</h4>
                  <p style={{ color: '#B76E3C', fontSize: '14px' }}>Каждый отель проверяется лично нашими экспертами</p>
                </div>
              </div>
              <div style={{
                background: '#FFF8F0',
                borderRadius: '20px',
                padding: '20px',
                border: '2px solid #D2B48C',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <span style={{ fontSize: '36px', color: '#B76E3C' }}>📋</span>
                <div>
                  <h4 style={{ color: '#8B5A2B', marginBottom: '5px' }}>Контроль стандартов</h4>
                  <p style={{ color: '#B76E3C', fontSize: '14px' }}>Внедрение требований ISO 9001</p>
                </div>
              </div>
              <div style={{
                background: '#FFF8F0',
                borderRadius: '20px',
                padding: '20px',
                border: '2px solid #D2B48C',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <span style={{ fontSize: '36px', color: '#B76E3C' }}>🤝</span>
                <div>
                  <h4 style={{ color: '#8B5A2B', marginBottom: '5px' }}>Надежные партнеры</h4>
                  <p style={{ color: '#B76E3C', fontSize: '14px' }}>Более 40 авиакомпаний и 14 000 агентств</p>
                </div>
              </div>
            </div>
          </section>

          {/* Социальная ответственность */}
          <section id="social" style={{ marginBottom: '50px' }}>
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
              <span style={{ fontSize: '40px' }}>𓏛</span>
              Социальная ответственность
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#5A3E2B',
              marginBottom: '20px'
            }}>
              <strong style={{ color: '#B76E3C' }}>«Шелковые барханы»</strong> ясно осознает свою ответственность перед обществом. Мы регулярно проводим благотворительные акции, направленные на поддержку детских домов и ветеранов, сотрудничаем с фондами помощи малоимущим. Для нас важно не только дарить радость путешествий, но и делать мир вокруг добрее.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '48px', opacity: 0.7 }}>❤️</span>
              <span style={{ fontSize: '48px', opacity: 0.7 }}>🤲</span>
              <span style={{ fontSize: '48px', opacity: 0.7 }}>🕊️</span>
            </div>
          </section>

          {/* Ценности и принципы */}
          <section id="values" style={{ marginBottom: '20px' }}>
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
              <span style={{ fontSize: '40px' }}>✨</span>
              Ценности и принципы
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '15px'
            }}>
              {[
                'Абсолютная прозрачность и уважение к культуре стран, где мы работаем.',
                'Наши сотрудники — это большая дружная семья, где ценят каждого.',
                'Отношения с партнерами строятся на долгосрочной взаимовыгодной основе.',
                'Конкуренция — естественный стимул для нашего развития.',
                'Мы открыты к критике и всегда готовы к диалогу.',
                'Участие в благотворительности — наш долг.',
                'Главная цель — довольный турист, который вернется к нам снова.',
                'Мы работаем на развитие всей туристической отрасли.'
              ].map((value, index) => (
                <div key={index} style={{
                  background: 'rgba(210, 180, 140, 0.15)',
                  borderRadius: '20px',
                  padding: '15px 20px',
                  borderLeft: '5px solid #B76E3C',
                  color: '#5A3E2B',
                  fontSize: '15px',
                  fontStyle: 'italic'
                }}>
                  {value}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Дополнительный блок с призывом */}
        <div style={{
          marginTop: '40px',
          background: 'rgba(255, 248, 240, 0.8)',
          backdropFilter: 'blur(5px)',
          borderRadius: '30px',
          padding: '30px',
          textAlign: 'center',
          border: '2px dashed #C0A080'
        }}>
          <p style={{
            fontSize: '20px',
            color: '#8B5A2B',
            fontFamily: "'Cormorant Garamond', serif",
            marginBottom: '10px'
          }}>
            «Шелковые барханы» — ваши ворота в мир удивительных путешествий 🐪
          </p>
          <p style={{ color: '#B76E3C', fontSize: '16px' }}>
            Присоединяйтесь к нашей большой семье путешественников!
          </p>
        </div>
      </div>
    </div>
  );
};

export { InformationPage };