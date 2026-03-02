import React, { useState } from "react";

const ClientAccountPage = () => {
  const [formData, setFormData] = useState({
    // Личные данные
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    
    // Паспортные данные (нужны для туров)
    passportSeries: '',
    passportNumber: '',
    passportIssued: '',
    passportDate: '',
    passportCode: '',
    
    // Адрес регистрации
    city: '',
    address: '',
    
    // Настройки
    password: '',
    confirmPassword: '',
    
    // Согласия
    agreeToNews: false,
    agreeToPersonalData: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
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

    // Обязательные поля
    if (!formData.firstName) newErrors.firstName = 'Имя обязательно';
    if (!formData.lastName) newErrors.lastName = 'Фамилия обязательна';
    if (!formData.email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email некорректен';
    
    if (!formData.phone) newErrors.phone = 'Телефон обязателен';
    
    // Паспортные данные
    if (!formData.passportSeries) newErrors.passportSeries = 'Серия паспорта обязательна';
    if (!formData.passportNumber) newErrors.passportNumber = 'Номер паспорта обязателен';
    if (!formData.passportIssued) newErrors.passportIssued = 'Кем выдан обязательно';
    if (!formData.passportDate) newErrors.passportDate = 'Дата выдачи обязательна';
    
    if (!formData.city) newErrors.city = 'Город обязателен';
    if (!formData.address) newErrors.address = 'Адрес обязателен';
    
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    else if (formData.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.agreeToPersonalData) {
      newErrors.agreeToPersonalData = 'Необходимо согласие на обработку данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Данные туриста:', formData);
      alert('Профиль успешно создан! Теперь вы можете бронировать туры.');
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: "'Montserrat', 'Arial', sans-serif",
      position: 'relative'
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
            🐪 Регистрация туриста
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
            Заполните анкету для бронирования туров
          </p>
        </div>

        {/* Форма регистрации */}
        <form onSubmit={handleSubmit}>
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
                👤 Личный кабинет
              </h2>
              
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[
                  { id: 'profile', label: '📋 Мои данные', active: true },
                  { id: 'bookings', label: '🗺️ Мои туры' },
                  { id: 'favorites', label: '❤️ Избранное' },
                  { id: 'reviews', label: '⭐ Мои отзывы' },
                  { id: 'logout', label: '🚪 Выход' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    style={{
                      padding: '12px 15px',
                      background: item.active ? '#B76E3C' : 'transparent',
                      color: item.active ? '#FFF8F0' : '#8B5A2B',
                      border: 'none',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      textAlign: 'left',
                      transition: 'all 0.3s',
                      fontWeight: item.active ? '600' : '400'
                    }}
                    onMouseEnter={(e) => {
                      if (!item.active) {
                        e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!item.active) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Бонусная карта */}
              <div style={{
                marginTop: '30px',
                padding: '15px',
                background: 'linear-gradient(135deg, #C0A080, #B76E3C)',
                borderRadius: '20px',
                color: '#FFF8F0',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '5px' }}>🎁</div>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>Бонусная карта</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>0 баллов</div>
                <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.9 }}>
                  Копите баллы с каждой поездки
                </div>
              </div>
            </div>

            {/* Правая колонка - форма */}
            <div style={{
              background: 'rgba(255, 248, 240, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '30px',
              padding: '30px',
              border: '2px solid #C0A080'
            }}>
              {/* Личные данные */}
              <section style={{ marginBottom: '30px' }}>
                <h3 style={{
                  fontSize: '20px',
                  color: '#8B5A2B',
                  marginBottom: '20px',
                  fontFamily: "'Cormorant Garamond', serif",
                  borderBottom: '2px solid #D2B48C',
                  paddingBottom: '10px'
                }}>
                  📋 Личные данные
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px'
                }}>
                  {/* Имя */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Имя <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Иван"
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

                  {/* Фамилия */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Фамилия <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Петров"
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

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Email <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ivan@mail.ru"
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

                  {/* Телефон */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Телефон <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+7 (999) 123-45-67"
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

                  {/* Пол */}
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
                          checked={formData.gender === 'male'}
                          onChange={handleChange}
                        />
                        Мужской
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={handleChange}
                        />
                        Женский
                      </label>
                    </div>
                  </div>

                  {/* Дата рождения */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Дата рождения
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <select
                        name="birthDay"
                        value={formData.birthDay}
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
                        value={formData.birthMonth}
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
                        value={formData.birthYear}
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

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px'
                }}>
                  {/* Серия */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Серия <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="passportSeries"
                      value={formData.passportSeries}
                      onChange={handleChange}
                      placeholder="4510"
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

                  {/* Номер */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Номер <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      placeholder="123456"
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

                  {/* Кем выдан */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Кем выдан <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="passportIssued"
                      value={formData.passportIssued}
                      onChange={handleChange}
                      placeholder="ОВД 'Тверской' г. Москвы"
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

                  {/* Дата выдачи */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Дата выдачи <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="date"
                      name="passportDate"
                      value={formData.passportDate}
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

                  {/* Код подразделения */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Код подразделения
                    </label>
                    <input
                      type="text"
                      name="passportCode"
                      value={formData.passportCode}
                      onChange={handleChange}
                      placeholder="770-001"
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

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px'
                }}>
                  {/* Город */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Город <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Москва"
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

                  {/* Улица/дом/квартира */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Адрес <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="ул. Пушкина, д. 10, кв. 42"
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
              </section>

              {/* Безопасность */}
              <section style={{ marginBottom: '30px' }}>
                <h3 style={{
                  fontSize: '20px',
                  color: '#8B5A2B',
                  marginBottom: '20px',
                  fontFamily: "'Cormorant Garamond', serif",
                  borderBottom: '2px solid #D2B48C',
                  paddingBottom: '10px'
                }}>
                  🔐 Безопасность
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px'
                }}>
                  {/* Пароль */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Пароль <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Не менее 6 символов"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${errors.password ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '15px',
                        backgroundColor: '#FFF8F0',
                        color: '#8B5A2B',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                    {errors.password && (
                      <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.password}</div>
                    )}
                  </div>

                  {/* Подтверждение пароля */}
                  <div>
                    <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                      Подтвердите пароль <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Повторите пароль"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: `2px solid ${errors.confirmPassword ? '#dc3545' : '#D2B48C'}`,
                        borderRadius: '15px',
                        backgroundColor: '#FFF8F0',
                        color: '#8B5A2B',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                    {errors.confirmPassword && (
                      <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.confirmPassword}</div>
                    )}
                  </div>
                </div>

                {/* Чекбокс показа пароля */}
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    Показать пароль
                  </label>
                </div>
              </section>

              {/* Согласия */}
              <section style={{ marginBottom: '30px' }}>
                <div style={{
                  background: '#FFF8F0',
                  borderRadius: '20px',
                  padding: '20px',
                  border: '2px solid #D2B48C'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B5A2B', fontSize: '14px' }}>
                      <input
                        type="checkbox"
                        name="agreeToNews"
                        checked={formData.agreeToNews}
                        onChange={handleChange}
                      />
                      Я согласен на получение новостей и специальных предложений
                    </label>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B5A2B', fontSize: '14px' }}>
                      <input
                        type="checkbox"
                        name="agreeToPersonalData"
                        checked={formData.agreeToPersonalData}
                        onChange={handleChange}
                      />
                      <span>Я согласен на обработку персональных данных <span style={{ color: '#dc3545' }}>*</span></span>
                    </label>
                    {errors.agreeToPersonalData && (
                      <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
                        {errors.agreeToPersonalData}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Кнопка сохранения */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                  🐪 Зарегистрироваться
                </button>
              </div>
            </div>
          </div>
        </form>

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
            Заполняя форму, вы даёте согласие на обработку персональных данных в соответствии с политикой конфиденциальности.
            Ваши данные защищены и используются только для бронирования туров.
          </p>
        </div>
      </div>
      
    </div>
  );
};

export { ClientAccountPage };