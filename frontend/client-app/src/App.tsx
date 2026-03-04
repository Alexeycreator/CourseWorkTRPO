import { Route, Routes } from 'react-router-dom'; 
import NavBar from './Components/NavBar';
import Footer from './Components/Footer'; 
import MainPage from './Components/MainPage';
import { CatalogToursPage } from './Pages/CatalogToursPage';
import { ClientAccountPage } from './Pages/ClientAccountPage';
import { HelpPage } from './Pages/HelpPage';
import { HotTourPage } from './Pages/HotTourPage';
import { InformationPage } from './Pages/InformationPage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { TourPage } from './Pages/TourPage';
import PrivacyTermsPage from './Pages/PrivacyTermsPage';

function App() {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F5F0E5 0%, #F0E5D5 50%, #E5D5C5 100%)'
        }}>
            <NavBar />
            <div style={{ 
                flex: '1 0 auto',
                width: '100%'
            }}>
                <Routes>
                    {/* Главная страница */}
                    <Route path='/' element={<MainPage />} />
                    
                    {/* Каталог туров */}
                    <Route path='/catalog' element={<CatalogToursPage />} />
                    
                    {/* Горящие туры */}
                    <Route path='/hot-tours' element={<HotTourPage />} />
                    
                    {/* Информация */}
                    <Route path='/information' element={<InformationPage />} />
                    
                    {/* Помощь */}
                    <Route path='/help' element={<HelpPage />} />
                    
                    {/* Личный кабинет */}
                    <Route path='/account' element={<ClientAccountPage />} />
                    
                    {/* Детальная страница тура с параметром */}
                    <Route path='/tour/:id' element={<TourPage />} />

                    <Route path='/legal' element={<PrivacyTermsPage />} />
                    
                    {/* Страница 404 - должна быть последней */}
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;