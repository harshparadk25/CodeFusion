import React from 'react'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Login from '../screens/login';
import Register from '../screens/Register';
 
const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoute;