import { Provider } from 'react-redux';
import store from './store/store.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

import Register from './components/RegisterForm/RegisterForm.js';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import LoginPage from './components/auth/LoginForm'; // Assuming you have a Login component
import Home from './components/HomePage';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/login" element={<LoginPage />} />{' '}
            <Route path="/home" element={<Home />} />
            {/* Adding a login route */}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
