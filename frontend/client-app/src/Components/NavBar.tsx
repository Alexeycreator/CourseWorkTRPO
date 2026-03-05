import React, { Component, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ButtonGoogleAuth from "./BtnGoogleAuth";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { getCurrencyRates } from "../Services/CurrencyRatesApi";

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  passportSeries: string;
  passportNumber: string;
  passportIssued: string;
  passportDate: string;
  passportCode: string;
  city: string;
  address: string;
  password: string;
  confirmPassword: string;
  agreeToNews: boolean;
  agreeToPersonalData: boolean;
}

interface NavBarProps {
  onCurrencyChange?: (letterCode: string, rate: number) => void; // функция, которая будет вызвана при выборе валюты
}

interface NavBarState {
  showAuth: boolean;
  googleAuthModal: boolean;
  showCurrencyMenu: boolean;

  showRegistrationModal: boolean;

  selectedCurrency: string;
  currencyOptions: string[];
  ratesData: Array<{
    letterCode: string;
    rate: number;
  }>;
  loading: boolean;
  error: string | null;

  registrationForm: RegistrationFormData;
  showPassword: boolean;
  errors: Record<string, string>;
}

export default class NavBar extends Component<NavBarProps, NavBarState> {
  state: NavBarState = {
    showAuth: false,
    googleAuthModal: false,
    showCurrencyMenu: false,
    showRegistrationModal: false,
    selectedCurrency: 'RUB', // если надо поменять изначальную валюту, то надо ввести ее letterCode
    currencyOptions: [],
    ratesData: [],
    loading: true,
    error: null,
    registrationForm: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 'male',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      passportSeries: '',
      passportNumber: '',
      passportIssued: '',
      passportDate: '',
      passportCode: '',
      city: '',
      address: '',
      password: '',
      confirmPassword: '',
      agreeToNews: false,
      agreeToPersonalData: false
    },
    showPassword: false, // <-- ДОБАВИТЬ
    errors: {} // <-
  };

  days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

  componentDidMount() {
    this.fetchCurrency();
    this.fetchRatesData();
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  toggleCurrencyMenu = () => {
    this.setState(prevState => ({
      showCurrencyMenu: !prevState.showCurrencyMenu
    }));
  };

  getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'RUB': return '₽';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return '₽';
    }
  };

  fetchCurrency = async () => {
    try {
      this.setState({ loading: true, error: null });

      const currencies = await getCurrencyRates();

      const selectedCurrencies = ['USD', 'EUR', 'RUB'];

      // Получаем уникальные коды валют (убираем дубликаты)
      const uniqueCurrencies = Array.from(new Set(currencies.map(c => c.letterCode).filter(c => selectedCurrencies.includes(c))));
      // Сортируем по алфавиту (опционально)
      const sortedCurrencies = uniqueCurrencies.sort();

      this.setState({
        currencyOptions: sortedCurrencies,
        loading: false
      });

      console.log("Загруженный список валют:", sortedCurrencies);
    }
    catch (err) {
      console.error("Ошибка загрузки списка валют:", err);
      this.setState({
        error: "Не удалось загрузить список валют",
        loading: false
      });
    }
  }

  fetchRatesData = async () => {
    try {
      this.setState({ loading: true, error: null });
      const currencies = await getCurrencyRates();

      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const formattedToday = `${day}.${month}.${year}`;

      // Фильтруем только за сегодня
      const todayRates = currencies.filter(r => r.dateReceipt === formattedToday);

      // Сохраняем все данные
      this.setState({
        ratesData: todayRates.map(r => ({
          letterCode: r.letterCode,
          rate: r.rate
        })),
        loading: false
      });

    } catch (err) {
      this.setState({
        error: "Не удалось загрузить данные",
        loading: false
      });
    }
  };

  getRateForCurrency = (letterCode: string): number | null => {
    const { ratesData } = this.state;
    const rateItem = ratesData.find(r => r.letterCode === letterCode);
    return rateItem ? rateItem.rate : null;
  };

  selectCurrency = (currencyCode: string) => {
    // Получаем курс для выбранной валюты
    const rate = this.getRateForCurrency(currencyCode);

    // Обновляем локальное состояние
    this.setState({
      selectedCurrency: currencyCode,
      showCurrencyMenu: false
    });

    // Если есть колбэк и курс найден, отправляем данные на сервер
    if (this.props.onCurrencyChange && rate) {
      this.props.onCurrencyChange(currencyCode, rate);
    } else if (this.props.onCurrencyChange) {
      // Если курс не найден, но колбэк есть, отправляем запрос на сервер
      this.fetchAndSendRate(currencyCode);
    }

    console.log(`Выбрана валюта: ${currencyCode}, курс: ${rate}`);
  };

  fetchAndSendRate = async (currencyCode: string) => {
    try {
      // Здесь можно сделать дополнительный запрос к серверу для получения актуального курса
      const response = await fetch(`/api/currency/rate?code=${currencyCode}`);
      const data = await response.json();

      if (this.props.onCurrencyChange) {
        this.props.onCurrencyChange(currencyCode, data.rate);
      }
    } catch (error) {
      console.error('Ошибка получения курса валюты:', error);
    }
  };

  // Метод для получения курса выбранной валюты
  getSelectedRate = (): number | null => {
    const { selectedCurrency, ratesData } = this.state;
    const found = ratesData.find(r => r.letterCode === selectedCurrency);
    return found ? found.rate : null;
  };

  toggleAuthModal = () => {
    this.setState(prevState => ({
      showAuth: !prevState.showAuth
    }));
  };

  toggleGoogleAuth = () => {
    this.setState(prevState => ({
      googleAuthModal: !prevState.googleAuthModal
    }));
  };

  toggleRegistrationModal = () => {
    this.setState(prevState => ({
      showRegistrationModal: !prevState.showRegistrationModal,
      showAuth: false // Закрываем модалку входа
    }));
  };

  handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    this.setState(prev => ({
      registrationForm: {
        ...prev.registrationForm,
        [name]: type === 'checkbox' ? checked : value
      }
    }));

    // Очищаем ошибку для поля, если она была
    if (this.state.errors[name]) {
      this.setState(prev => {
        const newErrors = { ...prev.errors };
        delete newErrors[name];
        return { errors: newErrors };
      });
    }
  };

  validateRegistrationForm = (): boolean => {
    const { registrationForm } = this.state;
    const newErrors: Record<string, string> = {};

    // Личные данные
    if (!registrationForm.firstName) newErrors.firstName = 'Имя обязательно';
    if (!registrationForm.lastName) newErrors.lastName = 'Фамилия обязательна';
    if (!registrationForm.email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(registrationForm.email)) newErrors.email = 'Email некорректен';

    if (!registrationForm.phone) newErrors.phone = 'Телефон обязателен';

    // Паспортные данные
    if (!registrationForm.passportSeries) newErrors.passportSeries = 'Серия паспорта обязательна';
    if (!registrationForm.passportNumber) newErrors.passportNumber = 'Номер паспорта обязателен';
    if (!registrationForm.passportIssued) newErrors.passportIssued = 'Кем выдан обязательно';
    if (!registrationForm.passportDate) newErrors.passportDate = 'Дата выдачи обязательна';

    // Адрес
    if (!registrationForm.city) newErrors.city = 'Город обязателен';
    if (!registrationForm.address) newErrors.address = 'Адрес обязателен';

    // Пароль
    if (!registrationForm.password) newErrors.password = 'Пароль обязателен';
    else if (registrationForm.password.length < 6) newErrors.password = 'Пароль должен быть не менее 6 символов';

    if (registrationForm.password !== registrationForm.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    // Согласия
    if (!registrationForm.agreeToPersonalData) {
      newErrors.agreeToPersonalData = 'Необходимо согласие на обработку данных';
    }

    this.setState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (this.validateRegistrationForm()) {
      console.log('Данные регистрации:', this.state.registrationForm);
      alert('Регистрация успешно завершена!');
      this.setState({
        showRegistrationModal: false,
        // Очищаем форму
        registrationForm: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          gender: 'male',
          birthDay: '',
          birthMonth: '',
          birthYear: '',
          passportSeries: '',
          passportNumber: '',
          passportIssued: '',
          passportDate: '',
          passportCode: '',
          city: '',
          address: '',
          password: '',
          confirmPassword: '',
          agreeToNews: false,
          agreeToPersonalData: false
        },
        errors: {}
      });
    }
  };

  private menuRef = React.createRef<HTMLDivElement>();
  private authRef = React.createRef<HTMLDivElement>();

  handleClickOutside = (event: MouseEvent) => {
    if (this.menuRef.current && !this.menuRef.current.contains(event.target as Node)) {
      this.setState({ showCurrencyMenu: false });
    }
    if (this.authRef.current && !this.authRef.current.contains(event.target as Node)) {
      this.setState({ showAuth: false });
    }
  };

  render() {
    const {
      showAuth,
      showCurrencyMenu,
      showRegistrationModal,
      selectedCurrency,
      registrationForm,
      showPassword,
      errors
    } = this.state;

    return (
      <>
        <nav className="navbar navbar-expand-lg" style={{
          background: 'linear-gradient(90deg, #F8F0E0 0%, #F0E0D0 50%, #E8D0C0 100%)',
          borderBottom: '2px solid #C0A080',
          boxShadow: '0 2px 10px rgba(160, 120, 80, 0.1)',
          padding: '8px 0',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          width: '100%',
          height: '70px'
        }}>
          <div className="container-fluid" style={{ padding: '0 20px' }}>
            {/* Логотип */}
            <Link
              to="/"
              className="navbar-brand"
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: '28px',
                fontWeight: '600',
                color: '#8B5A2B',
                textShadow: '1px 1px 2px rgba(200, 160, 120, 0.3)',
                letterSpacing: '1px',
                padding: '5px 15px',
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                marginLeft: '10px',
                textDecoration: 'none',
                background: 'rgba(255, 245, 235, 0.5)',
                backdropFilter: 'blur(5px)',
                border: '1px solid #C0A080',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(200, 160, 120, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 245, 235, 0.5)';
              }}
            >
              <span>𓂀 Шелковые барханы 𓂀</span>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{
                backgroundColor: '#C0A080',
                border: '1px solid #8B5A2B'
              }}
            >
              <span className="navbar-toggler-icon" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%238B5A2B' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`
              }}></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ marginLeft: '20px' }}>
                <li className="nav-item">
                  <Link
                    to="/"
                    className="nav-link"
                    style={{
                      color: '#8B5A2B',
                      fontSize: '16px',
                      fontWeight: '400',
                      padding: '8px 15px',
                      margin: '0 3px',
                      borderRadius: '20px',
                      transition: 'all 0.3s',
                      border: '1px solid transparent',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.15)';
                      e.currentTarget.style.borderColor = '#C0A080';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    𓊹 Главная
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/catalog"
                    className="nav-link"
                    style={{
                      color: '#8B5A2B',
                      fontSize: '16px',
                      fontWeight: '400',
                      padding: '8px 15px',
                      margin: '0 3px',
                      borderRadius: '20px',
                      transition: 'all 0.3s',
                      border: '1px solid transparent',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.15)';
                      e.currentTarget.style.borderColor = '#C0A080';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    𓊖 Туры
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/hot-tours"
                    className="nav-link"
                    style={{
                      color: '#8B5A2B',
                      fontSize: '16px',
                      fontWeight: '400',
                      padding: '8px 15px',
                      margin: '0 3px',
                      borderRadius: '20px',
                      transition: 'all 0.3s',
                      border: '1px solid transparent',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.15)';
                      e.currentTarget.style.borderColor = '#C0A080';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    𓂀 Горящие
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      color: '#8B5A2B',
                      fontSize: '16px',
                      fontWeight: '400',
                      padding: '8px 15px',
                      margin: '0 3px',
                      borderRadius: '20px',
                      transition: 'all 0.3s',
                      border: '1px solid transparent',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.15)';
                      e.currentTarget.style.borderColor = '#C0A080';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    𓋴 Ещё
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                    style={{
                      backgroundColor: '#F8F0E0',
                      border: '1px solid #C0A080',
                      borderRadius: '10px',
                      padding: '5px',
                      boxShadow: '0 5px 15px rgba(160, 120, 80, 0.1)'
                    }}
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/information"
                        style={{
                          color: '#8B5A2B',
                          padding: '8px 15px',
                          borderRadius: '8px',
                          transition: 'all 0.3s',
                          textDecoration: 'none',
                          display: 'block',
                          fontSize: '14px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#C0A080';
                          e.currentTarget.style.color = '#F8F0E0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#8B5A2B';
                        }}
                      >
                        𓏛 Информация
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/help"
                        style={{
                          color: '#8B5A2B',
                          padding: '8px 15px',
                          borderRadius: '8px',
                          transition: 'all 0.3s',
                          textDecoration: 'none',
                          display: 'block',
                          fontSize: '14px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#C0A080';
                          e.currentTarget.style.color = '#F8F0E0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#8B5A2B';
                        }}
                      >
                        𓋴 Помощь
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/account"
                        style={{
                          color: '#8B5A2B',
                          padding: '8px 15px',
                          borderRadius: '8px',
                          transition: 'all 0.3s',
                          textDecoration: 'none',
                          display: 'block',
                          fontSize: '14px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#C0A080';
                          e.currentTarget.style.color = '#F8F0E0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#8B5A2B';
                        }}
                      >
                        𓁐 Личный кабинет
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>

              {/* <div style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '15px',
              background: 'rgba(200, 160, 120, 0.15)',
              padding: '4px 15px',
              borderRadius: '20px',
              border: '1px solid #C0A080',
              fontSize: '14px',
              fontWeight: '500',
              color: '#8B5A2B'
            }}>
              {this.state.loading ? (
                <span>Загрузка курса...</span>
              ) : this.state.error ? (
                <span style={{ color: 'red' }}>Ошибка</span>
              ) : (
                <>
                  <span style={{ fontWeight: '700' }}>
                    {this.getSelectedRate()?.toFixed(2) ?? '—'}
                  </span>
                  <span style={{ marginRight: '5px' }}>{this.getCurrencySymbol(this.state.selectedCurrency)}</span>
                </>
              )}
            </div> */}
              {/* Селектор валюты */}
              <div
                ref={this.menuRef}
                style={{ position: 'relative', marginRight: '10px', flexShrink: 0 }}>
                <button
                  onClick={this.toggleCurrencyMenu}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #C0A080',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    color: '#8B5A2B',
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{selectedCurrency}</span>
                  <span style={{
                    fontSize: '10px',
                    transform: showCurrencyMenu ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.3s'
                  }}>
                    ▼
                  </span>
                </button>

                {showCurrencyMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '5px',
                    backgroundColor: '#F8F0E0',
                    border: '1px solid #C0A080',
                    borderRadius: '10px',
                    minWidth: '180px',
                    maxHeight: '300px',        // Ограничиваем высоту
                    overflowY: 'auto',          // Добавляем прокрутку
                    zIndex: 1000,
                    boxShadow: '0 5px 15px rgba(160, 120, 80, 0.1)',
                    scrollbarWidth: 'thin',     // Для Firefox
                    scrollbarColor: '#C0A080 #F8F0E0' // Для Firefox
                  }}>
                    {/* Кастомный скроллбар для WebKit браузеров */}
                    <style>
                      {`
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-track {
            background: #F8F0E0;
            border-radius: 0 10px 10px 0;
          }
          div::-webkit-scrollbar-thumb {
            background: #C0A080;
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #A08060;
          }
        `}
                    </style>

                    {this.state.loading ? (
                      <div style={{ padding: '15px', textAlign: 'center', color: '#8B5A2B' }}>
                        Загрузка...
                      </div>
                    ) : this.state.error ? (
                      <div style={{ padding: '15px', textAlign: 'center', color: 'red' }}>
                        {this.state.error}
                      </div>
                    ) : (
                      this.state.currencyOptions.map((currencyCode) => (
                        <button
                          key={currencyCode}
                          onClick={() => this.selectCurrency(currencyCode)}
                          style={{
                            width: '100%',
                            padding: '10px 15px',
                            border: 'none',
                            borderBottom: '1px solid #C0A080',
                            backgroundColor: selectedCurrency === currencyCode ? 'rgba(200, 160, 120, 0.15)' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '14px',
                            color: '#8B5A2B',
                            transition: 'all 0.2s',
                            fontWeight: selectedCurrency === currencyCode ? 500 : 400,
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.25)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = selectedCurrency === currencyCode ? 'rgba(200, 160, 120, 0.15)' : 'transparent';
                          }}
                        >
                          <span style={{
                            width: '30px',
                            fontSize: '16px',
                            display: 'inline-block',
                            textAlign: 'center'
                          }}>
                            {this.getCurrencySymbol(currencyCode)}
                          </span>
                          <span style={{
                            flex: 1,
                            fontWeight: 'inherit'
                          }}>
                            {currencyCode}
                          </span>
                          {selectedCurrency === currencyCode && (
                            <span style={{ color: '#8B5A2B', fontWeight: 'bold' }}>✓</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Форма поиска */}
              <form className="d-flex" style={{ marginRight: '10px', maxWidth: '250px' }}>
                <input
                  className="form-control"
                  type="search"
                  placeholder="Поиск..."
                  aria-label="Search"
                  style={{
                    border: '1px solid #C0A080',
                    borderRadius: '20px 0 0 20px',
                    padding: '6px 12px',
                    backgroundColor: '#F8F0E0',
                    color: '#8B5A2B',
                    fontSize: '14px',
                    outline: 'none',
                    width: '100%'
                  }}
                />
                <button
                  className="btn"
                  type="submit"
                  style={{
                    background: '#C0A080',
                    color: '#F8F0E0',
                    border: '1px solid #8B5A2B',
                    borderRadius: '0 20px 20px 0',
                    padding: '6px 15px',
                    fontSize: '14px',
                    fontWeight: '400',
                    transition: 'all 0.3s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8B5A2B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#C0A080';
                  }}
                >
                  𓊹
                </button>
              </form>

              {/* Кнопка авторизации */}
              <div className="position-relative"
                style={{ flexShrink: 0 }}>
                <button
                  className="btn"
                  id="authButton"
                  onClick={this.toggleAuthModal}
                  style={{
                    background: '#C0A080',
                    color: '#F8F0E0',
                    border: '1px solid #8B5A2B',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 5px rgba(160, 120, 80, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#8B5A2B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#C0A080';
                  }}
                >
                  𓁐
                </button>

                {showAuth && (
                  <div
                    ref={this.authRef}
                    id="authModal"
                    style={{
                      position: 'absolute',
                      top: '45px',
                      right: '0',
                      width: '280px',
                      backgroundColor: '#F8F0E0',
                      border: '1px solid #C0A080',
                      borderRadius: '10px',
                      padding: '15px',
                      boxShadow: '0 5px 15px rgba(160, 120, 80, 0.1)',
                      zIndex: 1000
                    }}
                  >
                    <h3 style={{
                      color: '#8B5A2B',
                      textAlign: 'center',
                      marginBottom: '15px',
                      fontSize: '18px',
                      borderBottom: '1px solid #C0A080',
                      paddingBottom: '8px'
                    }}>
                      𓋴 Вход
                    </h3>

                    <form onSubmit={(e) => e.preventDefault()}>
                      <div style={{ marginBottom: '10px' }}>
                        <input
                          type="text"
                          placeholder="Email"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: '#F0E0D0',
                            border: '1px solid #C0A080',
                            borderRadius: '8px',
                            color: '#8B5A2B',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <input
                          type="password"
                          placeholder="Пароль"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: '#F0E0D0',
                            border: '1px solid #C0A080',
                            borderRadius: '8px',
                            color: '#8B5A2B',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <button
                          type="submit"
                          style={{
                            flex: '1',
                            padding: '8px',
                            background: '#C0A080',
                            color: '#F8F0E0',
                            border: '1px solid #8B5A2B',
                            borderRadius: '8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#8B5A2B';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#C0A080';
                          }}
                        >
                          Войти
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            this.toggleRegistrationModal(); // Открываем модалку регистрации
                            this.toggleAuthModal(); // Закрываем модалку авторизации
                          }}
                          style={{
                            flex: '1',
                            padding: '8px',
                            background: 'transparent',
                            color: '#8B5A2B',
                            border: '1px solid #C0A080',
                            borderRadius: '8px',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}
                        >
                          Регистрация
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            border: '1px solid #C0A080',
                            background: 'transparent',
                            color: '#8B5A2B',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DB4437';
                            e.currentTarget.style.borderColor = '#DB4437';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = '#C0A080';
                            e.currentTarget.style.color = '#8B5A2B';
                          }}
                          onClick={this.toggleGoogleAuth}
                        >
                          G
                        </button>
                      </div>

                      <Modal
                        isOpen={this.state.googleAuthModal}
                        toggle={this.toggleGoogleAuth}
                        centered
                      >
                        <ModalHeader toggle={this.toggleGoogleAuth}>
                          Авторизация через Google
                        </ModalHeader>
                        <ModalBody>
                          <ButtonGoogleAuth />
                        </ModalBody>
                      </Modal>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Модальное окно регистрации */}
        {showRegistrationModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#F8F0E0',
              borderRadius: '30px',
              padding: '30px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              border: '2px solid #C0A080',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}>
              {/* Кнопка закрытия */}
              <button
                onClick={this.toggleRegistrationModal}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#8B5A2B',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(183, 110, 60, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ✕
              </button>

              <h2 style={{
                textAlign: 'center',
                color: '#8B5A2B',
                fontSize: '28px',
                fontFamily: "'Cormorant Garamond', serif",
                marginBottom: '20px'
              }}>
                🐪 Регистрация туриста
              </h2>

              <form onSubmit={this.handleRegistrationSubmit}>
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
                        value={registrationForm.firstName}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.lastName}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.email}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.phone}
                        onChange={this.handleRegistrationChange}
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
                            checked={registrationForm.gender === 'male'}
                            onChange={this.handleRegistrationChange}
                          />
                          Мужской
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B5A2B' }}>
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={registrationForm.gender === 'female'}
                            onChange={this.handleRegistrationChange}
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
                          value={registrationForm.birthDay}
                          onChange={this.handleRegistrationChange}
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
                          {this.days.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <select
                          name="birthMonth"
                          value={registrationForm.birthMonth}
                          onChange={this.handleRegistrationChange}
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
                          {this.months.map((month, index) => (
                            <option key={month} value={index + 1}>{month}</option>
                          ))}
                        </select>
                        <select
                          name="birthYear"
                          value={registrationForm.birthYear}
                          onChange={this.handleRegistrationChange}
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
                          {this.years.map(year => (
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
                        value={registrationForm.passportSeries}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.passportNumber}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.passportIssued}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.passportDate}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.passportCode}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.city}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.address}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.password}
                        onChange={this.handleRegistrationChange}
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
                        value={registrationForm.confirmPassword}
                        onChange={this.handleRegistrationChange}
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
                        onChange={() => this.setState({ showPassword: !showPassword })}
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
                          checked={registrationForm.agreeToNews}
                          onChange={this.handleRegistrationChange}
                        />
                        Я согласен на получение новостей и специальных предложений
                      </label>
                    </div>

                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B5A2B', fontSize: '14px' }}>
                        <input
                          type="checkbox"
                          name="agreeToPersonalData"
                          checked={registrationForm.agreeToPersonalData}
                          onChange={this.handleRegistrationChange}
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

                {/* Кнопки */}
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
                    🐪 Зарегистрироваться
                  </button>

                  <button
                    type="button"
                    onClick={this.toggleRegistrationModal}
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
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }
}  
