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
            <div style={{ flex: '1 0 auto', width: '100%' }}>
                <Routes>
                    <Route path='/' element={<MainPage />} />
                    <Route path='/catalog' element={<CatalogToursPage />} />
                    <Route path='/hot-tours' element={<HotTourPage />} />
                    <Route path='/information' element={<InformationPage />} />
                    <Route path='/help' element={<HelpPage />} />
                    <Route path='/account' element={<ClientAccountPage />} />
                    <Route path='/catalog/tour/:id' element={<TourPage />} />
                    <Route path='/hot-tours/tour/:id' element={<TourPage />} /> {/* Динамический маршрут */}
                    <Route path='/legal' element={<PrivacyTermsPage />} />
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;