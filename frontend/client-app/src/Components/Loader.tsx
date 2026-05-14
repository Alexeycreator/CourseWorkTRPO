import React from 'react';

interface LoaderProps {
    message?: string;
    fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Загрузка...', fullScreen = false }) => {
    const containerStyle: React.CSSProperties = fullScreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
    } : {
        textAlign: 'center',
        padding: '40px'
    };

    return (
        <div style={containerStyle}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'pulse 1.5s infinite' }}>🐪</div>
                <style>{`
                    @keyframes pulse {
                        0% { opacity: 0.6; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.1); }
                        100% { opacity: 0.6; transform: scale(1); }
                    }
                `}</style>
                <h3 style={{ color: '#8B5A2B', fontFamily: "'Cormorant Garamond', serif" }}>{message}</h3>
            </div>
        </div>
    );
};

export default Loader;