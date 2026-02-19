import React, { Component } from "react";
import { Link } from 'react-router-dom';
import ButtonGoogleAuth from "./BtnGoogleAuth";
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

// Определяем интерфейс для состояния
interface NavBarState {
  showAuth: boolean;
  googleAuthModal: boolean; // Добавлено
}

export default class NavBar extends Component<{}, NavBarState> {
  // Инициализируем состояние
  state: NavBarState = {
    showAuth: false,
    googleAuthModal: false // Добавлено
  };

  // Метод для переключения модального окна
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

  render() {
    const { showAuth } = this.state; // Получаем значение из состояния

    return (
      <nav className="navbar navbar-expand-lg" style={{
        background: 'linear-gradient(90deg, #2E1B3F 0%, #4B0082 50%, #6A5ACD 100%)',
        borderBottom: '3px solid #9370DB',
        boxShadow: '0 4px 15px rgba(147, 112, 219, 0.3)',
        padding: '10px 0',
        position: 'relative' // Добавляем для позиционирования декоративных элементов
      }}>
        <div className="container-fluid" style={{ padding: '0 30px' }}>
          {/* Логотип - ссылка на главную */}
          <Link
            to="/"
            className="navbar-brand"
            style={{
              fontFamily: "'Poppins', 'Montserrat', 'Arial Black', sans-serif",
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(45deg, #FFD700, #E6E6FA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px #db7c70',
              letterSpacing: '2px',
              padding: '5px 15px',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              marginLeft: '20px',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.textShadow = '0 0 15px #FFD700';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px #9370DB';
            }}
          >
            🚪 Салли-Турс 🚪
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
              backgroundColor: '#9370DB',
              border: '2px solid #E6E6FA'
            }}
          >
            <span className="navbar-toggler-icon" style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='white' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`
            }}></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ marginLeft: '30px' }}>
              {/* Главная */}
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link"
                  style={{
                    color: '#E6E6FA',
                    fontSize: '18px',
                    fontWeight: '500',
                    padding: '10px 20px',
                    margin: '0 5px',
                    borderRadius: '20px',
                    transition: 'all 0.3s',
                    border: '1px solid transparent',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(147, 112, 219, 0.3)';
                    e.currentTarget.style.border = '1px solid #9370DB';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.border = '1px solid transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🏠 Домой
                </Link>
              </li>

              {/* Каталог туров */}
              <li className="nav-item">
                <Link
                  to="/catalog"
                  className="nav-link"
                  style={{
                    color: '#E6E6FA',
                    fontSize: '18px',
                    fontWeight: '500',
                    padding: '10px 20px',
                    margin: '0 5px',
                    borderRadius: '20px',
                    transition: 'all 0.3s',
                    border: '1px solid transparent',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(147, 112, 219, 0.3)';
                    e.currentTarget.style.border = '1px solid #9370DB';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.border = '1px solid transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🚪 Все двери
                </Link>
              </li>

              {/* Горящие туры */}
              <li className="nav-item">
                <Link
                  to="/hot-tours"
                  className="nav-link"
                  style={{
                    color: '#E6E6FA',
                    fontSize: '18px',
                    fontWeight: '500',
                    padding: '10px 20px',
                    margin: '0 5px',
                    borderRadius: '20px',
                    transition: 'all 0.3s',
                    border: '1px solid transparent',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(147, 112, 219, 0.3)';
                    e.currentTarget.style.border = '1px solid #9370DB';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.border = '1px solid transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🔥 Горящие туры
                </Link>
              </li>

              {/* Выпадающее меню с дополнительными страницами */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    color: '#E6E6FA',
                    fontSize: '18px',
                    fontWeight: '500',
                    padding: '10px 20px',
                    margin: '0 5px',
                    borderRadius: '20px',
                    transition: 'all 0.3s',
                    border: '1px solid transparent',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(147, 112, 219, 0.3)';
                    e.currentTarget.style.border = '1px solid #9370DB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.border = '1px solid transparent';
                  }}
                >
                  👻 Ещё
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdown"
                  style={{
                    backgroundColor: '#2E1B3F',
                    border: '2px solid #9370DB',
                    borderRadius: '15px',
                    padding: '10px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                >
                  {/* Информация */}
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/information"
                      style={{
                        color: '#E6E6FA',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#9370DB';
                        e.currentTarget.style.paddingLeft = '30px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      ℹ️ Информация
                    </Link>
                  </li>

                  {/* Помощь */}
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/help"
                      style={{
                        color: '#E6E6FA',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#9370DB';
                        e.currentTarget.style.paddingLeft = '30px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      ❓ Помощь
                    </Link>
                  </li>

                  {/* Личный кабинет */}
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/account"
                      style={{
                        color: '#E6E6FA',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#9370DB';
                        e.currentTarget.style.paddingLeft = '30px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      👤 Личный кабинет
                    </Link>
                  </li>

                  <li><hr className="dropdown-divider" style={{ borderColor: '#9370DB' }} /></li>

                  {/* Детальная страница тура (пример) */}
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/tour/1"
                      style={{
                        color: '#FFD700',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#9370DB';
                        e.currentTarget.style.paddingLeft = '30px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      🏆 Пример тура
                    </Link>
                  </li>

                  {/* Страница не найдена (для примера) */}
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/404"
                      style={{
                        color: '#FF6B6B',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#9370DB';
                        e.currentTarget.style.paddingLeft = '30px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                    >
                      ⚠️ 404
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            {/* Форма поиска */}
            <form className="d-flex" style={{ marginRight: '20px' }}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="🔍 Найти дверь..."
                aria-label="Search"
                style={{
                  border: '2px solid #9370DB',
                  borderRadius: '25px',
                  padding: '8px 20px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  //caretColor: '#70db99', // цвет курсора
                  // accentColor: '#1fcf54' 
                }}
              />
              <button
                className="btn"
                type="submit"
                style={{
                  background: 'linear-gradient(45deg, #9370DB, #6A5ACD)',
                  color: 'white',
                  border: '2px solid #E6E6FA',
                  borderRadius: '25px',
                  padding: '8px 25px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = 'linear-gradient(45deg, #6A5ACD, #9370DB)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(45deg, #9370DB, #6A5ACD)';
                }}
              >
                Поиск 🔍
              </button>
            </form>

            {/* Кнопка авторизации */}
            <div className="position-relative">
              <button
                className="btn"
                id="authButton"
                onClick={this.toggleAuthModal} // Используем метод класса
                style={{
                  background: 'linear-gradient(45deg, #FFD700, #9370DB)',
                  color: 'white',
                  border: '2px solid #E6E6FA',
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  transition: 'all 0.3s',
                  boxShadow: '0 0 10px rgba(147, 112, 219, 0.5)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 0 20px #FFD700';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(147, 112, 219, 0.5)';
                }}
              >
                👤
              </button>

              {/* Модальное окно авторизации */}
              {showAuth && ( // Используем состояние для условного рендеринга
                <div
                  id="authModal"
                  style={{
                    position: 'absolute',
                    top: '60px',
                    right: '0',
                    width: '320px',
                    backgroundColor: '#2E1B3F',
                    border: '2px solid #9370DB',
                    borderRadius: '15px',
                    padding: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    zIndex: 1000
                  }}
                >
                  {/* Заголовок */}
                  <h3 style={{
                    color: '#FFD700',
                    textAlign: 'center',
                    marginBottom: '20px',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '600',
                    borderBottom: '2px solid #9370DB',
                    paddingBottom: '10px'
                  }}>
                    🔐 Вход в Салли-Турс
                  </h3>

                  {/* Форма авторизации */}
                  <form onSubmit={(e) => e.preventDefault()}>
                    {/* Поле для email/логина */}
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{
                        color: '#E6E6FA',
                        display: 'block',
                        marginBottom: '5px',
                        fontSize: '14px'
                      }}>
                        📧 Email или логин
                      </label>
                      <input
                        type="text"
                        style={{
                          width: '100%',
                          padding: '10px 15px',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          border: '2px solid #9370DB',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'all 0.3s'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#FFD700';
                          e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#9370DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        placeholder="Введите email или логин"
                      />
                    </div>

                    {/* Поле для пароля */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{
                        color: '#E6E6FA',
                        display: 'block',
                        marginBottom: '5px',
                        fontSize: '14px'
                      }}>
                        🔑 Пароль
                      </label>
                      <input
                        type="password"
                        style={{
                          width: '100%',
                          padding: '10px 15px',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          border: '2px solid #9370DB',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '14px',
                          outline: 'none',
                          transition: 'all 0.3s'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#FFD700';
                          e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.3)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#9370DB';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        placeholder="Введите пароль"
                      />
                    </div>

                    {/* Кнопки действий */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                      <button
                        type="submit"
                        style={{
                          flex: '1',
                          padding: '10px',
                          background: 'linear-gradient(45deg, #9370DB, #6A5ACD)',
                          color: 'white',
                          border: '2px solid #E6E6FA',
                          borderRadius: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #6A5ACD, #9370DB)';
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #9370DB, #6A5ACD)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Войти
                      </button>
                      <button
                        type="button"
                        style={{
                          flex: '1',
                          padding: '10px',
                          background: 'transparent',
                          color: '#FFD700',
                          border: '2px solid #9370DB',
                          borderRadius: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(147, 112, 219, 0.3)';
                          e.currentTarget.style.borderColor = '#FFD700';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = '#9370DB';
                        }}
                      >
                        Регистрация
                      </button>
                    </div>

                    {/* Дополнительные ссылки */}
                    <div style={{ textAlign: 'center' }}>
                      <a
                        href="#"
                        style={{
                          color: '#9370DB',
                          textDecoration: 'none',
                          fontSize: '13px',
                          transition: 'color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#FFD700';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9370DB';
                        }}
                      >
                        Забыли пароль?
                      </a>
                    </div>

                    {/* Разделитель */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      margin: '20px 0'
                    }}>
                      <div style={{ flex: '1', height: '1px', backgroundColor: '#9370DB' }}></div>
                      <span style={{ color: '#9370DB', fontSize: '12px' }}>ИЛИ</span>
                      <div style={{ flex: '1', height: '1px', backgroundColor: '#9370DB' }}></div>
                    </div>

                    {/* Социальные кнопки */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      {/* Кнопка Google */}
                      <button
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: '2px solid #9370DB',
                          background: 'transparent',
                          color: '#E6E6FA',
                          fontSize: '18px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#DB4437';
                          e.currentTarget.style.borderColor = '#DB4437';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = '#9370DB';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        onClick={this.toggleGoogleAuth}  // ИЗМЕНЕНО: вызываем метод класса
                      >
                        G
                      </button>
                    </div>

                    {/* ДОБАВЛЕНО: Модальное окно для GoogleAuth */}
                    <Modal
                      isOpen={this.state.googleAuthModal}
                      toggle={this.toggleGoogleAuth}
                      centered
                      style={{
                        backgroundColor: '#2E1B3F'
                      }}
                    >
                      <ModalHeader
                        toggle={this.toggleGoogleAuth}
                        style={{
                          backgroundColor: '#2E1B3F',
                          color: '#FFD700',
                          borderBottom: '2px solid #9370DB'
                        }}
                      >
                        🔐 Авторизация через Google
                      </ModalHeader>
                      <ModalBody style={{
                        backgroundColor: '#2E1B3F',
                        padding: '20px'
                      }}>
                        <ButtonGoogleAuth />
                      </ModalBody>
                    </Modal>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Декоративные элементы как пятна на шкуре Салли */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '20%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(147, 112, 219, 0.2)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: 1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '5px',
          right: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(106, 90, 205, 0.2)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 1
        }} />
      </nav>
    );
  }
}