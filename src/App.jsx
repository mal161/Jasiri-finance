import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import AddIncome from './pages/AddIncome';
import AddExpense from './pages/AddExpense';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page w-full h-full">
      <Routes location={location}>
        <Route path='/' element={<Navigate to='/signin' />}/>
        <Route path='/register' element={<ProtectedRoute element={<Register/>} requireAuth={false} />}/>
        <Route path='/signin' element={<ProtectedRoute element={<Signin/>} requireAuth={false} />}/>
        <Route path='/forgot-password' element={<ProtectedRoute element={<ForgotPassword/>} requireAuth={false} />}/>
        <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard/>} />}/>
        <Route path='/income' element={<ProtectedRoute element={<AddIncome/>} />}/>
        <Route path='/expense' element={<ProtectedRoute element={<AddExpense/>} />}/>
        <Route path='/profile' element={<ProtectedRoute element={<Profile/>} />}/>
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  )
}

export default App
