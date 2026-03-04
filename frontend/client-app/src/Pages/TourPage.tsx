import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Импортируем изображения для всех туров
import maldivImage from '../Images/Maldiv.jpg';
import italiaImage from '../Images/Italia.jpeg';
import baliImage from '../Images/Bali.jpg';
import egyptImage from '../Images/egypt.jpg';
import turkeyImage from '../Images/turkey.jpg';
import greeceImage from '../Images/greece.jpg';
import thailandImage from '../Images/thailand.jpg';
import uaeImage from '../Images/uae.jpg';
import japanImage from '../Images/japan.jpg';
import franceImage from '../Images/france.jpg';

// Интерфейс для данных тура
interface TourData {
    id: number;
    title: string;
    description: string;
    longDescription?: string;
    price: number;
    oldPrice?: number;
    image: string;
    gallery?: string[];
    rating: number;
    reviews: number;
    nights: number;
    country: string;
    city: string;
    area?: string;
    hotelName?: string;
    type: string;
    hot: boolean;
    departureCity?: string;
    mealType?: string;
    included?: string[];
    notIncluded?: string[];
    program?: string[];
}

const TourPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [tour, setTour] = useState<TourData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [tourists, setTourists] = useState(2);

    // База данных всех туров с подробными описаниями
    const toursDatabase: Record<string, TourData> = {
        '1': {
            id: 1,
            title: 'Мальдивы',
            description: 'Райский отдых на белоснежных пляжах',
            longDescription: 'Мальдивы — это тропический рай, состоящий из 26 атоллов и более 1000 коралловых островов. Кристально чистая вода бирюзового цвета, белоснежные песчаные пляжи, богатейший подводный мир и роскошные отели делают это направление идеальным для романтического отдыха, медового месяца или просто незабываемого отпуска. Здесь вы сможете насладиться уединением на частных островах, поплавать с маской среди разноцветных рыб и кораллов, а также испытать настоящий релакс в спа-центрах мирового уровня. Мальдивы — это место, где время останавливается, а заботы исчезают вместе с приливом.',
            price: 180000,
            oldPrice: 220000,
            image: maldivImage,
            gallery: [
                maldivImage,
                'https://images.unsplash.com/photo-1540202404-a2f3c7b1b5e0?w=800',
                'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800',
                'https://images.unsplash.com/photo-1573843981279-9a27c1c3e2a9?w=800'
            ],
            rating: 4.8,
            reviews: 124,
            nights: 7,
            country: 'Мальдивы',
            city: 'Мале',
            area: 'Северный Мале',
            hotelName: 'Conrad Maldives Rangali',
            type: 'Пляжный',
            hot: true,
            departureCity: 'Москва',
            mealType: 'Завтраки',
            included: [
                'Перелет Москва-Мале-Москва',
                'Трансфер аэропорт-отель-аэропорт',
                'Проживание в отеле 5*',
                'Страховка',
                'Завтраки (шведский стол)'
            ],
            notIncluded: [
                'Виза (не нужна)',
                'Экскурсии',
                'Дополнительные услуги отеля'
            ],
            program: [
                'День 1: Прибытие, заселение, отдых на пляже',
                'День 2: Снорклинг, знакомство с отелем',
                'День 3: Экскурсия на остров Мале',
                'День 4: Дайвинг (опционально)',
                'День 5: Романтический ужин на пляже',
                'День 6: Свободный день, спа-процедуры',
                'День 7: Прощальный ужин, вылет'
            ]
        },
        '2': {
            id: 2,
            title: 'Италия',
            description: 'Экскурсионный тур по историческим местам',
            longDescription: 'Италия — страна, где каждый камень дышит историей, а каждый уголок пропитан искусством и страстью. Рим с его величественным Колизеем и таинственным Римским форумом, Флоренция — колыбель Ренессанса, где творили Леонардо и Микеланджело, Венеция с её романтичными каналами и гондолами, и Помпеи — город, застывший во времени после извержения Везувия. Этот тур позволит вам прикоснуться к великому наследию античности и эпохи Возрождения, насладиться неповторимой итальянской кухней — от пиццы и пасты до лучших вин и сыров, и прочувствовать знаменитое итальянское гостеприимство.',
            price: 95000,
            oldPrice: 120000,
            image: italiaImage,
            gallery: [
                italiaImage,
                'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800',
                'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
                'https://images.unsplash.com/photo-1549989476-69a92fa57c41?w=800'
            ],
            rating: 4.7,
            reviews: 98,
            nights: 5,
            country: 'Италия',
            city: 'Рим',
            area: 'Центр',
            hotelName: 'Hotel Bristol Rome',
            type: 'Экскурсионный',
            hot: false,
            departureCity: 'Москва',
            mealType: 'Завтраки',
            included: [
                'Перелет Москва-Рим-Москва',
                'Трансферы по программе',
                'Проживание в отелях 3-4*',
                'Страховка',
                'Завтраки',
                'Экскурсии с русским гидом'
            ],
            notIncluded: [
                'Виза (оформляем помощь)',
                'Обеды и ужины',
                'Входные билеты в музеи (опционально)'
            ],
            program: [
                'День 1: Прибытие в Рим, обзорная экскурсия',
                'День 2: Колизей, Римский форум, Ватикан',
                'День 3: Переезд во Флоренцию, экскурсия',
                'День 4: Пиза, Венеция',
                'День 5: Возвращение в Рим, вылет'
            ]
        },
        '3': {
            id: 3,
            title: 'Бали',
            description: 'Йога-тур и духовные практики',
            longDescription: 'Бали — остров богов, уникальное место силы и гармонии, где индуистская культура тесно переплетается с потрясающей природой. Здесь вы сможете восстановить душевное равновесие, занимаясь йогой на рассвете прямо на берегу океана, медитировать под шум волн, посетить древние храмы, спрятанные в джунглях, и увидеть знаменитые рисовые террасы. Этот тур создан для тех, кто ищет не просто отдых, а возможность перезагрузиться, найти внутренний баланс и зарядиться энергией острова. Вас ждут мастер-классы по балийской кухне, спа-процедуры с использованием натуральных масел и знакомство с местными целителями.',
            price: 120000,
            oldPrice: 150000,
            image: baliImage,
            gallery: [
                baliImage,
                'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800',
                'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
                'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800'
            ],
            rating: 4.9,
            reviews: 156,
            nights: 10,
            country: 'Индонезия',
            city: 'Денпасар',
            area: 'Убуд',
            hotelName: 'Four Seasons Resort Bali',
            type: 'Оздоровительный',
            hot: true,
            departureCity: 'Москва',
            mealType: 'Завтраки',
            included: [
                'Перелет Москва-Денпасар-Москва',
                'Трансфер',
                'Проживание в отеле 4*',
                'Страховка',
                'Ежедневные занятия йогой',
                'Завтраки'
            ],
            notIncluded: [
                'Виза (оформляется по прилету)',
                'Экскурсии',
                'Дополнительные спа-процедуры'
            ],
            program: [
                'День 1: Прибытие, заселение',
                'День 2: Йога на рассвете, храм Танах Лот',
                'День 3: Медитация, водопады',
                'День 4: Йога, рисовые террасы',
                'День 5: Свободный день, спа',
                'День 6: Йога, храм Улувату',
                'День 7: Мастер-класс по балийской кухне',
                'День 8: Йога, экскурсия на вулкан',
                'День 9: Прощальная церемония',
                'День 10: Вылет'
            ]
        },
        '4': {
            id: 4,
            title: 'Египет',
            description: 'Тайны пирамид и отдых на Красном море',
            longDescription: 'Египет — страна фараонов, величественных пирамид и загадок, манящая путешественников со всего мира. Вы прикоснетесь к истории, увидев знаменитые пирамиды Гизы и загадочного Сфинкса, прогуляетесь по шумным и колоритным базарам Кара, где можно купить специи, золото и знаменитые кальяны. А после экскурсий вас ждет роскошный отдых на курортах Красного моря — Хургаде или Шарм-эль-Шейхе. Кристально чистая вода, богатейший подводный мир (мечта дайверов!), коралловые рифы и золотистые пески подарят вам незабываемый отпуск.',
            price: 85000,
            oldPrice: 110000,
            image: egyptImage,
            rating: 4.6,
            reviews: 203,
            nights: 8,
            country: 'Египет',
            city: 'Каир',
            area: 'Гиза',
            hotelName: 'Four Seasons Cairo',
            type: 'Пляжный',
            hot: true,
            departureCity: 'Москва',
            mealType: 'Все включено',
            included: [
                'Перелет Москва-Каир-Москва',
                'Трансфер',
                'Проживание в отеле 5*',
                'Страховка',
                'Питание по системе "Все включено"',
                'Экскурсия к пирамидам'
            ],
            notIncluded: [
                'Виза (25$ при въезде)',
                'Дополнительные экскурсии',
                'Личные расходы'
            ],
            program: [
                'День 1: Прибытие в Каир, трансфер в отель',
                'День 2: Экскурсия к пирамидам Гизы и Сфинксу',
                'День 3: Перелет в Хургаду, заселение',
                'День 4-7: Отдых на море, дайвинг, снорклинг',
                'День 8: Вылет из Хургады'
            ]
        },
        '5': {
            id: 5,
            title: 'Турция',
            description: 'Всё включено для всей семьи',
            longDescription: 'Турция — идеальное направление для семейного отдыха и не только. Здесь вас ждут прекрасные песчаные пляжи с пологим входом в море, развитая инфраструктура, анимация для детей и взрослых, а также знаменитая система "все включено", которая избавит вас от лишних забот. Вы сможете посетить древние города и античные руины, покупаться в термальных источниках Памуккале, отправиться на шопинг в Стамбул или просто наслаждаться солнцем и морем в Анталье, Кемере или Белеке. Гостеприимство местных жителей и богатая турецкая кухня никого не оставят равнодушным.',
            price: 65000,
            oldPrice: 90000,
            image: turkeyImage,
            rating: 4.5,
            reviews: 312,
            nights: 7,
            country: 'Турция',
            city: 'Анталья',
            area: 'Кемер',
            hotelName: 'Rixos Sungate',
            type: 'Пляжный',
            hot: true,
            departureCity: 'Москва',
            mealType: 'Все включено',
            included: [
                'Перелет Москва-Анталья-Москва',
                'Трансфер',
                'Проживание в отеле 5*',
                'Страховка',
                'Питание по системе "Все включено"',
                'Анимация'
            ],
            notIncluded: [
                'Экскурсии',
                'Спа-услуги',
                'Личные расходы'
            ],
            program: [
                'День 1: Прибытие, заселение',
                'День 2-6: Пляжный отдых, аквапарк, экскурсии (опционально)',
                'День 7: Вылет'
            ]
        },
        '6': {
            id: 6,
            title: 'Греция',
            description: 'Острова и античная культура',
            longDescription: 'Греция — колыбель европейской цивилизации, страна, где античные мифы оживают на каждом шагу. Здесь древние руины соседствуют с живописными островами, где белоснежные домики с синими куполами спускаются к бирюзовому морю. Вы посетите величественный Акрополь в Афинах, прогуляетесь по узким улочкам Санторини с потрясающим видом на кальдеру, отведаете свежайшие морепродукты и знаменитую греческую мусаку. Греция — это место, где история, культура и пляжный отдых сливаются воедино, даря незабываемые впечатления.',
            price: 115000,
            oldPrice: 145000,
            image: greeceImage,
            rating: 4.8,
            reviews: 167,
            nights: 7,
            country: 'Греция',
            city: 'Афины',
            area: 'Санторини',
            hotelName: 'Canaves Oia Suites',
            type: 'Экскурсионный',
            hot: false,
            departureCity: 'Москва',
            mealType: 'Завтраки',
            included: [
                'Перелет Москва-Афины-Москва',
                'Паром Афины-Санторини',
                'Проживание в отелях 4*',
                'Страховка',
                'Завтраки',
                'Экскурсия по Афинам'
            ],
            notIncluded: [
                'Шенгенская виза',
                'Обеды и ужины',
                'Экскурсии на островах'
            ],
            program: [
                'День 1: Прибытие в Афины, обзорная экскурсия',
                'День 2: Паром на Санторини, заселение',
                'День 3-5: Отдых на Санторини, экскурсии (опционально)',
                'День 6: Возвращение в Афины',
                'День 7: Вылет'
            ]
        },
        '7': {
            id: 7,
            title: 'Таиланд',
            description: 'Экзотика и джунгли',
            longDescription: 'Таиланд — страна улыбок, яркая и контрастная, манящая своей экзотикой. Вас ждут белоснежные пляжи Пхукета и Краби, окруженные известняковыми скалами, бирюзовая вода Андаманского моря, тропические джунгли с водопадами и экзотическими животными. Вы сможете покататься на слонах, посетить древние буддийские храмы с золотыми статуями, отведать невероятно вкусную и острую тайскую кухню прямо на уличных рынках и увидеть знаменитое шоу трансвеститов. Таиланд подарит вам заряд энергии и массу ярких эмоций.',
            price: 135000,
            oldPrice: 170000,
            image: thailandImage,
            rating: 4.7,
            reviews: 189,
            nights: 10,
            country: 'Таиланд',
            city: 'Бангкок',
            area: 'Пхукет',
            hotelName: 'Banyan Tree Phuket',
            type: 'Экзотический',
            hot: true,
            departureCity: 'Москва',
            mealType: 'Завтраки',
            included: [
                'Перелет Москва-Пхукет-Москва',
                'Трансфер',
                'Проживание в отеле 5*',
                'Страховка',
                'Завтраки'
            ],
            notIncluded: [
                'Виза (оформляется по прилету)',
                'Экскурсии',
                'Обеды и ужины'
            ],
            program: [
                'День 1: Прибытие в Пхукет, заселение',
                'День 2-9: Пляжный отдых, экскурсии на острова, дайвинг',
                'День 10: Вылет'
            ]
        },
        '8': {
            id: 8,
            title: 'ОАЭ',
            description: 'Роскошь и небоскрёбы',
            longDescription: 'Объединенные Арабские Эмираты — страна контрастов и ультрасовременной роскоши. Здесь древние традиции бедуинов соседствуют с футуристическими небоскребами. Вы подниметесь на знаменитый Бурдж-Халифа — самое высокое здание в мире, увидите потрясающее шоу фонтанов, посетите роскошные торговые центры с аквариумами и отелями 7 звезд. Для любителей активного отдыха — сафари на джипах по золотым дюнам пустыни, катание на верблюдах и ужин в бедуинской деревне. ОАЭ — это место, где можно почувствовать себя шейхом.',
            price: 155000,
            oldPrice: 190000,
            image: uaeImage,
            rating: 4.9,
            reviews: 145,
            nights: 6,
            country: 'ОАЭ',
            city: 'Дубай',
            area: 'Jumeirah',
            hotelName: 'Burj Al Arab',
            type: 'Шопинг',
            hot: true,
            departureCity: 'Москва',
            mealType: 'Завтраки',
            included: [
                'Перелет Москва-Дубай-Москва',
                'Трансфер',
                'Проживание в отеле 5*',
                'Страховка',
                'Завтраки'
            ],
            notIncluded: [
                'Виза (оформляется)',
                'Экскурсии',
                'Обеды и ужины'
            ],
            program: [
                'День 1: Прибытие в Дубай, заселение',
                'День 2: Обзорная экскурсия, Бурдж-Халифа',
                'День 3: Сафари по пустыне',
                'День 4: Шопинг в Dubai Mall',
                'День 5: Пляжный отдых или Абу-Даби',
                'День 6: Вылет'
            ]
        },
        '9': {
            id: 9,
            title: 'Япония',
            description: 'Цветущая сакура и традиции',
            longDescription: 'Япония — страна восходящего солнца, где древние традиции гармонично переплетаются с самыми современными технологиями. В период цветения сакуры страна превращается в настоящую сказку — парки и улицы утопают в нежно-розовых лепестках. Вы посетите древние храмы Киото и Нары, где живут ручные олени, прогуляетесь по футуристическому Токио с его неоновыми вывесками и небоскребами, увидите величественную гору Фудзи и попробуете настоящие суши и саке. Япония — это путешествие в другой мир, полное загадок и открытий.',
            price: 210000,
            oldPrice: 250000,
            image: japanImage,
            rating: 4.9,
            reviews: 92,
            nights: 8,
            country: 'Япония',
            city: 'Токио',
            type: 'Экскурсионный',
            hot: false,
            departureCity: 'Москва',
            mealType: 'Завтраки',
            included: [
                'Перелет Москва-Токио-Москва',
                'Трансфер',
                'Проживание в отелях 3-4*',
                'Страховка',
                'Завтраки',
                'JR Pass на 7 дней'
            ],
            notIncluded: [
                'Японская виза',
                'Обеды и ужины',
                'Входные билеты'
            ],
            program: [
                'День 1: Прибытие в Токио',
                'День 2-3: Токио: императорский дворец, Акихабара, Сибуя',
                'День 4-5: Киото: храмы и сады',
                'День 6: Нара и Осака',
                'День 7: Гора Фудзи',
                'День 8: Вылет'
            ]
        },
        '10': {
            id: 10,
            title: 'Франция',
            description: 'Романтика Парижа и замки Луары',
            longDescription: 'Франция — страна любви, изысканной кухни и великой истории. Париж встретит вас Эйфелевой башней, Лувром с его бесценными сокровищами (включая Мону Лизу) и романтичными улочками Монмартра. Вы проплывете на кораблике по Сене, увидите Нотр-Дам и Елисейские поля. А за пределами столицы вас ждут великолепные замки Луары — Шамбор, Шенонсо и другие, которые перенесут вас в эпоху королей и королев. Франция — это также знаменитые вина Бордо и Бургундии, сыры и круассаны, лавандовые поля Прованса и роскошные курорты Лазурного берега.',
            price: 175000,
            oldPrice: 215000,
            image: franceImage,
            rating: 4.8,
            reviews: 178,
            nights: 6,
            country: 'Франция',
            city: 'Париж',
            type: 'Романтический',
            hot: false,
            departureCity: 'Москва',
            mealType: 'Завтраки',
            included: [
                'Перелет Москва-Париж-Москва',
                'Трансфер',
                'Проживание в отеле 4*',
                'Страховка',
                'Завтраки',
                'Экскурсия в Версаль'
            ],
            notIncluded: [
                'Шенгенская виза',
                'Обеды и ужины',
                'Экскурсии в замки Луары'
            ],
            program: [
                'День 1: Прибытие в Париж, заселение',
                'День 2: Эйфелева башня, Лувр, круиз по Сене',
                'День 3: Версаль',
                'День 4: Экскурсия в замки Луары',
                'День 5: Монмартр, свободный день',
                'День 6: Вылет'
            ]
        }
    };

    useEffect(() => {
        setLoading(true);
        
        // Имитация загрузки данных
        setTimeout(() => {
            if (id && toursDatabase[id]) {
                setTour(toursDatabase[id]);
            } else {
                // Тур не найден, перенаправляем на 404
                navigate('/404');
            }
            setLoading(false);
        }, 300);
    }, [id, navigate]);

    const formatPrice = (price: number) => {
        return price.toLocaleString('ru-RU') + ' ₽';
    };

    const handleBooking = () => {
        alert(`Спасибо за интерес к туру "${tour?.title}"! Мы свяжемся с вами в ближайшее время.`);
    };

    if (loading) {
        return (
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '60px 20px',
                textAlign: 'center'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '20px',
                    animation: 'pulse 1.5s infinite'
                }}>🐪</div>
                <style>{`
                    @keyframes pulse {
                        0% { opacity: 0.6; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.1); }
                        100% { opacity: 0.6; transform: scale(1); }
                    }
                `}</style>
                <h2 style={{ color: '#8B5A2B' }}>Загрузка информации о туре...</h2>
            </div>
        );
    }

    if (!tour) {
        return null; // Будет перенаправлено на 404
    }

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px'
        }}>
            {/* Хлебные крошки */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#8B5A2B',
                flexWrap: 'wrap'
            }}>
                <Link to="/" style={{ color: '#B76E3C', textDecoration: 'none' }}>Главная</Link>
                <span>/</span>
                <Link to="/catalog" style={{ color: '#B76E3C', textDecoration: 'none' }}>Каталог</Link>
                <span>/</span>
                <span>{tour.title}</span>
            </div>

            {/* Основной контент */}
            <div style={{
                background: 'rgba(255, 248, 240, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '40px',
                padding: '40px',
                boxShadow: '0 20px 40px rgba(139, 69, 19, 0.15)',
                border: '2px solid #C0A080'
            }}>
                {/* Заголовок и навигация */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '42px',
                            color: '#8B5A2B',
                            marginBottom: '5px'
                        }}>
                            {tour.title}
                        </h1>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ color: '#B76E3C' }}>📍 {tour.country}, {tour.city}{tour.area ? `, ${tour.area}` : ''}</span>
                            <span style={{ color: '#B76E3C' }}>•</span>
                            <span style={{ color: '#B76E3C' }}>⭐ {tour.rating} ({tour.reviews} отзывов)</span>
                            <span style={{ color: '#B76E3C' }}>•</span>
                            <span style={{ color: '#B76E3C' }}>🏷️ {tour.type}</span>
                        </div>
                    </div>
                    {tour.hot && (
                        <div style={{
                            background: '#B76E3C',
                            color: '#FFF8F0',
                            padding: '8px 20px',
                            borderRadius: '30px',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            🔥 Горящий тур
                        </div>
                    )}
                </div>

                {/* Изображение */}
                <div style={{ marginBottom: '30px' }}>
                    <div style={{
                        width: '100%',
                        height: '400px',
                        borderRadius: '20px',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={tour.image}
                            alt={tour.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </div>

                {/* Две колонки: описание и бронирование */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 350px',
                    gap: '40px'
                }}>
                    {/* Левая колонка - описание */}
                    <div>
                        <section style={{ marginBottom: '30px' }}>
                            <h2 style={{
                                fontSize: '24px',
                                color: '#8B5A2B',
                                marginBottom: '15px',
                                fontFamily: "'Cormorant Garamond', serif",
                                borderBottom: '2px solid #D2B48C',
                                paddingBottom: '8px'
                            }}>
                                📝 Описание тура
                            </h2>
                            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#5A3E2B' }}>
                                {tour.longDescription || tour.description}
                            </p>
                        </section>

                        {tour.included && (
                            <section style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '24px',
                                    color: '#8B5A2B',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '8px'
                                }}>
                                    ✅ В стоимость включено
                                </h2>
                                <ul style={{ color: '#5A3E2B', lineHeight: '1.8' }}>
                                    {tour.included.map((item, index) => (
                                        <li key={index} style={{ marginBottom: '8px' }}>✓ {item}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {tour.notIncluded && (
                            <section style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '24px',
                                    color: '#8B5A2B',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '8px'
                                }}>
                                    ❌ Дополнительно оплачивается
                                </h2>
                                <ul style={{ color: '#5A3E2B', lineHeight: '1.8' }}>
                                    {tour.notIncluded.map((item, index) => (
                                        <li key={index} style={{ marginBottom: '8px' }}>✗ {item}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {tour.program && (
                            <section>
                                <h2 style={{
                                    fontSize: '24px',
                                    color: '#8B5A2B',
                                    marginBottom: '15px',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    borderBottom: '2px solid #D2B48C',
                                    paddingBottom: '8px'
                                }}>
                                    📅 Программа тура
                                </h2>
                                <ul style={{ color: '#5A3E2B', lineHeight: '1.8' }}>
                                    {tour.program.map((day, index) => (
                                        <li key={index} style={{ marginBottom: '8px' }}>• {day}</li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Правая колонка - бронирование */}
                    <div>
                        <div style={{
                            background: '#FFF8F0',
                            borderRadius: '20px',
                            padding: '25px',
                            border: '2px solid #D2B48C',
                            position: 'sticky',
                            top: '90px'
                        }}>
                            <h3 style={{
                                fontSize: '22px',
                                color: '#8B5A2B',
                                marginBottom: '20px',
                                fontFamily: "'Cormorant Garamond', serif",
                                textAlign: 'center'
                            }}>
                                Забронировать тур
                            </h3>

                            {/* Цена */}
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                {tour.oldPrice && (
                                    <span style={{
                                        color: '#B76E3C',
                                        fontSize: '16px',
                                        textDecoration: 'line-through',
                                        marginRight: '10px'
                                    }}>
                                        {formatPrice(tour.oldPrice)}
                                    </span>
                                )}
                                <span style={{
                                    fontSize: '36px',
                                    fontWeight: '700',
                                    color: '#8B5A2B'
                                }}>
                                    {formatPrice(tour.price)}
                                </span>
                                <div style={{ color: '#B76E3C', fontSize: '14px', marginTop: '5px' }}>
                                    за {tour.nights} ночей
                                </div>
                            </div>

                            {/* Выбор даты */}
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{
                                    display: 'block',
                                    color: '#8B5A2B',
                                    fontSize: '14px',
                                    marginBottom: '5px'
                                }}>
                                    📅 Дата вылета
                                </label>
                                <select
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '2px solid #D2B48C',
                                        borderRadius: '10px',
                                        backgroundColor: '#FFF8F0',
                                        color: '#8B5A2B',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="">Выберите дату</option>
                                    <option value="2026-03-15">15 марта 2026</option>
                                    <option value="2026-03-22">22 марта 2026</option>
                                    <option value="2026-04-01">1 апреля 2026</option>
                                </select>
                            </div>

                            {/* Количество туристов */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    color: '#8B5A2B',
                                    fontSize: '14px',
                                    marginBottom: '5px'
                                }}>
                                    👥 Количество туристов
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        onClick={() => setTourists(Math.max(1, tourists - 1))}
                                        style={{
                                            width: '35px',
                                            height: '35px',
                                            borderRadius: '50%',
                                            border: '2px solid #D2B48C',
                                            background: 'transparent',
                                            color: '#8B5A2B',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        −
                                    </button>
                                    <span style={{ flex: 1, textAlign: 'center', color: '#8B5A2B' }}>
                                        {tourists}
                                    </span>
                                    <button
                                        onClick={() => setTourists(tourists + 1)}
                                        style={{
                                            width: '35px',
                                            height: '35px',
                                            borderRadius: '50%',
                                            border: '2px solid #D2B48C',
                                            background: 'transparent',
                                            color: '#8B5A2B',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Информация о туре */}
                            <div style={{
                                background: '#F0E5D5',
                                borderRadius: '15px',
                                padding: '15px',
                                marginBottom: '20px'
                            }}>
                                {tour.departureCity && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: '#8B5A2B' }}>✈️ Вылет из:</span>
                                        <span style={{ color: '#B76E3C' }}>{tour.departureCity}</span>
                                    </div>
                                )}
                                {tour.hotelName && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ color: '#8B5A2B' }}>🏨 Отель:</span>
                                        <span style={{ color: '#B76E3C' }}>{tour.hotelName}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#8B5A2B' }}>🌙 Ночей:</span>
                                    <span style={{ color: '#B76E3C' }}>{tour.nights}</span>
                                </div>
                                {tour.mealType && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#8B5A2B' }}>🍽️ Питание:</span>
                                        <span style={{ color: '#B76E3C' }}>{tour.mealType}</span>
                                    </div>
                                )}
                            </div>

                            {/* Кнопка бронирования */}
                            <button
                                onClick={handleBooking}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: 'linear-gradient(135deg, #B76E3C, #8B5A2B)',
                                    color: '#FFF8F0',
                                    border: '2px solid #D2B48C',
                                    borderRadius: '30px',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                Забронировать
                            </button>

                            {/* Дополнительная информация */}
                            <p style={{
                                textAlign: 'center',
                                fontSize: '12px',
                                color: '#B76E3C',
                                marginTop: '15px'
                            }}>
                                Бесплатная отмена за 14 дней до вылета
                            </p>
                        </div>
                    </div>
                </div>

                {/* Кнопка "Вернуться к каталогу" */}
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Link to="/catalog">
                        <button style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            color: '#8B5A2B',
                            border: '2px solid #C0A080',
                            borderRadius: '30px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(192, 160, 128, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}>
                            ← Вернуться в каталог
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export { TourPage };