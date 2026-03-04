import React from "react";
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Фоновые иероглифы */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '80px', opacity: 0.05, pointerEvents: 'none' }}>𓂀</div>
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', fontSize: '100px', opacity: 0.05, pointerEvents: 'none' }}>𓊹</div>
      <div style={{ position: 'absolute', top: '30%', right: '10%', fontSize: '60px', opacity: 0.05, pointerEvents: 'none' }}>𓋴</div>
      
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'rgba(255, 248, 240, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '40px',
        padding: '50px 40px',
        boxShadow: '0 20px 40px rgba(139, 69, 19, 0.15)',
        border: '2px solid #C0A080',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* 404 с верблюдами */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '80px', transform: 'scaleX(-1)' }}>🐪</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '120px',
            fontWeight: '700',
            color: '#8B5A2B',
            lineHeight: 1,
            textShadow: '2px 2px 0 #C0A080, 4px 4px 0 rgba(183, 110, 60, 0.3)'
          }}>
            404
          </span>
          <span style={{ fontSize: '80px' }}>🐪</span>
        </div>

        {/* Заголовок */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '36px',
          color: '#8B5A2B',
          marginBottom: '15px'
        }}>
          Ой, кажется, вы заблудились в пустыне!
        </h2>

        {/* Описание */}
        <p style={{
          color: '#B76E3C',
          fontSize: '18px',
          marginBottom: '30px',
          lineHeight: 1.6
        }}>
          Эта страница затерялась среди барханов так же, <br />
          как древний город в песках Египта. 🌵
        </p>

        {/* Декоративная линия */}
        <div style={{
          width: '100px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #C0A080, #B76E3C, #C0A080, transparent)',
          margin: '0 auto 30px'
        }}></div>

        {/* Кнопки */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/">
            <button style={{
              padding: '12px 30px',
              background: '#B76E3C',
              color: '#FFF8F0',
              border: '2px solid #8B5A2B',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#8B5A2B';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#B76E3C';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              <span>🏜️</span> Вернуться домой
            </button>
          </Link>
          
          <Link to="/catalog">
            <button style={{
              padding: '12px 30px',
              background: 'transparent',
              color: '#8B5A2B',
              border: '2px solid #C0A080',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(192, 160, 128, 0.1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              <span>🐪</span> К турам
            </button>
          </Link>
        </div>

        {/* Маленькая подсказка */}
        <p style={{
          marginTop: '30px',
          color: '#C0A080',
          fontSize: '14px',
          fontStyle: 'italic'
        }}>
          * Возможно, вы искали сокровища фараонов, но нашли эту страницу
        </p>
      </div>
    </div>
  );
};

export { NotFoundPage };