import { Provider } from "react-redux";
import store from "./store/store.js";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Register from "./components/RegisterForm/RegisterForm.js";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
