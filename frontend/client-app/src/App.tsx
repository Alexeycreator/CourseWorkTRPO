import React from 'react';
import './App.css';
import NavBar from './Components/NavBar';
import { Route, Routes } from 'react-router-dom';
import MainPage from './Components/MainPage';
import { NotFound } from './Pages/NotFoundPage';
import { TourPage } from './Pages/TourPage';
import { HelpPage } from './Pages/HelpPage';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='*' element={<NotFound />} />
       <Route path='/Tour' element={<TourPage />} /> 
       <Route path='/2' element={<HelpPage />} /> 
      </Routes>
    </>
  );
}

export default App;