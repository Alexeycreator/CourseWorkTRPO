import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { getClientPassport, getClients, authApi, UserData } from "../Services/IndexAuth";
import { getAddressByPassportId, getClientsByPassportId, getPassportById, Passport, updatePassport } from "../Services/PassportApi";
import { Client, getClientById, updateClient } from "../Services/ClientApi";
import { Address, getAddressById, getAddresses } from "../Services/AddressApi";
import EditDocumentModal, { DocumentFormData, AddressFormData, CombinedDocumentData } from '../EditDocumentModal';

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
  const { user, isAuthenticated, logout } = useAuth();
  const [userData, setUserData] = useState<Client | null>(null);

  // Используем массивы для хранения множества документов
  const [passportsData, setPassportsData] = useState<Passport[]>([]);
  const [addressesData, setAddressesData] = useState<Address[]>([]);

  const [editedData, setEditedData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const originalDataRef = useRef<Client | null>(null);

  // Состояния для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CombinedDocumentData | null>(null);
  const [modalMode, setModalMode] = useState<'edit' | 'add'>('edit');

  const [saveStatus, setSaveStatus] = useState({ show: false, message: '', type: '' });

  const handleLogout = () => {
    authApi.logout();
    if (logout) {
      logout();
    }
    window.location.href = '/';
  };

  // Функция для редактирования документа
  const handleEditDocument = (passport: Passport, address: Address | undefined, index: number) => {
    setModalData({
      passport: {
        seria: passport.seria?.toString() || '',
        number: passport.number?.toString() || '',
        issuedBy: passport.issuedBy || '',
        dateOfIssue: passport.dateOfIssue || '',
        departmentCode: passport.departmentCode || '',
        type: passport.type || 'passport',
        gender: (passport as any).gender || '',
        placeOfBirth: (passport as any).placeOfBirth || '',
        id: passport.id
      },
      address: address ? {
        country: address.country || 'Российская Федерация',
        city: address.city || '',
        street: address.street || '',
        house: address.house || '',
        apartment: address.apartment?.toString() || '',
        id: address.id
      } : {
        country: 'Российская Федерация',
        city: '',
        street: '',
        house: '',
        apartment: ''
      },
      passportId: passport.id,
      addressId: address?.id,
      index: index
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Функция для добавления нового документа
  const handleAddDocument = () => {
    setModalData({
      passport: {
        seria: '',
        number: '',
        issuedBy: '',
        dateOfIssue: '',
        departmentCode: '',
        type: 'passport',
        gender: '',
        placeOfBirth: ''
      },
      address: {
        country: 'Российская Федерация',
        city: '',
        street: '',
        house: '',
        apartment: ''
      },
      index: -1
    });
    setModalMode('add');
    setIsModalOpen(true);
  };

  // Функция для сохранения документа (как при редактировании, так и при добавлении)
  const handleSaveDocument = async (passportData: DocumentFormData, addressData: AddressFormData) => {
    try {
      setLoading(true);

      if (modalMode === 'edit' && modalData && modalData.index !== undefined && modalData.index >= 0) {
        // Режим редактирования - обновляем существующие документы
        const index = modalData.index;

        // Обновляем паспорт
        const updatedPassports = [...passportsData];
        updatedPassports[index] = {
          ...updatedPassports[index],
          seria: parseInt(passportData.seria, 10),
          number: parseInt(passportData.number, 10),
          issuedBy: passportData.issuedBy,
          dateOfIssue: passportData.dateOfIssue,
          departmentCode: passportData.departmentCode,
          type: passportData.type,
          gender: (passportData as any).gender,
          placeOfBirth: (passportData as any).placeOfBirth
        };
        setPassportsData(updatedPassports);

        // Обновляем адрес
        const updatedAddresses = [...addressesData];
        if (updatedAddresses[index]) {
          updatedAddresses[index] = {
            ...updatedAddresses[index],
            country: addressData.country,
            city: addressData.city,
            street: addressData.street,
            house: addressData.house,
            apartment: addressData.apartment ? parseInt(addressData.apartment, 10) : null
          };
        } else if (addressData.city || addressData.street || addressData.house) {
          // Если адреса не было, создаем новый
          updatedAddresses[index] = {
            id: Date.now(),
            region: '',
            country: addressData.country,
            city: addressData.city,
            street: addressData.street,
            house: addressData.house,
            apartment: addressData.apartment ? parseInt(addressData.apartment, 10) : null
          };
        }
        setAddressesData(updatedAddresses);

        setSaveStatus({
          show: true,
          message: 'Документы успешно обновлены!',
          type: 'success'
        });
      } else if (modalMode === 'add') {
        // Режим добавления - создаем новые документы
        const createdPassport = {
          id: Date.now(),
          seria: parseInt(passportData.seria, 10),
          number: parseInt(passportData.number, 10),
          issuedBy: passportData.issuedBy,
          dateOfIssue: passportData.dateOfIssue,
          departmentCode: passportData.departmentCode,
          type: passportData.type,
          gender: (passportData as any).gender,
          placeOfBirth: (passportData as any).placeOfBirth
        };

        const createdAddress = {
          id: Date.now(),
          region: '',
          country: addressData.country,
          city: addressData.city,
          street: addressData.street,
          house: addressData.house,
          apartment: addressData.apartment ? parseInt(addressData.apartment, 10) : null
        };

        // Добавляем новые документы в конец списков
        setPassportsData(prev => [...prev, createdPassport]);
        setAddressesData(prev => [...prev, createdAddress]);

        setSaveStatus({
          show: true,
          message: 'Новый документ успешно добавлен!',
          type: 'success'
        });
      }

      // Закрываем модальное окно
      setIsModalOpen(false);
      setModalData(null);

      setTimeout(() => {
        setSaveStatus({ show: false, message: '', type: '' });
      }, 3000);

    } catch (error: any) {
      console.error('Ошибка при сохранении документов:', error);
      setSaveStatus({
        show: true,
        message: error.response?.data?.message || 'Ошибка при сохранении документов',
        type: 'error'
      });

      setTimeout(() => {
        setSaveStatus({ show: false, message: '', type: '' });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    try {
      let loadUser = await getClientById(Number(user.id));
      setUserData(loadUser);
      console.log("Загружены данные пользователя: ", loadUser);

      let loadUserPassports: Passport[] = [];
      let loadUserAddresses: Address[] = [];

      if (loadUser.passport_Id) {
        // Загружаем паспорт пользователя
        const singlePassport = await getPassportById(loadUser.passport_Id);
        if (singlePassport) {
          loadUserPassports = [singlePassport];
          setPassportsData(loadUserPassports);
          console.log("Загружены паспорта пользователя: ", loadUserPassports);

          // Загружаем адрес для паспорта
          const address = await getAddressByPassportId(singlePassport.id);
          if (address) {
            loadUserAddresses = [address];
            setAddressesData(loadUserAddresses);
            console.log("Загружены адреса пользователя: ", loadUserAddresses);
          }
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
        // Убираем placeOfBirth из личных данных

        passports: loadUserPassports.map(p => ({
          id: p.id,
          series: p.seria,
          number: p.number,
          issuedBy: p.issuedBy,
          issuedDate: p.dateOfIssue,
          subdivisionCode: p.departmentCode,
          gender: (p as any).gender,
          placeOfBirth: (p as any).placeOfBirth
        })),

        addresses: loadUserAddresses.map(a => ({
          id: a.id,
          city: a.city,
          street: a.street,
          house: a.house,
          apartment: a.apartment,
        }))
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
    if (userData) {
      setEditedData({
        ...userData,
        passports: passportsData,
        addresses: addressesData
      });
    }
  }, [userData, passportsData, addressesData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !editedData || !originalDataRef.current) return;

    try {
      const updateData: any = {};
      const original = originalDataRef.current;

      if (editedData.surName !== original.surName) updateData.surName = editedData.surName;
      if (editedData.firstName !== original.firstName) updateData.firstName = editedData.firstName;
      if (editedData.middleName !== original.middleName) updateData.middleName = editedData.middleName || null;
      if (editedData.gender !== original.gender) updateData.gender = editedData.gender;
      if (editedData.birthday !== original.birthday) {
        updateData.birthday = typeof editedData.birthday === 'object'
          ? editedData.birthday.toISOString().split('T')[0]
          : editedData.birthday;
      }
      if (editedData.age !== original.age) updateData.age = Number(editedData.age);
      if (editedData.phoneNumber !== original.phoneNumber) updateData.phoneNumber = editedData.phoneNumber;
      if (editedData.email !== original.email) updateData.email = editedData.email;
      if (editedData.passport_Id !== original.passport_Id) updateData.passport_Id = editedData.passport_Id || null;
      // Убираем placeOfBirth из сохранения личных данных

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
      passports: passportsData,
      addresses: addressesData
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

      {isAuthenticated ? (
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
                  { id: 'documents' as const, label: '📄 Документы' },
                  { id: 'logout' as const, label: '🚪 Выход' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'logout') {
                        handleLogout();
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
              {/* Уведомление о сохранении */}
              {saveStatus.show && (
                <div style={{
                  marginBottom: '20px',
                  padding: '15px 20px',
                  background: saveStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: saveStatus.type === 'success' ? '#155724' : '#721c24',
                  border: `2px solid ${saveStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                  borderRadius: '15px',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span>{saveStatus.type === 'success' ? '✅' : '❌'}</span>
                  {saveStatus.message}
                </div>
              )}

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
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>
                            Имя <span style={{ color: '#dc3545' }}>*</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={editedData?.firstName || ''}
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
                            name="surName"
                            value={editedData?.surName || ''}
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
                            name="middleName"
                            value={editedData?.middleName || ''}
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
                            value={editedData?.email || ''}
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
                            name="phoneNumber"
                            value={editedData?.phoneNumber || ''}
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
                                value="Мужской"
                                checked={editedData?.gender === 'Мужской'}
                                onChange={handleChange}
                              />
                              Мужской
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                              <input
                                type="radio"
                                name="gender"
                                value="Женский"
                                checked={editedData?.gender === 'Женский'}
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
                              name="birthday"
                              value={editedData?.birthday || ''}
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
              ) : activeTab === 'documents' ? (
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px',
                    borderBottom: '2px solid #D2B48C',
                    paddingBottom: '10px'
                  }}>
                    <h3 style={{
                      fontSize: '24px',
                      color: '#8B5A2B',
                      fontFamily: "'Cormorant Garamond', serif",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      margin: 0
                    }}>
                      <span>📄 Мои документы</span>
                    </h3>

                    {/* Кнопка добавления нового документа */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={handleAddDocument}
                        style={{
                          padding: '8px 15px',
                          background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                          color: '#FFF8F0',
                          border: '2px solid #D2B48C',
                          borderRadius: '20px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.3s',
                          boxShadow: '0 2px 8px rgba(183, 110, 60, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(183, 110, 60, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(183, 110, 60, 0.2)';
                        }}
                      >
                        <span>➕</span> Добавить документ
                      </button>
                    </div>
                  </div>

                  {/* Если нет документов, показываем сообщение */}
                  {passportsData.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px',
                      background: '#FFF8F0',
                      borderRadius: '20px',
                      border: '2px dashed #D2B48C'
                    }}>
                      <p style={{ fontSize: '18px', color: '#8B5A2B', marginBottom: '20px' }}>
                        У вас пока нет добавленных документов
                      </p>
                      <button
                        type="button"
                        onClick={handleAddDocument}
                        style={{
                          padding: '12px 30px',
                          background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                          color: '#FFF8F0',
                          border: '2px solid #D2B48C',
                          borderRadius: '40px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '10px',
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
                        <span>➕</span> Добавить первый документ
                      </button>
                    </div>
                  ) : (
                    // Отображаем все документы
                    <section style={{ marginBottom: '30px' }}>
                      {passportsData.map((passport, index) => (
                        <div key={passport.id} style={{
                          background: '#FFF8F0',
                          borderRadius: '20px',
                          padding: '25px',
                          border: '2px solid #D2B48C',
                          marginBottom: index < passportsData.length - 1 ? '20px' : '0'
                        }}>
                          {/* Заголовок блока с одной кнопкой редактирования */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            borderBottom: '2px solid #D2B48C',
                            paddingBottom: '10px'
                          }}>
                            <h4 style={{
                              fontSize: '18px',
                              color: '#B76E3C',
                              fontFamily: "'Cormorant Garamond', serif",
                              margin: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span>📄</span> Документ #{index + 1}
                            </h4>

                            <button
                              type="button"
                              onClick={() => handleEditDocument(passport, addressesData[index], index)}
                              style={{
                                padding: '8px 20px',
                                background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                                color: '#FFF8F0',
                                border: '2px solid #D2B48C',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'all 0.3s',
                                boxShadow: '0 2px 8px rgba(183, 110, 60, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(183, 110, 60, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(183, 110, 60, 0.2)';
                              }}
                            >
                              <span>✏️</span> Редактировать
                            </button>
                          </div>

                          {/* Паспортные данные */}
                          <div style={{ marginBottom: addressesData[index] ? '25px' : '0' }}>
                            <h5 style={{
                              fontSize: '16px',
                              color: '#B76E3C',
                              fontFamily: "'Cormorant Garamond', serif",
                              borderBottom: '1px dashed #D2B48C',
                              paddingBottom: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              margin: '0 0 15px 0'
                            }}>
                              <span>🪪</span> Паспорт РФ
                            </h5>

                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '180px 1fr',
                              gap: '12px',
                              alignItems: 'center'
                            }}>
                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Серия и номер:</div>
                              <div style={{ color: '#5D3A1A' }}>
                                {passport.seria || '—'} {passport.number || '—'}
                              </div>

                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Кем выдан:</div>
                              <div style={{ color: '#5D3A1A' }}>{passport.issuedBy || '—'}</div>

                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дата выдачи:</div>
                              <div style={{ color: '#5D3A1A' }}>
                                {passport.dateOfIssue
                                  ? new Date(passport.dateOfIssue).toLocaleDateString('ru-RU')
                                  : '—'}
                              </div>

                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Код подразделения:</div>
                              <div style={{ color: '#5D3A1A' }}>{passport.departmentCode || '—'}</div>

                              {/* Пол */}
                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Пол:</div>
                              <div style={{ color: '#5D3A1A' }}>{(passport as any).gender || user?.gender || '—'}</div>

                              {/* Место рождения - ТОЛЬКО В ПАСПОРТЕ */}
                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Место рождения:</div>
                              <div style={{ color: '#5D3A1A' }}>{(passport as any).placeOfBirth || '—'}</div>
                            </div>
                          </div>

                          {/* Адрес регистрации */}
                          <div>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '15px'
                            }}>
                              <h5 style={{
                                fontSize: '16px',
                                color: '#B76E3C',
                                fontFamily: "'Cormorant Garamond', serif",
                                borderBottom: '1px dashed #D2B48C',
                                paddingBottom: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                margin: 0
                              }}>
                                <span>📍</span> Адрес регистрации
                              </h5>
                            </div>

                            {addressesData[index] ? (
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: '180px 1fr',
                                gap: '12px',
                                alignItems: 'center'
                              }}>
                                <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Страна:</div>
                                <div style={{ color: '#5D3A1A' }}>{addressesData[index].country || 'Российская Федерация'}</div>

                                <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Город:</div>
                                <div style={{ color: '#5D3A1A' }}>{addressesData[index].city || '—'}</div>

                                <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Улица:</div>
                                <div style={{ color: '#5D3A1A' }}>{addressesData[index].street || '—'}</div>

                                <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дом:</div>
                                <div style={{ color: '#5D3A1A' }}>{addressesData[index].house || '—'}</div>

                                <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Квартира:</div>
                                <div style={{ color: '#5D3A1A' }}>
                                  {addressesData[index].apartment?.toString() || '—'}
                                </div>
                              </div>
                            ) : (
                              <div style={{
                                textAlign: 'center',
                                padding: '20px',
                                color: '#8B5A2B',
                                background: 'rgba(210, 180, 140, 0.1)',
                                borderRadius: '10px'
                              }}>
                                <p>Адрес регистрации не добавлен</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </section>
                  )}

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

                        <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Количество документов:</div>
                        <div style={{ color: '#5D3A1A' }}>
                          <span style={{
                            background: '#28a745',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {passportsData.length} {passportsData.length === 1 ? 'документ' : passportsData.length < 5 ? 'документа' : 'документов'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Модальное окно для редактирования/добавления документа */}
                  <EditDocumentModal
                    open={isModalOpen}
                    data={modalData}
                    onClose={() => {
                      setIsModalOpen(false);
                      setModalData(null);
                    }}
                    onSave={handleSaveDocument}
                    mode={modalMode}
                  />
                </div>
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
                  {/* код для туров */}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
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