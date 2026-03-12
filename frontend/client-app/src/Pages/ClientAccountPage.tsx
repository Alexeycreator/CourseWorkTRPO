import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { getClientPassport, getClients } from "../Services/IndexAuth";
import { getAddressByPassportId, getClientsByPassportId, getPassportById, Passport, updatePassport } from "../Services/PassportApi";
import { Client, getClientById, updateClient } from "../Services/ClientApi";
import { Address, getAddressById, getAddresses } from "../Services/AddressApi";

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
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'bookings'>('profile');
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<Client | null>(null);
  const [passportData, setPassportData] = useState<Passport | null>(null);
  const [addressData, setAddressData] = useState<Address | null>(null);
  const [editedData, setEditedData] = useState<any>(null); // для редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const originalDataRef = useRef<Client | null>(null); // для хранения оригинальных данных

  const fetchUser = async () => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    try {
      let loadUser = await getClientById(Number(user.id));
      setUserData(loadUser);
      console.log("Загружены данные пользователя: ", loadUser);
      let loadUserPassport;
      let loadUserPassportAddress;

      if (loadUser.passport_Id) {
        loadUserPassport = await getPassportById(loadUser.passport_Id);
        setPassportData(loadUserPassport);
        console.log("Загружены данные паспорта пользователя: ", loadUserPassport);

        if (loadUserPassport) {
          loadUserPassportAddress = await getAddressByPassportId(loadUserPassport.id);
          setAddressData(loadUserPassportAddress);
          console.log("Загружены данные регистрации пользователя: ", loadUserPassportAddress);
        }
      }
      const combinedData = {
        id: loadUser.id,
        surName: loadUser.surName,
        firstName: loadUser.firstName,
        middleName: loadUser.middleName,
        phoneNumber: loadUser.phoneNumber,
        email: loadUser.email,
        login: loadUser.login,
        gender: loadUser.gender,
        birthday: loadUser.birthday,
        age: loadUser.age,
        passport_Id: loadUser.passport_Id,
        isReadOnly: loadUser.isReadOnly,

        passport: loadUserPassport ? {
          id: loadUserPassport.id,
          series: loadUserPassport.seria,
          number: loadUserPassport.number,
          issuedBy: loadUserPassport.issuedBy,
          issuedDate: loadUserPassport.dateOfIssue,
          subdivisionCode: loadUserPassport.departmentCode
        } : null,

        address: loadUserPassportAddress ? {
          id: loadUserPassportAddress.id,
          city: loadUserPassportAddress.city,
          street: loadUserPassportAddress.street,
          house: loadUserPassportAddress.house,
          apartment: loadUserPassportAddress.apartment,
        } : null
      };
      setEditedData(combinedData);
      originalDataRef.current = JSON.parse(JSON.stringify(combinedData));
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user?.id]);

  useEffect(() => {
    if (userData && passportData) {
      setEditedData({
        ...userData,
        ...passportData,
        address: addressData
      });
    }
  }, [userData, passportData, addressData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Обработка вложенных полей (например, "passport.series")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setEditedData((prev: any) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

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

    if (!editedData?.firstName) newErrors.firstName = 'Имя обязательно';
    if (!editedData?.surName) newErrors.lastName = 'Фамилия обязательна';
    if (!editedData?.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(editedData.email)) {
      newErrors.email = 'Email некорректен';
    }
    if (!editedData?.phoneNumber) newErrors.phone = 'Телефон обязателен';

    // Проверка паспортных данных
    if (editedData?.seria) {
      if (!editedData.seria) newErrors.passportSeries = 'Серия паспорта обязательна';
      if (!editedData.number) newErrors.passportNumber = 'Номер паспорта обязателен';
    }

    // Проверка адреса
    if (editedData?.address) {
      if (!editedData.address.city) newErrors.city = 'Город обязателен';
      if (!editedData.address.street) newErrors.street = 'Улица обязательна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !editedData || !originalDataRef.current) return;

    try {
      const updateData: any = {};
      const original = originalDataRef.current;

      if (editedData.surName !== original.surName) {
        updateData.surName = editedData.surName;
      }
      if (editedData.firstName !== original.firstName) {
        updateData.firstName = editedData.firstName;
      }
      if (editedData.middleName !== original.middleName) {
        updateData.middleName = editedData.middleName || null;
      }
      if (editedData.gender !== original.gender) {
        updateData.gender = editedData.gender;
      }
      if (editedData.birthday !== original.birthday) {
        updateData.birthday = typeof editedData.birthday === 'object'
          ? editedData.birthday.toISOString().split('T')[0]
          : editedData.birthday;
      }

      if (editedData.age !== original.age) {
        updateData.age = Number(editedData.age);
      }
      if (editedData.phoneNumber !== original.phoneNumber) {
        updateData.phoneNumber = editedData.phoneNumber;
      }
      if (editedData.email !== original.email) {
        updateData.email = editedData.email;
      }
      if (editedData.passport_Id !== original.passport_Id) {
        updateData.passport_Id = editedData.passport_Id || null;
      }
      if (Object.keys(updateData).length === 0) {
        console.log('Нет изменений для сохранения');
        return;
      }

      console.log("Отправляю изменения клиента:", updateData);

      const updatedClient = await updateClient(editedData.id, updateData);

      originalDataRef.current = {
        ...originalDataRef.current,
        ...updateData
      };

      console.log('Данные успешно сохранены!');
      setIsEditing(false);

    } catch (error: any) {
      console.error("Ошибка:", error);
      console.log(error.response?.data?.message || 'Ошибка при сохранении');
    }
  };

  const handleCancel = () => {
    setEditedData({
      ...userData,
      ...passportData,
      address: addressData
    });
    setIsEditing(false);
    setErrors({});
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <div>Пожалуйста, войдите в систему</div>;
  }

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

  // const getGenderText = (gender: string) => {
  //   return gender === 'male' ? 'Мужской' : 'Женский';
  // };

  // const getFullBirthDate = () => {
  //   if (clientData.birthDay && clientData.birthMonth && clientData.birthYear) {
  //     const monthIndex = parseInt(clientData.birthMonth) - 1;
  //     return `${clientData.birthDay} ${months[monthIndex]} ${clientData.birthYear}`;
  //   }
  //   return 'Не указано';
  // };

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

      {isAuthenticated ? (<div style={{
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
            {isEditing ? 'Редактирование профиля' : 'Здравствуйте, ' + user?.firstName + '!'}
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
              👤 {user?.firstName} {user?.surName}
            </h2>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                { id: 'profile' as const, label: '📋 Мои данные' },
                //{ id: 'bookings' as const, label: '🗺️ Мои туры', badge: bookedTours.length.toString() },
                { id: 'documents' as const, label: '📄 Документы' },
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
                  {/* {item.badge && (
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
                  )} */}
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
                          value={editedData.surName}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.surName ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.surName && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.surName}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Отчество
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={editedData.middleName}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.middleName ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.middleName && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.middleName}</div>
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
                          value={editedData.phoneNumber}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.phoneNumber ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.phoneNumber && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.phoneNumber}</div>
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
                              checked={editedData.gender === 'Мужской'}
                              onChange={handleChange}
                            />
                            Мужской
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={editedData.gender === 'Женский'}
                              onChange={handleChange}
                            />
                            Женский
                          </label>
                        </div>
                      </div>

                      <div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                            Дата рождения <span style={{ color: '#dc3545' }}>*</span>
                          </label>
                          <input
                            type="date"
                            name="passportDate"
                            value={editedData.birthday}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: `2px solid ${errors.birthday ? '#dc3545' : '#D2B48C'}`,
                              borderRadius: '15px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B',
                              fontSize: '15px',
                              outline: 'none'
                            }}
                          />
                          {errors.birthday && (
                            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.birthday}</div>
                          )}
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
                        <div style={{ color: '#5D3A1A', fontSize: '16px' }}>{user?.firstName}</div>
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Фамилия:</div>
                        <div style={{ color: '#5D3A1A', fontSize: '16px' }}>{user?.surName}</div>
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Отчество:</div>
                        <div style={{ color: '#5D3A1A', fontSize: '16px' }}>{user?.middleName}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Email:</div>
                        <div style={{ color: '#5D3A1A' }}>{user?.email}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Телефон:</div>
                        <div style={{ color: '#5D3A1A' }}>{user?.phoneNumber}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Пол:</div>
                        <div style={{ color: '#5D3A1A' }}>{user?.gender}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дата рождения:</div>
                        <div style={{ color: '#5D3A1A' }}>{user?.birthday}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Возраст:</div>
                        <div style={{ color: '#5D3A1A' }}>{user?.age}</div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Паспортные данные 
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
                          value={editedData.seria}
                          onChange={handleChange}
                          maxLength={4}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.seria ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.seria && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.seria}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Номер <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="passportNumber"
                          value={editedData.number}
                          onChange={handleChange}
                          maxLength={6}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.number ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.number && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.number}</div>
                        )}
                      </div>

                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Кем выдан <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="passportIssued"
                          value={editedData.issuedBy}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.issuedBy ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.issuedBy && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.issuedBy}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Дата выдачи <span style={{ color: '#dc3545' }}>*</span>
                        </label>
                        <input
                          type="date"
                          name="passportDate"
                          value={editedData.dateOfIssue}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: `2px solid ${errors.dateOfIssue ? '#dc3545' : '#D2B48C'}`,
                            borderRadius: '15px',
                            backgroundColor: '#FFF8F0',
                            color: '#8B5A2B',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                        {errors.dateOfIssue && (
                          <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '3px' }}>{errors.dateOfIssue}</div>
                        )}
                      </div>

                      <div>
                        <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                          Код подразделения
                        </label>
                        <input
                          type="text"
                          name="passportCode"
                          value={editedData.departmentCode}
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
                        <div style={{ color: '#5D3A1A' }}>{passportData?.seria} {passportData?.number}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Кем выдан:</div>
                        <div style={{ color: '#5D3A1A' }}>{passportData?.issuedBy}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дата выдачи:</div>
                        <div style={{ color: '#5D3A1A' }}>{passportData?.dateOfIssue}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Код подразделения:</div>
                        <div style={{ color: '#5D3A1A' }}>{passportData?.departmentCode}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Тип паспорта:</div>
                        <div style={{ color: '#5D3A1A' }}>{passportData?.type}</div>
                      </div>
                    </div>
                  )}
                </section>
*/}
                {/* Адрес регистрации 
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
                          value={editedData.address.city}
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
                          value={`ул. ${editedData.address.street}, д. ${editedData.address?.house}, кв. ${editedData.address?.apartment}`}
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
                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Страна:</div>
                        <div style={{ color: '#5D3A1A' }}>{addressData?.country}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Город:</div>
                        <div style={{ color: '#5D3A1A' }}>{addressData?.city}</div>

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Адрес:</div>
                        <div style={{ color: '#5D3A1A' }}>ул. {addressData?.street}, д. {addressData?.house}, кв. {addressData?.apartment}</div>
                      </div>
                    </div>
                  )}
                </section>
*/}
                {/* Согласия 
                <section style={{ marginBottom: '30px' }}>
                  <div style={{
                    background: '#FFF8F0',
                    borderRadius: '20px',
                    padding: '20px',
                    border: '2px solid #D2B48C'
                  }}>
                    {isEditing ? (
                      <>
                        <div>
                          Соглашения (в разработке)
                        </div>
                         <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B5A2B', fontSize: '14px' }}>
                            <input
                              type="checkbox"
                              name="agreeToNews"
                              checked={editedData.agreeToNews}
                              onChange={handleChange}
                            />
                            Получать новости и специальные предложения (в разработке)
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
                            <span>Согласие на обработку персональных данных (в разработке)<span style={{ color: '#dc3545' }}>*</span></span>
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
                        <div style={{ color: '#5D3A1A' }}>В разработке</div>
                        {/* <div style={{ color: '#5D3A1A' }}>{clientData.agreeToNews ? '✓ Согласен' : '✗ Не согласен'}</div> 

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Персональные данные:</div>
                        <div style={{ color: '#5D3A1A' }}>В разработке</div>
                        {/* <div style={{ color: '#5D3A1A' }}>{clientData.agreeToPersonalData ? '✓ Согласен' : '✗ Не согласен'}</div> 
                      </div>
                    )}
                  </div>
                </section>*/}

                {/* Кнопки сохранения/отмены */}
                {isEditing && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button
                      type="submit"
                      onClick={handleSave}
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
            ) : activeTab === 'documents' ? (

              <div>
                <h3 style={{
                  fontSize: '24px',
                  color: '#8B5A2B',
                  marginBottom: '25px',
                  fontFamily: "'Cormorant Garamond', serif",
                  borderBottom: '2px solid #D2B48C',
                  paddingBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span>📄 Мои документы</span>
                </h3>

                {/* Паспортные данные */}
                <section style={{ marginBottom: '30px' }}>
                  <h4 style={{
                    fontSize: '18px',
                    color: '#8B5A2B',
                    marginBottom: '15px',
                    fontFamily: "'Cormorant Garamond', serif"
                  }}>
                    🪪 Паспортные данные
                  </h4>
                  <div style={{
                    background: '#FFF8F0',
                    borderRadius: '20px',
                    padding: '20px',
                    border: '2px solid #D2B48C'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '180px 1fr',
                      gap: '15px',
                      alignItems: 'center'
                    }}>
                      <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Серия и номер:</div>
                      <div style={{ color: '#5D3A1A' }}>{passportData?.seria} {passportData?.number}</div>

                      <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Кем выдан:</div>
                      <div style={{ color: '#5D3A1A' }}>{passportData?.issuedBy}</div>

                      <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дата выдачи:</div>
                      <div style={{ color: '#5D3A1A' }}>{passportData?.dateOfIssue}</div>

                      <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Код подразделения:</div>
                      <div style={{ color: '#5D3A1A' }}>{passportData?.departmentCode}</div>

                      <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Тип паспорта:</div>
                      <div style={{ color: '#5D3A1A' }}>{passportData?.type}</div>

                      {/* Выделенный блок с адресом регистрации */}
                      <div style={{
                        marginTop: '20px',
                      }}>
                        <h5 style={{
                          fontSize: '16px',
                          color: '#B76E3C',
                          marginBottom: '15px',
                          fontFamily: "'Cormorant Garamond', serif",
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          Адрес регистрации:
                        </h5>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '180px 1fr',
                          gap: '15px',
                          alignItems: 'center'
                        }}>
                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Страна:</div>
                          <div style={{ color: '#5D3A1A' }}>{addressData?.country}</div>

                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Город:</div>
                          <div style={{ color: '#5D3A1A' }}>{addressData?.city}</div>

                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Улица:</div>
                          <div style={{ color: '#5D3A1A' }}>{addressData?.street}</div>

                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дом:</div>
                          <div style={{ color: '#5D3A1A' }}>{addressData?.house}</div>

                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Квартира:</div>
                          <div style={{ color: '#5D3A1A' }}>{addressData?.apartment || '—'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Дополнительная информация */}
                <section>
                  <h4 style={{
                    fontSize: '18px',
                    color: '#8B5A2B',
                    marginBottom: '15px',
                    fontFamily: "'Cormorant Garamond', serif"
                  }}>
                    ℹ️ Дополнительная информация
                  </h4>
                  <div style={{
                    background: '#FFF8F0',
                    borderRadius: '20px',
                    padding: '20px',
                    border: '2px solid #D2B48C'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '180px 1fr',
                      gap: '15px',
                      alignItems: 'center'
                    }}>
                      <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Гражданство:</div>
                      <div style={{ color: '#5D3A1A' }}>Российская Федерация</div>

                      <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Статус документа:</div>
                      <div style={{ color: '#5D3A1A' }}>
                        <span style={{
                          background: '#28a745',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px'
                        }}>
                          Действителен
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              // Вкладка "Мои туры" (существующий код)
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

                {/* код в файле */}
              </div>
            )}
          </div>
        </div>
      </div>) : (
        <div
          style={{
            textAlign: 'center'
          }}
        >
          <h1>Доступ заблокирован</h1>
          <p>Пожалуйста, зайдите в профиль или обратитесь в тех. поддержку</p>
        </div>
      )}
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
        </p>
      </div>
    </div>
  );
};

export { ClientAccountPage };