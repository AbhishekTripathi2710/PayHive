import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
