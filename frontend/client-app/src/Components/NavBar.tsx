import React, { Component } from "react";
import { Link } from 'react-router-dom';
import ButtonGoogleAuth from "./BtnGoogleAuth";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

interface NavBarState {
  showAuth: boolean;
  googleAuthModal: boolean;
  showCurrencyMenu: boolean;
  selectedCurrency: string;
}

export default class NavBar extends Component<{}, NavBarState> {
  currencies = [
    { code: 'RUB', symbol: '₽', label: 'RUB' },
    { code: 'USD', symbol: '$', label: 'USD' },
    { code: 'EUR', symbol: '€', label: 'EUR' }
  ];

  state: NavBarState = {
    showAuth: false,
    googleAuthModal: false,
    showCurrencyMenu: false,
    selectedCurrency: 'RUB'
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

  toggleCurrencyMenu = () => {
    this.setState(prevState => ({
      showCurrencyMenu: !prevState.showCurrencyMenu
    }));
  };

  selectCurrency = (code: string) => {
    this.setState({
      selectedCurrency: code,
      showCurrencyMenu: false
    });
  };

  getCurrencySymbol = (code: string) => {
    switch(code) {
      case 'RUB': return '₽';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return '₽';
    }
  };

  render() {
    const { showAuth, showCurrencyMenu, selectedCurrency } = this.state;

    return (
      <nav className="navbar navbar-expand-lg" style={{
        background: 'linear-gradient(90deg, #F8F0E0 0%, #F0E0D0 50%, #E8D0C0 100%)',
        borderBottom: '2px solid #C0A080',
        boxShadow: '0 2px 10px rgba(160, 120, 80, 0.1)',
        padding: '8px 0',
        position: 'relative'
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

            {/* Селектор валюты */}
            <div style={{ position: 'relative', marginRight: '10px', flexShrink: 0 }}>
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
                <span>{this.getCurrencySymbol(selectedCurrency)}</span>
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
                  minWidth: '150px',
                  zIndex: 1000,
                  overflow: 'hidden',
                  boxShadow: '0 5px 15px rgba(160, 120, 80, 0.1)'
                }}>
                  {this.currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => this.selectCurrency(currency.code)}
                      style={{
                        width: '100%',
                        padding: '8px 15px',
                        border: 'none',
                        borderBottom: '1px solid #C0A080',
                        backgroundColor: selectedCurrency === currency.code ? 'rgba(200, 160, 120, 0.15)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px',
                        color: '#8B5A2B',
                        transition: 'all 0.3s',
                        fontWeight: selectedCurrency === currency.code ? 500 : 400
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(200, 160, 120, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = selectedCurrency === currency.code ? 'rgba(200, 160, 120, 0.15)' : 'transparent';
                      }}
                    >
                      <span style={{ width: '25px' }}>{currency.symbol}</span>
                      <span style={{ flex: 1, textAlign: 'left' }}>{currency.label}</span>
                      {selectedCurrency === currency.code && (
                        <span>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Форма поиска - исправлено позиционирование */}
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
            <div className="position-relative" style={{ flexShrink: 0 }}>
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
    );
  }
}