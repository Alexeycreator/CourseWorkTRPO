import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { getClientPassport, getClients, authApi, UserData } from "../Services/IndexAuth";
import { getAddressByPassportId, getClientsByPassportId, getPassportById, Passport, updatePassport, createPassport, deletePassport } from "../Services/PassportApi";
import { Client, getClientById, updateClient, getClientTickets } from "../Services/ClientApi";
import { Address, getAddressById, getAddresses } from "../Services/AddressApi";
import EditDocumentModal, { DocumentFormData, AddressFormData, CombinedDocumentData } from '../EditDocumentModal';
import { Link } from 'react-router-dom';
import { getEmployees, Employee, updateEmployee, getEmployeeById } from "../Services/EmployeesApi";
import { createTour } from "../Services/ToursApi";
import { createHotel } from "../Services/HotelsApi";
import { createHotelRoom } from "../Services/HotelRoomsApi";
import { createAddress, updateAddress, deleteAddress } from "../Services/AddressApi";
// Обновленные интерфейсы согласно моделям
interface Tour {
  id?: number;
  name: string;
  startDot: string;
  endDot: string;
  details: string;
  imageTour: string;
  description: string;
  separately: string;
  included: string;
  program: string;
  type: string;
  hotTour: boolean;
  price: number;
  isReadOnly?: boolean;
  tickets_Id?: number | null;
  transfers_Id?: number | null;
}

interface Hotel {
  id?: number;
  name: string;
  stars: number;
  timeOfStay: number;
  imageHotel: string;
  details?: string | null;
  isReadOnly?: boolean;
  address_Id?: number | null;
  tickets_Id?: number | null;
  hotelRooms_Id?: number;
}

interface HotelRoom {
  id?: number;
  nameRoom: string;
  details?: string | null;
  floor: number;
  imageRoom?: string | null;
  isReadOnly?: boolean;
}

const ClientAccountPage = () => {
  // Состояние для активной вкладки
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'bookings' | 'admin' | 'employee'>('profile');
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

  // Состояния для туров, отелей и номеров
  const [tours, setTours] = useState<Tour[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelRooms, setHotelRooms] = useState<HotelRoom[]>([]);

  // Состояния для форм добавления
  const [showTourForm, setShowTourForm] = useState(false);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);

  // Состояния для админ-панели
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<'clients' | 'employees'>('clients');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewingUserData, setViewingUserData] = useState<Client | Employee | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  // Формы для добавления
  const [newTour, setNewTour] = useState<Partial<Tour>>({
    type: 'Экскурсионный',
    hotTour: false,
    separately: 'Не предусмотрено',
    included: 'Не предусмотрено',
    program: 'Не предусмотрено',
    imageTour: '/default-tour.jpg'
  });

  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    stars: 3,
    timeOfStay: 1,
    imageHotel: '/default-hotel.jpg',
    details: ''
  });

  const [newRoom, setNewRoom] = useState<Partial<HotelRoom>>({
    floor: 1,
    details: '',
    imageRoom: '/default-room.jpg'
  });

  // Функция для сброса всех форм
  const resetForms = () => {
    setShowTourForm(false);
    setShowHotelForm(false);
    setShowRoomForm(false);
    setNewTour({
      type: 'Экскурсионный',
      hotTour: false,
      separately: 'Не предусмотрено',
      included: 'Не предусмотрено',
      program: 'Не предусмотрено',
      imageTour: '/default-tour.jpg'
    });
    setNewHotel({
      stars: 3,
      timeOfStay: 1,
      imageHotel: '/default-hotel.jpg',
      details: ''
    });
    setNewRoom({
      floor: 1,
      details: '',
      imageRoom: '/default-room.jpg'
    });
  };

  // Функция для обработки смены вкладки
  const handleTabChange = (tabId: 'profile' | 'documents' | 'bookings' | 'admin' | 'employee') => {
    setActiveTab(tabId);
    if (tabId !== 'profile') {
      setIsEditing(false);
    }
    resetForms();
    setSelectedUserId(null);
    setViewingUserData(null);
  };

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
        type: passport.type || 'internal',
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
        type: 'internal',
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

  // Функция для сохранения документа
  const handleSaveDocument = async (passportData: DocumentFormData, addressData: AddressFormData) => {
    try {
      setLoading(true);

      if (modalMode === 'edit' && modalData && modalData.index !== undefined && modalData.index >= 0) {
        const index = modalData.index;
        const existingPassport = passportsData[index];
        const existingAddress = addressesData[index];

        // 1. Обновляем паспорт (используем существующую функцию updatePassport)
        await updatePassport(existingPassport.id, {
          seria: parseInt(passportData.seria, 10),
          number: parseInt(passportData.number, 10),
          type: passportData.type
        });

        // Обновляем локальное состояние паспорта
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

        // 2. Обновляем адрес (если существует)
        if (existingAddress && existingAddress.id) {
          try {
            await updateAddress(existingAddress.id, {
              country: addressData.country,
              region: addressData.country,
              city: addressData.city,
              street: addressData.street,
              house: addressData.house,
              apartment: addressData.apartment ? parseInt(addressData.apartment, 10) : null
            });
          } catch (err) {
            console.warn('Не удалось обновить адрес:', err);
          }

          const updatedAddresses = [...addressesData];
          updatedAddresses[index] = {
            ...updatedAddresses[index],
            country: addressData.country,
            city: addressData.city,
            street: addressData.street,
            house: addressData.house,
            apartment: addressData.apartment ? parseInt(addressData.apartment, 10) : null
          };
          setAddressesData(updatedAddresses);
        }

        setSaveStatus({
          show: true,
          message: 'Документ успешно обновлён!',
          type: 'success'
        });
      }
      else if (modalMode === 'add') {
        // 1. Создаём паспорт через прямой POST с ВСЕМИ полями
        const passportResponse = await fetch('http://localhost:5050/api/Passports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            seria: parseInt(passportData.seria, 10),
            number: parseInt(passportData.number, 10),
            type: passportData.type,
            issuedBy: passportData.issuedBy,
            dateOfIssue: passportData.dateOfIssue,
            departmentCode: passportData.departmentCode,
            gender: (passportData as any).gender,
            placeOfBirth: (passportData as any).placeOfBirth
          })
        });

        if (!passportResponse.ok) {
          const errorData = await passportResponse.json();
          throw new Error(errorData.message || 'Ошибка создания паспорта');
        }

        const createdPassport = await passportResponse.json();

        // Формируем полный объект паспорта
        const fullPassport = {
          ...createdPassport,
          seria: parseInt(passportData.seria, 10),
          number: parseInt(passportData.number, 10),
          issuedBy: passportData.issuedBy,
          dateOfIssue: passportData.dateOfIssue,
          departmentCode: passportData.departmentCode,
          type: passportData.type,
          gender: (passportData as any).gender,
          placeOfBirth: (passportData as any).placeOfBirth
        };

        // 2. Создаём адрес в БД (если заполнен)
        let createdAddress: Address | null = null;
        if (addressData.city || addressData.street || addressData.house) {
          try {
            const addressResponse = await fetch('http://localhost:5050/api/Addresses', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                country: addressData.country,
                region: addressData.country,
                city: addressData.city,
                street: addressData.street,
                house: addressData.house,
                apartment: addressData.apartment ? parseInt(addressData.apartment, 10) : null,
                passport_Id: createdPassport.id
              })
            });

            if (addressResponse.ok) {
              createdAddress = await addressResponse.json();
            }
          } catch (err) {
            console.warn('Не удалось создать адрес:', err);
          }
        }

        // 3. Обновляем клиента
        if (userData && !userData.passport_Id) {
          try {
            await updateClient(userData.id, {
              surName: userData.surName,
              firstName: userData.firstName,
              middleName: userData.middleName,
              phoneNumber: userData.phoneNumber,
              email: userData.email,
              login: userData.login,
              gender: userData.gender,
              birthday: userData.birthday,
              age: userData.age,
              passport_Id: createdPassport.id
            });
            setUserData(prev => prev ? { ...prev, passport_Id: createdPassport.id } : null);
          } catch (err) {
            console.warn('Не удалось обновить клиента:', err);
          }
        }

        // 4. Обновляем локальные состояния
        setPassportsData(prev => [...prev, fullPassport]);
        setAddressesData(prev => [...prev, createdAddress || {
          id: Date.now(),
          region: addressData.country,
          country: addressData.country,
          city: addressData.city,
          street: addressData.street,
          house: addressData.house,
          apartment: addressData.apartment ? parseInt(addressData.apartment, 10) : null,
          passport_Id: createdPassport.id
        }]);

        setSaveStatus({
          show: true,
          message: 'Новый документ успешно добавлен в базу данных!',
          type: 'success'
        });
      }

      setIsModalOpen(false);
      setModalData(null);

      // Перезагружаем данные с сервера для синхронизации
      setTimeout(() => {
        fetchUser();
      }, 500);

      setTimeout(() => {
        setSaveStatus({ show: false, message: '', type: '' });
      }, 3000);

    } catch (error: any) {
      console.error('Ошибка при сохранении документов:', error);
      setSaveStatus({
        show: true,
        message: error.response?.data?.message || error.message || 'Ошибка при сохранении документов',
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
        const singlePassport = await getPassportById(loadUser.passport_Id);
        if (singlePassport) {
          loadUserPassports = [singlePassport];
          setPassportsData(loadUserPassports);
          console.log("Загружены паспорта пользователя: ", loadUserPassports);

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

  const fetchAllClients = async () => {
    try {
      setLoading(true);
      const clients = await getClients();
      setAllClients(clients as Client[]);
    } catch (error) {
      console.error("Ошибка загрузки клиентов:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      setLoading(true);
      const employees = await getEmployees();
      setAllEmployees(employees);
    } catch (error) {
      console.error("Ошибка загрузки сотрудников:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (id: number, type: 'clients' | 'employees') => {
    setSelectedUserId(id);
    setSelectedUserType(type);
    try {
      if (type === 'clients') {
        const client = await getClientById(id);
        setViewingUserData(client);
      } else {
        const employee = await getEmployeeById(id);
        setViewingUserData(employee);
      }
      setIsEditingUser(false);
    } catch (error) {
      console.error("Ошибка загрузки пользователя:", error);
    }
  };

  const handleAddTourAsync = async () => {
    if (!newTour.name || !newTour.startDot || !newTour.endDot || !newTour.price) {
      setSaveStatus({
        show: true,
        message: 'Пожалуйста, заполните все обязательные поля',
        type: 'error'
      });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
      return;
    }

    try {
      setLoading(true);
      const tourData: any = {
        name: newTour.name,
        startDot: newTour.startDot,
        endDot: newTour.endDot,
        details: newTour.details || '',
        imageTour: newTour.imageTour || '/default-tour.jpg',
      };

      const createdTour = await createTour(tourData);

      const fullTour: Tour = {
        ...createdTour,
        price: newTour.price || 0,
        description: newTour.description || '',
        separately: newTour.separately || 'Не предусмотрено',
        included: newTour.included || 'Не предусмотрено',
        program: newTour.program || 'Не предусмотрено',
        hotTour: newTour.hotTour || false,
        type: newTour.type || 'Экскурсионный'
      };

      setTours(prev => [...prev, fullTour]);
      setShowTourForm(false);
      setNewTour({
        type: 'Экскурсионный',
        hotTour: false,
        separately: 'Не предусмотрено',
        included: 'Не предусмотрено',
        program: 'Не предусмотрено',
        imageTour: '/default-tour.jpg'
      });
      setSaveStatus({
        show: true,
        message: 'Тур успешно добавлен!',
        type: 'success'
      });
    } catch (error) {
      console.error('Ошибка создания тура:', error);
      setSaveStatus({
        show: true,
        message: 'Ошибка при создании тура',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleAddHotelAsync = async () => {
    if (!newHotel.name || !newHotel.stars || !newHotel.timeOfStay || !newHotel.imageHotel) {
      setSaveStatus({
        show: true,
        message: 'Пожалуйста, заполните все обязательные поля',
        type: 'error'
      });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
      return;
    }

    try {
      setLoading(true);
      const createdRoom = await createHotelRoom({
        nameRoom: `Стандартный номер ${newHotel.name}`,
        floor: 1,
        details: 'Стандартный номер',
        imageRoom: '/default-room.jpg'
      });

      const createdHotel = await createHotel({
        name: newHotel.name,
        stars: newHotel.stars,
        timeOfStay: newHotel.timeOfStay,
        imageHotel: newHotel.imageHotel,
        details: newHotel.details || '',
        hotelRooms_Id: createdRoom.id
      });

      setHotels(prev => [...prev, createdHotel as Hotel]);
      setShowHotelForm(false);
      setNewHotel({
        stars: 3,
        timeOfStay: 1,
        imageHotel: '/default-hotel.jpg',
        details: ''
      });
      setSaveStatus({
        show: true,
        message: 'Отель успешно добавлен!',
        type: 'success'
      });
    } catch (error) {
      console.error('Ошибка создания отеля:', error);
      setSaveStatus({
        show: true,
        message: 'Ошибка при создании отеля',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    }
  };


  //Функции для удаления документов
  // Добавьте эти функции в ClientAccountPage.tsx

  // 1. Функция для удаления паспорта через API
  const deletePassportFromDb = async (passportId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/Passports/${passportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при удалении паспорта');
      }

      return true;
    } catch (error) {
      console.error('Ошибка удаления паспорта:', error);
      throw error;
    }
  };

  // 2. Функция для удаления адреса через API
  const deleteAddressFromDb = async (addressId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/Addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Если адрес не найден - это не ошибка, просто адреса не было
      if (response.status === 404) {
        return true;
      }

      if (!response.ok) {
        throw new Error('Ошибка при удалении адреса');
      }

      return true;
    } catch (error) {
      console.error('Ошибка удаления адреса:', error);
      // Не прерываем удаление, если адрес не удалился
      return true;
    }
  };

  // 3. Функция для обновления клиента (удаление ссылки на паспорт)
  const removePassportFromClient = async (clientId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/Clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          passport_Id: null
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении клиента');
      }

      return true;
    } catch (error) {
      console.error('Ошибка обновления клиента:', error);
      throw error;
    }
  };

  // Функция для удаления документа
  const handleDeleteDocument = async (passport: Passport, address: Address | undefined, index: number) => {
    // Подтверждение удаления
    if (!window.confirm(`Вы уверены, что хотите удалить паспорт #${index + 1}? Это действие нельзя отменить.`)) {
      return;
    }

    setLoading(true);
    try {
      // ВАЖНО: Сначала обновляем клиента - УБИРАЕМ ССЫЛКУ НА ПАСПОРТ
      if (userData?.passport_Id === passport.id) {
        try {
          await updateClient(userData.id, {
            surName: userData.surName,
            firstName: userData.firstName,
            middleName: userData.middleName,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            login: userData.login,
            gender: userData.gender,
            birthday: userData.birthday,
            age: userData.age,
            passport_Id: null  // ← Убираем ссылку на паспорт
          });
          console.log('Ссылка на паспорт удалена у клиента');

          // Обновляем локальное состояние клиента
          setUserData(prev => prev ? { ...prev, passport_Id: null } : null);
        } catch (err) {
          console.error('Не удалось обновить клиента:', err);
          throw new Error('Не удалось удалить связь с клиентом. Удаление отменено.');
        }
      }

      // Небольшая задержка, чтобы сервер обработал обновление клиента
      await new Promise(resolve => setTimeout(resolve, 500));

      // 2. Удаляем адрес (если есть)
      if (address && address.id) {
        try {
          await deleteAddress(address.id);
          console.log('Адрес удалён');
        } catch (err) {
          console.warn('Адрес не найден или уже удалён:', err);
        }
      }

      // 3. Теперь удаляем сам паспорт (он уже не связан с клиентом)
      await deletePassport(passport.id);
      console.log('Паспорт удалён');

      // 4. Обновляем локальные состояния
      const newPassportsData = [...passportsData];
      newPassportsData.splice(index, 1);
      setPassportsData(newPassportsData);

      const newAddressesData = [...addressesData];
      newAddressesData.splice(index, 1);
      setAddressesData(newAddressesData);

      setSaveStatus({
        show: true,
        message: 'Паспорт успешно удалён!',
        type: 'success'
      });

      // 5. Перезагружаем данные
      await fetchUser();

    } catch (error: any) {
      console.error('Ошибка при удалении паспорта:', error);
      setSaveStatus({
        show: true,
        message: error.message || 'Ошибка при удалении паспорта',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSaveStatus({ show: false, message: '', type: '' });
      }, 3000);
    }
  };


  const handleAddRoomAsync = async () => {
    if (!newRoom.nameRoom || !newRoom.floor) {
      setSaveStatus({
        show: true,
        message: 'Пожалуйста, заполните все обязательные поля',
        type: 'error'
      });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
      return;
    }

    try {
      setLoading(true);
      const createdRoom = await createHotelRoom({
        nameRoom: newRoom.nameRoom,
        floor: newRoom.floor,
        details: newRoom.details || '',
        imageRoom: newRoom.imageRoom || '/default-room.jpg'
      });

      setHotelRooms(prev => [...prev, createdRoom as HotelRoom]);
      setShowRoomForm(false);
      setNewRoom({
        floor: 1,
        details: '',
        imageRoom: '/default-room.jpg'
      });
      setSaveStatus({
        show: true,
        message: 'Номер успешно добавлен!',
        type: 'success'
      });
    } catch (error) {
      console.error('Ошибка создания номера:', error);
      setSaveStatus({
        show: true,
        message: 'Ошибка при создании номера',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    }
  };

  if (loading && !userData) {
    return <div>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <div>Пожалуйста, войдите в систему</div>;
  }

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
                  { id: 'bookings' as const, label: '🗺️ Мои бронирования' },
                  { id: 'admin' as const, label: '👨‍💼 Администратор' },
                  { id: 'employee' as const, label: '👨‍💻 Сотрудник' },
                  { id: 'logout' as const, label: '🚪 Выход' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'logout') {
                        handleLogout();
                      } else {
                        handleTabChange(item.id);
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
                    <section style={{ marginBottom: '30px' }}>
                      {passportsData.map((passport, index) => (
                        <div key={passport.id} style={{
                          background: '#FFF8F0',
                          borderRadius: '20px',
                          padding: '25px',
                          border: '2px solid #D2B48C',
                          marginBottom: index < passportsData.length - 1 ? '20px' : '0'
                        }}>
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
                            <div style={{ display: 'flex', gap: '10px' }}>
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
                                <span>✏️</span> Редактировать документ
                              </button>

                              <button
                                type="button"
                                //onClick={() => handleDeleteDocument(passport, addressesData[index], index)}
                                disabled={loading}
                                style={{
                                  padding: '8px 20px',
                                  background: 'linear-gradient(135deg, #dc3545, #c82333)',
                                  color: '#FFF8F0',
                                  border: '2px solid #D2B48C',
                                  borderRadius: '20px',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  transition: 'all 0.3s',
                                  boxShadow: '0 2px 8px rgba(220, 53, 69, 0.2)',
                                  opacity: loading ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => {
                                  if (!loading) {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!loading) {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.2)';
                                  }
                                }}
                              >
                                <span>🗑️</span> {loading ? 'Удаление...' : 'Удалить'}
                              </button>
                            </div>
                          </div>

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
                              <span>🪪</span> {passport.type === 'foreign' ? 'Загранпаспорт' : 'Паспорт РФ'}
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

                              {passport.type === 'foreign' && passport.dateOfExpiry && (
                                <>
                                  <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Срок действия:</div>
                                  <div style={{ color: '#5D3A1A' }}>
                                    {new Date(passport.dateOfExpiry).toLocaleDateString('ru-RU')}
                                  </div>
                                </>
                              )}

                              {passport.type === 'internal' && (
                                <>
                                  <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Код подразделения:</div>
                                  <div style={{ color: '#5D3A1A' }}>{passport.departmentCode || '—'}</div>
                                </>
                              )}

                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Пол:</div>
                              <div style={{ color: '#5D3A1A' }}>{passport.gender || '—'}</div>

                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Место рождения:</div>
                              <div style={{ color: '#5D3A1A' }}>{passport.placeOfBirth || '—'}</div>
                            </div>
                          </div>

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
              ) : activeTab === 'bookings' ? (
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

                  {tours.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px',
                      background: '#FFF8F0',
                      borderRadius: '20px',
                      border: '2px solid #D2B48C'
                    }}>
                      <p style={{ fontSize: '18px', color: '#8B5A2B' }}>
                        У вас пока нет забронированных туров
                      </p>
                      <Link to="/catalog" style={{ textDecoration: 'none' }}>
                        <button style={{
                          marginTop: '20px',
                          padding: '12px 30px',
                          background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                          color: '#FFF8F0',
                          border: '2px solid #D2B48C',
                          borderRadius: '40px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          boxShadow: '0 5px 15px rgba(183, 110, 60, 0.3)'
                        }}>
                          🐪 Выбрать тур
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px'
                    }}>
                      {tours.map((tour) => (
                        <div key={tour.id} style={{
                          background: '#FFF8F0',
                          borderRadius: '20px',
                          padding: '25px',
                          border: '2px solid #D2B48C',
                          position: 'relative'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                            color: 'white',
                            padding: '5px 15px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
                          }}>
                            <span>✅</span> Оформлен
                          </div>

                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '200px 1fr',
                            gap: '25px'
                          }}>
                            <div style={{
                              width: '100%',
                              height: '150px',
                              borderRadius: '15px',
                              overflow: 'hidden',
                              border: '2px solid #D2B48C'
                            }}>
                              <img
                                src={tour.imageTour}
                                alt={tour.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </div>

                            <div>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '10px'
                              }}>
                                <h4 style={{
                                  fontSize: '20px',
                                  color: '#8B5A2B',
                                  fontFamily: "'Cormorant Garamond', serif",
                                  margin: 0
                                }}>
                                  {tour.name}
                                </h4>
                              </div>

                              <p style={{
                                color: '#5D3A1A',
                                fontSize: '14px',
                                marginBottom: '15px',
                                lineHeight: '1.6'
                              }}>
                                {tour.description}
                              </p>

                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '10px',
                                marginBottom: '15px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ color: '#8B5A2B' }}>📍</span>
                                  <span style={{ color: '#5D3A1A', fontSize: '14px' }}>
                                    {tour.startDot} → {tour.endDot}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ color: '#8B5A2B' }}>🏷️</span>
                                  <span style={{ color: '#5D3A1A', fontSize: '14px' }}>
                                    {tour.type}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ color: '#8B5A2B' }}>💰</span>
                                  <span style={{
                                    color: '#B76E3C',
                                    fontWeight: '600',
                                    fontSize: '16px'
                                  }}>
                                    {new Intl.NumberFormat('ru-RU').format(tour.price)} ₽
                                  </span>
                                </div>
                                {tour.hotTour && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: '#8B5A2B' }}>🔥</span>
                                    <span style={{
                                      color: '#dc3545',
                                      fontSize: '14px',
                                      fontWeight: '500'
                                    }}>
                                      Горящий тур
                                    </span>
                                  </div>
                                )}
                              </div>

                              <Link to={`/catalog/tour/${tour.id}`} style={{ textDecoration: 'none' }}>
                                <button style={{
                                  padding: '8px 20px',
                                  background: 'transparent',
                                  color: '#8B5A2B',
                                  border: '2px solid #D2B48C',
                                  borderRadius: '20px',
                                  fontSize: '14px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px'
                                }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(183, 110, 60, 0.1)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                  }}>
                                  👁️ Подробнее о туре
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : activeTab === 'admin' ? (
                // Вкладка "Администратор" — полный доступ
                <div>
                  <h3 style={{
                    fontSize: '24px',
                    color: '#8B5A2B',
                    marginBottom: '25px',
                    fontFamily: "'Cormorant Garamond', serif",
                    borderBottom: '2px solid #D2B48C',
                    paddingBottom: '10px'
                  }}>
                    👨‍💼 Панель администратора
                  </h3>

                  {/* Выбор режима работы */}
                  <div style={{ marginBottom: '30px' }}>
                    <p style={{ color: '#8B5A2B', marginBottom: '15px' }}>Выберите режим работы:</p>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setShowTourForm(false);
                          setShowHotelForm(false);
                          setShowRoomForm(false);
                        }}
                        style={{
                          padding: '12px 25px',
                          background: !showTourForm && !showHotelForm && !showRoomForm ? '#B76E3C' : '#C0A080',
                          color: '#FFF8F0',
                          border: '2px solid #8B5A2B',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>👥</span> Управление пользователями
                      </button>
                      <button
                        onClick={() => {
                          setShowTourForm(!showTourForm);
                          setShowHotelForm(false);
                          setShowRoomForm(false);
                          setSelectedUserId(null);
                          setViewingUserData(null);
                        }}
                        style={{
                          padding: '12px 25px',
                          background: showTourForm ? '#B76E3C' : '#C0A080',
                          color: '#FFF8F0',
                          border: '2px solid #8B5A2B',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>✈️</span> Добавить тур
                      </button>
                      <button
                        onClick={() => {
                          setShowHotelForm(!showHotelForm);
                          setShowTourForm(false);
                          setShowRoomForm(false);
                          setSelectedUserId(null);
                          setViewingUserData(null);
                        }}
                        style={{
                          padding: '12px 25px',
                          background: showHotelForm ? '#B76E3C' : '#C0A080',
                          color: '#FFF8F0',
                          border: '2px solid #8B5A2B',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>🏨</span> Добавить отель
                      </button>
                      <button
                        onClick={() => {
                          setShowRoomForm(!showRoomForm);
                          setShowTourForm(false);
                          setShowHotelForm(false);
                          setSelectedUserId(null);
                          setViewingUserData(null);
                        }}
                        style={{
                          padding: '12px 25px',
                          background: showRoomForm ? '#B76E3C' : '#C0A080',
                          color: '#FFF8F0',
                          border: '2px solid #8B5A2B',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>🛏️</span> Добавить номер
                      </button>
                    </div>
                  </div>

                  {/* Форма добавления тура */}
                  {showTourForm && (
                    <div style={{
                      background: '#FFF8F0',
                      borderRadius: '20px',
                      padding: '25px',
                      border: '2px solid #D2B48C',
                      marginBottom: '30px'
                    }}>
                      <h4 style={{
                        fontSize: '20px',
                        color: '#B76E3C',
                        marginBottom: '20px',
                        fontFamily: "'Cormorant Garamond', serif"
                      }}>
                        Добавление нового тура
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px'
                      }}>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Название тура *</label>
                          <input
                            type="text"
                            value={newTour.name || ''}
                            onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Точка отправления *</label>
                          <input
                            type="text"
                            value={newTour.startDot || ''}
                            onChange={(e) => setNewTour({ ...newTour, startDot: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Точка назначения *</label>
                          <input
                            type="text"
                            value={newTour.endDot || ''}
                            onChange={(e) => setNewTour({ ...newTour, endDot: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Цена (₽) *</label>
                          <input
                            type="number"
                            value={newTour.price || ''}
                            onChange={(e) => setNewTour({ ...newTour, price: Number(e.target.value) })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Тип тура</label>
                          <select
                            value={newTour.type || 'Экскурсионный'}
                            onChange={(e) => setNewTour({ ...newTour, type: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          >
                            <option value="Экскурсионный">Экскурсионный</option>
                            <option value="Пляжный">Пляжный</option>
                            <option value="Горнолыжный">Горнолыжный</option>
                            <option value="Лечебный">Лечебный</option>
                            <option value="Шопинг">Шопинг</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>URL изображения</label>
                          <input
                            type="text"
                            value={newTour.imageTour || ''}
                            onChange={(e) => setNewTour({ ...newTour, imageTour: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B5A2B' }}>
                            <input
                              type="checkbox"
                              checked={newTour.hotTour || false}
                              onChange={(e) => setNewTour({ ...newTour, hotTour: e.target.checked })}
                            />
                            Горящий тур
                          </label>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Краткое описание</label>
                          <textarea
                            value={newTour.description || ''}
                            onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
                            rows={2}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Детали маршрута</label>
                          <textarea
                            value={newTour.details || ''}
                            onChange={(e) => setNewTour({ ...newTour, details: e.target.value })}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        marginTop: '25px',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          type="button"
                          onClick={handleAddTourAsync}
                          disabled={loading}
                          style={{
                            padding: '12px 30px',
                            background: loading ? '#999' : 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                            color: '#FFF8F0',
                            border: '2px solid #D2B48C',
                            borderRadius: '25px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            opacity: loading ? 0.7 : 1
                          }}
                        >
                          {loading ? 'Сохранение...' : 'Сохранить тур'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTourForm(false)}
                          style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            color: '#8B5A2B',
                            border: '2px solid #D2B48C',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Форма добавления отеля */}
                  {showHotelForm && (
                    <div style={{
                      background: '#FFF8F0',
                      borderRadius: '20px',
                      padding: '25px',
                      border: '2px solid #D2B48C',
                      marginBottom: '30px'
                    }}>
                      <h4 style={{
                        fontSize: '20px',
                        color: '#B76E3C',
                        marginBottom: '20px',
                        fontFamily: "'Cormorant Garamond', serif"
                      }}>
                        Добавление нового отеля
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px'
                      }}>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Название отеля *</label>
                          <input
                            type="text"
                            value={newHotel.name || ''}
                            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Количество звезд *</label>
                          <select
                            value={newHotel.stars || 3}
                            onChange={(e) => setNewHotel({ ...newHotel, stars: Number(e.target.value) })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          >
                            <option value={1}>1 звезда</option>
                            <option value={2}>2 звезды</option>
                            <option value={3}>3 звезды</option>
                            <option value={4}>4 звезды</option>
                            <option value={5}>5 звезд</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Время проживания (дней) *</label>
                          <input
                            type="number"
                            min="1"
                            value={newHotel.timeOfStay || 1}
                            onChange={(e) => setNewHotel({ ...newHotel, timeOfStay: Number(e.target.value) })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>URL изображения *</label>
                          <input
                            type="text"
                            value={newHotel.imageHotel || ''}
                            onChange={(e) => setNewHotel({ ...newHotel, imageHotel: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Детали</label>
                          <textarea
                            value={newHotel.details || ''}
                            onChange={(e) => setNewHotel({ ...newHotel, details: e.target.value })}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        marginTop: '25px',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          type="button"
                          onClick={handleAddHotelAsync}
                          disabled={loading}
                          style={{
                            padding: '12px 30px',
                            background: loading ? '#999' : 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                            color: '#FFF8F0',
                            border: '2px solid #D2B48C',
                            borderRadius: '25px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            opacity: loading ? 0.7 : 1
                          }}
                        >
                          {loading ? 'Сохранение...' : 'Сохранить отель'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowHotelForm(false)}
                          style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            color: '#8B5A2B',
                            border: '2px solid #D2B48C',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Форма добавления номера */}
                  {showRoomForm && (
                    <div style={{
                      background: '#FFF8F0',
                      borderRadius: '20px',
                      padding: '25px',
                      border: '2px solid #D2B48C',
                      marginBottom: '30px'
                    }}>
                      <h4 style={{
                        fontSize: '20px',
                        color: '#B76E3C',
                        marginBottom: '20px',
                        fontFamily: "'Cormorant Garamond', serif"
                      }}>
                        Добавление номера
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px'
                      }}>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Название номера *</label>
                          <input
                            type="text"
                            value={newRoom.nameRoom || ''}
                            onChange={(e) => setNewRoom({ ...newRoom, nameRoom: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Этаж *</label>
                          <input
                            type="number"
                            min="1"
                            value={newRoom.floor || 1}
                            onChange={(e) => setNewRoom({ ...newRoom, floor: Number(e.target.value) })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>URL изображения</label>
                          <input
                            type="text"
                            value={newRoom.imageRoom || ''}
                            onChange={(e) => setNewRoom({ ...newRoom, imageRoom: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Детали</label>
                          <textarea
                            value={newRoom.details || ''}
                            onChange={(e) => setNewRoom({ ...newRoom, details: e.target.value })}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        marginTop: '25px',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          type="button"
                          onClick={handleAddRoomAsync}
                          disabled={loading}
                          style={{
                            padding: '12px 30px',
                            background: loading ? '#999' : 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                            color: '#FFF8F0',
                            border: '2px solid #D2B48C',
                            borderRadius: '25px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            opacity: loading ? 0.7 : 1
                          }}
                        >
                          {loading ? 'Сохранение...' : 'Сохранить номер'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRoomForm(false)}
                          style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            color: '#8B5A2B',
                            border: '2px solid #D2B48C',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Управление пользователями (только если не выбраны формы добавления) */}
                  {!showTourForm && !showHotelForm && !showRoomForm && (
                    <>
                      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <button
                          onClick={() => {
                            setSelectedUserType('clients');
                            fetchAllClients();
                            setSelectedUserId(null);
                            setViewingUserData(null);
                          }}
                          style={{
                            padding: '10px 20px',
                            background: selectedUserType === 'clients' ? '#B76E3C' : '#C0A080',
                            color: '#FFF8F0',
                            border: '2px solid #8B5A2B',
                            borderRadius: '20px',
                            cursor: 'pointer'
                          }}
                        >
                          👥 Клиенты
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserType('employees');
                            fetchAllEmployees();
                            setSelectedUserId(null);
                            setViewingUserData(null);
                          }}
                          style={{
                            padding: '10px 20px',
                            background: selectedUserType === 'employees' ? '#B76E3C' : '#C0A080',
                            color: '#FFF8F0',
                            border: '2px solid #8B5A2B',
                            borderRadius: '20px',
                            cursor: 'pointer'
                          }}
                        >
                          💼 Сотрудники
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
                        <div style={{
                          background: '#FFF8F0',
                          borderRadius: '15px',
                          padding: '15px',
                          border: '2px solid #D2B48C',
                          maxHeight: '500px',
                          overflowY: 'auto'
                        }}>
                          <h4 style={{ color: '#8B5A2B', marginBottom: '15px' }}>
                            {selectedUserType === 'clients' ? 'Клиенты' : 'Сотрудники'}
                          </h4>
                          {loading ? (
                            <p style={{ color: '#8B5A2B', textAlign: 'center' }}>Загрузка...</p>
                          ) : selectedUserType === 'clients' ? (
                            allClients.map(client => (
                              <div
                                key={client.id}
                                onClick={() => handleViewUser(client.id, 'clients')}
                                style={{
                                  padding: '10px',
                                  marginBottom: '5px',
                                  background: selectedUserId === client.id ? '#B76E3C' : 'transparent',
                                  color: selectedUserId === client.id ? '#FFF8F0' : '#8B5A2B',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s'
                                }}
                              >
                                {client.surName} {client.firstName}
                              </div>
                            ))
                          ) : (
                            allEmployees.map(employee => (
                              <div
                                key={employee.id}
                                onClick={() => handleViewUser(employee.id, 'employees')}
                                style={{
                                  padding: '10px',
                                  marginBottom: '5px',
                                  background: selectedUserId === employee.id ? '#B76E3C' : 'transparent',
                                  color: selectedUserId === employee.id ? '#FFF8F0' : '#8B5A2B',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s'
                                }}
                              >
                                {employee.surName} {employee.firstName} - {employee.position}
                              </div>
                            ))
                          )}
                        </div>

                        <div style={{
                          background: '#FFF8F0',
                          borderRadius: '15px',
                          padding: '20px',
                          border: '2px solid #D2B48C'
                        }}>
                          {viewingUserData ? (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h4 style={{ color: '#8B5A2B' }}>
                                  {selectedUserType === 'clients' ? 'Клиент' : 'Сотрудник'}: {' '}
                                  {(viewingUserData as Client).surName} {(viewingUserData as Client).firstName}
                                </h4>
                                <button
                                  onClick={() => setIsEditingUser(!isEditingUser)}
                                  style={{
                                    padding: '8px 15px',
                                    background: '#C0A080',
                                    color: '#FFF8F0',
                                    border: '1px solid #8B5A2B',
                                    borderRadius: '15px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {isEditingUser ? 'Отмена' : '✏️ Редактировать'}
                                </button>
                              </div>

                              <div style={{ marginBottom: '20px' }}>
                                <p><strong>Email:</strong> {viewingUserData.email}</p>
                                <p><strong>Телефон:</strong> {viewingUserData.phoneNumber}</p>
                                {selectedUserType === 'clients' && (
                                  <>
                                    <p><strong>Дата рождения:</strong> {(viewingUserData as Client).birthday}</p>
                                    <p><strong>Возраст:</strong> {(viewingUserData as Client).age}</p>
                                    <p><strong>Пол:</strong> {(viewingUserData as Client).gender}</p>
                                    <p><strong>Логин:</strong> {(viewingUserData as Client).login}</p>
                                  </>
                                )}
                                {selectedUserType === 'employees' && (
                                  <p><strong>Должность:</strong> {(viewingUserData as Employee).position}</p>
                                )}
                              </div>

                              {isEditingUser && (
                                <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(210, 180, 140, 0.1)', borderRadius: '10px' }}>
                                  <h5 style={{ color: '#8B5A2B', marginBottom: '15px' }}>Редактирование</h5>
                                  <div style={{ display: 'grid', gap: '10px' }}>
                                    <input
                                      type="text"
                                      placeholder="Фамилия"
                                      value={(viewingUserData as Client).surName || ''}
                                      onChange={(e) => setViewingUserData({ ...viewingUserData, surName: e.target.value } as any)}
                                      style={{
                                        padding: '8px',
                                        border: '1px solid #D2B48C',
                                        borderRadius: '8px',
                                        backgroundColor: '#FFF8F0'
                                      }}
                                    />
                                    <input
                                      type="text"
                                      placeholder="Имя"
                                      value={(viewingUserData as Client).firstName || ''}
                                      onChange={(e) => setViewingUserData({ ...viewingUserData, firstName: e.target.value } as any)}
                                      style={{
                                        padding: '8px',
                                        border: '1px solid #D2B48C',
                                        borderRadius: '8px',
                                        backgroundColor: '#FFF8F0'
                                      }}
                                    />
                                    <input
                                      type="email"
                                      placeholder="Email"
                                      value={viewingUserData.email || ''}
                                      onChange={(e) => setViewingUserData({ ...viewingUserData, email: e.target.value } as any)}
                                      style={{
                                        padding: '8px',
                                        border: '1px solid #D2B48C',
                                        borderRadius: '8px',
                                        backgroundColor: '#FFF8F0'
                                      }}
                                    />
                                    <input
                                      type="tel"
                                      placeholder="Телефон"
                                      value={viewingUserData.phoneNumber || ''}
                                      onChange={(e) => setViewingUserData({ ...viewingUserData, phoneNumber: e.target.value } as any)}
                                      style={{
                                        padding: '8px',
                                        border: '1px solid #D2B48C',
                                        borderRadius: '8px',
                                        backgroundColor: '#FFF8F0'
                                      }}
                                    />
                                    <button
                                      onClick={async () => {
                                        try {
                                          setLoading(true);
                                          if (selectedUserType === 'clients') {
                                            await updateClient(viewingUserData.id, viewingUserData as Client);
                                          } else {
                                            await updateEmployee(viewingUserData.id, viewingUserData as Employee);
                                          }
                                          setSaveStatus({
                                            show: true,
                                            message: 'Данные сохранены!',
                                            type: 'success'
                                          });
                                          setIsEditingUser(false);
                                          setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
                                        } catch (error) {
                                          console.error('Ошибка сохранения:', error);
                                          setSaveStatus({
                                            show: true,
                                            message: 'Ошибка при сохранении',
                                            type: 'error'
                                          });
                                        } finally {
                                          setLoading(false);
                                        }
                                      }}
                                      style={{
                                        padding: '10px',
                                        background: '#B76E3C',
                                        color: '#FFF8F0',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Сохранить изменения
                                    </button>
                                  </div>
                                </div>
                              )}

                              {selectedUserType === 'clients' && (
                                <div>
                                  <h5 style={{ color: '#8B5A2B', marginBottom: '10px' }}>Бронирования:</h5>
                                  <button
                                    onClick={async () => {
                                      try {
                                        setLoading(true);
                                        const tickets = await getClientTickets(viewingUserData.id);
                                        console.log('Билеты клиента:', tickets);
                                        alert(`Найдено билетов: ${tickets.length}\n\n${tickets.map((t: any) => `ID: ${t.id}, Цена: ${t.price}₽`).join('\n')}`);
                                      } catch (error) {
                                        console.error('Ошибка загрузки билетов:', error);
                                        alert('Ошибка загрузки билетов');
                                      } finally {
                                        setLoading(false);
                                      }
                                    }}
                                    style={{
                                      padding: '8px 15px',
                                      background: '#B76E3C',
                                      color: '#FFF8F0',
                                      border: 'none',
                                      borderRadius: '15px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    📋 Показать бронирования
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p style={{ color: '#8B5A2B', textAlign: 'center', padding: '40px' }}>
                              Выберите пользователя для просмотра
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : activeTab === 'employee' ? (
                // Вкладка "Сотрудник" (Менеджер) — только добавление отелей и номеров, без просмотра клиентов
                <div>
                  <h3 style={{
                    fontSize: '24px',
                    color: '#8B5A2B',
                    marginBottom: '25px',
                    fontFamily: "'Cormorant Garamond', serif",
                    borderBottom: '2px solid #D2B48C',
                    paddingBottom: '10px'
                  }}>
                    👨‍💻 Панель сотрудника
                  </h3>

                  {/* Выбор режима работы */}
                  <div style={{ marginBottom: '30px' }}>
                    <p style={{ color: '#8B5A2B', marginBottom: '15px' }}>Выберите действие:</p>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setShowHotelForm(!showHotelForm);
                          setShowRoomForm(false);
                        }}
                        style={{
                          padding: '12px 25px',
                          background: showHotelForm ? '#B76E3C' : '#C0A080',
                          color: '#FFF8F0',
                          border: '2px solid #8B5A2B',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>🏨</span> Добавить отель
                      </button>
                      <button
                        onClick={() => {
                          setShowRoomForm(!showRoomForm);
                          setShowHotelForm(false);
                        }}
                        style={{
                          padding: '12px 25px',
                          background: showRoomForm ? '#B76E3C' : '#C0A080',
                          color: '#FFF8F0',
                          border: '2px solid #8B5A2B',
                          borderRadius: '25px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>🛏️</span> Добавить номер
                      </button>
                    </div>
                  </div>

                  {/* Форма добавления отеля */}
                  {showHotelForm && (
                    <div style={{
                      background: '#FFF8F0',
                      borderRadius: '20px',
                      padding: '25px',
                      border: '2px solid #D2B48C',
                      marginBottom: '30px'
                    }}>
                      <h4 style={{
                        fontSize: '20px',
                        color: '#B76E3C',
                        marginBottom: '20px',
                        fontFamily: "'Cormorant Garamond', serif"
                      }}>
                        Добавление нового отеля
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px'
                      }}>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Название отеля *</label>
                          <input
                            type="text"
                            value={newHotel.name || ''}
                            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Количество звезд *</label>
                          <select
                            value={newHotel.stars || 3}
                            onChange={(e) => setNewHotel({ ...newHotel, stars: Number(e.target.value) })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          >
                            <option value={1}>1 звезда</option>
                            <option value={2}>2 звезды</option>
                            <option value={3}>3 звезды</option>
                            <option value={4}>4 звезды</option>
                            <option value={5}>5 звезд</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Время проживания (дней) *</label>
                          <input
                            type="number"
                            min="1"
                            value={newHotel.timeOfStay || 1}
                            onChange={(e) => setNewHotel({ ...newHotel, timeOfStay: Number(e.target.value) })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>URL изображения *</label>
                          <input
                            type="text"
                            value={newHotel.imageHotel || ''}
                            onChange={(e) => setNewHotel({ ...newHotel, imageHotel: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Детали</label>
                          <textarea
                            value={newHotel.details || ''}
                            onChange={(e) => setNewHotel({ ...newHotel, details: e.target.value })}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        marginTop: '25px',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          type="button"
                          onClick={handleAddHotelAsync}
                          disabled={loading}
                          style={{
                            padding: '12px 30px',
                            background: loading ? '#999' : 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                            color: '#FFF8F0',
                            border: '2px solid #D2B48C',
                            borderRadius: '25px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            opacity: loading ? 0.7 : 1
                          }}
                        >
                          {loading ? 'Сохранение...' : 'Сохранить отель'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowHotelForm(false)}
                          style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            color: '#8B5A2B',
                            border: '2px solid #D2B48C',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Форма добавления номера */}
                  {showRoomForm && (
                    <div style={{
                      background: '#FFF8F0',
                      borderRadius: '20px',
                      padding: '25px',
                      border: '2px solid #D2B48C',
                      marginBottom: '30px'
                    }}>
                      <h4 style={{
                        fontSize: '20px',
                        color: '#B76E3C',
                        marginBottom: '20px',
                        fontFamily: "'Cormorant Garamond', serif"
                      }}>
                        Добавление номера
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px'
                      }}>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Название номера *</label>
                          <input
                            type="text"
                            value={newRoom.nameRoom || ''}
                            onChange={(e) => setNewRoom({ ...newRoom, nameRoom: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Этаж *</label>
                          <input
                            type="number"
                            min="1"
                            value={newRoom.floor || 1}
                            onChange={(e) => setNewRoom({ ...newRoom, floor: Number(e.target.value) })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>URL изображения</label>
                          <input
                            type="text"
                            value={newRoom.imageRoom || ''}
                            onChange={(e) => setNewRoom({ ...newRoom, imageRoom: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', color: '#8B5A2B', marginBottom: '5px' }}>Детали</label>
                          <textarea
                            value={newRoom.details || ''}
                            onChange={(e) => setNewRoom({ ...newRoom, details: e.target.value })}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #D2B48C',
                              borderRadius: '10px',
                              backgroundColor: '#FFF8F0',
                              color: '#8B5A2B'
                            }}
                          />
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        marginTop: '25px',
                        justifyContent: 'flex-end'
                      }}>
                        <button
                          type="button"
                          onClick={handleAddRoomAsync}
                          disabled={loading}
                          style={{
                            padding: '12px 30px',
                            background: loading ? '#999' : 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                            color: '#FFF8F0',
                            border: '2px solid #D2B48C',
                            borderRadius: '25px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            opacity: loading ? 0.7 : 1
                          }}
                        >
                          {loading ? 'Сохранение...' : 'Сохранить номер'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRoomForm(false)}
                          style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            color: '#8B5A2B',
                            border: '2px solid #D2B48C',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Если ничего не выбрано — показать статистику */}
                  {!showHotelForm && !showRoomForm && (
                    <div style={{
                      marginTop: '30px',
                      padding: '20px',
                      background: '#FFF8F0',
                      borderRadius: '15px',
                      border: '2px solid #D2B48C',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: '#8B5A2B', fontSize: '16px' }}>
                        Выберите действие: добавить отель или номер
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h1>Доступ заблокирован</h1>
          <p>Пожалуйста, зайдите в профиль или обратитесь в тех. поддержку</p>
        </div>
      )}
    </div>
  );
};

export { ClientAccountPage };