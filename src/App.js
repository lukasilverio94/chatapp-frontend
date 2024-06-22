import { Provider } from "react-redux";
import store from "./store/store.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Register from "./components/RegisterForm/RegisterForm.js";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import LoginPage from "./components/auth/LoginForm";
import Home from "./components/HomePage";
import ChatRoomListCreateComponent from "./components/ChatRoomListCreateComponent"; // Correct the path

import ChatRoomWrapper from "./components/ChatRoomWrapper"; // Correct the path
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/chatrooms"
              element={<ChatRoomListCreateComponent />}
            />
            <Route path="/chatroom/:roomId" element={<ChatRoomWrapper />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
