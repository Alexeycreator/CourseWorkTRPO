import { Route, Routes } from 'react-router-dom'; 
import NavBar from './Components/NavBar';
import MainPage from './Components/MainPage';
import { CatalogToursPage } from './Pages/CatalogToursPage';
import { ClientAccountPage } from './Pages/ClientAccountPage';
import { HelpPage } from './Pages/HelpPage';
import { HotTourPage } from './Pages/HotTourPage';
import { InformationPage } from './Pages/InformationPage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { TourPage } from './Pages/TourPage';

function App() {
    return (
        <>
            <NavBar />
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
                
                {/* Страница 404 - должна быть последней */}
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;