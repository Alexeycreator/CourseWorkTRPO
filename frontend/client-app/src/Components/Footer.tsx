import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: 'linear-gradient(0deg, #2E1B3F, #4B0082)',
            color: 'white',
            padding: '40px 20px',
            marginTop: 'auto',
            borderTop: '3px solid #9370DB',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#9370DB',
                padding: '10px 30px',
                borderRadius: '30px',
                fontSize: '24px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
            }}>
                👻 Салли-турс 👻
            </div>
            
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px',
                paddingTop: '30px'
            }}>
                <div>
                    <h3 style={{ color: '#FFD700', marginBottom: '20px' }}>Корпорация монстров</h3>
                    <p style={{ color: '#D8BFD8' }}>Путешествия со страхом и смехом!</p>
                </div>
                <div>
                    <h3 style={{ color: '#FFD700', marginBottom: '20px' }}>Контакты</h3>
                    <p style={{ color: '#D8BFD8' }}>📍 Монстрополис, ул. Страха, 13</p>
                    <p style={{ color: '#D8BFD8' }}>📞 +7 (999) 123-45-67</p>
                </div>
                <div>
                    <h3 style={{ color: '#FFD700', marginBottom: '20px' }}>Мы в соцсетях</h3>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '30px' }}>
                        <span>👻</span>
                        <span>💚</span>
                        <span>🚪</span>
                        <span>🪀</span>
                    </div>
                </div>
            </div>
            
            <div style={{
                textAlign: 'center',
                marginTop: '30px',
                paddingTop: '20px',
                borderTop: '1px solid #9370DB',
                color: '#D8BFD8'
            }}>
                <p>© 2026 Корпорация монстров. Все двери защищены.</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    С любовью от Салли и Майка 💚
                </p>
            </div>
        </footer>
    );
};

export default Footer;