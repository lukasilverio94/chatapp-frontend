// src/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Adjust this to your actual reducer

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here
});

export default rootReducer;
