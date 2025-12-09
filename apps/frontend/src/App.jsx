import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Vérifier si l'utilisateur est connecté en essayant de récupérer ses publications
      const response = await axios.get('/api/publications');
      if (response.data.success) {
        // L'utilisateur est connecté
        setUser({ authenticated: true });
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-gray-900">Chargement...</div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <Signup setUser={setUser} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <Dashboard user={user} setUser={setUser} />
          } 
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;

