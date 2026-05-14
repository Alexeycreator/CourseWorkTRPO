import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
    src: string | null | undefined;
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    type?: 'tour' | 'hotel' | 'room' | 'user';
}

// Локальные плейсхолдеры
export const PLACEHOLDERS = {
    tour: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Crect width="400" height="200" fill="%23D2B48C"/%3E%3Ctext x="200" y="110" font-family="Arial" font-size="18" fill="%238B5A2B" text-anchor="middle"%3E🐪 Нет изображения%3C/text%3E%3C/svg%3E',
    hotel: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23D2B48C"/%3E%3Ctext x="400" y="225" font-family="Arial" font-size="24" fill="%238B5A2B" text-anchor="middle"%3E🏨 Нет изображения%3C/text%3E%3C/svg%3E',
    room: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Crect width="400" height="200" fill="%23D2B48C"/%3E%3Ctext x="200" y="105" font-family="Arial" font-size="20" fill="%238B5A2B" text-anchor="middle"%3E🛏️ Нет изображения%3C/text%3E%3C/svg%3E',
    user: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%23D2B48C"/%3E%3Ctext x="50" y="65" font-family="Arial" font-size="40" fill="%238B5A2B" text-anchor="middle"%3E👤%3C/text%3E%3C/svg%3E',
};

// ВАЛИДНЫЕ РАСШИРЕНИЯ ИЗОБРАЖЕНИЙ
export const VALID_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];

// Проверка, является ли строка валидным путем к изображению
export const isValidImagePath = (path: string | null | undefined): boolean => {
    if (!path || path === 'null' || path === 'undefined' || path === 'test' || path === '') return false;
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const lowerPath = path.toLowerCase();
    return validExtensions.some(ext => lowerPath.endsWith(ext));
};

// ПОЛУЧЕНИЕ БЕЗОПАСНОГО URL ДЛЯ ИЗОБРАЖЕНИЙ
// Использует REACT_APP_API_URL_IMAGES для правильного формирования пути к картинкам
export const getSafeImageUrl = (
    path: string | null | undefined,
    type: keyof typeof PLACEHOLDERS = 'tour'
): string => {
    if (!isValidImagePath(path)) {
        return PLACEHOLDERS[type];
    }
    // Используем отдельную переменную для URL картинок (без /api)
    const IMAGES_API_URL = process.env.REACT_APP_API_URL_IMAGES || 'http://localhost:5050';
    return `${IMAGES_API_URL}/${path}`;
};

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className,
    style,
    type = 'tour'
}) => {
    const [imageSrc, setImageSrc] = useState<string>(PLACEHOLDERS[type]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Сброс состояния при изменении src
        setIsLoading(true);
        setHasError(false);

        // Проверка на валидность src
        if (!src || src === 'null' || src === 'undefined' || src === 'test' || src === '') {
            setImageSrc(PLACEHOLDERS[type]);
            setIsLoading(false);
            setHasError(true);
            return;
        }

        // Если это data:image - сразу используем
        if (src.startsWith('data:')) {
            setImageSrc(src);
            setIsLoading(false);
            return;
        }

        // Если это полный URL (http:// или https://)
        if (src.startsWith('http://') || src.startsWith('https://')) {
            // Проверяем, что это изображение, а не просто текст
            if (!isValidImagePath(src)) {
                setImageSrc(PLACEHOLDERS[type]);
                setIsLoading(false);
                setHasError(true);
                return;
            }

            const img = new Image();
            img.onload = () => {
                setImageSrc(src);
                setIsLoading(false);
            };
            img.onerror = () => {
                setImageSrc(PLACEHOLDERS[type]);
                setIsLoading(false);
                setHasError(true);
            };
            img.src = src;
            return;
        }

        // Для относительных путей используем getSafeImageUrl
        const fullUrl = getSafeImageUrl(src, type);
        
        // Если вернулся плейсхолдер, значит путь невалидный
        if (fullUrl === PLACEHOLDERS[type]) {
            setImageSrc(fullUrl);
            setIsLoading(false);
            setHasError(true);
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImageSrc(fullUrl);
            setIsLoading(false);
        };
        img.onerror = () => {
            setImageSrc(PLACEHOLDERS[type]);
            setIsLoading(false);
            setHasError(true);
        };
        img.src = fullUrl;
    }, [src, type]);

    if (isLoading) {
        return (
            <div
                className={className}
                style={{
                    ...style,
                    background: '#F0E5D5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...(style || {})
                }}
            >
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '3px solid #D2B48C',
                    borderTop: '3px solid #B76E3C',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={hasError ? `Нет изображения: ${alt}` : alt}
            className={className}
            style={style}
        />
    );
};

export default OptimizedImage;