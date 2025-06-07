import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import Login from './Modules/Authentication/Login ';
//import Dashboard from './Modules/Dashboard/Dashboard';
import Home from './pages/Home/Home';

import 'bootstrap/dist/css/bootstrap.css';

import './App.css';
import NotFoundPage from './pages/NotFound';
import MainLayout from './Modules/MainLayout';
import StationSummary from './Modules/Station/StationSummary';
import StationDetails from './Modules/Station/StationDetails';
import Reports from './pages/Reports/Reports';
import ProfileLayout from './pages/ProfileLayout';
import Profile from './Modules/Profile/Profile';
import FaqManulas from './Modules/Profile/FaqManulas';
import Appereance from './Modules/Profile/Appereance';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/station'>
            <Route path='summary' element={<StationSummary />} />
            <Route path='details' element={<StationDetails />} />
          </Route>
          <Route path='/reports' element={<Reports />} />
          <Route path='/profile' element={<ProfileLayout />}>
            <Route index element={<Profile />} />
            <Route path='faq-manuals' element={<FaqManulas />} />
            <Route path='appearance' element={<Appereance />} />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/not-found' />} />
      </Route>
      <Route path='/not-found' element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
