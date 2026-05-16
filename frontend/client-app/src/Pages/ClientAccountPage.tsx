import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { clientApi, UserResponse } from "../Services/IndexAuth";
import { Passports, deletePassport, updatePassport, createPassport, getInfoPassport } from "../Services/PassportApi";
import { Address, getAddresses } from "../Services/AddressApi";
import EditDocumentModal, { DocumentFormData, AddressFormData, CombinedDocumentData } from '../EditDocumentModal';
import { Link } from 'react-router-dom';
import { createTour, CreateTourDto, getAllTours, Tours } from "../Services/ToursApi";
import { createHotel, CreateHotelDto, getAllHotels } from "../Services/HotelsApi";
import { createHotelRoom, CreateHotelRoomsDto, getAllHotelRooms, HotelRooms } from "../Services/HotelRoomsApi";
import { getInfoUserTicket } from "../Services/TicketsApi";
import { deleteUser } from "../Services/UsersApi";
import { getSafeImageUrl, PLACEHOLDERS } from "../Components/OptimizedImage";
import Loader from "../Components/Loader";
import NavBar from "../Components/NavBar";

interface TourLocal {
  id?: number;
  name: string;
  startDot: string;
  endDot: string;
  details: string;
  imageTour: string;
  description: string;
  type: string;
  hotTour: boolean;
  price: number;
  countNights?: number | null;
  tickets_Id?: number | null;
}

interface NavItem {
  id: 'profile' | 'documents' | 'bookings' | 'admin' | 'employee' | 'logout';
  label: string;
  roles: string[];
}

const DELETED_PASSPORTS_KEY = 'deletedPassports';

const getDeletedPassportIds = (): number[] => {
  try { return JSON.parse(localStorage.getItem(DELETED_PASSPORTS_KEY) || '[]'); }
  catch { return []; }
};

const addDeletedPassportId = (id: number) => {
  const ids = getDeletedPassportIds();
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(DELETED_PASSPORTS_KEY, JSON.stringify(ids));
  }
};

const ClientAccountPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'bookings' | 'admin' | 'employee'>('profile');
  const { user, isAuthenticated, logout } = useAuth();
  const [userData, setUserData] = useState<UserResponse | null>(null);

  const [passportData, setPassportData] = useState<Passports | null>(null);
  const [addressData, setAddressData] = useState<Address | null>(null);

  const [editedData, setEditedData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const originalDataRef = useRef<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CombinedDocumentData | null>(null);
  const [modalMode, setModalMode] = useState<'edit' | 'add'>('edit');

  const [saveStatus, setSaveStatus] = useState<{ show: boolean; message: string; type: string }>({ show: false, message: '', type: '' });
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showTourForm, setShowTourForm] = useState(false);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);

  const [allClients, setAllClients] = useState<UserResponse[]>([]);
  const [allEmployees, setAllEmployees] = useState<UserResponse[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<'clients' | 'employees'>('clients');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewingUserData, setViewingUserData] = useState<UserResponse | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const [bookedTours, setBookedTours] = useState<TourLocal[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [isLoadingPassports, setIsLoadingPassports] = useState(false);

  const [availableHotels, setAvailableHotels] = useState<{ id: number; name: string; stars: number }[]>([]);
  const [availableRooms, setAvailableRooms] = useState<HotelRooms[]>([]);
  const [availableAddresses, setAvailableAddresses] = useState<Address[]>([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);

  const userRole = (user?.role || 'user').toLowerCase();

  const [selectedCurrency, setSelectedCurrency] = useState('RUB');
  const [currentRate, setCurrentRate] = useState(1);
  const [signCurrency, setSignCurrency] = useState('₽');

  const navItems: NavItem[] = [
    { id: 'profile', label: '📋 Мои данные', roles: ['admin', 'employee', 'user'] },
    { id: 'documents', label: '📄 Документы', roles: ['admin', 'employee', 'user'] },
    { id: 'bookings', label: '🗺️ Мои бронирования', roles: ['admin', 'employee', 'user'] },
    { id: 'admin', label: '👨‍💼 Администратор', roles: ['admin'] },
    { id: 'employee', label: '👨‍💻 Сотрудник', roles: ['employee'] },
    { id: 'logout', label: '🚪 Выход', roles: ['admin', 'employee', 'user'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const [newTour, setNewTour] = useState<CreateTourDto>({
    nameTour: '', startDot: '', endDot: '', details: '', imageTour: '',
    description: '', separately: '', included: '', program: '',
    hotTour: false, typeTour: 'Экскурсионный', price: 0, hotelsId: 0
  });

  const [newHotel, setNewHotel] = useState<CreateHotelDto & { addressId?: number | null }>({
    name: '', stars: 3, imageHotel: '/default-hotel.jpg', details: '', hotelRoomId: null, addressId: null
  });

  const [newRoom, setNewRoom] = useState<CreateHotelRoomsDto>({
    nameRoom: '', floor: 1, details: '', imageRoom: '/default-room.jpg', typeRoom: 'Стандарт'
  });

  const getTodayISO = (): string => new Date().toISOString().split('T')[0];

  const handleCurrencyChange = (currency: string, rate: number) => {
    switch (currency) {
      case "RUB": setSignCurrency('₽'); break;
      case "USD": setSignCurrency('$'); break;
      case "EUR": setSignCurrency('€'); break;
    }
    setSelectedCurrency(currency);
    setCurrentRate(rate);
  };

  const showStatus = (message: string, type: string) => {
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    setSaveStatus({ show: true, message, type });
    statusTimerRef.current = setTimeout(() => setSaveStatus({ show: false, message: '', type: '' }), 5000);
  };

  const formatDateToISO = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  };

  const fetchAvailableHotels = async () => {
    try {
      setIsLoadingHotels(true);
      const list = await getAllHotels();
      setAvailableHotels(list.map((h: any) => ({ id: h.id, name: h.name, stars: h.stars })));
    } catch (e: any) {
      console.log('Отели не загружены:', e);
    } finally {
      setIsLoadingHotels(false);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const rooms = await getAllHotelRooms();
      setAvailableRooms(rooms);
    } catch (e: any) {
      console.log('Номера не загружены:', e);
    }
  };
  const fetchAvailableAddresses = async () => {
    try {
      const addresses = await getAddresses();
      setAvailableAddresses(addresses);
    } catch (e: any) {
      console.log('Адреса не загружены:', e);
    }
  };
  const fetchUser = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const u = await clientApi.getById(Number(user.id));
      setUserData(u);
      await fetchUserPassport();
    } catch (e: any) {
      console.log('Не удалось загрузить пользователя:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPassport = async () => {
    if (!user?.id) return;
    setIsLoadingPassports(true);
    try {
      const passportInfo = await getInfoPassport(user.id);
      if (passportInfo) {
        const deletedIds = getDeletedPassportIds();
        if (deletedIds.includes(passportInfo.id)) {
          setPassportData(null); setAddressData(null);
          setIsLoadingPassports(false); return;
        }
        setPassportData({
          id: passportInfo.id, seria: passportInfo.seria, number: passportInfo.number,
          type: passportInfo.type, issuedBy: passportInfo.issuedBy,
          departmentCode: passportInfo.departmentCode,
          dateOfIssue: passportInfo.dateOfIssue instanceof Date
            ? passportInfo.dateOfIssue.toISOString().split('T')[0]
            : String(passportInfo.dateOfIssue)
        });
        if (passportInfo.address) {
          setAddressData({
            id: passportInfo.address.id, country: passportInfo.address.country || '',
            region: passportInfo.address.region || '', city: passportInfo.address.city || '',
            street: passportInfo.address.street || '', house: passportInfo.address.house || '',
            apartment: passportInfo.address.apartment ? parseInt(String(passportInfo.address.apartment), 10) : null
          });
        } else { setAddressData(null); }
      } else { setPassportData(null); setAddressData(null); }
    } catch { setPassportData(null); setAddressData(null); }
    finally { setIsLoadingPassports(false); }
  };

  const fetchUserBookedTours = async () => {
    if (!user?.id) return;
    try {
      setLoadingBookings(true);
      const userTickets = await getInfoUserTicket(user.id);
      const allTours: Tours[] = await getAllTours();
      const result: TourLocal[] = [];
      for (const ticket of userTickets) {
        if (ticket.tourId) {
          const relatedTour = allTours.find((t: Tours) => t.id === ticket.tourId);
          if (relatedTour && !result.find(x => x.id === relatedTour.id)) {
            result.push({
              id: relatedTour.id, name: relatedTour.name || '',
              startDot: relatedTour.startDot || '', endDot: relatedTour.endDot || '',
              details: relatedTour.details || '', imageTour: relatedTour.imageTour || '',
              description: relatedTour.description || relatedTour.details || '',
              type: relatedTour.type || '', hotTour: relatedTour.hotTour || false,
              price: relatedTour.price || ticket.price,
              countNights: (relatedTour as any).countNights || null,
              tickets_Id: ticket.id
            });
          }
        }
      }
      setBookedTours(result);
    } catch (e: any) { setBookedTours([]); }
    finally { setLoadingBookings(false); }
  };

  useEffect(() => {
    fetchUser(); fetchUserBookedTours();
    return () => { if (statusTimerRef.current) clearTimeout(statusTimerRef.current); };
  }, [user?.id]);

  useEffect(() => {
    if (userData) {
      setEditedData({ ...userData });
      if (!originalDataRef.current) originalDataRef.current = { ...userData };
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    let value: any;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      value = target.checked;
    } else { value = target.value; }
    setEditedData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!editedData?.firstName?.trim()) errs.firstName = 'Имя обязательно';
    if (!editedData?.surName?.trim()) errs.surName = 'Фамилия обязательна';
    if (!editedData?.email?.trim()) errs.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(editedData.email)) errs.email = 'Email некорректен';
    if (!editedData?.phoneNumber?.trim()) errs.phoneNumber = 'Телефон обязателен';
    if (!editedData?.gender) errs.gender = 'Пол обязателен';
    if (!editedData?.birthday) errs.birthday = 'Дата рождения обязательна';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !editedData?.id) return;
    if (!originalDataRef.current) originalDataRef.current = { ...userData };
    try {
      const updateData: any = {};
      const orig = originalDataRef.current;
      if (editedData.surName !== orig?.surName) updateData.surName = editedData.surName;
      if (editedData.firstName !== orig?.firstName) updateData.firstName = editedData.firstName;
      if (editedData.middleName !== orig?.middleName) updateData.middleName = editedData.middleName || null;
      if (String(editedData.gender || '') !== String(orig?.gender || '')) updateData.gender = editedData.gender;
      if (editedData.birthday !== orig?.birthday) updateData.birthday = editedData.birthday;
      if (editedData.phoneNumber !== orig?.phoneNumber) updateData.phoneNumber = editedData.phoneNumber;
      if (editedData.email !== orig?.email) updateData.email = editedData.email;
      if (Object.keys(updateData).length === 0) { showStatus('Нет изменений', 'info'); setIsEditing(false); return; }
      await clientApi.update(editedData.id, updateData);
      originalDataRef.current = { ...orig, ...updateData };
      const updated = await clientApi.getById(editedData.id);
      setUserData(updated); setIsEditing(false);
      showStatus('Данные сохранены!', 'success');
    } catch (error: any) { showStatus(error.serverMessage || error.message || 'Ошибка сохранения', 'error'); }
  };

  const handleCancel = () => {
    setEditedData(originalDataRef.current ? { ...originalDataRef.current } : { ...userData });
    setIsEditing(false); setErrors({});
  };

  const handleEditDocument = () => {
    if (!passportData) { handleAddDocument(); return; }
    setModalData({
      passport: {
        seria: String(passportData.seria || ''), number: String(passportData.number || ''),
        issuedBy: passportData.issuedBy || '', dateOfIssue: passportData.dateOfIssue || '',
        departmentCode: passportData.departmentCode || '', type: passportData.type || 'internal',
        gender: (passportData as any).gender || '', placeOfBirth: (passportData as any).placeOfBirth || '',
        id: passportData.id
      },
      address: addressData ? {
        country: addressData.country || 'Российская Федерация', city: addressData.city || '',
        street: addressData.street || '', house: addressData.house || '',
        apartment: addressData.apartment?.toString() || '', id: addressData.id
      } : { country: 'Российская Федерация', city: '', street: '', house: '', apartment: '' },
      passportId: passportData.id, addressId: addressData?.id, index: 0
    });
    setModalMode('edit'); setIsModalOpen(true);
  };

  const handleAddDocument = () => {
    setModalData({
      passport: { seria: '', number: '', issuedBy: '', dateOfIssue: '', departmentCode: '', type: 'internal', gender: '', placeOfBirth: '' },
      address: { country: 'Российская Федерация', city: '', street: '', house: '', apartment: '' }, index: -1
    });
    setModalMode('add'); setIsModalOpen(true);
  };

  const handleSaveDocument = async (passportFormData: DocumentFormData, addressFormData: AddressFormData) => {
    if (!user?.id) { showStatus('Пользователь не авторизован', 'error'); return; }
    try {
      setLoading(true);
      const dateOfIssue = formatDateToISO(passportFormData.dateOfIssue);
      const deptCode = passportFormData.departmentCode?.trim() || '000-000';
      let apartment: number = 0;
      if (addressFormData.apartment) {
        const p = parseInt(addressFormData.apartment, 10);
        if (!isNaN(p) && p > 0 && p <= 2147483647) apartment = p;
      }
      const hasAddr = !!(addressFormData.city?.trim() || addressFormData.street?.trim());
      const addressForCreate = hasAddr ? {
        id: 0, passportId: 0,
        country: addressFormData.country || 'Российская Федерация',
        region: addressFormData.country || 'Российская Федерация',
        city: addressFormData.city || '', street: addressFormData.street || '',
        house: addressFormData.house || '', apartment: apartment
      } : null;
      const addressForUpdate = hasAddr ? {
        id: addressData?.id || 0, passportId: passportData?.id || 0,
        country: addressFormData.country || 'Российская Федерация',
        region: addressFormData.country || 'Российская Федерация',
        city: addressFormData.city || '', street: addressFormData.street || '',
        house: addressFormData.house || '', apartment: apartment
      } : null;

      if (modalMode === 'edit' && passportData) {
        const payload = {
          id: passportData.id, passportId: passportData.id,
          seria: parseInt(passportFormData.seria, 10) || 0,
          number: parseInt(passportFormData.number, 10) || 0,
          type: passportFormData.type || 'internal',
          issuedBy: passportFormData.issuedBy || '',
          departmentCode: deptCode, dateOfIssue: dateOfIssue,
          address: addressForUpdate
        };
        await updatePassport(user.id, payload as any);
        setPassportData({
          id: passportData.id, seria: parseInt(passportFormData.seria, 10) || 0,
          number: parseInt(passportFormData.number, 10) || 0,
          type: passportFormData.type || 'internal',
          issuedBy: passportFormData.issuedBy || '',
          departmentCode: deptCode, dateOfIssue: dateOfIssue
        });
        if (addressForUpdate) setAddressData(addressForUpdate as Address);
        showStatus('Документ обновлён!', 'success');
      } else if (modalMode === 'add') {
        const payload = {
          seria: parseInt(passportFormData.seria, 10) || 0,
          number: parseInt(passportFormData.number, 10) || 0,
          type: passportFormData.type || 'internal',
          issuedBy: passportFormData.issuedBy || '',
          departmentCode: deptCode, dateOfIssue: dateOfIssue,
          address: addressForCreate
        };
        await createPassport(user.id, payload as any);
        localStorage.removeItem(DELETED_PASSPORTS_KEY);

        setPassportData({
          id: 0, seria: parseInt(passportFormData.seria, 10) || 0,
          number: parseInt(passportFormData.number, 10) || 0,
          type: passportFormData.type || 'internal',
          issuedBy: passportFormData.issuedBy || '',
          departmentCode: deptCode, dateOfIssue: dateOfIssue
        });
        if (addressForCreate) setAddressData(addressForCreate as Address);
        showStatus('Документ добавлен!', 'success');
      }
      setIsModalOpen(false); setModalData(null);
      setTimeout(async () => {
        try {
          const info = await getInfoPassport(user.id);
          if (info) {
            setPassportData(prev => prev ? { ...prev, id: info.id } : null);
            if (info.address) setAddressData(prev => prev ? { ...prev, id: info.address.id } : null);
          }
        } catch { }
      }, 2000);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data?.title || error.serverMessage || error.message || 'Ошибка';
      showStatus(msg, 'error');
    } finally { setLoading(false); }
  };

  const handleDeleteDocument = async () => {
    if (!user?.id || !passportData) return;
    if (!window.confirm('Удалить паспорт? Документ будет скрыт из личного кабинета.')) return;
    setLoading(true);
    try { await deletePassport(passportData.id, user.id); }
    catch { console.log('Серверное удаление не сработало, выполняем клиентское удаление'); }
    addDeletedPassportId(passportData.id);
    setPassportData(null); setAddressData(null);
    showStatus('Документ скрыт из личного кабинета', 'success');
    setLoading(false);
  };

  const fetchAllClients = async () => { try { setAllClients(await clientApi.getAll()); } catch { } };
  const fetchAllEmployees = async () => {
    try {
      const users = await clientApi.getAll();
      setAllEmployees(users.filter((u: any) => u.role === 'employee' || u.position === 'Сотрудник'));
    } catch { }
  };

  const handleViewUser = async (id: number, type: 'clients' | 'employees') => {
    setSelectedUserId(id); setSelectedUserType(type);
    try { const u = await clientApi.getById(id); setViewingUserData(u); setIsEditingUser(false); } catch { }
  };

  const handleDeleteViewedUser = async () => {
    if (!viewingUserData) return;
    if (!window.confirm(`Удалить пользователя ${viewingUserData.surName} ${viewingUserData.firstName}?`)) return;
    try {
      await deleteUser(viewingUserData.id);
      setViewingUserData(null); setSelectedUserId(null);
      if (selectedUserType === 'clients') fetchAllClients(); else fetchAllEmployees();
      showStatus('Пользователь удалён!', 'success');
    } catch (error: any) { showStatus(error.serverMessage || error.message || 'Ошибка удаления', 'error'); }
  };

  const handleAddTourAsync = async () => {
    if (!newTour.nameTour || !newTour.startDot || !newTour.endDot || !newTour.price) {
      showStatus('Заполните обязательные поля (название, даты, цена)', 'error'); return;
    }
    if (!newTour.hotelsId) { showStatus('Выберите отель', 'error'); return; }
    if (!user?.id) return;
    const today = getTodayISO();
    if (newTour.startDot < today) { showStatus('Дата начала тура не может быть меньше текущей даты', 'error'); return; }
    if (newTour.endDot <= newTour.startDot) { showStatus('Дата окончания должна быть позже даты начала (минимум 1 день)', 'error'); return; }
    setLoading(true);
    try {
      await createTour(user.id, newTour);
      setShowTourForm(false); resetTourForm();
      showStatus('Тур добавлен!', 'success');
    } catch (error: any) { showStatus(error.serverMessage || error.message || 'Ошибка создания тура', 'error'); }
    finally { setLoading(false); }
  };

  const handleAddHotelAsync = async () => {
    if (!newHotel.name || !newHotel.stars) { showStatus('Заполните название и звёзды', 'error'); return; }
    if (!user?.id) return;
    setLoading(true);
    try {
      const hotelData: any = {
        name: newHotel.name,
        stars: Number(newHotel.stars),
        imageHotel: newHotel.imageHotel || '/default-hotel.jpg',
        details: newHotel.details || ''
      };
      if (newHotel.addressId && newHotel.addressId > 0) {
        hotelData.addressId = newHotel.addressId;
      }
      if (newHotel.hotelRoomId && newHotel.hotelRoomId > 0) {
        hotelData.hotelRoomId = newHotel.hotelRoomId;
      }

      console.log('Отправка данных отеля:', JSON.stringify(hotelData, null, 2));
      await createHotel(user.id, hotelData);
      setShowHotelForm(false); resetHotelForm();
      showStatus('Отель добавлен!', 'success');
      await fetchAvailableHotels();
      await fetchAvailableRooms();
    } catch (error: any) {
      console.error('Ошибка создания отеля:', error);
      showStatus(error.response?.data?.message || error.serverMessage || error.message || 'Ошибка создания отеля', 'error');
    }
    finally { setLoading(false); }
  };

  const handleAddRoomAsync = async () => {
    if (!newRoom.nameRoom || !newRoom.floor || !newRoom.typeRoom) {
      showStatus('Заполните обязательные поля', 'error'); return;
    }
    if (!user?.id) return;
    setLoading(true);
    try {
      await createHotelRoom(newRoom, user.id);
      setShowRoomForm(false); resetRoomForm();
      showStatus('Номер добавлен!', 'success');
      await fetchAvailableRooms();
    } catch (error: any) { showStatus(error.serverMessage || 'Ошибка создания номера', 'error'); }
    finally { setLoading(false); }
  };

  const resetTourForm = () => setNewTour({ nameTour: '', startDot: '', endDot: '', details: '', imageTour: '', description: '', separately: '', included: '', program: '', hotTour: false, typeTour: 'Экскурсионный', price: 0, hotelsId: 0 });
  const resetHotelForm = () => setNewHotel({ name: '', stars: 3, imageHotel: '/default-hotel.jpg', details: '', hotelRoomId: null });
  const resetRoomForm = () => setNewRoom({ nameRoom: '', floor: 1, details: '', imageRoom: '/default-room.jpg', typeRoom: 'Стандарт' });

  const resetForms = () => {
    setShowTourForm(false); setShowHotelForm(false); setShowRoomForm(false);
    resetTourForm(); resetHotelForm(); resetRoomForm();
  };

  const handleTabChange = (tabId: 'profile' | 'documents' | 'bookings' | 'admin' | 'employee') => {
    setActiveTab(tabId);
    if (tabId !== 'profile') setIsEditing(false);
    resetForms();
    setSelectedUserId(null); setViewingUserData(null);
    if (tabId === 'admin') { fetchAvailableHotels(); fetchAvailableRooms(); fetchAvailableAddresses(); }
  };

  const handleLogout = () => { if (logout) logout(); window.location.href = '/'; };

  if (loading && !userData) return <Loader message="Загрузка данных..." fullScreen />;
  if (!isAuthenticated) return <div style={{ textAlign: 'center', padding: '100px' }}>Пожалуйста, войдите в систему</div>;

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px', border: '2px solid #D2B48C', borderRadius: '15px', backgroundColor: '#FFF8F0', color: '#5D3A1A', fontSize: '15px' };
  const errStyle: React.CSSProperties = { color: '#dc3545', fontSize: '12px', marginTop: '3px' };
  const btnPrimary: React.CSSProperties = { padding: '15px 50px', background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)', color: '#FFF', border: 'none', borderRadius: '40px', fontSize: '18px', fontWeight: '600', cursor: 'pointer' };
  const btnPrimarySmall: React.CSSProperties = { padding: '8px 20px', background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)', color: '#FFF', border: 'none', borderRadius: '20px', cursor: 'pointer' };
  const btnSecondary: React.CSSProperties = { padding: '15px 30px', background: 'transparent', color: '#8B5A2B', border: '2px solid #D2B48C', borderRadius: '40px', fontSize: '16px', cursor: 'pointer' };
  const btnDangerSmall: React.CSSProperties = { padding: '8px 20px', background: '#dc3545', color: '#FFF', border: 'none', borderRadius: '20px', cursor: 'pointer' };
  const btnOutline: React.CSSProperties = { padding: '10px 25px', background: '#C0A080', color: '#FFF', border: 'none', borderRadius: '30px', cursor: 'pointer' };
  const btnTab: React.CSSProperties = { padding: '12px 25px', color: '#FFF', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: '600' };
  const formCardStyle: React.CSSProperties = { background: '#FFF8F0', borderRadius: '20px', padding: '25px', border: '2px solid #D2B48C', marginBottom: '30px' };
  const tourCardStyle: React.CSSProperties = { background: '#FFF8F0', borderRadius: '20px', padding: '25px', border: '2px solid #D2B48C', position: 'relative', marginBottom: '20px' };
  const badgeStyle: React.CSSProperties = { position: 'absolute', top: '15px', right: '15px', background: '#28a745', color: 'white', padding: '6px 18px', borderRadius: '25px', fontSize: '13px', fontWeight: 'bold' };
  const imgStyle: React.CSSProperties = { width: '100%', height: '160px', borderRadius: '15px', objectFit: 'cover', border: '2px solid #D2B48C' };

  return (
    <div style={{ background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)', minHeight: '100vh', padding: '40px 20px', fontFamily: "'Montserrat', sans-serif", position: 'relative', paddingTop: '70px' }}>
      <NavBar onCurrencyChange={handleCurrencyChange} />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', color: '#8B5A2B' }}>🐪 Личный кабинет</h1>
          <p style={{ color: '#B76E3C', fontSize: '16px' }}>
            {isEditing ? 'Редактирование' : `Здравствуйте, ${user?.firstName}!`}
            <span style={{ fontSize: '12px', marginLeft: '10px', opacity: 0.7 }}>({userRole})</span>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px', alignItems: 'start' }}>
          <div style={{ background: 'rgba(255,248,240,0.9)', backdropFilter: 'blur(10px)', borderRadius: '30px', padding: '25px', border: '2px solid #C0A080', position: 'sticky', top: '20px' }}>
            <h2 style={{ fontSize: '24px', color: '#8B5A2B', marginBottom: '20px' }}>👤 {user?.firstName} {user?.surName}</h2>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {filteredNavItems.map(item => (
                <button key={item.id} onClick={() => item.id === 'logout' ? handleLogout() : handleTabChange(item.id)}
                  style={{ padding: '12px 15px', background: activeTab === item.id ? '#B76E3C' : 'transparent', color: activeTab === item.id ? '#FFF' : '#8B5A2B', border: 'none', borderRadius: '15px', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === item.id ? '600' : '400' }}>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div style={{ background: 'rgba(255,248,240,0.9)', backdropFilter: 'blur(10px)', borderRadius: '30px', padding: '30px', border: '2px solid #C0A080' }}>
            {saveStatus.show && (
              <div style={{ marginBottom: '20px', padding: '15px', background: saveStatus.type === 'success' ? '#d4edda' : saveStatus.type === 'info' ? '#cce5ff' : '#f8d7da', borderRadius: '15px' }}>
                {saveStatus.message}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                {!isEditing && (
                  <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <button onClick={() => { originalDataRef.current = { ...userData }; setEditedData({ ...userData }); setIsEditing(true); }}
                      style={{ padding: '10px 20px', background: 'transparent', color: '#8B5A2B', border: '2px solid #D2B48C', borderRadius: '20px', cursor: 'pointer' }}>✏️ Редактировать</button>
                  </div>
                )}
                <h3>📋 Личные данные</h3>
                {isEditing ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div><label>Имя *</label><input name="firstName" value={editedData?.firstName || ''} onChange={handleChange} style={inputStyle} />{errors.firstName && <div style={errStyle}>{errors.firstName}</div>}</div>
                    <div><label>Фамилия *</label><input name="surName" value={editedData?.surName || ''} onChange={handleChange} style={inputStyle} />{errors.surName && <div style={errStyle}>{errors.surName}</div>}</div>
                    <div><label>Отчество</label><input name="middleName" value={editedData?.middleName || ''} onChange={handleChange} style={inputStyle} /></div>
                    <div><label>Email *</label><input type="email" name="email" value={editedData?.email || ''} onChange={handleChange} style={inputStyle} />{errors.email && <div style={errStyle}>{errors.email}</div>}</div>
                    <div><label>Телефон *</label><input type="tel" name="phoneNumber" value={editedData?.phoneNumber || ''} onChange={handleChange} style={inputStyle} />{errors.phoneNumber && <div style={errStyle}>{errors.phoneNumber}</div>}</div>
                    <div>
                      <label>Пол *</label>
                      <div style={{ display: 'flex', gap: '20px', padding: '12px 0' }}>
                        <label><input type="radio" name="gender" value="Мужской" checked={editedData?.gender === 'Мужской'} onChange={handleChange} /> Мужской</label>
                        <label><input type="radio" name="gender" value="Женский" checked={editedData?.gender === 'Женский'} onChange={handleChange} /> Женский</label>
                      </div>
                      {errors.gender && <div style={errStyle}>{errors.gender}</div>}
                    </div>
                    <div><label>Дата рождения *</label><input type="date" name="birthday" value={editedData?.birthday || ''} onChange={handleChange} style={inputStyle} />{errors.birthday && <div style={errStyle}>{errors.birthday}</div>}</div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
                      <button onClick={handleSave} style={btnPrimary}>Сохранить</button>
                      <button onClick={handleCancel} style={btnSecondary}>Отмена</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#FFF8F0', borderRadius: '20px', padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '15px' }}>
                      <div>Имя:</div><div>{userData?.firstName || '—'}</div>
                      <div>Фамилия:</div><div>{userData?.surName || '—'}</div>
                      <div>Отчество:</div><div>{userData?.middleName || '—'}</div>
                      <div>Email:</div><div>{userData?.email || '—'}</div>
                      <div>Телефон:</div><div>{userData?.phoneNumber || '—'}</div>
                      <div>Пол:</div><div>{userData?.gender || '—'}</div>
                      <div>Дата рождения:</div><div>{userData?.birthday || '—'}</div>
                      <div>Возраст:</div><div>{userData?.age || '—'} лет</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                  <h3>📄 Мои документы</h3>
                  {/* {!passportData && <button onClick={handleAddDocument} style={btnPrimarySmall}>➕ Добавить</button>} */}
                </div>
                {isLoadingPassports ? <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Загрузка...</div> :
                  !passportData ? <div style={{ textAlign: 'center', padding: '40px', background: '#FFF8F0', borderRadius: '20px', border: '2px dashed #D2B48C' }}><p>Нет документов</p><button onClick={handleAddDocument} style={btnPrimary}>➕ Добавить первый документ</button></div> :
                    <div style={{ background: '#FFF8F0', borderRadius: '20px', padding: '25px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h4>📄 Документ #1</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={handleEditDocument} style={btnPrimarySmall}>✏️</button>
                          <button onClick={handleDeleteDocument} disabled={loading} style={btnDangerSmall}>🗑️</button>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px' }}>
                        <div>Серия и номер:</div><div>{passportData.seria} {passportData.number}</div>
                        <div>Кем выдан:</div><div>{passportData.issuedBy || '—'}</div>
                        <div>Дата выдачи:</div><div>{passportData.dateOfIssue ? new Date(passportData.dateOfIssue).toLocaleDateString('ru-RU') : '—'}</div>
                        <div>Код подразделения:</div><div>{passportData.departmentCode || '—'}</div>
                      </div>
                      {addressData && (
                        <div style={{ marginTop: '20px' }}>
                          <h5>📍 Адрес регистрации</h5>
                          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px' }}>
                            <div>Страна:</div><div>{addressData.country}</div>
                            <div>Город:</div><div>{addressData.city}</div>
                            <div>Улица:</div><div>{addressData.street}</div>
                            <div>Дом:</div><div>{addressData.house}</div>
                            <div>Квартира:</div><div>{addressData.apartment || '—'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                }
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3>🗺️ Мои бронирования</h3>
                {loadingBookings ? <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Загрузка...</div> :
                  bookedTours.length === 0 ? <div style={{ textAlign: 'center', padding: '40px' }}><p>Нет забронированных туров</p><Link to="/catalog"><button style={btnPrimary}>🐪 Выбрать тур</button></Link></div> :
                    bookedTours.map(tour => (
                      <div key={tour.id} style={tourCardStyle}>
                        <div style={badgeStyle}>✅ Забронировано</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '25px' }}>
                          <img src={getSafeImageUrl(tour.imageTour, 'tour')} alt={tour.name} style={imgStyle} onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDERS.tour; }} />
                          <div>
                            <h4>{tour.name}</h4>
                            <p>📍 {tour.startDot} → {tour.endDot}  •  🏷️ {tour.type}</p>
                            <p>{tour.description?.substring(0, 150)}...</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '28px', fontWeight: '700', color: '#8B5A2B' }}>{new Intl.NumberFormat('ru-RU').format(tour.price / currentRate)} {signCurrency}</span>
                              <Link to={`/catalog/tour/${tour.id}`}><button style={btnOutline}>Подробнее</button></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                }
              </div>
            )}

            {activeTab === 'admin' && userRole === 'admin' && (
              <div>
                <h3>👨‍💼 Панель администратора</h3>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  <button onClick={() => { setShowTourForm(false); setShowHotelForm(false); setShowRoomForm(false); }} style={{ ...btnTab, background: !showTourForm && !showHotelForm && !showRoomForm ? '#B76E3C' : '#C0A080' }}>👥 Пользователи</button>
                  <button onClick={() => { setShowTourForm(!showTourForm); setShowHotelForm(false); setShowRoomForm(false); fetchAvailableHotels(); }} style={{ ...btnTab, background: showTourForm ? '#B76E3C' : '#C0A080' }}>✈️ Тур</button>
                  <button onClick={() => { setShowHotelForm(!showHotelForm); setShowTourForm(false); setShowRoomForm(false); fetchAvailableRooms(); fetchAvailableAddresses(); }} style={{ ...btnTab, background: showHotelForm ? '#B76E3C' : '#C0A080' }}>🏨 Отель</button>
                  <button onClick={() => { setShowRoomForm(!showRoomForm); setShowTourForm(false); setShowHotelForm(false); }} style={{ ...btnTab, background: showRoomForm ? '#B76E3C' : '#C0A080' }}>🛏️ Номер</button>
                </div>

                {showTourForm && (
                  <div style={formCardStyle}>
                    <h4>Добавление нового тура</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div><label>Название *</label><input value={newTour.nameTour} onChange={e => setNewTour({ ...newTour, nameTour: e.target.value })} style={inputStyle} /></div>
                      <div><label>Цена ({signCurrency}) *</label><input type="number" min="1" value={newTour.price || ''} onChange={e => setNewTour({ ...newTour, price: Number(e.target.value) })} style={inputStyle} /></div>
                      <div><label>Дата начала *</label><input type="date" min={getTodayISO()} value={newTour.startDot} onChange={e => setNewTour({ ...newTour, startDot: e.target.value })} style={inputStyle} /></div>
                      <div><label>Дата окончания *</label><input type="date" min={newTour.startDot || getTodayISO()} value={newTour.endDot} onChange={e => setNewTour({ ...newTour, endDot: e.target.value })} style={inputStyle} /></div>
                      <div><label>Тип тура</label><select value={newTour.typeTour} onChange={e => setNewTour({ ...newTour, typeTour: e.target.value })} style={inputStyle}><option>Экскурсионный</option><option>Пляжный</option><option>Горнолыжный</option><option>Лечебный</option><option>Шопинг</option></select></div>
                      <div><label>Отель *</label><select value={newTour.hotelsId} onChange={e => setNewTour({ ...newTour, hotelsId: Number(e.target.value) })} style={inputStyle}><option value={0}>-- Выберите --</option>{availableHotels.map(h => <option key={h.id} value={h.id}>{h.name} ({'★'.repeat(h.stars)})</option>)}</select></div>
                      <div><label><input type="checkbox" checked={newTour.hotTour} onChange={e => setNewTour({ ...newTour, hotTour: e.target.checked })} /> Горящий тур</label></div>
                      <div><label>URL изображения</label><input value={newTour.imageTour} onChange={e => setNewTour({ ...newTour, imageTour: e.target.value })} style={inputStyle} /></div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}><label>Краткое описание *</label><textarea value={newTour.description} onChange={e => setNewTour({ ...newTour, description: e.target.value })} rows={3} style={inputStyle} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label>Детали маршрута *</label><textarea value={newTour.details} onChange={e => setNewTour({ ...newTour, details: e.target.value })} rows={4} style={inputStyle} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label>Что включено *</label><textarea value={newTour.included} onChange={e => setNewTour({ ...newTour, included: e.target.value })} rows={3} style={inputStyle} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label>Что оплачивается отдельно *</label><textarea value={newTour.separately} onChange={e => setNewTour({ ...newTour, separately: e.target.value })} rows={2} style={inputStyle} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label>Программа тура *</label><textarea value={newTour.program} onChange={e => setNewTour({ ...newTour, program: e.target.value })} rows={5} style={inputStyle} /></div>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px', justifyContent: 'flex-end' }}>
                      <button onClick={handleAddTourAsync} disabled={loading} style={btnPrimary}>{loading ? 'Сохранение...' : 'Сохранить тур'}</button>
                      <button onClick={() => setShowTourForm(false)} style={btnSecondary}>Отмена</button>
                    </div>
                  </div>
                )}

                {showHotelForm && (
                  <div style={formCardStyle}>
                    <h4>Добавление нового отеля</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div><label>Название *</label><input value={newHotel.name} onChange={e => setNewHotel({ ...newHotel, name: e.target.value })} style={inputStyle} /></div>
                      <div><label>Звёзды *</label><select value={newHotel.stars} onChange={e => setNewHotel({ ...newHotel, stars: Number(e.target.value) })} style={inputStyle}>{[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{'★'.repeat(s)}</option>)}</select></div>
                      <div><label>URL изображения</label><input value={newHotel.imageHotel || ''} onChange={e => setNewHotel({ ...newHotel, imageHotel: e.target.value })} style={inputStyle} /></div>
                      <div>
                        <label>Номер в отеле (опционально)</label>
                        <select value={newHotel.hotelRoomId || 0} onChange={e => setNewHotel({ ...newHotel, hotelRoomId: e.target.value ? Number(e.target.value) : null })} style={inputStyle}>
                          <option value={0}>-- Без номера --</option>
                          {availableRooms.map(room => <option key={room.id} value={room.id}>{room.nameRoom} (этаж {room.floor}, {room.typeRoom})</option>)}
                        </select>
                      </div>
                      <div>
                        <label>Адрес отеля (опционально)</label>
                        <select
                          value={newHotel.addressId || 0}
                          onChange={e => setNewHotel({ ...newHotel, addressId: e.target.value ? Number(e.target.value) : null })}
                          style={inputStyle}
                        >
                          <option value={0}>-- Без адреса --</option>
                          {availableAddresses.map(addr => (
                            <option key={addr.id} value={addr.id}>
                              {addr.country}, {addr.city}, {addr.street}, д. {addr.house}{addr.apartment ? `, кв. ${addr.apartment}` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}><label>Детали</label><textarea value={newHotel.details || ''} onChange={e => setNewHotel({ ...newHotel, details: e.target.value })} rows={3} style={inputStyle} /></div>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px', justifyContent: 'flex-end' }}>
                      <button onClick={handleAddHotelAsync} disabled={loading} style={btnPrimary}>{loading ? 'Сохранение...' : 'Сохранить отель'}</button>
                      <button onClick={() => setShowHotelForm(false)} style={btnSecondary}>Отмена</button>
                    </div>
                  </div>
                )}

                {showRoomForm && (
                  <div style={formCardStyle}>
                    <h4>Добавление нового номера</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div><label>Название *</label><input value={newRoom.nameRoom} onChange={e => setNewRoom({ ...newRoom, nameRoom: e.target.value })} style={inputStyle} /></div>
                      <div><label>Тип *</label><select value={newRoom.typeRoom} onChange={e => setNewRoom({ ...newRoom, typeRoom: e.target.value })} style={inputStyle}><option>Стандарт</option><option>Люкс</option><option>Полулюкс</option><option>Семейный</option><option>Эконом</option></select></div>
                      <div><label>Этаж *</label><input type="number" min="1" value={newRoom.floor} onChange={e => setNewRoom({ ...newRoom, floor: Number(e.target.value) })} style={inputStyle} /></div>
                      <div><label>URL изображения</label><input value={newRoom.imageRoom || ''} onChange={e => setNewRoom({ ...newRoom, imageRoom: e.target.value })} style={inputStyle} /></div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}><label>Детали</label><textarea value={newRoom.details || ''} onChange={e => setNewRoom({ ...newRoom, details: e.target.value })} rows={3} style={inputStyle} /></div>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '25px', justifyContent: 'flex-end' }}>
                      <button onClick={handleAddRoomAsync} disabled={loading} style={btnPrimary}>{loading ? 'Сохранение...' : 'Сохранить номер'}</button>
                      <button onClick={() => setShowRoomForm(false)} style={btnSecondary}>Отмена</button>
                    </div>
                  </div>
                )}

                {!showTourForm && !showHotelForm && !showRoomForm && (
                  <>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                      <button onClick={() => { setSelectedUserType('clients'); fetchAllClients(); }} style={{ ...btnTab, background: selectedUserType === 'clients' ? '#B76E3C' : '#C0A080' }}>👥 Клиенты</button>
                      <button onClick={() => { setSelectedUserType('employees'); fetchAllEmployees(); }} style={{ ...btnTab, background: selectedUserType === 'employees' ? '#B76E3C' : '#C0A080' }}>💼 Сотрудники</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
                      <div style={{ background: '#FFF8F0', borderRadius: '15px', padding: '15px', maxHeight: '500px', overflowY: 'auto' }}>
                        {selectedUserType === 'clients'
                          ? allClients.map(c => <div key={c.id} onClick={() => handleViewUser(c.id, 'clients')} style={{ padding: '10px', cursor: 'pointer', background: selectedUserId === c.id ? '#B76E3C' : 'transparent', color: selectedUserId === c.id ? '#FFF' : '#8B5A2B', borderRadius: '10px', marginBottom: '3px' }}>{c.surName} {c.firstName}</div>)
                          : allEmployees.map(e => <div key={e.id} onClick={() => handleViewUser(e.id, 'employees')} style={{ padding: '10px', cursor: 'pointer', background: selectedUserId === e.id ? '#B76E3C' : 'transparent', color: selectedUserId === e.id ? '#FFF' : '#8B5A2B', borderRadius: '10px', marginBottom: '3px' }}>{e.surName} {e.firstName} - {e.position}</div>)
                        }
                      </div>
                      <div style={{ background: '#FFF8F0', borderRadius: '15px', padding: '20px' }}>
                        {viewingUserData ? (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                              <h4>{viewingUserData.surName} {viewingUserData.firstName}</h4>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setIsEditingUser(!isEditingUser)} style={btnPrimarySmall}>{isEditingUser ? 'Отмена' : '✏️'}</button>
                                <button onClick={handleDeleteViewedUser} style={btnDangerSmall}>🗑️</button>
                              </div>
                            </div>
                            <p><strong>Email:</strong> {viewingUserData.email}</p>
                            <p><strong>Телефон:</strong> {viewingUserData.phoneNumber}</p>
                            <p><strong>Роль:</strong> {viewingUserData.role || viewingUserData.position}</p>
                            {isEditingUser && (
                              <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(210,180,140,0.1)', borderRadius: '10px', display: 'grid', gap: '10px' }}>
                                <input placeholder="Фамилия" value={viewingUserData.surName || ''} onChange={e => setViewingUserData({ ...viewingUserData, surName: e.target.value })} style={inputStyle} />
                                <input placeholder="Имя" value={viewingUserData.firstName || ''} onChange={e => setViewingUserData({ ...viewingUserData, firstName: e.target.value })} style={inputStyle} />
                                <input placeholder="Email" value={viewingUserData.email || ''} onChange={e => setViewingUserData({ ...viewingUserData, email: e.target.value })} style={inputStyle} />
                                <input placeholder="Телефон" value={viewingUserData.phoneNumber || ''} onChange={e => setViewingUserData({ ...viewingUserData, phoneNumber: e.target.value })} style={inputStyle} />
                                <button onClick={async () => { await clientApi.update(viewingUserData.id, viewingUserData as any); setIsEditingUser(false); if (selectedUserType === 'clients') fetchAllClients(); else fetchAllEmployees(); showStatus('Сохранено!', 'success'); }} style={btnPrimary}>Сохранить</button>
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

            {activeTab === 'employee' && userRole === 'employee' && (
              <div>
                <h3>👨‍💻 Панель сотрудника</h3>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <button onClick={() => { setShowHotelForm(!showHotelForm); setShowRoomForm(false); fetchAvailableRooms(); }} style={{ ...btnTab, background: showHotelForm ? '#B76E3C' : '#C0A080' }}>🏨 Добавить отель</button>
                  <button onClick={() => { setShowRoomForm(!showRoomForm); setShowHotelForm(false); }} style={{ ...btnTab, background: showRoomForm ? '#B76E3C' : '#C0A080' }}>🛏️ Добавить номер</button>
                </div>

                {showHotelForm && (
                  <div style={formCardStyle}>
                    <h4>Добавление отеля</h4>
                    <div><label>Название *</label><input value={newHotel.name} onChange={e => setNewHotel({ ...newHotel, name: e.target.value })} style={inputStyle} /></div>
                    <div><label>Звёзды *</label><select value={newHotel.stars} onChange={e => setNewHotel({ ...newHotel, stars: Number(e.target.value) })} style={inputStyle}>{[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{'★'.repeat(s)}</option>)}</select></div>
                    <div><label>URL изображения</label><input value={newHotel.imageHotel || ''} onChange={e => setNewHotel({ ...newHotel, imageHotel: e.target.value })} style={inputStyle} /></div>
                    <div>
                      <label>Номер в отеле (опционально)</label>
                      <select value={newHotel.hotelRoomId || 0} onChange={e => setNewHotel({ ...newHotel, hotelRoomId: e.target.value ? Number(e.target.value) : null })} style={inputStyle}>
                        <option value={0}>-- Без номера --</option>
                        {availableRooms.map(room => <option key={room.id} value={room.id}>{room.nameRoom} (этаж {room.floor}, {room.typeRoom})</option>)}
                      </select>
                    </div>
                    <div>
                      <label>Адрес отеля (опционально)</label>
                      <select
                        value={newHotel.addressId || 0}
                        onChange={e => setNewHotel({ ...newHotel, addressId: e.target.value ? Number(e.target.value) : null })}
                        style={inputStyle}
                      >
                        <option value={0}>-- Без адреса --</option>
                        {availableAddresses.map(addr => (
                          <option key={addr.id} value={addr.id}>
                            {addr.country}, {addr.city}, {addr.street}, д. {addr.house}{addr.apartment ? `, кв. ${addr.apartment}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div><label>Детали</label><textarea value={newHotel.details || ''} onChange={e => setNewHotel({ ...newHotel, details: e.target.value })} rows={3} style={inputStyle} /></div>
                    <button onClick={handleAddHotelAsync} disabled={loading} style={{ ...btnPrimary, marginTop: '15px' }}>{loading ? 'Сохранение...' : 'Сохранить'}</button>
                  </div>
                )}

                {showRoomForm && (
                  <div style={formCardStyle}>
                    <h4>Добавление номера</h4>
                    <div><label>Название *</label><input value={newRoom.nameRoom} onChange={e => setNewRoom({ ...newRoom, nameRoom: e.target.value })} style={inputStyle} /></div>
                    <div><label>Тип *</label><select value={newRoom.typeRoom} onChange={e => setNewRoom({ ...newRoom, typeRoom: e.target.value })} style={inputStyle}><option>Стандарт</option><option>Люкс</option><option>Полулюкс</option><option>Семейный</option><option>Эконом</option></select></div>
                    <div><label>Этаж *</label><input type="number" value={newRoom.floor} onChange={e => setNewRoom({ ...newRoom, floor: Number(e.target.value) })} style={inputStyle} /></div>
                    <div><label>URL изображения</label><input value={newRoom.imageRoom || ''} onChange={e => setNewRoom({ ...newRoom, imageRoom: e.target.value })} style={inputStyle} /></div>
                    <div><label>Детали</label><textarea value={newRoom.details || ''} onChange={e => setNewRoom({ ...newRoom, details: e.target.value })} rows={3} style={inputStyle} /></div>
                    <button onClick={handleAddRoomAsync} disabled={loading} style={{ ...btnPrimary, marginTop: '15px' }}>{loading ? 'Сохранение...' : 'Сохранить'}</button>
                  </div>
                )}

                {!showHotelForm && !showRoomForm && <div style={{ textAlign: 'center', padding: '40px' }}>Выберите действие</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EditDocumentModal рендерится здесь, вне контента, как отдельное окно */}
      <EditDocumentModal
        open={isModalOpen}
        data={modalData}
        onClose={() => { setIsModalOpen(false); setModalData(null); }}
        onSave={handleSaveDocument}
        mode={modalMode}
      />
    </div>
  );
};

export { ClientAccountPage };