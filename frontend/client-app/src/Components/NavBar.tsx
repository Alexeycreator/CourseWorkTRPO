import React, { Component } from "react";
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg" style={{
        background: 'linear-gradient(90deg, #2E1B3F 0%, #4B0082 50%, #6A5ACD 100%)',
        borderBottom: '3px solid #9370DB',
        boxShadow: '0 4px 15px rgba(147, 112, 219, 0.3)',
        padding: '10px 0'
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
              textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px #9370DB',
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
                  color: 'white'
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