import React from "react";
import maldivImage from '../Images/Maldiv.jpg';
import italiaImage from '../Images/Italia.jpeg';
import baliImage from '../Images/Bali.jpg';

const MainPage = () => {
    return (
        <div>
            <main>
                {/* Hero с красивым фоном */}
                <section className="hero" style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/images/beach-hero.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    padding: '100px 20px',
                    textAlign: 'center'
                }}>
                    <div className="hero-content">
                        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Путешествуй без границ</h1>
                        <p style={{ fontSize: '20px', marginBottom: '30px' }}>Более 1000 туров по всему миру</p>
                        <div className="hero-buttons">
                            <button className="btn-primary" style={{
                                padding: '12px 30px',
                                fontSize: '18px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}>Подобрать тур</button>
                            <button className="btn-secondary" style={{
                                padding: '12px 30px',
                                fontSize: '18px',
                                backgroundColor: 'transparent',
                                color: 'white',
                                border: '2px solid white',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}>Спецпредложения</button>
                        </div>
                    </div>
                </section>

                {/* Почему выбирают нас */}
                <section className="advantages" style={{
                    padding: '60px 20px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '36px',
                        marginBottom: '40px',
                        color: '#333'
                    }}>Почему выбирают нас</h2>
                    <div className="advantages-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px'
                    }}>
                        <div className="advantage" style={{ textAlign: 'center', padding: '20px' }}>
                            <span className="icon" style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>✈️</span>
                            <h3 style={{ marginBottom: '10px' }}>10+ лет на рынке</h3>
                            <p style={{ color: '#666' }}>Опытные специалисты по туризму</p>
                        </div>
                        <div className="advantage" style={{ textAlign: 'center', padding: '20px' }}>
                            <span className="icon" style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>🏨</span>
                            <h3 style={{ marginBottom: '10px' }}>Отели 4-5*</h3>
                            <p style={{ color: '#666' }}>Только проверенные отели</p>
                        </div>
                        <div className="advantage" style={{ textAlign: 'center', padding: '20px' }}>
                            <span className="icon" style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>💰</span>
                            <h3 style={{ marginBottom: '10px' }}>Лучшие цены</h3>
                            <p style={{ color: '#666' }}>Гарантия низкой стоимости</p>
                        </div>
                        <div className="advantage" style={{ textAlign: 'center', padding: '20px' }}>
                            <span className="icon" style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>🛡️</span>
                            <h3 style={{ marginBottom: '10px' }}>Поддержка 24/7</h3>
                            <p style={{ color: '#666' }}>Помощь на отдыхе</p>
                        </div>
                    </div>
                </section>

                {/* Спецпредложения */}
                <section className="special-offers" style={{
                    padding: '60px 20px',
                    backgroundColor: '#f8f9fa'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '36px',
                            marginBottom: '40px',
                            color: '#333'
                        }}>Спецпредложения месяца</h2>
                        <div className="offers-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '30px'
                        }}>
                            {/* Мальдивы */}
                            <div className="offer-card" style={{
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s',
                                cursor: 'pointer',
                                backgroundColor: 'white'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <img
                                    src={maldivImage}
                                    alt="Мальдивы"
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Мальдивы</h3>
                                    <p style={{ color: '#666', margin: '0 0 15px 0' }}>Райский отдых на островах</p>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        color: '#007bff',
                                        margin: '0 0 15px 0'
                                    }}>180 000 ₽</p>
                                    <button style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        width: '100%',
                                        fontSize: '16px'
                                    }}>Подробнее</button>
                                </div>
                            </div>

                            {/* Италия */}
                            <div className="offer-card" style={{
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s',
                                cursor: 'pointer',
                                backgroundColor: 'white'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <img
                                    src={italiaImage}
                                    alt="Италия"
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Италия</h3>
                                    <p style={{ color: '#666', margin: '0 0 15px 0' }}>Экскурсионный тур</p>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        color: '#007bff',
                                        margin: '0 0 15px 0'
                                    }}>95 000 ₽</p>
                                    <button style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        width: '100%',
                                        fontSize: '16px'
                                    }}>Подробнее</button>
                                </div>
                            </div>

                            {/* Бали */}
                            <div className="offer-card" style={{
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s',
                                cursor: 'pointer',
                                backgroundColor: 'white'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <img
                                    src={baliImage}
                                    alt="Бали"
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Бали</h3>
                                    <p style={{ color: '#666', margin: '0 0 15px 0' }}>Йога-тур</p>
                                    <p style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        color: '#007bff',
                                        margin: '0 0 15px 0'
                                    }}>120 000 ₽</p>
                                    <button style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        width: '100%',
                                        fontSize: '16px'
                                    }}>Подробнее</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Отзывы */}
                <section className="reviews" style={{
                    padding: '60px 20px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '36px',
                        marginBottom: '40px',
                        color: '#333'
                    }}>Отзывы наших клиентов</h2>
                    <div className="reviews-slider" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px'
                    }}>
                        <div className="review" style={{
                            padding: '30px',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                            <p style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '20px' }}>
                                "Отличный отдых! Все организовано на высшем уровне"
                            </p>
                            <p className="author" style={{ fontWeight: 'bold', color: '#007bff' }}>— Есения, Турция</p>
                        </div>
                        <div className="review" style={{
                            padding: '30px',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                            <p style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '20px' }}>
                                "Спасибо за незабываемый отпуск!"
                            </p>
                            <p className="author" style={{ fontWeight: 'bold', color: '#007bff' }}>— Валерий, Египет</p>
                        </div>
                    </div>
                </section>

                {/* Подписка на новости */}
                <section className="newsletter" style={{
                    padding: '60px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h2 style={{
                            fontSize: '36px',
                            marginBottom: '20px'
                        }}>Подпишитесь на рассылку</h2>
                        <p style={{
                            fontSize: '18px',
                            marginBottom: '30px'
                        }}>Получайте горящие предложения первыми</p>
                        <form style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center'
                        }}>
                            <input
                                type="email"
                                placeholder="Ваш email"
                                style={{
                                    padding: '12px',
                                    fontSize: '16px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    width: '300px'
                                }}
                            />
                            <button type="submit" style={{
                                padding: '12px 30px',
                                fontSize: '16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}>Подписаться</button>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="bg-dark text-white text-center py-3" style={{
                backgroundColor: '#343a40',
                color: 'white',
                padding: '20px',
                marginTop: 'auto'
            }}>
                <p style={{ margin: 0 }}>© 2026 Jeffrey Island. Все права защищены.</p>
            </footer>
        </div>
    )
}

export default MainPage;