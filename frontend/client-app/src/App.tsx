import React from 'react';
import './App.css';
import NavBar from './Components/NavBar';
import { Route, Routes } from 'react-router-dom';
import MainPage from './Components/MainPage';
import { NotFound } from './Components/NotFound';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;