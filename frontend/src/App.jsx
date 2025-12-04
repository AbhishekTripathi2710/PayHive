import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Subscriptions from './pages/Subscription'
import Invoices from './pages/Invoices'
import InvoiceDetail from './pages/InvoiceDetail'
import Payments from './pages/Payment'

function Protected({children}){
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login"></Navigate>
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path='/' element={
          <Protected><Navigate to="/dashboard"></Navigate></Protected>
        }></Route>

        <Route path='/dashboard' element={
          <Protected><Dashboard></Dashboard></Protected>
        }></Route>

        <Route path='/subscriptions' element={
          <Protected><Subscriptions></Subscriptions></Protected>
        }></Route>

        <Route path='/invoices' element={
          <Protected><Invoices></Invoices></Protected>
        }></Route>

        <Route path='/invoices/:invoiceId' element={
          <Protected><InvoiceDetail></InvoiceDetail></Protected>
        }></Route>

        <Route path='/payments' element={
          <Protected><Payments></Payments></Protected>
        }></Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
