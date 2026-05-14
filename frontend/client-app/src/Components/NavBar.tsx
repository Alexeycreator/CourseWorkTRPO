import React, { Component, createRef } from "react";
import { Link } from 'react-router-dom';
import ButtonGoogleAuth from "./BtnGoogleAuth";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { getCurrencyRates } from "../Services/CurrencyRatesApi";
import { authApi, UserData } from "../Services/IndexAuth";
import RegistrationModal from "./RegistrationModal";

interface NavBarProps {
  onCurrencyChange?: (letterCode: string, rate: number) => void;
}

interface NavBarState {
  showAuth: boolean;
  googleAuthModal: boolean;
  showCurrencyMenu: boolean;
  showRegistrationModal: boolean;
  selectedCurrency: string;
  currencyOptions: string[];
  ratesData: Array<{ letterCode: string; rate: number }>;
  loading: boolean;
  error: string | null;
  user: UserData | null;
  isNavbarCollapsed: boolean;

  // Форма авторизации
  authForm: {
    login: string;
    password: string;
  };
  authLoading: boolean;
  authError: string | null;
  authFieldErrors: {
    login?: string;
    password?: string;
  };

  showPassword: boolean;
  showUserMenu: boolean;
}

export default class NavBar extends Component<NavBarProps, NavBarState> {
  private menuRef = createRef<HTMLDivElement>();
  private authRef = createRef<HTMLDivElement>();
  private userMenuRef = createRef<HTMLDivElement>();

  state: NavBarState = {
    showAuth: false,
    googleAuthModal: false,
    showCurrencyMenu: false,
    showRegistrationModal: false,
    selectedCurrency: 'RUB',
    currencyOptions: [],
    ratesData: [],
    user: authApi.getStoredUser(),
    authForm: { login: '', password: '' },
    authLoading: false,
    authError: null,
    authFieldErrors: {},
    showPassword: false,
    loading: true,
    error: null,
    showUserMenu: false,
    isNavbarCollapsed: false,
  };

  componentDidMount() {
    this.fetchCurrency();
    this.fetchRatesData();
    document.addEventListener('mousedown', this.handleClickOutside);
    window.addEventListener('openAuthModal', this.openAuthFromEvent);
    window.addEventListener('openRegistrationModal', this.openRegistrationFromEvent);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    window.removeEventListener('openAuthModal', this.openAuthFromEvent);
    window.removeEventListener('openRegistrationModal', this.openRegistrationFromEvent);
    window.removeEventListener('resize', this.handleResize);
  }

  // ========== УПРАВЛЕНИЕ МОБИЛЬНЫМ МЕНЮ ==========
  toggleNavbarCollapse = () => {
    this.setState(prev => ({ isNavbarCollapsed: !prev.isNavbarCollapsed }));
  };

  closeNavbar = () => {
    this.setState({ isNavbarCollapsed: false });
  };

  handleResize = () => {
    if (window.innerWidth >= 992) {
      this.setState({ isNavbarCollapsed: false });
    }
  };

  // ========== ВАЛЮТА ==========
  toggleCurrencyMenu = () => {
    this.setState(prev => ({ showCurrencyMenu: !prev.showCurrencyMenu }));
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
      const uniqueCurrencies = Array.from(new Set(currencies.map(c => c.letterCode).filter(c => selectedCurrencies.includes(c))));
      const sortedCurrencies = uniqueCurrencies.sort();
      this.setState({ currencyOptions: sortedCurrencies, loading: false });
    } catch (err: any) {
      this.setState({ error: err.serverMessage || err.message || "Не удалось загрузить список валют", loading: false });
    }
  };

  fetchRatesData = async () => {
    try {
      this.setState({ loading: true, error: null });
      const currencies = await getCurrencyRates();
      const today = new Date();
      const formattedToday = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
      const todayRates = currencies.filter(r => r.dateReceipt === formattedToday);
      this.setState({
        ratesData: todayRates.map(r => ({ letterCode: r.letterCode, rate: r.rate })),
        loading: false,
      });
    } catch (err: any) {
      this.setState({ error: err.serverMessage || err.message || "Не удалось загрузить данные", loading: false });
    }
  };

  getRateForCurrency = (letterCode: string): number | null => {
    const rateItem = this.state.ratesData.find(r => r.letterCode === letterCode);
    return rateItem ? rateItem.rate : null;
  };

  selectCurrency = (currencyCode: string) => {
    const rate = this.getRateForCurrency(currencyCode);
    this.setState({ selectedCurrency: currencyCode, showCurrencyMenu: false });
    if (this.props.onCurrencyChange && rate) {
      this.props.onCurrencyChange(currencyCode, rate);
    }
  };

  // ========== АВТОРИЗАЦИЯ ==========
  toggleAuthModal = () => {
    this.setState(prev => ({
      showAuth: !prev.showAuth,
      authError: null,
      authFieldErrors: {},
      authForm: { login: '', password: '' }
    }));
  };

  handleAuthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(prev => ({
      authForm: { ...prev.authForm, [name]: value },
      authFieldErrors: { ...prev.authFieldErrors, [name]: undefined },
      authError: null
    }));
  };

  openAuthFromEvent = () => {
    this.setState({ showAuth: true, showRegistrationModal: false });
  };

  openRegistrationFromEvent = () => {
    this.setState({ showRegistrationModal: true, showAuth: false });
  };

  switchToRegistration = () => {
    this.setState({ showAuth: false, showRegistrationModal: true });
  };

  switchToAuth = () => {
    this.setState({ showRegistrationModal: false, showAuth: true });
  };

  validateAuthForm = (): boolean => {
    const { login, password } = this.state.authForm;
    const errors: { login?: string; password?: string } = {};
    if (!login.trim()) errors.login = 'Введите логин или email';
    if (!password) errors.password = 'Введите пароль';
    this.setState({ authFieldErrors: errors });
    return Object.keys(errors).length === 0;
  };

  notifyAuthChange = (user: UserData | null) => {
    window.dispatchEvent(new CustomEvent('authChange', { detail: { user } }));
  };

  handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.validateAuthForm()) return;
    this.setState({ authLoading: true, authError: null });
    try {
      const { login, password } = this.state.authForm;
      const response = await authApi.login({ login, password });
      this.setState({
        user: response.user,
        showAuth: false,
        authForm: { login: '', password: '' },
        authError: null,
        authFieldErrors: {}
      });
      this.notifyAuthChange(response.user);
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.setState({
          authError: 'Неверный логин или пароль',
          authFieldErrors: { login: 'Пользователь не найден', password: 'Неверный пароль' }
        });
      } else if (error.request) {
        this.setState({ authError: 'Сервер не отвечает. Проверьте подключение' });
      } else {
        this.setState({ authError: error.serverMessage || 'Произошла ошибка. Попробуйте снова' });
      }
    } finally {
      this.setState({ authLoading: false });
    }
  };

  handleLogout = () => {
    const currentPath = window.location.pathname;
    const isAccountPage = currentPath.startsWith('/account');

    authApi.logout();
    this.setState({ user: null });
    this.notifyAuthChange(null);

    if (isAccountPage) {
      window.location.href = '/';
    }
  };

  toggleGoogleAuth = () => {
    this.setState(prev => ({ googleAuthModal: !prev.googleAuthModal }));
  };

  // ========== ЗАКРЫТИЕ ПО КЛИКУ СНАРУЖИ ==========
  handleClickOutside = (event: MouseEvent) => {
    if (this.menuRef.current && !this.menuRef.current.contains(event.target as Node)) {
      this.setState({ showCurrencyMenu: false });
    }
    if (this.authRef.current && !this.authRef.current.contains(event.target as Node)) {
      this.setState({ showAuth: false, authError: null, authFieldErrors: {}, authForm: { login: '', password: '' } });
    }
    if (this.userMenuRef.current && !this.userMenuRef.current.contains(event.target as Node)) {
      this.setState({ showUserMenu: false });
    }
  };

  render() {
    const {
      showAuth,
      showCurrencyMenu,
      showRegistrationModal,
      selectedCurrency,
      user,
      authLoading,
      authError,
      authFieldErrors,
      authForm,
      loading,
      error,
      isNavbarCollapsed,
    } = this.state;

    return (
      <>
        <nav
          className="navbar navbar-expand-lg"
          style={{
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
          }}
        >
          <div className="container-fluid" style={{ padding: '0 20px' }}>
            {/* Логотип */}
            <Link
              to="/"
              className="navbar-brand"
              onClick={this.closeNavbar}
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
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200, 160, 120, 0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 245, 235, 0.5)'; }}
            >
              <span>𓂀 Шелковые барханы 𓂀</span>
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              aria-controls="navbarSupportedContent"
              aria-expanded={isNavbarCollapsed}
              aria-label="Toggle navigation"
              onClick={this.toggleNavbarCollapse}
              style={{ backgroundColor: '#C0A080', border: '1px solid #8B5A2B' }}
            >
              <span className="navbar-toggler-icon" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%238B5A2B' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`
              }}></span>
            </button>

            <div className={`collapse navbar-collapse ${isNavbarCollapsed ? 'show' : ''}`} id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ marginLeft: '20px' }}>
                <li className="nav-item">
                  <Link to="/" className="nav-link" onClick={this.closeNavbar} style={{ color: '#8B5A2B', fontSize: '16px', padding: '8px 15px', borderRadius: '20px', transition: 'all 0.3s', border: '1px solid transparent', textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.15)'; e.currentTarget.style.borderColor = '#C0A080'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                    𓊹 Главная
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/catalog" className="nav-link" onClick={this.closeNavbar} style={{ color: '#8B5A2B', fontSize: '16px', padding: '8px 15px', borderRadius: '20px', transition: 'all 0.3s', border: '1px solid transparent', textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.15)'; e.currentTarget.style.borderColor = '#C0A080'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                    𓊖 Туры
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/hot-tours" className="nav-link" onClick={this.closeNavbar} style={{ color: '#8B5A2B', fontSize: '16px', padding: '8px 15px', borderRadius: '20px', transition: 'all 0.3s', border: '1px solid transparent', textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.15)'; e.currentTarget.style.borderColor = '#C0A080'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                    𓂀 Горящие
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"
                    style={{ color: '#8B5A2B', fontSize: '16px', padding: '8px 15px', borderRadius: '20px', transition: 'all 0.3s', border: '1px solid transparent', textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.15)'; e.currentTarget.style.borderColor = '#C0A080'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                    𓋴 Ещё
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown" style={{ backgroundColor: '#F8F0E0', border: '1px solid #C0A080', borderRadius: '10px', padding: '5px' }}>
                    <li><Link className="dropdown-item" to="/information" onClick={this.closeNavbar} style={{ color: '#8B5A2B', padding: '8px 15px', borderRadius: '8px', transition: 'all 0.3s', textDecoration: 'none', display: 'block' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C0A080'; e.currentTarget.style.color = '#F8F0E0'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8B5A2B'; }}>𓏛 Информация</Link></li>
                    <li><Link className="dropdown-item" to="/help" onClick={this.closeNavbar} style={{ color: '#8B5A2B', padding: '8px 15px', borderRadius: '8px', transition: 'all 0.3s', textDecoration: 'none', display: 'block' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C0A080'; e.currentTarget.style.color = '#F8F0E0'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8B5A2B'; }}>𓋴 Помощь</Link></li>
                    {user && (
                      <li><Link className="dropdown-item" to={`/account/${user.id}`} onClick={this.closeNavbar} style={{ color: '#8B5A2B', padding: '8px 15px', borderRadius: '8px', transition: 'all 0.3s', textDecoration: 'none', display: 'block' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#C0A080'; e.currentTarget.style.color = '#F8F0E0'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8B5A2B'; }}>𓁐 Личный кабинет</Link></li>
                    )}
                  </ul>
                </li>
              </ul>

              {/* Селектор валюты */}
              <div ref={this.menuRef} style={{ position: 'relative', marginRight: '10px', flexShrink: 0 }}>
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
                >
                  <span>{selectedCurrency}</span>
                  <span style={{ fontSize: '10px', transform: showCurrencyMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
                </button>
                {showCurrencyMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '5px',
                    backgroundColor: '#F8F0E0',
                    border: '1px solid #C0A080',
                    borderRadius: '10px',
                    minWidth: '180px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 5px 15px rgba(160, 120, 80, 0.1)'
                  }}>
                    {loading ? (
                      <div style={{ padding: '15px', textAlign: 'center', color: '#8B5A2B' }}>Загрузка...</div>
                    ) : error ? (
                      <div style={{ padding: '15px', textAlign: 'center', color: 'red' }}>{error}</div>
                    ) : (
                      this.state.currencyOptions.map(currencyCode => (
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
                            textAlign: 'left'
                          }}
                        >
                          <span style={{ width: '30px', fontSize: '16px', textAlign: 'center' }}>{this.getCurrencySymbol(currencyCode)}</span>
                          <span style={{ flex: 1 }}>{currencyCode}</span>
                          {selectedCurrency === currencyCode && <span style={{ color: '#8B5A2B', fontWeight: 'bold' }}>✓</span>}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Поиск */}
              <form className="d-flex" style={{ marginRight: '10px', maxWidth: '250px' }} onSubmit={(e) => {
                e.preventDefault();
                const searchInput = (e.currentTarget.elements.namedItem('search') as HTMLInputElement)?.value;
                if (searchInput) {
                  this.closeNavbar();
                  window.location.href = `/catalog?search=${encodeURIComponent(searchInput)}`;
                }
              }}>
                <input className="form-control" type="search" name="search" placeholder="Поиск..." aria-label="Search"
                  style={{ border: '1px solid #C0A080', borderRadius: '20px 0 0 20px', padding: '6px 12px', backgroundColor: '#F8F0E0', color: '#8B5A2B', fontSize: '14px', outline: 'none', width: '100%' }} />
                <button className="btn" type="submit"
                  style={{ background: '#C0A080', color: '#F8F0E0', border: '1px solid #8B5A2B', borderRadius: '0 20px 20px 0', padding: '6px 15px', fontSize: '14px', transition: 'all 0.3s', whiteSpace: 'nowrap' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#8B5A2B'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#C0A080'; }}>𓊹</button>
              </form>

              {/* Авторизация / профиль */}
              <div className="position-relative" style={{ flexShrink: 0 }}>
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#8B5A2B', fontSize: '14px', fontWeight: '500' }}>{user.surName} {user.firstName}</span>
                    <button className="btn" onClick={() => { this.handleLogout(); this.closeNavbar(); }}
                      style={{ background: '#C0A080', color: '#F8F0E0', border: '1px solid #8B5A2B', borderRadius: '8px', padding: '5px 10px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#8B5A2B'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#C0A080'; }}>Выйти</button>
                  </div>
                ) : (
                  <button className="btn" id="authButton" onClick={this.toggleAuthModal}
                    style={{ background: '#C0A080', color: '#F8F0E0', border: '1px solid #8B5A2B', borderRadius: '50%', width: '35px', height: '35px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', transition: 'all 0.3s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#8B5A2B'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#C0A080'; }}>𓁐</button>
                )}

                {/* Модальное окно авторизации */}
                {showAuth && !user && (
                  <div ref={this.authRef} id="authModal"
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
                    }}>
                    <h3 style={{ color: '#8B5A2B', textAlign: 'center', marginBottom: '15px', fontSize: '18px', borderBottom: '1px solid #C0A080', paddingBottom: '8px' }}>𓋴 Вход</h3>
                    <form onSubmit={this.handleAuthSubmit}>
                      <div style={{ marginBottom: '10px' }}>
                        <input type="text" name="login" value={authForm.login} onChange={this.handleAuthInputChange}
                          placeholder="Введите логин или Email"
                          style={{ width: '100%', padding: '8px 12px', backgroundColor: '#F0E0D0', border: `1px solid ${authFieldErrors.login ? '#d32f2f' : '#C0A080'}`, borderRadius: '8px', color: '#8B5A2B', fontSize: '14px', outline: 'none' }} />
                        {authFieldErrors.login && <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>{authFieldErrors.login}</div>}
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <input type="password" name="password" value={authForm.password} onChange={this.handleAuthInputChange}
                          placeholder="Пароль"
                          style={{ width: '100%', padding: '8px 12px', backgroundColor: '#F0E0D0', border: `1px solid ${authFieldErrors.password ? '#d32f2f' : '#C0A080'}`, borderRadius: '8px', color: '#8B5A2B', fontSize: '14px', outline: 'none' }} />
                        {authFieldErrors.password && <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>{authFieldErrors.password}</div>}
                      </div>
                      {authError && <div style={{ backgroundColor: '#ffebee', color: '#d32f2f', padding: '8px 12px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', textAlign: 'center', border: '1px solid #ffcdd2' }}>{authError}</div>}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <button type="submit" disabled={authLoading}
                          style={{ flex: 1, padding: '8px', background: authLoading ? '#999' : '#C0A080', color: '#F8F0E0', border: '1px solid #8B5A2B', borderRadius: '8px', fontSize: '14px', cursor: authLoading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', opacity: authLoading ? 0.7 : 1 }}
                          onMouseEnter={(e) => { if (!authLoading) e.currentTarget.style.background = '#8B5A2B'; }}
                          onMouseLeave={(e) => { if (!authLoading) e.currentTarget.style.background = '#C0A080'; }}>{authLoading ? 'Вход...' : 'Войти'}</button>
                        <button type="button" onClick={this.switchToRegistration}
                          style={{ flex: 1, padding: '8px', background: 'transparent', color: '#8B5A2B', border: '1px solid #C0A080', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0E0D0'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>Регистрация</button>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button type="button" onClick={this.toggleGoogleAuth}
                          style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid #C0A080', background: 'transparent', color: '#8B5A2B', fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DB4437'; e.currentTarget.style.borderColor = '#DB4437'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#C0A080'; e.currentTarget.style.color = '#8B5A2B'; }}>G</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Google Auth Modal */}
                <Modal isOpen={this.state.googleAuthModal} toggle={this.toggleGoogleAuth} centered>
                  <ModalHeader toggle={this.toggleGoogleAuth}>Авторизация через Google</ModalHeader>
                  <ModalBody><ButtonGoogleAuth /></ModalBody>
                </Modal>
              </div>
            </div>
          </div>
        </nav>

        {/* Модальное окно регистрации */}
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => {
            setTimeout(() => this.setState({ showRegistrationModal: false }), 0);
          }}
          onSuccess={(user) => {
            this.setState({ user, showRegistrationModal: false });
            this.notifyAuthChange(user);
          }}
          onSwitchToAuth={this.switchToAuth}
        />
      </>
    );
  }
}