import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import{ BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login.jsx'
import Register from './Register.jsx'
import PrivateRoute from './PrivateRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Dashboard from './Dashboard.jsx'
import NotFound from './NotFound.jsx' 

if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      },
      (err) => {
        console.log('Service Worker registration failed:', err);
      }
    );
  });
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <PrivateRoute> <App /> </PrivateRoute> } /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={ <PrivateRoute> <Dashboard /> </PrivateRoute> } />
          
          <Route path="*" element={<NotFound />} />
     
      </Routes>
    </BrowserRouter>

    </AuthProvider>
    
  
  </StrictMode>,
)
