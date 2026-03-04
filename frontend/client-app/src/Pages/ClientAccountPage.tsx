import React, { useState } from "react";

interface Tour {
  id: number;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  nights: number;
  country: string;
  city: string;
  type: string;
  hot: boolean;
}

const ClientAccountPage = () => {
  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  
  // Пример данных клиента
  const [clientData, setClientData] = useState({
    // Личные данные
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'ivan.petrov@mail.ru',
    phone: '+7 (999) 123-45-67',
    gender: 'male',
    birthDay: '15',
    birthMonth: '5',
    birthYear: '1990',
    
    // Паспортные данные
    passportSeries: '4510',
    passportNumber: '123456',
    passportIssued: 'ОВД "Тверской" г. Москвы',
    passportDate: '2010-05-20',
    passportCode: '770-001',
    
    // Адрес регистрации
    city: 'Москва',
    address: 'ул. Пушкина, д. 10, кв. 42',
    
    // Настройки
    agreeToNews: true,
    agreeToPersonalData: true
  });

  // Пример данных о забронированных турах клиента
  const [bookedTours] = useState<Tour[]>([
    {
      id: 1,
      title: "Мальдивы",
      description: "Райский отдых на белоснежных пляжах",
      price: 180000,
      oldPrice: 220000,
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviews: 124,
      nights: 7,
      country: "Мальдивы",
      city: "Мале",
      type: "Пляжный",
      hot: true
    },
    {
      id: 2,
      title: "Италия",
      description: "Экскурсионный тур по историческим местам",
      price: 95000,
      oldPrice: 120000,
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviews: 98,
      nights: 5,
      country: "Италия",
      city: "Рим",
      type: "Экскурсионный",
      hot: false
    },
    {
      id: 3,
      title: "Бали",
      description: "Йога-тур и духовные практики",
      price: 120000,
      oldPrice: 150000,
      image: "https://images.unsplash.com/photo-1537996192471-5ba5aab9e0b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviews: 156,
      nights: 10,
      country: "Индонезия",
      city: "Денпасар",
      type: "Оздоровительный",
      hot: true
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...clientData });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setEditedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editedData.firstName) newErrors.firstName = 'Имя обязательно';
    if (!editedData.lastName) newErrors.lastName = 'Фамилия обязательна';
    if (!editedData.email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(editedData.email)) newErrors.email = 'Email некорректен';
    
    if (!editedData.phone) newErrors.phone = 'Телефон обязателен';
    
    if (!editedData.passportSeries) newErrors.passportSeries = 'Серия паспорта обязательна';
    if (!editedData.passportNumber) newErrors.passportNumber = 'Номер паспорта обязателен';
    if (!editedData.passportIssued) newErrors.passportIssued = 'Кем выдан обязательно';
    if (!editedData.passportDate) newErrors.passportDate = 'Дата выдачи обязательна';
    
    if (!editedData.city) newErrors.city = 'Город обязателен';
    if (!editedData.address) newErrors.address = 'Адрес обязателен';

    if (!editedData.agreeToPersonalData) {
      newErrors.agreeToPersonalData = 'Необходимо согласие на обработку данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setClientData(editedData);
      setIsEditing(false);
      alert('Данные успешно сохранены!');
    }
  };

  const handleCancel = () => {
    setEditedData(clientData);
    setIsEditing(false);
    setErrors({});
  };

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

  const getGenderText = (gender: string) => {
    return gender === 'male' ? 'Мужской' : 'Женский';
  };

  const getFullBirthDate = () => {
    if (clientData.birthDay && clientData.birthMonth && clientData.birthYear) {
      const monthIndex = parseInt(clientData.birthMonth) - 1;
      return `${clientData.birthDay} ${months[monthIndex]} ${clientData.birthYear}`;
    }
    return 'Не указано';
  };

  // Функция для форматирования цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

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
      <div style={{ position: 'fixed', top: '5%', left: '2%', fontSize: '60px', opacity: 0.05, pointerEvents: 'none' }}>𓂀</div>
      <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '80px', opacity: 0.05, pointerEvents: 'none' }}>𓊹</div>
      <div style={{ position: 'fixed', top: '20%', right: '8%', fontSize: '50px', opacity: 0.05, pointerEvents: 'none' }}>𓋴</div>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Заголовок */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '48px',
            color: '#8B5A2B',
            marginBottom: '10px'
          }}>
            🐪 Личный кабинет
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
            {isEditing ? 'Редактирование профиля' : 'Здравствуйте, ' + clientData.firstName + '!'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Левая колонка - навигация */}
          <div style={{
            background: 'rgba(255, 248, 240, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '30px',
            padding: '25px',
            border: '2px solid #C0A080',
            position: 'sticky',
            top: '20px'
          }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '24px',
              color: '#8B5A2B',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #D2B48C'
            }}>
              👤 {clientData.firstName} {clientData.lastName}
            </h2>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                { id: 'profile' as const, label: '📋 Мои данные' },
                { id: 'bookings' as const, label: '🗺️ Мои туры', badge: bookedTours.length.toString() },
                { id: 'logout' as const, label: '🚪 Выход' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 'logout') {
                      console.log('Выход из аккаунта');
                    } else {
                      setActiveTab(item.id);
                      if (item.id !== 'profile') {
                        setIsEditing(false);
                      }
                    }
                  }}
                  style={{
                    padding: '12px 15px',
                    background: activeTab === item.id ? '#B76E3C' : 'transparent',
                    color: activeTab === item.id ? '#FFF8F0' : '#8B5A2B',
                    border: 'none',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    textAlign: 'left',
                    transition: 'all 0.3s',
                    fontWeight: activeTab === item.id ? '600' : '400',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      background: '#FFF8F0',
                      color: '#B76E3C',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Правая колонка - контент */}
          <div style={{
            background: 'rgba(255, 248, 240, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '30px',
            padding: '30px',
            border: '2px solid #C0A080'
          }}>
            {activeTab === 'profile' ? (
              // Вкладка "Мои данные"
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                {/* Кнопка редактирования */}
                {!isEditing && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: '#8B5A2B',
                        border: '2px solid #D2B48C',
                        borderRadius: '20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span>✏️</span> Редактировать профиль
                    </button>
                  </div>
                )}

                {/* Личные данные */}
                <section style={{ marginBottom: '30px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    color: '#8B5A2B',
                    marginBottom: '20px',
                    fontFamily: "'Cormorant Garamond', serif",
                    borderBottom: '2px solid #D2B48C',
                    paddingBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span>📋 Личные данные</span>
                  </h3>

                  {isEditing ? (
                    // Режим редактирования
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '20px'
                    }}>
                      {/* Все поля формы... (сохраните ваш существующий код) */}
                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Имя <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={editedData.firstName}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.firstName ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.firstName && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.firstName}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Фамилия <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={editedData.lastName}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.lastName ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.lastName && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.lastName}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Email <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editedData.email}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.email ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.email && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.email}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Телефон <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={editedData.phone}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.phone ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.phone && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.phone}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Пол
                        </label>
                        <div style={{ display: 'flex', gap: '20px', padding: '12px 0' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={editedData.gender === 'male'}
                              onChange={handleChange}
                            />
                            Мужской
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={editedData.gender === 'female'}
                              onChange={handleChange}
                            />
                            Женский
                          </label>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Дата рождения
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <select
                            name="birthDay"
                            value={editedData.birthDay}
                            onChange={handleChange}
                            style={{
                              flex: 1,
                              padding: '12px',
                              border: '2px solid #D2B48C',
                              borderRadius: '15px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B',
                              fontSize: '15px',
                              outline: 'none'
                            }}
                          >
                            <option value="">День</option>
                            {days.map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                          <select
                            name="birthMonth"
                            value={editedData.birthMonth}
                            onChange={handleChange}
                            style={{
                              flex: 2,
                              padding: '12px',
                              border: '2px solid #D2B48C',
                              borderRadius: '15px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B',
                              fontSize: '15px',
                              outline: 'none'
                            }}
                          >
                            <option value="">Месяц</option>
                            {months.map((month, index) => (
                              <option key={month} value={index + 1}>{month}</option>
                            ))}
                          </select>
                          <select
                            name="birthYear"
                            value={editedData.birthYear}
                            onChange={handleChange}
                            style={{
                              flex: 1,
                              padding: '12px',
                              border: '2px solid #D2B48C',
                              borderRadius: '15px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B',
                              fontSize: '15px',
                              outline: 'none'
                            }}
                          >
                            <option value="">Год</option>
                            {years.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Режим просмотра
                    <div style={{
                      background: '#FFF8F0',
                      borderRadius: '20px',
                      padding: '20px',
                      border: '2px solid #D2B48C'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '150px 1fr',
                        gap: '15px',
                        alignItems: 'center'
                      }}>
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Имя:</div>
                        <div style={{ color: '#5D3A1A', fontSize: '16px' }}>{clientData.firstName} {clientData.lastName}</div>
                        
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Email:</div>
                        <div style={{ color: '#5D3A1A' }}>{clientData.email}</div>
                        
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Телефон:</div>
                        <div style={{ color: '#5D3A1A' }}>{clientData.phone}</div>
                        
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Пол:</div>
                        <div style={{ color: '#5D3A1A' }}>{getGenderText(clientData.gender)}</div>
                        
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дата рождения:</div>
                        <div style={{ color: '#5D3A1A' }}>{getFullBirthDate()}</div>
                        
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Возраст:</div>
                        <div style={{ color: '#5D3A1A' }}>
                          {new Date().getFullYear() - parseInt(clientData.birthYear)} лет
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Паспортные данные */}
                <section style={{ marginBottom: '30px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    color: '#8B5A2B',
                    marginBottom: '20px',
                    fontFamily: "'Cormorant Garamond', serif",
                    borderBottom: '2px solid #D2B48C',
                    paddingBottom: '10px'
                  }}>
                    🪪 Паспортные данные
                  </h3>

                  {isEditing ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '20px'
                    }}>
                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Серия <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="passportSeries"
                          value={editedData.passportSeries}
                          onChange={handleChange}
                          maxLength={4}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.passportSeries ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.passportSeries && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.passportSeries}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Номер <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="passportNumber"
                          value={editedData.passportNumber}
                          onChange={handleChange}
                          maxLength={6}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.passportNumber ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.passportNumber && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.passportNumber}</div>
                        )}
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Кем выдан <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="passportIssued"
                          value={editedData.passportIssued}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.passportIssued ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.passportIssued && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.passportIssued}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Дата выдачи <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="date"
                          name="passportDate"
                          value={editedData.passportDate}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.passportDate ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.passportDate && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.passportDate}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Код подразделения
                        </label>
                        <input
                          type="text"
                          name="passportCode"
                          value={editedData.passportCode}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #D2B48C',
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: '#FFF8F0',
                      borderRadius: '20px',
                      padding: '20px',
                      border: '2px solid #D2B48C'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '150px 1fr',
                        gap: '15px',
                        alignItems: 'center'
                      }}>
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Серия и номер:</div>
                        <div style={{ color: '#5D3A1A' }}>{clientData.passportSeries} {clientData.passportNumber}</div>
                        
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Кем выдан:</div>
                        <div style={{ color: '#5D3A1A' }}>{clientData.passportIssued}</div>
                        
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дата выдачи:</div>
                        <div style={{ color: '#5D3A1A' }}>
                          {new Date(clientData.passportDate).toLocaleDateString('ru-RU')}
                        </div>
                        
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Код подразделения:</div>
                        <div style={{ color: '#5D3A1A' }}>{clientData.passportCode || '—'}</div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Адрес регистрации */}
                <section style={{ marginBottom: '30px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    color: '#8B5A2B',
                    marginBottom: '20px',
                    fontFamily: "'Cormorant Garamond', serif",
                    borderBottom: '2px solid #D2B48C',
                    paddingBottom: '10px'
                  }}>
                    📍 Адрес регистрации
                  </h3>

                  {isEditing ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '20px'
                    }}>
                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Город <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={editedData.city}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.city ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.city && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.city}</div>
                        )}
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Адрес <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={editedData.address}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.address ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.address && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.address}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: '#FFF8F0',
                      borderRadius: '20px',
                      padding: '20px',
                      border: '2px solid #D2B48C'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '150px 1fr',
                        gap: '15px',
                        alignItems: 'center'
                      }}>
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Город:</div>
                        <div style={{ color: '#5D3A1A' }}>{clientData.city}</div>
                        
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Адрес:</div>
                        <div style={{ color: '#5D3A1A' }}>{clientData.address}</div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Согласия */}
                <section style={{ marginBottom: '30px' }}>
                  <div style={{
                    background: '#FFF8F0',
                    borderRadius: '20px',
                    padding: '20px',
                    border: '2px solid #D2B48C'
                  }}>
                    {isEditing ? (
                      <>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B5A2B', fontSize: '14px' }}>
                            <input
                              type="checkbox"
                              name="agreeToNews"
                              checked={editedData.agreeToNews}
                              onChange={handleChange}
                            />
                            Получать новости и специальные предложения
                          </label>
                        </div>

                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B5A2B', fontSize: '14px' }}>
                            <input
                              type="checkbox"
                              name="agreeToPersonalData"
                              checked={editedData.agreeToPersonalData}
                              onChange={handleChange}
                            />
                            <span>Согласие на обработку персональных данных <span style={{ color: '#dc3545' }}>*</span></span>
                          </label>
                          {errors.agreeToPersonalData && (
                            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                              {errors.agreeToPersonalData}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '150px 1fr',
                        gap: '15px',
                        alignItems: 'center'
                      }}>
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Новости:</div>
                        <div style={{ color: '#5D3A1A' }}>{clientData.agreeToNews ? '✓ Согласен' : '✗ Не согласен'}</div>
                        
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Персональные данные:</div>
                        <div style={{ color: '#5D3A1A' }}>{clientData.agreeToPersonalData ? '✓ Согласен' : '✗ Не согласен'}</div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Кнопки сохранения/отмены */}
                {isEditing && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button
                      type="submit"
                      style={{
                        padding: '15px 50px',
                        background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                        color: '#FFF8F0',
                        border: '2px solid #D2B48C',
                        borderRadius: '40px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 5px 15px rgba(183, 110, 60, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(183, 110, 60, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(183, 110, 60, 0.3)';
                      }}
                    >
                      Сохранить
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      style={{
                        padding: '15px 30px',
                        background: 'transparent',
                        color: '#8B5A2B',
                        border: '2px solid #D2B48C',
                        borderRadius: '40px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      ✕ Отмена
                    </button>
                  </div>
                )}
              </form>
            ) : (
              // Вкладка "Мои туры"
              <div>
                <h3 style={{
                  fontSize: '24px',
                  color: '#8B5A2B',
                  marginBottom: '25px',
                  fontFamily: "'Cormorant Garamond', serif",
                  borderBottom: '2px solid #D2B48C',
                  paddingBottom: '10px'
                }}>
                  🗺️ Ваши забронированные туры
                </h3>

                {bookedTours.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#8B5A2B'
                  }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏝️</div>
                    <h4>У вас пока нет забронированных туров</h4>
                    <p style={{ marginTop: '10px' }}>
                      Перейдите в каталог, чтобы выбрать путешествие
                    </p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {bookedTours.map((tour) => (
                      <div key={tour.id} className="col-12 col-md-6 col-lg-4">
                        <div
                          className="card h-100"
                          style={{
                            background: 'rgba(255, 248, 240, 0.9)',
                            border: '2px solid #D2B48C',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            transition: 'all 0.3s',
                            position: 'relative',
                            cursor: 'pointer'
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
                          {tour.hot && (
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

                          {/* Бейдж со скидкой */}
                          {tour.oldPrice && (
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
                          )}

                          <img
                            src={tour.image}
                            alt={tour.title}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              borderBottom: '2px solid #D2B48C'
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
                                {tour.title}
                              </h3>
                              <div style={{ color: '#B76E3C' }}>
                                <span>⭐</span> {tour.rating}
                              </div>
                            </div>

                            <p style={{ color: '#8B5A2B', fontSize: '14px', marginBottom: '10px' }}>
                              {tour.description}
                            </p>

                            <div className="d-flex gap-2 mb-2" style={{ color: '#8B5A2B', fontSize: '13px' }}>
                              <span>📍 {tour.country}</span>
                              <span>•</span>
                              <span>🏙️ {tour.city}</span>
                              <span>•</span>
                              <span>🗺️ {tour.type}</span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <div>
                                {tour.oldPrice && (
                                  <span style={{
                                    color: '#B76E3C',
                                    fontSize: '14px',
                                    textDecoration: 'line-through',
                                    marginRight: '10px'
                                  }}>
                                    {formatPrice(tour.oldPrice)}
                                  </span>
                                )}
                                <span style={{
                                  color: '#8B5A2B',
                                  fontSize: '24px',
                                  fontWeight: '600'
                                }}>
                                  {formatPrice(tour.price)}
                                </span>
                              </div>
                              <span style={{ color: '#B76E3C', fontSize: '14px' }}>
                                {tour.nights} ночей
                              </span>
                            </div>

                            {/* Статус бронирования */}
                            <div style={{
                              marginTop: '15px',
                              padding: '8px',
                              background: '#D2B48C',
                              borderRadius: '25px',
                              textAlign: 'center'
                            }}>
                              <span style={{ color: '#FFF8F0', fontSize: '13px', fontWeight: '500' }}>
                                ✅ Забронировано
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Дополнительная информация */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(255, 248, 240, 0.5)',
          borderRadius: '20px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#8B5A2B'
        }}>
          <p>
            Ваши данные защищены и используются только для бронирования туров.
            Для изменения данных нажмите кнопку "Редактировать профиль".
          </p>
        </div>
      </div>
    </div>
  );
};

export { ClientAccountPage };