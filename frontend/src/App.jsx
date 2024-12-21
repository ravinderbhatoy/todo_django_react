import './App.css'
import React from 'react'
import TodoPage from './pages/TodoPage'
import {BrowserRouter, Route, Routes} from 'react-router'
import Login from './pages/Login'
import { AuthProvider } from './context/AuthContext'


function App() {


  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route Component={TodoPage} path="/" exact />
          <Route Component={Login} path="/login" />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App