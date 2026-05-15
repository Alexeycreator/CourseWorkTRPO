import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { clientApi, UserResponse } from "../Services/IndexAuth";
import { Passports, deletePassport, getAllPassports, updatePassport, createPassport, CreatePassportDto, getInfoPassport } from "../Services/PassportApi";
import { Address } from "../Services/AddressApi";
import EditDocumentModal, { DocumentFormData, AddressFormData, CombinedDocumentData } from '../EditDocumentModal';
import { Link } from 'react-router-dom';
import { createTour, CreateTourDto, getMainTours, ToursDto } from "../Services/ToursApi";
import { createHotel, CreateHotelDto, getAllHotels } from "../Services/HotelsApi";
import { createHotelRoom, CreateHotelRoomsDto } from "../Services/HotelRoomsApi";
import { getAllTickets } from "../Services/TicketsApi";
import { getSafeImageUrl, PLACEHOLDERS } from "../Components/OptimizedImage";
import Loader from "../Components/Loader";

// Локальные интерфейсы для форм
interface TourLocal {
  id?: number;
  name: string;
  startDot: string;
  endDot: string;
  details: string;
  imageTour: string;
  //description: string;
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

interface HotelLocal {
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

interface HotelRoomLocal {
  id?: number;
  nameRoom: string;
  details?: string | null;
  floor: number;
  imageRoom?: string | null;
  isReadOnly?: boolean;
}

interface Employee {
  id: number;
  surName: string;
  firstName: string;
  middleName?: string | null;
  gender: string;
  birthday: string;
  age: number;
  position: string;
  role: string;
  phoneNumber: string;
  email: string;
  login: string;
}

interface HotelOption {
  id: number;
  name: string;
  stars: number;
}

// Тип для элемента навигации
interface NavItem {
  id: 'profile' | 'documents' | 'bookings' | 'admin' | 'employee' | 'logout';
  label: string;
  roles: string[];
}

const ClientAccountPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'bookings' | 'admin' | 'employee'>('profile');
  const { user, isAuthenticated, logout } = useAuth();
  const [userData, setUserData] = useState<UserResponse | null>(null);

  const [passportsData, setPassportsData] = useState<Passports[]>([]);
  const [addressesData, setAddressesData] = useState<Address[]>([]);

  const [editedData, setEditedData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const originalDataRef = useRef<UserResponse | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CombinedDocumentData | null>(null);
  const [modalMode, setModalMode] = useState<'edit' | 'add'>('edit');

  const [saveStatus, setSaveStatus] = useState({ show: false, message: '', type: '' });

  const [showTourForm, setShowTourForm] = useState(false);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);

  const [allClients, setAllClients] = useState<UserResponse[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<'clients' | 'employees'>('clients');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewingUserData, setViewingUserData] = useState<UserResponse | Employee | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const [bookedTours, setBookedTours] = useState<TourLocal[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [isLoadingPassports, setIsLoadingPassports] = useState(false);

  const [availableHotels, setAvailableHotels] = useState<HotelOption[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);

  const userRole = (user?.role || 'user').toLowerCase();

  const navItems: NavItem[] = [
    { id: 'profile', label: '📋 Мои данные', roles: ['admin', 'employee', 'user'] },
    { id: 'documents', label: '📄 Документы', roles: ['admin', 'employee', 'user'] },
    { id: 'bookings', label: '🗺️ Мои бронирования', roles: ['admin', 'employee', 'user'] },
    { id: 'admin', label: '👨‍💼 Администратор', roles: ['admin'] },
    { id: 'employee', label: '👨‍💻 Сотрудник', roles: ['employee'] },
    { id: 'logout', label: '🚪 Выход', roles: ['admin', 'employee', 'user'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const [newTour, setNewTour] = useState<Partial<CreateTourDto>>({
    nameTour: '',
    startDot: '',
    endDot: '',
    details: '',
    imageTour: '',
    description: '',
    separately: '',
    included: '',
    program: '',
    hotTour: false,
    typeTour: 'Экскурсионный',
    price: 0,
    hotelsId: 0
  });

  const [newHotel, setNewHotel] = useState<Partial<CreateHotelDto>>({
    name: '',
    stars: 3,
    imageHotel: '/default-hotel.jpg',
    details: ''
  });

  const [newRoom, setNewRoom] = useState<Partial<CreateHotelRoomsDto>>({
    nameRoom: '',
    floor: 1,
    details: '',
    imageRoom: '/default-room.jpg',
    typeRoom: 'Стандарт'
  });

  const fetchAvailableHotels = async () => {
    try {
      setIsLoadingHotels(true);
      const hotelsList = await getAllHotels();
      setAvailableHotels(hotelsList.map((h: any) => ({
        id: h.id,
        name: h.name,
        stars: h.stars
      })));
    } catch (error: any) {
      setSaveStatus({ show: true, message: error.serverMessage || 'Ошибка загрузки отелей', type: 'error' });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    } finally {
      setIsLoadingHotels(false);
    }
  };

  const resetForms = () => {
    setShowTourForm(false);
    setShowHotelForm(false);
    setShowRoomForm(false);
    setNewTour({
      nameTour: '',
      startDot: '',
      endDot: '',
      details: '',
      imageTour: '',
      description: '',
      separately: '',
      included: '',
      program: '',
      hotTour: false,
      typeTour: 'Экскурсионный',
      price: 0,
      hotelsId: 0
    });
    setNewHotel({
      name: '',
      stars: 3,
      imageHotel: '/default-hotel.jpg',
      details: ''
    });
    setNewRoom({
      nameRoom: '',
      floor: 1,
      details: '',
      imageRoom: '/default-room.jpg',
      typeRoom: 'Стандарт'
    });
  };

  const handleTabChange = (tabId: 'profile' | 'documents' | 'bookings' | 'admin' | 'employee') => {
    setActiveTab(tabId);
    if (tabId !== 'profile') {
      setIsEditing(false);
    }
    resetForms();
    setSelectedUserId(null);
    setViewingUserData(null);
    if (tabId === 'admin') {
      fetchAvailableHotels();
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    window.location.href = '/';
  };

  const handleEditDocument = (passport: Passports, address: Address | undefined, index: number) => {
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

  const formatDateToISO = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
  };

  const handleSaveDocument = async (passportData: DocumentFormData, addressData: AddressFormData) => {
    if (!user?.id) {
      setSaveStatus({ show: true, message: 'Пользователь не авторизован', type: 'error' });
      return;
    }

    try {
      setLoading(true);

      const formattedDateOfIssue = formatDateToISO(passportData.dateOfIssue);

      // Проверка apartment
      let apartmentNumber: number | null = null;
      if (addressData.apartment) {
        const parsed = parseInt(addressData.apartment, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 2147483647) {
          apartmentNumber = parsed;
        }
      }

      // departmentCode обязателен для всех типов
      const departmentCode = passportData.departmentCode || '000-000';

      if (modalMode === 'edit' && modalData && modalData.index !== undefined && modalData.index >= 0) {
        const index = modalData.index;
        const existingPassport = passportsData[index];
        const existingAddress = addressesData[index];

        const addressObj = (addressData.city || addressData.street) ? {
          id: existingAddress?.id || 0,
          country: addressData.country || 'Российская Федерация',
          region: addressData.country || 'Российская Федерация',
          city: addressData.city || '',
          street: addressData.street || '',
          house: addressData.house || '',
          apartment: apartmentNumber
        } : null;

        const updateRequest = {
          id: existingPassport.id,
          passportId: existingPassport.id,
          seria: parseInt(passportData.seria, 10) || 0,
          number: parseInt(passportData.number, 10) || 0,
          type: passportData.type || 'internal',
          issuedBy: passportData.issuedBy || '',
          departmentCode: departmentCode,
          dateOfIssue: formattedDateOfIssue,
          address: addressObj
        };

        console.log('Обновление паспорта:', JSON.stringify(updateRequest, null, 2));
        await updatePassport(user.id, updateRequest as any);

        const updatedPassports = [...passportsData];
        updatedPassports[index] = {
          ...updatedPassports[index],
          seria: parseInt(passportData.seria, 10) || 0,
          number: parseInt(passportData.number, 10) || 0,
          issuedBy: passportData.issuedBy || '',
          dateOfIssue: formattedDateOfIssue,
          departmentCode: departmentCode,
          type: passportData.type || 'internal'
        };
        setPassportsData(updatedPassports);

        if (addressObj) {
          const updatedAddresses = [...addressesData];
          updatedAddresses[index] = addressObj as Address;
          setAddressesData(updatedAddresses);
        }

        setSaveStatus({ show: true, message: 'Документ успешно обновлён!', type: 'success' });
      } else if (modalMode === 'add') {
        const addressObj = (addressData.city || addressData.street) ? {
          id: 0,
          country: addressData.country || 'Российская Федерация',
          region: addressData.country || 'Российская Федерация',
          city: addressData.city || '',
          street: addressData.street || '',
          house: addressData.house || '',
          apartment: apartmentNumber
        } : null;

        const createRequest = {
          seria: parseInt(passportData.seria, 10) || 0,
          number: parseInt(passportData.number, 10) || 0,
          type: passportData.type || 'internal',
          issuedBy: passportData.issuedBy || '',
          departmentCode: departmentCode,
          dateOfIssue: formattedDateOfIssue,
          address: addressObj
        };

        console.log('Создание паспорта:', JSON.stringify(createRequest, null, 2));
        await createPassport(user.id, createRequest as any);

        setSaveStatus({ show: true, message: 'Новый документ успешно добавлен!', type: 'success' });
      }

      setIsModalOpen(false);
      setModalData(null);
      setTimeout(() => fetchUser(), 500);
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    } catch (error: any) {
      console.error('Ошибка сохранения документа:', error);
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(', ')
        : (error.response?.data?.message || error.serverMessage || error.message || 'Ошибка при сохранении');
      setSaveStatus({ show: true, message: errorMessage, type: 'error' });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const loadUser = await clientApi.getById(Number(user.id));
      setUserData(loadUser);
      await fetchUserPassports();
    } catch (error: any) {
      setSaveStatus({ show: true, message: error.serverMessage || 'Ошибка загрузки данных', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Получаем ВСЕ паспорта пользователя
  const fetchUserPassports = async () => {
    if (!user?.id) return;
    setIsLoadingPassports(true);
    try {
      // Используем getAllPassports и фильтруем по userId
      const allPassports = await getAllPassports();
      
      // Пытаемся получить паспорта через getInfoPassport для каждого паспорта
      const userPassports: Passports[] = [];
      const userAddresses: Address[] = [];

      try {
        const passportInfo = await getInfoPassport(user.id);
        if (passportInfo) {
          userPassports.push({
            id: passportInfo.id,
            seria: passportInfo.seria,
            number: passportInfo.number,
            type: passportInfo.type,
            issuedBy: passportInfo.issuedBy,
            departmentCode: passportInfo.departmentCode,
            dateOfIssue: passportInfo.dateOfIssue instanceof Date 
              ? passportInfo.dateOfIssue.toISOString().split('T')[0] 
              : String(passportInfo.dateOfIssue)
          });

          if (passportInfo.address) {
            userAddresses.push({
              id: passportInfo.address.id,
              country: passportInfo.address.country || '',
              region: passportInfo.address.region || '',
              city: passportInfo.address.city || '',
              street: passportInfo.address.street || '',
              house: passportInfo.address.house || '',
              apartment: passportInfo.address.apartment ? parseInt(String(passportInfo.address.apartment), 10) : null
            });
          }
        }
      } catch (err) {
        console.log('getInfoPassport не сработал, используем getAllPassports');
      }

      // Если getInfoPassport не вернул данные, показываем все паспорта
      if (userPassports.length === 0 && allPassports.length > 0) {
        // Для обычных пользователей показываем все паспорта (так как API не фильтрует по userId)
        setPassportsData(allPassports);
        // Загружаем адреса для каждого паспорта (заглушка)
        setAddressesData(new Array(allPassports.length).fill(null));
      } else {
        setPassportsData(userPassports);
        setAddressesData(userAddresses);
      }
    } catch (error: any) {
      console.error('Ошибка загрузки паспортов:', error);
      setPassportsData([]);
      setAddressesData([]);
    } finally {
      setIsLoadingPassports(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUserBookedTours();
  }, [user?.id]);

  useEffect(() => {
    if (userData) {
      const newEditedData = { ...userData, passports: passportsData, addresses: addressesData };
      setEditedData(newEditedData);
      if (!originalDataRef.current) {
        originalDataRef.current = newEditedData;
      }
    }
  }, [userData, passportsData, addressesData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setEditedData((prev: any) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (errors[name]) {
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors; });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!editedData?.firstName) newErrors.firstName = 'Имя обязательно';
    if (!editedData?.surName) newErrors.surName = 'Фамилия обязательна';
    if (!editedData?.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(editedData.email)) {
      newErrors.email = 'Email некорректен';
    }
    if (!editedData?.phoneNumber) newErrors.phoneNumber = 'Телефон обязателен';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !editedData) return;

    if (!originalDataRef.current) {
      originalDataRef.current = userData;
    }

    try {
      const updateData: any = {};
      const original = originalDataRef.current;

      if (editedData.surName !== original?.surName) updateData.surName = editedData.surName;
      if (editedData.firstName !== original?.firstName) updateData.firstName = editedData.firstName;
      if (editedData.middleName !== original?.middleName) updateData.middleName = editedData.middleName || null;
      if (editedData.gender !== original?.gender) updateData.gender = editedData.gender;
      if (editedData.birthday !== original?.birthday) updateData.birthday = editedData.birthday;
      if (editedData.age !== original?.age) updateData.age = Number(editedData.age);
      if (editedData.phoneNumber !== original?.phoneNumber) updateData.phoneNumber = editedData.phoneNumber;
      if (editedData.email !== original?.email) updateData.email = editedData.email;

      if (Object.keys(updateData).length === 0) {
        setSaveStatus({ show: true, message: 'Нет изменений для сохранения', type: 'info' });
        setIsEditing(false);
        setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
        return;
      }

      await clientApi.update(editedData.id, updateData);
      originalDataRef.current = { ...originalDataRef.current, ...updateData };

      const updatedUser = await clientApi.getById(editedData.id);
      setUserData(updatedUser);
      setEditedData({ ...updatedUser, passports: passportsData, addresses: addressesData });

      setIsEditing(false);
      setSaveStatus({ show: true, message: 'Данные успешно сохранены!', type: 'success' });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    } catch (error: any) {
      setSaveStatus({ show: true, message: error.serverMessage || error.message || 'Ошибка при сохранении', type: 'error' });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleCancel = () => {
    if (originalDataRef.current) {
      setEditedData({ ...originalDataRef.current, passports: passportsData, addresses: addressesData });
    } else {
      setEditedData({ ...userData, passports: passportsData, addresses: addressesData });
    }
    setIsEditing(false);
    setErrors({});
  };

  const fetchAllClients = async () => {
    try {
      setLoading(true);
      const clients = await clientApi.getAll();
      setAllClients(clients);
    } catch (error: any) {
      setSaveStatus({ show: true, message: error.serverMessage || 'Ошибка загрузки клиентов', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      setLoading(true);
      const users = await clientApi.getAll();
      const employees = users.filter(u => u.role === 'employee' || u.position === 'Сотрудник');
      setAllEmployees(employees as Employee[]);
    } catch (error: any) {
      setSaveStatus({ show: true, message: error.serverMessage || 'Ошибка загрузки сотрудников', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (id: number, type: 'clients' | 'employees') => {
    setSelectedUserId(id);
    setSelectedUserType(type);
    try {
      const user = await clientApi.getById(id);
      setViewingUserData(user);
      setIsEditingUser(false);
    } catch (error: any) {
      setSaveStatus({ show: true, message: error.serverMessage || 'Ошибка загрузки пользователя', type: 'error' });
    }
  };

  const handleAddTourAsync = async () => {
    if (!newTour.nameTour || !newTour.startDot || !newTour.endDot || !newTour.price) {
      setSaveStatus({ show: true, message: 'Пожалуйста, заполните все обязательные поля (название, даты, цена)', type: 'error' });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
      return;
    }

    if (!newTour.hotelsId || newTour.hotelsId <= 0) {
      setSaveStatus({ show: true, message: 'Пожалуйста, выберите отель из списка', type: 'error' });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
      return;
    }

    if (!user?.id) {
      setSaveStatus({ show: true, message: 'Пользователь не авторизован', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const tourData: CreateTourDto = {
        nameTour: newTour.nameTour!.trim(),
        startDot: newTour.startDot!,
        endDot: newTour.endDot!,
        details: newTour.details || 'Детали отсутствуют',
        imageTour: newTour.imageTour || '/default-tour.jpg',
        description: newTour.description || 'Описание отсутствует',
        separately: newTour.separately || 'Не предусмотрено',
        included: newTour.included || 'Не предусмотрено',
        program: newTour.program || 'Программа не указана',
        hotTour: newTour.hotTour || false,
        typeTour: newTour.typeTour || 'Экскурсионный',
        price: Number(newTour.price) || 0,
        hotelsId: newTour.hotelsId
      };
      await createTour(user.id, tourData);
      setShowTourForm(false);
      resetForms();
      setSaveStatus({ show: true, message: 'Тур успешно добавлен!', type: 'success' });
    } catch (error: any) {
      setSaveStatus({ show: true, message: error.serverMessage || error.response?.data?.message || 'Ошибка при создании тура', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleAddHotelAsync = async () => {
    if (!newHotel.name || !newHotel.stars) {
      setSaveStatus({ show: true, message: 'Заполните название и звезды отеля', type: 'error' });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
      return;
    }

    if (!user?.id) {
      setSaveStatus({ show: true, message: 'Пользователь не авторизован', type: 'error' });
      return;
    }

    try {
      setLoading(true);

      await createHotel(user.id, {
        name: newHotel.name,
        stars: Number(newHotel.stars),
        imageHotel: newHotel.imageHotel || '/default-hotel.jpg',
        details: newHotel.details || ''
      });

      setShowHotelForm(false);
      resetForms();
      setSaveStatus({ show: true, message: 'Отель успешно добавлен!', type: 'success' });
      await fetchAvailableHotels();
    } catch (error: any) {
      setSaveStatus({ show: true, message: error.serverMessage || error.message || 'Ошибка при создании отеля', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    }
  };

  // Получаем ВСЕ забронированные туры пользователя
  const fetchUserBookedTours = async () => {
    if (!user?.id) return;
    try {
      setLoadingBookings(true);

      // Получаем все билеты
      const allTickets = await getAllTickets();
      
      // Получаем все туры
      const allTours = await getMainTours();
      
      // Находим билеты и связанные туры
      const userBookedTours: TourLocal[] = [];

      for (const ticket of allTickets) {
        // Ищем тур, связанный с билетом
        const relatedTour = allTours.find((tour: ToursDto) => {
          // Проверяем различные возможные связи
          return (ticket as any).tourId === tour.id || 
                 (ticket as any).ticketsId === tour.id ||
                 tour.id === (ticket as any).tourId;
        });
        
        if (relatedTour) {
          // Проверяем, нет ли уже такого тура в списке
          const exists = userBookedTours.find(t => t.id === relatedTour.id);
          if (!exists) {
            userBookedTours.push({
              id: relatedTour.id,
              name: relatedTour.nameTour || '',
              startDot: relatedTour.startDot || '',
              endDot: relatedTour.endDot || '',
              details: relatedTour.details || '',
              imageTour: relatedTour.imageTour || '',
              //description: relatedTour.description || relatedTour.details || '',
              separately: 'Не предусмотрено',
              included: 'Не предусмотрено',
              program: 'Не указана',
              type: relatedTour.type || '',
              hotTour: false,
              price: relatedTour.price || ticket.price,
              tickets_Id: ticket.id,
              transfers_Id: null
            });
          }
        }
      }

      console.log('Найдено забронированных туров:', userBookedTours.length);
      setBookedTours(userBookedTours);
    } catch (error: any) {
      console.log('Не удалось загрузить бронирования:', error);
      setBookedTours([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleDeleteDocument = async (passport: Passports, address: Address | undefined, index: number) => {
    if (!user?.id) {
      setSaveStatus({ show: true, message: 'Пользователь не авторизован', type: 'error' });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
      return;
    }

    if (!window.confirm(`Вы уверены, что хотите удалить паспорт #${index + 1}?\nЭто действие нельзя отменить.`)) {
      return;
    }

    setLoading(true);
    try {
      console.log('Удаление паспорта:', { passportId: passport.id, userId: user.id });
      await deletePassport(passport.id, user.id);

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
    } catch (error: any) {
      console.error('Ошибка удаления паспорта:', error);
      setSaveStatus({
        show: true,
        message: error.serverMessage || error.message || 'Ошибка удаления паспорта',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleAddRoomAsync = async () => {
    if (!newRoom.nameRoom || !newRoom.floor || !newRoom.typeRoom) {
      setSaveStatus({ show: true, message: 'Заполните все обязательные поля', type: 'error' });
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
      return;
    }
    if (!user?.id) {
      setSaveStatus({ show: true, message: 'Пользователь не авторизован', type: 'error' });
      return;
    }
    try {
      setLoading(true);
      const roomData: CreateHotelRoomsDto = {
        nameRoom: newRoom.nameRoom,
        floor: newRoom.floor,
        details: newRoom.details || '',
        imageRoom: newRoom.imageRoom || '/default-room.jpg',
        typeRoom: newRoom.typeRoom
      };
      await createHotelRoom(roomData, user.id);
      setShowRoomForm(false);
      resetForms();
      setSaveStatus({ show: true, message: 'Номер успешно добавлен!', type: 'success' });
    } catch (error: any) {
      setSaveStatus({ show: true, message: error.serverMessage || 'Ошибка при создании номера', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000);
    }
  };

  if (loading && !userData) {
    return <Loader message="Загрузка данных пользователя..." fullScreen />;
  }

  if (!isAuthenticated) return <div>Пожалуйста, войдите в систему</div>;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: "'Montserrat', 'Arial', sans-serif",
      position: 'relative',
      paddingTop: '70px'
    }}>
      <div style={{ position: 'fixed', top: '5%', left: '2%', fontSize: '60px', opacity: 0.05, pointerEvents: 'none' }}>𓂀</div>
      <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '80px', opacity: 0.05, pointerEvents: 'none' }}>𓊹</div>
      <div style={{ position: 'fixed', top: '20%', right: '8%', fontSize: '50px', opacity: 0.05, pointerEvents: 'none' }}>𓋴</div>

      {isAuthenticated ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', color: '#8B5A2B', marginBottom: '10px' }}>🐪 Личный кабинет</h1>
            <div style={{ width: '150px', height: '3px', background: 'linear-gradient(90deg, transparent, #C0A080, #B76E3C, #C0A080, transparent)', margin: '0 auto' }}></div>
            <p style={{ color: '#B76E3C', marginTop: '15px', fontSize: '16px' }}>
              {isEditing ? 'Редактирование профиля' : 'Здравствуйте, ' + user?.firstName + '!'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px', alignItems: 'start' }}>
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
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: '#8B5A2B', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #D2B48C' }}>
                👤 {user?.firstName} {user?.surName}
              </h2>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {filteredNavItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { if (item.id === 'logout') handleLogout(); else handleTabChange(item.id); }}
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
              {saveStatus.show && (
                <div style={{
                  marginBottom: '20px',
                  padding: '15px 20px',
                  background: saveStatus.type === 'success' ? '#d4edda' : (saveStatus.type === 'info' ? '#cce5ff' : '#f8d7da'),
                  color: saveStatus.type === 'success' ? '#155724' : (saveStatus.type === 'info' ? '#004085' : '#721c24'),
                  border: `2px solid ${saveStatus.type === 'success' ? '#c3e6cb' : (saveStatus.type === 'info' ? '#b8daff' : '#f5c6cb')}`,
                  borderRadius: '15px',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span>{saveStatus.type === 'success' ? '✅' : (saveStatus.type === 'info' ? 'ℹ️' : '❌')}</span>
                  {saveStatus.message}
                </div>
              )}

              {/* Вкладка ПРОФИЛЬ */}
              {activeTab === 'profile' && (
                <div>
                  {!isEditing ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                      <button type="button" onClick={() => {
                        originalDataRef.current = userData;
                        setEditedData({ ...userData, passports: passportsData, addresses: addressesData });
                        setIsEditing(true);
                      }} style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: '#8B5A2B',
                        border: '2px solid #D2B48C',
                        borderRadius: '20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>✏️</span> Редактировать профиль
                      </button>
                    </div>
                  ) : null}

                  <section style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '20px', color: '#8B5A2B', marginBottom: '20px', borderBottom: '2px solid #D2B48C', paddingBottom: '10px' }}>📋 Личные данные</h3>

                    {isEditing ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>Имя *</label>
                          <input type="text" name="firstName" value={editedData?.firstName || ''} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: `2px solid ${errors.firstName ? '#dc3545' : '#D2B48C'}`, borderRadius: '15px', backgroundColor: '#FFF8F0', color: '#8B5A2B' }} />
                          {errors.firstName && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.firstName}</div>}
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>Фамилия *</label>
                          <input type="text" name="surName" value={editedData?.surName || ''} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: `2px solid ${errors.surName ? '#dc3545' : '#D2B48C'}`, borderRadius: '15px', backgroundColor: '#FFF8F0', color: '#8B5A2B' }} />
                          {errors.surName && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.surName}</div>}
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>Отчество</label>
                          <input type="text" name="middleName" value={editedData?.middleName || ''} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: `2px solid ${errors.middleName ? '#dc3545' : '#D2B48C'}`, borderRadius: '15px', backgroundColor: '#FFF8F0', color: '#8B5A2B' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>Email *</label>
                          <input type="email" name="email" value={editedData?.email || ''} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: `2px solid ${errors.email ? '#dc3545' : '#D2B48C'}`, borderRadius: '15px', backgroundColor: '#FFF8F0', color: '#8B5A2B' }} />
                          {errors.email && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.email}</div>}
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>Телефон *</label>
                          <input type="tel" name="phoneNumber" value={editedData?.phoneNumber || ''} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: `2px solid ${errors.phoneNumber ? '#dc3545' : '#D2B48C'}`, borderRadius: '15px', backgroundColor: '#FFF8F0', color: '#8B5A2B' }} />
                          {errors.phoneNumber && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.phoneNumber}</div>}
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>Пол</label>
                          <div style={{ display: 'flex', gap: '20px', padding: '12px 0' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                              <input type="radio" name="gender" value="Мужской" checked={editedData?.gender === 'Мужской'} onChange={handleChange} /> Мужской
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                              <input type="radio" name="gender" value="Женский" checked={editedData?.gender === 'Женский'} onChange={handleChange} /> Женский
                            </label>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#8B5A2B', fontSize: '14px', marginBottom: '5px' }}>Дата рождения *</label>
                          <input type="date" name="birthday" value={editedData?.birthday || ''} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', border: `2px solid ${errors.birthday ? '#dc3545' : '#D2B48C'}`, borderRadius: '15px', backgroundColor: '#FFF8F0', color: '#8B5A2B' }} />
                          {errors.birthday && <div style={{ color: '#dc3545', fontSize: '12px' }}>{errors.birthday}</div>}
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: '#FFF8F0', borderRadius: '20px', padding: '20px', border: '2px solid #D2B48C' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '15px', alignItems: 'center' }}>
                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Имя:</div><div>{user?.firstName || '—'}</div>
                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Фамилия:</div><div>{user?.surName || '—'}</div>
                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Отчество:</div><div>{user?.middleName || '—'}</div>
                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Email:</div><div>{user?.email || '—'}</div>
                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Телефон:</div><div>{user?.phoneNumber || '—'}</div>
                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Пол:</div><div>{user?.gender || '—'}</div>
                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дата рождения:</div><div>{user?.birthday || '—'}</div>
                          <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Возраст:</div><div>{user?.age || '—'} лет</div>
                        </div>
                      </div>
                    )}
                  </section>

                  {isEditing && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                      <button type="button" onClick={handleSave} style={{
                        padding: '15px 50px', background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)', color: '#FFF8F0',
                        border: '2px solid #D2B48C', borderRadius: '40px', fontSize: '18px', fontWeight: '600', cursor: 'pointer'
                      }}>Сохранить</button>
                      <button type="button" onClick={handleCancel} style={{
                        padding: '15px 30px', background: 'transparent', color: '#8B5A2B',
                        border: '2px solid #D2B48C', borderRadius: '40px', fontSize: '16px', fontWeight: '500', cursor: 'pointer'
                      }}>✕ Отмена</button>
                    </div>
                  )}
                </div>
              )}

              {/* Вкладка ДОКУМЕНТЫ */}
              {activeTab === 'documents' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #D2B48C', paddingBottom: '10px' }}>
                    <h3 style={{ fontSize: '24px', color: '#8B5A2B', fontFamily: "'Cormorant Garamond', serif", margin: 0 }}>📄 Мои документы</h3>
                    <button type="button" onClick={handleAddDocument} style={{ padding: '8px 15px', background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>➕ Добавить документ</button>
                  </div>

                  {isLoadingPassports ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                      <p style={{ color: '#8B5A2B' }}>Загрузка документов...</p>
                    </div>
                  ) : passportsData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#FFF8F0', borderRadius: '20px', border: '2px dashed #D2B48C' }}>
                      <p style={{ fontSize: '18px', color: '#8B5A2B', marginBottom: '20px' }}>У вас пока нет добавленных документов</p>
                      <button type="button" onClick={handleAddDocument} style={{ padding: '12px 30px', background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '40px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>➕ Добавить первый документ</button>
                    </div>
                  ) : (
                    passportsData.map((passport, index) => (
                      <div key={passport.id} style={{ background: '#FFF8F0', borderRadius: '20px', padding: '25px', border: '2px solid #D2B48C', marginBottom: index < passportsData.length - 1 ? '20px' : '0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #D2B48C', paddingBottom: '10px' }}>
                          <h4 style={{ fontSize: '18px', color: '#B76E3C', margin: 0 }}>📄 Документ #{index + 1}</h4>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => handleEditDocument(passport, addressesData[index], index)} style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '20px', fontSize: '14px', cursor: 'pointer' }}>✏️ Редактировать</button>
                            <button type="button" onClick={() => handleDeleteDocument(passport, addressesData[index], index)} disabled={loading} style={{ padding: '8px 20px', background: '#dc3545', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '20px', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>🗑️ {loading ? 'Удаление...' : 'Удалить'}</button>
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px', alignItems: 'center' }}>
                            <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Серия и номер:</div><div>{passport.seria || '—'} {passport.number || '—'}</div>
                            <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Кем выдан:</div><div>{passport.issuedBy || '—'}</div>
                            <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дата выдачи:</div><div>{passport.dateOfIssue ? new Date(passport.dateOfIssue).toLocaleDateString('ru-RU') : '—'}</div>
                            <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Код подразделения:</div><div>{passport.departmentCode || '—'}</div>
                          </div>
                        </div>
                        {addressesData[index] && (
                          <div style={{ marginTop: '20px' }}>
                            <h5 style={{ fontSize: '16px', color: '#B76E3C', margin: '0 0 15px 0' }}>📍 Адрес регистрации</h5>
                            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px', alignItems: 'center' }}>
                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Страна:</div><div>{addressesData[index].country || 'Российская Федерация'}</div>
                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Город:</div><div>{addressesData[index].city || '—'}</div>
                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Улица:</div><div>{addressesData[index].street || '—'}</div>
                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Дом:</div><div>{addressesData[index].house || '—'}</div>
                              <div style={{ color: '#8B5A2B', fontWeight: '500' }}>Квартира:</div><div>{addressesData[index].apartment?.toString() || '—'}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  <EditDocumentModal open={isModalOpen} data={modalData} onClose={() => { setIsModalOpen(false); setModalData(null); }} onSave={handleSaveDocument} mode={modalMode} />
                </div>
              )}

              {/* Вкладка БРОНИРОВАНИЯ */}
              {activeTab === 'bookings' && (
                <div>
                  <h3 style={{ fontSize: '24px', color: '#8B5A2B', marginBottom: '25px', borderBottom: '2px solid #D2B48C', paddingBottom: '10px' }}>🗺️ Ваши забронированные туры</h3>
                  {loadingBookings ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px', animation: 'pulse 1.5s infinite' }}>⏳</div>
                      <p style={{ color: '#8B5A2B' }}>Загрузка бронирований...</p>
                    </div>
                  ) : bookedTours.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFF8F0', borderRadius: '30px', border: '2px solid #D2B48C' }}>
                      <div style={{ fontSize: '60px', marginBottom: '20px' }}>🗺️</div>
                      <p style={{ fontSize: '20px', color: '#8B5A2B', marginBottom: '10px' }}>У вас пока нет забронированных туров</p>
                      <Link to="/catalog"><button style={{ padding: '12px 35px', background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '40px', fontSize: '16px', cursor: 'pointer' }}>🐪 Выбрать тур</button></Link>
                    </div>
                  ) : (
                    bookedTours.map((tour) => (
                      <div key={tour.id} style={{ background: '#FFF8F0', borderRadius: '20px', padding: '25px', border: '2px solid #D2B48C', position: 'relative', marginBottom: '20px' }}>
                        <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#28a745', color: 'white', padding: '6px 18px', borderRadius: '25px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><span>✅</span> Забронировано</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '25px' }}>
                          <img src={getSafeImageUrl(tour.imageTour, 'tour')} alt={tour.name} style={{ width: '100%', height: '160px', borderRadius: '15px', objectFit: 'cover', border: '2px solid #D2B48C' }} onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDERS.tour; }} />
                          <div>
                            <h4 style={{ fontSize: '22px', color: '#8B5A2B', marginBottom: '8px' }}>{tour.name}</h4>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                              <span style={{ color: '#B76E3C', fontSize: '14px' }}>📍 {tour.startDot} → {tour.endDot}</span>
                              <span>•</span>
                              <span style={{ color: '#B76E3C', fontSize: '14px' }}>🏷️ {tour.type}</span>
                              {tour.hotTour && <><span>•</span><span style={{ color: '#e67e22', fontSize: '14px' }}>🔥 Горящий тур</span></>}
                            </div>
                            {/* <p style={{ color: '#5D3A1A', fontSize: '14px', marginBottom: '15px' }}>{tour.description.length > 150 ? tour.description.substring(0, 150) + '...' : tour.description}</p> */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '28px', fontWeight: '700', color: '#8B5A2B' }}>{new Intl.NumberFormat('ru-RU').format(tour.price)} ₽</span>
                              <Link to={`/catalog/tour/${tour.id}`}><button style={{ padding: '10px 25px', background: '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '30px', cursor: 'pointer' }}>👁️ Подробнее</button></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Вкладка АДМИНИСТРАТОР */}
              {activeTab === 'admin' && (
                <div>
                  <h3 style={{ fontSize: '24px', color: '#8B5A2B', marginBottom: '25px', borderBottom: '2px solid #D2B48C', paddingBottom: '10px' }}>👨‍💼 Панель администратора</h3>
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <button onClick={() => { setShowTourForm(false); setShowHotelForm(false); setShowRoomForm(false); }} style={{ padding: '12px 25px', background: !showTourForm && !showHotelForm && !showRoomForm ? '#B76E3C' : '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>👥 Управление пользователями</button>
                      <button onClick={() => { setShowTourForm(!showTourForm); setShowHotelForm(false); setShowRoomForm(false); fetchAvailableHotels(); }} style={{ padding: '12px 25px', background: showTourForm ? '#B76E3C' : '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>✈️ Добавить тур</button>
                      <button onClick={() => { setShowHotelForm(!showHotelForm); setShowTourForm(false); setShowRoomForm(false); }} style={{ padding: '12px 25px', background: showHotelForm ? '#B76E3C' : '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>🏨 Добавить отель</button>
                      <button onClick={() => { setShowRoomForm(!showRoomForm); setShowTourForm(false); setShowHotelForm(false); }} style={{ padding: '12px 25px', background: showRoomForm ? '#B76E3C' : '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>🛏️ Добавить номер</button>
                    </div>
                  </div>

                  {showTourForm && (
                    <div style={{ background: '#FFF8F0', borderRadius: '20px', padding: '25px', border: '2px solid #D2B48C', marginBottom: '30px' }}>
                      <h4 style={{ fontSize: '20px', color: '#B76E3C', marginBottom: '20px' }}>Добавление нового тура</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        <div><label>Название тура *</label><input type="text" value={newTour.nameTour || ''} onChange={(e) => setNewTour({ ...newTour, nameTour: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div><label>Дата начала *</label><input type="date" value={newTour.startDot || ''} onChange={(e) => setNewTour({ ...newTour, startDot: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div><label>Дата окончания *</label><input type="date" value={newTour.endDot || ''} onChange={(e) => setNewTour({ ...newTour, endDot: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div><label>Цена (₽) *</label><input type="number" value={newTour.price || ''} onChange={(e) => setNewTour({ ...newTour, price: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div><label>Тип тура</label><select value={newTour.typeTour || 'Экскурсионный'} onChange={(e) => setNewTour({ ...newTour, typeTour: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }}><option value="Экскурсионный">Экскурсионный</option><option value="Пляжный">Пляжный</option><option value="Горнолыжный">Горнолыжный</option><option value="Лечебный">Лечебный</option><option value="Шопинг">Шопинг</option></select></div>
                        <div><label>Выберите отель *</label><select value={newTour.hotelsId || 0} onChange={(e) => setNewTour({ ...newTour, hotelsId: parseInt(e.target.value) })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }}><option value={0}>-- Выберите отель --</option>{availableHotels.map(hotel => (<option key={hotel.id} value={hotel.id}>{hotel.name} ({'★'.repeat(hotel.stars)})</option>))}</select></div>
                        <div><label>URL изображения</label><input type="text" value={newTour.imageTour || ''} onChange={(e) => setNewTour({ ...newTour, imageTour: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div><label><input type="checkbox" checked={newTour.hotTour || false} onChange={(e) => setNewTour({ ...newTour, hotTour: e.target.checked })} /> Горящий тур</label></div>
                        <div style={{ gridColumn: 'span 2' }}><label>Краткое описание *</label><textarea value={newTour.description || ''} onChange={(e) => setNewTour({ ...newTour, description: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div style={{ gridColumn: 'span 2' }}><label>Детали маршрута *</label><textarea value={newTour.details || ''} onChange={(e) => setNewTour({ ...newTour, details: e.target.value })} rows={4} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div style={{ gridColumn: 'span 2' }}><label>Что включено *</label><textarea value={newTour.included || ''} onChange={(e) => setNewTour({ ...newTour, included: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div style={{ gridColumn: 'span 2' }}><label>Что оплачивается отдельно *</label><textarea value={newTour.separately || ''} onChange={(e) => setNewTour({ ...newTour, separately: e.target.value })} rows={2} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div style={{ gridColumn: 'span 2' }}><label>Программа тура *</label><textarea value={newTour.program || ''} onChange={(e) => setNewTour({ ...newTour, program: e.target.value })} rows={5} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '25px', justifyContent: 'flex-end' }}>
                        <button onClick={handleAddTourAsync} disabled={loading || availableHotels.length === 0} style={{ padding: '12px 30px', background: (loading || availableHotels.length === 0) ? '#999' : 'linear-gradient(135deg, #B76E3C, #8B5A2B)', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '25px', cursor: (loading || availableHotels.length === 0) ? 'not-allowed' : 'pointer' }}>{loading ? 'Сохранение...' : 'Сохранить тур'}</button>
                        <button onClick={() => setShowTourForm(false)} style={{ padding: '12px 30px', background: 'transparent', color: '#8B5A2B', border: '2px solid #D2B48C', borderRadius: '25px', cursor: 'pointer' }}>Отмена</button>
                      </div>
                    </div>
                  )}

                  {showHotelForm && (
                    <div style={{ background: '#FFF8F0', borderRadius: '20px', padding: '25px', border: '2px solid #D2B48C', marginBottom: '30px' }}>
                      <h4 style={{ fontSize: '20px', color: '#B76E3C', marginBottom: '20px' }}>Добавление нового отеля</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        <div><label>Название отеля *</label><input type="text" value={newHotel.name || ''} onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div><label>Звезд *</label><select value={newHotel.stars || 3} onChange={(e) => setNewHotel({ ...newHotel, stars: Number(e.target.value) })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option></select></div>
                        <div><label>URL изображения *</label><input type="text" value={newHotel.imageHotel || ''} onChange={(e) => setNewHotel({ ...newHotel, imageHotel: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div style={{ gridColumn: 'span 2' }}><label>Детали</label><textarea value={newHotel.details || ''} onChange={(e) => setNewHotel({ ...newHotel, details: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '25px', justifyContent: 'flex-end' }}>
                        <button onClick={handleAddHotelAsync} disabled={loading} style={{ padding: '12px 30px', background: loading ? '#999' : '#B76E3C', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '25px', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Сохранение...' : 'Сохранить отель'}</button>
                        <button onClick={() => setShowHotelForm(false)} style={{ padding: '12px 30px', background: 'transparent', color: '#8B5A2B', border: '2px solid #D2B48C', borderRadius: '25px', cursor: 'pointer' }}>Отмена</button>
                      </div>
                    </div>
                  )}

                  {showRoomForm && (
                    <div style={{ background: '#FFF8F0', borderRadius: '20px', padding: '25px', border: '2px solid #D2B48C', marginBottom: '30px' }}>
                      <h4 style={{ fontSize: '20px', color: '#B76E3C', marginBottom: '20px' }}>Добавление номера</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        <div><label>Название номера *</label><input type="text" value={newRoom.nameRoom || ''} onChange={(e) => setNewRoom({ ...newRoom, nameRoom: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div><label>Тип номера *</label><select value={newRoom.typeRoom || 'Стандарт'} onChange={(e) => setNewRoom({ ...newRoom, typeRoom: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }}><option value="Стандарт">Стандарт</option><option value="Люкс">Люкс</option><option value="Полулюкс">Полулюкс</option><option value="Семейный">Семейный</option><option value="Эконом">Эконом</option></select></div>
                        <div><label>Этаж *</label><input type="number" min="1" value={newRoom.floor || 1} onChange={(e) => setNewRoom({ ...newRoom, floor: Number(e.target.value) })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div><label>URL изображения</label><input type="text" value={newRoom.imageRoom || ''} onChange={(e) => setNewRoom({ ...newRoom, imageRoom: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                        <div style={{ gridColumn: 'span 2' }}><label>Детали</label><textarea value={newRoom.details || ''} onChange={(e) => setNewRoom({ ...newRoom, details: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '25px', justifyContent: 'flex-end' }}>
                        <button onClick={handleAddRoomAsync} disabled={loading} style={{ padding: '12px 30px', background: loading ? '#999' : '#B76E3C', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '25px', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Сохранение...' : 'Сохранить номер'}</button>
                        <button onClick={() => setShowRoomForm(false)} style={{ padding: '12px 30px', background: 'transparent', color: '#8B5A2B', border: '2px solid #D2B48C', borderRadius: '25px', cursor: 'pointer' }}>Отмена</button>
                      </div>
                    </div>
                  )}

                  {!showTourForm && !showHotelForm && !showRoomForm && (
                    <>
                      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <button onClick={() => { setSelectedUserType('clients'); fetchAllClients(); }} style={{ padding: '10px 20px', background: selectedUserType === 'clients' ? '#B76E3C' : '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '20px', cursor: 'pointer' }}>👥 Клиенты</button>
                        <button onClick={() => { setSelectedUserType('employees'); fetchAllEmployees(); }} style={{ padding: '10px 20px', background: selectedUserType === 'employees' ? '#B76E3C' : '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '20px', cursor: 'pointer' }}>💼 Сотрудники</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
                        <div style={{ background: '#FFF8F0', borderRadius: '15px', padding: '15px', border: '2px solid #D2B48C', maxHeight: '500px', overflowY: 'auto' }}>
                          <h4 style={{ color: '#8B5A2B', marginBottom: '15px' }}>{selectedUserType === 'clients' ? 'Клиенты' : 'Сотрудники'}</h4>
                          {selectedUserType === 'clients' ? allClients.map(client => (<div key={client.id} onClick={() => handleViewUser(client.id, 'clients')} style={{ padding: '10px', marginBottom: '5px', background: selectedUserId === client.id ? '#B76E3C' : 'transparent', color: selectedUserId === client.id ? '#FFF8F0' : '#8B5A2B', borderRadius: '10px', cursor: 'pointer' }}>{client.surName} {client.firstName}</div>)) : allEmployees.map(employee => (<div key={employee.id} onClick={() => handleViewUser(employee.id, 'employees')} style={{ padding: '10px', marginBottom: '5px', background: selectedUserId === employee.id ? '#B76E3C' : 'transparent', color: selectedUserId === employee.id ? '#FFF8F0' : '#8B5A2B', borderRadius: '10px', cursor: 'pointer' }}>{employee.surName} {employee.firstName} - {employee.position}</div>))}
                        </div>
                        <div style={{ background: '#FFF8F0', borderRadius: '15px', padding: '20px', border: '2px solid #D2B48C' }}>
                          {viewingUserData ? (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h4 style={{ color: '#8B5A2B' }}>{selectedUserType === 'clients' ? 'Клиент' : 'Сотрудник'}: {(viewingUserData as UserResponse).surName} {(viewingUserData as UserResponse).firstName}</h4>
                                <button onClick={() => setIsEditingUser(!isEditingUser)} style={{ padding: '8px 15px', background: '#C0A080', color: '#FFF8F0', border: '1px solid #8B5A2B', borderRadius: '15px', cursor: 'pointer' }}>{isEditingUser ? 'Отмена' : '✏️ Редактировать'}</button>
                              </div>
                              <div><p><strong>Email:</strong> {viewingUserData.email}</p><p><strong>Телефон:</strong> {viewingUserData.phoneNumber}</p></div>
                              {isEditingUser && (
                                <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(210, 180, 140, 0.1)', borderRadius: '10px' }}>
                                  <input type="text" placeholder="Фамилия" value={(viewingUserData as UserResponse).surName || ''} onChange={(e) => setViewingUserData({ ...viewingUserData, surName: e.target.value } as any)} style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #D2B48C', borderRadius: '8px' }} />
                                  <input type="text" placeholder="Имя" value={(viewingUserData as UserResponse).firstName || ''} onChange={(e) => setViewingUserData({ ...viewingUserData, firstName: e.target.value } as any)} style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #D2B48C', borderRadius: '8px' }} />
                                  <input type="email" placeholder="Email" value={viewingUserData.email || ''} onChange={(e) => setViewingUserData({ ...viewingUserData, email: e.target.value } as any)} style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #D2B48C', borderRadius: '8px' }} />
                                  <input type="tel" placeholder="Телефон" value={viewingUserData.phoneNumber || ''} onChange={(e) => setViewingUserData({ ...viewingUserData, phoneNumber: e.target.value } as any)} style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #D2B48C', borderRadius: '8px' }} />
                                  <button onClick={async () => { await clientApi.update(viewingUserData.id, viewingUserData as any); setIsEditingUser(false); setSaveStatus({ show: true, message: 'Данные сохранены!', type: 'success' }); setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 3000); }} style={{ padding: '10px', background: '#B76E3C', color: '#FFF8F0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Сохранить</button>
                                </div>
                              )}
                            </div>
                          ) : <p style={{ textAlign: 'center', padding: '40px' }}>Выберите пользователя</p>}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Вкладка СОТРУДНИК */}
              {activeTab === 'employee' && (
                <div>
                  <h3 style={{ fontSize: '24px', color: '#8B5A2B', marginBottom: '25px', borderBottom: '2px solid #D2B48C', paddingBottom: '10px' }}>👨‍💻 Панель сотрудника</h3>
                  <div style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                      <button onClick={() => { setShowHotelForm(!showHotelForm); setShowRoomForm(false); }} style={{ padding: '12px 25px', background: showHotelForm ? '#B76E3C' : '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>🏨 Добавить отель</button>
                      <button onClick={() => { setShowRoomForm(!showRoomForm); setShowHotelForm(false); }} style={{ padding: '12px 25px', background: showRoomForm ? '#B76E3C' : '#C0A080', color: '#FFF8F0', border: '2px solid #8B5A2B', borderRadius: '25px', cursor: 'pointer' }}>🛏️ Добавить номер</button>
                    </div>
                  </div>
                  {showHotelForm && (
                    <div style={{ background: '#FFF8F0', borderRadius: '20px', padding: '25px', border: '2px solid #D2B48C', marginBottom: '30px' }}>
                      <h4 style={{ fontSize: '20px', color: '#B76E3C' }}>Добавление отеля</h4>
                      <div><label>Название отеля *</label><input type="text" value={newHotel.name || ''} onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                      <div><label>Звезд *</label><select value={newHotel.stars || 3} onChange={(e) => setNewHotel({ ...newHotel, stars: Number(e.target.value) })} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }}><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option></select></div>
                      <div><label>URL изображения *</label><input type="text" value={newHotel.imageHotel || ''} onChange={(e) => setNewHotel({ ...newHotel, imageHotel: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                      <div><label>Детали</label><textarea value={newHotel.details || ''} onChange={(e) => setNewHotel({ ...newHotel, details: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                      <button onClick={handleAddHotelAsync} disabled={loading} style={{ padding: '12px 30px', background: '#B76E3C', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '25px', cursor: 'pointer', marginTop: '15px' }}>Сохранить</button>
                    </div>
                  )}
                  {showRoomForm && (
                    <div style={{ background: '#FFF8F0', borderRadius: '20px', padding: '25px', border: '2px solid #D2B48C', marginBottom: '30px' }}>
                      <h4 style={{ fontSize: '20px', color: '#B76E3C' }}>Добавление номера</h4>
                      <div><label>Название номера *</label><input type="text" value={newRoom.nameRoom || ''} onChange={(e) => setNewRoom({ ...newRoom, nameRoom: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                      <div><label>Тип номера *</label><select value={newRoom.typeRoom || 'Стандарт'} onChange={(e) => setNewRoom({ ...newRoom, typeRoom: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }}><option value="Стандарт">Стандарт</option><option value="Люкс">Люкс</option><option value="Полулюкс">Полулюкс</option><option value="Семейный">Семейный</option><option value="Эконом">Эконом</option></select></div>
                      <div><label>Этаж *</label><input type="number" value={newRoom.floor || 1} onChange={(e) => setNewRoom({ ...newRoom, floor: Number(e.target.value) })} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                      <div><label>URL изображения</label><input type="text" value={newRoom.imageRoom || ''} onChange={(e) => setNewRoom({ ...newRoom, imageRoom: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                      <div><label>Детали</label><textarea value={newRoom.details || ''} onChange={(e) => setNewRoom({ ...newRoom, details: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', border: '2px solid #D2B48C', borderRadius: '10px' }} /></div>
                      <button onClick={handleAddRoomAsync} disabled={loading} style={{ padding: '12px 30px', background: '#B76E3C', color: '#FFF8F0', border: '2px solid #D2B48C', borderRadius: '25px', cursor: 'pointer', marginTop: '15px' }}>Сохранить</button>
                    </div>
                  )}
                  {!showHotelForm && !showRoomForm && (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#FFF8F0', borderRadius: '15px', border: '2px solid #D2B48C' }}>Выберите действие: добавить отель или номер</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}><h1>Доступ заблокирован</h1><p>Пожалуйста, зайдите в профиль</p></div>
      )}
    </div>
  );
};

export { ClientAccountPage };