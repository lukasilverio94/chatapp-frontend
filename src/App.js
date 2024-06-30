import React, { useState, useContext } from 'react';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './components/RegisterForm/RegisterForm.js';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import LoginPage from './components/auth/LoginForm';
import MeetUpChat from './components/MeetUpChat';


import './App.css';

export const AuthContext = React.createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
    console.log('User logged in');
  };

  const logout = () => {
    setIsLoggedIn(false);
    console.log('User logged out');
  };

  console.log('Rendering App component');

  return (
    <Provider store={store}>
      <Router>
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
          <div className="App">
            <Routes>
              <Route path="/" element={<MeetUpChat />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
            </Routes>
          </div>
        </AuthContext.Provider>
      </Router>
    </Provider>
  );
}

export default App;
