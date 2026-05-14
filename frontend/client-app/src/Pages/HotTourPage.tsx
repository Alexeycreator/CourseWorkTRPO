import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { getMainTours } from "../Services/ToursApi";
import NavBar from "../Components/NavBar";
import { getSafeImageUrl, PLACEHOLDERS } from "../Components/OptimizedImage";
import Loader from "../Components/Loader";

// Локальный интерфейс для горящего тура
interface HotTourItem {
    id: number;
    imageTour?: string | null;
    nameTour?: string | null;
    details?: string | null;
    startDot?: string | null;
    endDot?: string | null;
    type?: string | null;
    oldPrice?: number | null;
    nowPrice?: number | null;
    countNights?: number | null;
    hotTour?: boolean;
}

const HotTourPage = () => {
    const location = useLocation();
    const [sortBy, setSortBy] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [tours, setTours] = useState<HotTourItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const calculateNights = (startDate: string, endDate: string): number => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatPrice = (price: number | null | undefined) => {
        if (price === null || price === undefined) return '0 ₽';
        return price.toLocaleString('ru-RU') + ' ₽';
    };

    const calculateDiscount = (oldPrice: number | null | undefined, nowPrice: number | null | undefined): number => {
        if (oldPrice && nowPrice && oldPrice > nowPrice) {
            return Math.round(((oldPrice - nowPrice) / oldPrice) * 100);
        }
        return 0;
    };

    // Загружаем все туры и фильтруем горящие
    const fetchHotTours = async () => {
        try {
            setLoading(true);
            
            // Загружаем все туры через готовый метод API
            const allTours = await getMainTours();
            
            // Фильтруем только горящие туры (hotTour === true)
            const hotToursList = allTours.filter(tour => tour.hotTour === true);
            
            if (hotToursList.length === 0) {
                setError("На данный момент горящих туров нет");
                setTours([]);
            } else {
                // Преобразуем в формат с oldPrice и nowPrice
                const formattedTours: HotTourItem[] = hotToursList.map((tour: any) => ({
                    id: tour.id,
                    imageTour: tour.imageTour,
                    nameTour: tour.nameTour,
                    details: tour.details,
                    startDot: tour.startDot,
                    endDot: tour.endDot,
                    type: tour.type,
                    countNights: tour.countNights,
                    oldPrice: tour.price,
                    nowPrice: tour.price ? tour.price * 0.8 : 0, // 20% скидка
                    hotTour: true
                }));
                setTours(formattedTours);
                setError(null);
            }
            
        } catch (err: any) {
            setError(err.serverMessage || err.message || "Не удалось загрузить горящие туры");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            setSearchQuery(searchParam);
        }
    }, [location.search]);

    useEffect(() => {
        fetchHotTours();
    }, []);

    const filterToursBySearch = (toursList: HotTourItem[]): HotTourItem[] => {
        if (!searchQuery.trim()) return toursList;
        
        const query = searchQuery.toLowerCase().trim();
        return toursList.filter(tour => {
            const searchableFields = [
                tour.nameTour,
                tour.startDot,
                tour.endDot,
                tour.type,
                tour.details
            ].filter(field => field && typeof field === 'string');
            
            return searchableFields.some(field => 
                field?.toLowerCase().includes(query)
            );
        });
    };

    const getFilteredAndSortedTours = () => {
        let filtered = filterToursBySearch(tours);
        
        if (sortBy === 'price-asc') {
            filtered = [...filtered].sort((a, b) => (a.nowPrice || 0) - (b.nowPrice || 0));
        } else if (sortBy === 'price-desc') {
            filtered = [...filtered].sort((a, b) => (b.nowPrice || 0) - (a.nowPrice || 0));
        } else if (sortBy === 'discount') {
            filtered = [...filtered].sort((a, b) => {
                const discountA = calculateDiscount(a.oldPrice, a.nowPrice);
                const discountB = calculateDiscount(b.oldPrice, b.nowPrice);
                return discountB - discountA;
            });
        }
        
        return filtered;
    };

    const filteredAndSortedTours = getFilteredAndSortedTours();

    const resetSearch = () => {
        setSearchQuery('');
    };

    const hasNoHotTours = tours.length === 0 && !loading && error === "На данный момент горящих туров нет";
    const hasNoSearchResults = tours.length > 0 && filteredAndSortedTours.length === 0 && !loading && !error;

    if (loading) {
        return <Loader message="Загрузка горящих туров..." fullScreen />;
    }

    if (error && error !== "На данный момент горящих туров нет") {
        return (
            <div style={{
                background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
                minHeight: '100vh',
                padding: '20px',
                paddingTop: '70px'
            }}>
                <NavBar />
                <div style={{
                    maxWidth: '600px',
                    margin: '100px auto',
                    textAlign: 'center',
                    background: 'rgba(255, 248, 240, 0.9)',
                    borderRadius: '30px',
                    padding: '40px',
                    border: '2px solid #C0A080'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                    <h2 style={{ color: '#8B5A2B', marginBottom: '15px' }}>Ошибка загрузки</h2>
                    <p style={{ color: '#B76E3C', marginBottom: '25px' }}>{error}</p>
                    <button
                        onClick={fetchHotTours}
                        style={{
                            padding: '12px 30px',
                            background: '#C0A080',
                            color: '#FFF8F0',
                            border: '2px solid #8B5A2B',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#8B5A2B';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#C0A080';
                        }}
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)',
            minHeight: '100vh',
            padding: '20px',
            paddingTop: '70px'
        }}>
            <NavBar />
            
            <div style={{ position: 'fixed', top: '10%', left: '2%', fontSize: '40px', opacity: 0.05, pointerEvents: 'none' }}>𓂀</div>
            <div style={{ position: 'fixed', bottom: '10%', right: '3%', fontSize: '50px', opacity: 0.05, pointerEvents: 'none' }}>𓊹</div>
            <div style={{ position: 'fixed', top: '30%', right: '5%', fontSize: '35px', opacity: 0.05, pointerEvents: 'none' }}>𓋴</div>

            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '48px',
                        color: '#8B5A2B',
                        marginBottom: '10px',
                        position: 'relative'
                    }}>
                        🔥 Горящие туры
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        color: '#B76E3C',
                        marginBottom: '20px'
                    }}>
                        Специальные предложения с максимальными скидками! 🐪
                    </p>
                    
                    <div style={{
                        width: '150px',
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, #C0A080, transparent)',
                        margin: '0 auto'
                    }}></div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    gap: '20px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1', maxWidth: '400px' }}>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            background: 'rgba(255, 248, 240, 0.9)',
                            borderRadius: '50px',
                            padding: '5px',
                            border: '2px solid #C0A080'
                        }}>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingLeft: '15px',
                                fontSize: '20px',
                                color: '#B76E3C'
                            }}>
                                🔍
                            </span>
                            <input
                                type="text"
                                placeholder="Поиск по горящим турам..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '12px 10px',
                                    border: 'none',
                                    borderRadius: '40px',
                                    backgroundColor: 'transparent',
                                    color: '#8B5A2B',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={resetSearch}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        color: '#B76E3C',
                                        padding: '0 15px',
                                        borderRadius: '50%'
                                    }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ color: '#8B5A2B', fontSize: '16px' }}>𓊹 Сортировать:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                padding: '8px 20px',
                                border: '2px solid #C0A080',
                                borderRadius: '25px',
                                backgroundColor: '#FFF8F0',
                                color: '#8B5A2B',
                                fontSize: '14px',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            <option value="default">По умолчанию</option>
                            <option value="price-asc">Сначала дешевле</option>
                            <option value="price-desc">Сначала дороже</option>
                            <option value="discount">По размеру скидки</option>
                        </select>
                    </div>
                </div>

                {!hasNoHotTours && !hasNoSearchResults && (
                    <div style={{ marginBottom: '20px', color: '#8B5A2B' }}>
                        Найдено туров: {filteredAndSortedTours.length}
                    </div>
                )}

                {!hasNoHotTours && !hasNoSearchResults && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '25px',
                        marginBottom: '40px'
                    }}>
                        {filteredAndSortedTours.map((tour) => {
                            const discount = calculateDiscount(tour.oldPrice, tour.nowPrice);
                            const oldPrice = tour.oldPrice || 0;
                            const nowPrice = tour.nowPrice || 0;
                            
                            return (
                                <div
                                    key={tour.id}
                                    style={{
                                        background: 'rgba(255, 248, 240, 0.9)',
                                        border: '2px solid #D2B48C',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(183, 110, 60, 0.2)';
                                        e.currentTarget.style.borderColor = '#B76E3C';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.borderColor = '#D2B48C';
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        left: '15px',
                                        background: '#B76E3C',
                                        color: '#FFF8F0',
                                        padding: '8px 15px',
                                        borderRadius: '30px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        zIndex: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        boxShadow: '0 4px 10px rgba(183, 110, 60, 0.3)'
                                    }}>
                                        <span style={{ fontSize: '18px' }}>🔥</span>
                                        <span>Горящий тур</span>
                                    </div>

                                    {discount > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            right: '15px',
                                            background: '#8B5A2B',
                                            color: '#FFD700',
                                            padding: '8px 15px',
                                            borderRadius: '30px',
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            zIndex: 2,
                                            boxShadow: '0 4px 10px rgba(139, 69, 19, 0.3)'
                                        }}>
                                            -{discount}%
                                        </div>
                                    )}

                                    <div style={{
                                        height: '200px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        borderBottom: '2px solid #D2B48C'
                                    }}>
                                        <Link to={`/catalog/tour/${tour.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                                            <img
                                                src={getSafeImageUrl(tour.imageTour, 'tour')}
                                                alt={tour.nameTour || 'Тур'}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = PLACEHOLDERS.tour;
                                                    (e.target as HTMLImageElement).onerror = null;
                                                }}
                                            />
                                        </Link>
                                    </div>

                                    <div style={{
                                        padding: '20px',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{
                                            color: '#8B5A2B',
                                            fontSize: '14px',
                                            marginBottom: '5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <span>📍</span>
                                            <span>{tour.startDot} → {tour.endDot}</span>
                                        </div>

                                        <h3 style={{
                                            margin: '0 0 8px 0',
                                            fontSize: '20px',
                                            fontWeight: '700',
                                            color: '#8B5A2B',
                                            fontFamily: "'Cormorant Garamond', serif"
                                        }}>
                                            <Link to={`/catalog/tour/${tour.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                {tour.nameTour}
                                            </Link>
                                        </h3>

                                        <p style={{
                                            color: '#B76E3C',
                                            fontSize: '14px',
                                            marginBottom: '10px',
                                            fontStyle: 'italic'
                                        }}>
                                            {tour.details}
                                        </p>

                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '10px',
                                            marginBottom: '15px',
                                            fontSize: '13px',
                                            color: '#8B5A2B'
                                        }}>
                                            <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>
                                                🏷️ {tour.type}
                                            </span>
                                            <span style={{ background: '#F0E5D5', padding: '4px 8px', borderRadius: '15px' }}>
                                                🌙 {tour.countNights || (tour.startDot && tour.endDot ? calculateNights(tour.startDot, tour.endDot) : 0)} ночей
                                            </span>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            justifyContent: 'space-between',
                                            marginTop: 'auto'
                                        }}>
                                            <div>
                                                {oldPrice > nowPrice && (
                                                    <span style={{
                                                        fontSize: '16px',
                                                        color: '#B76E3C',
                                                        textDecoration: 'line-through',
                                                        marginRight: '10px'
                                                    }}>
                                                        {formatPrice(oldPrice)}
                                                    </span>
                                                )}
                                                <span style={{
                                                    fontSize: '28px',
                                                    fontWeight: '700',
                                                    color: '#8B5A2B'
                                                }}>
                                                    {formatPrice(nowPrice)}
                                                </span>
                                            </div>
                                        </div>

                                        <Link to={`/catalog/tour/${tour.id}`} style={{ textDecoration: 'none' }}>
                                            <button
                                                style={{
                                                    marginTop: '15px',
                                                    background: '#C0A080',
                                                    color: '#FFF8F0',
                                                    border: '2px solid #8B5A2B',
                                                    borderRadius: '30px',
                                                    padding: '12px',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s',
                                                    width: '100%'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#8B5A2B';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = '#C0A080';
                                                }}
                                            >
                                                𓊹 Подробнее
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {hasNoSearchResults && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#8B5A2B'
                    }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏜️</div>
                        <h3>По вашему запросу ничего не найдено</h3>
                        <p>Попробуйте изменить параметры поиска</p>
                        <button
                            onClick={resetSearch}
                            style={{
                                marginTop: '20px',
                                padding: '10px 30px',
                                background: '#C0A080',
                                color: '#FFF8F0',
                                border: '2px solid #8B5A2B',
                                borderRadius: '25px',
                                cursor: 'pointer'
                            }}
                        >
                            Сбросить поиск
                        </button>
                    </div>
                )}

                {hasNoHotTours && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#8B5A2B'
                    }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏜️</div>
                        <h3>На данный момент горящих туров нет</h3>
                        <p>Загляните позже — новые предложения появляются регулярно!</p>
                        <Link to="/catalog">
                            <button
                                style={{
                                    marginTop: '20px',
                                    padding: '10px 30px',
                                    background: '#C0A080',
                                    color: '#FFF8F0',
                                    border: '2px solid #8B5A2B',
                                    borderRadius: '25px',
                                    cursor: 'pointer'
                                }}
                            >
                                Посмотреть все туры
                            </button>
                        </Link>
                    </div>
                )}

                {!error && tours.length > 0 && (
                    <div style={{
                        marginTop: '60px',
                        padding: '40px',
                        background: 'rgba(255, 248, 240, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid #C0A080',
                        borderRadius: '30px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '-20px',
                            fontSize: '80px',
                            opacity: 0.1,
                            transform: 'rotate(-15deg)'
                        }}>🐪</div>
                        <div style={{
                            position: 'absolute',
                            bottom: '-20px',
                            right: '-20px',
                            fontSize: '80px',
                            opacity: 0.1,
                            transform: 'rotate(15deg)'
                        }}>🏜️</div>

                        <h2 style={{
                            fontSize: '32px',
                            color: '#8B5A2B',
                            marginBottom: '15px',
                            fontFamily: "'Cormorant Garamond', serif"
                        }}>
                            🎯 Не нашли подходящий горящий тур?
                        </h2>
                        
                        <p style={{
                            color: '#B76E3C',
                            marginBottom: '25px',
                            fontSize: '18px',
                            maxWidth: '600px',
                            margin: '0 auto 25px'
                        }}>
                            Оставьте заявку, и мы подберем для вас индивидуальное предложение со скидкой!
                        </p>
                        
                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <input
                                type="email"
                                placeholder="Ваш email"
                                style={{
                                    padding: '12px 25px',
                                    border: '2px solid #C0A080',
                                    borderRadius: '30px',
                                    width: '300px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    backgroundColor: '#FFF8F0',
                                    color: '#8B5A2B'
                                }}
                            />
                            <button
                                onClick={() => alert('Спасибо! Скоро мы свяжемся с вами.')}
                                style={{
                                    background: '#B76E3C',
                                    color: '#FFF8F0',
                                    border: '2px solid #8B5A2B',
                                    borderRadius: '30px',
                                    padding: '12px 40px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#8B5A2B';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#B76E3C';
                                }}
                            >
                                𓊹 Подобрать тур
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { HotTourPage };