import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContextProvider } from './context.js';
import './styles/global.css';

import Home from './pages/home.jsx';
import Profile from './pages/profile.jsx';
import SignUpForm from './pages/signupForm.jsx';
import SingleGame from './pages/singleGame.jsx';
import LoginForm from './pages/loginForm.jsx';
import SearchAPI from './pages/searchAPI.jsx';


const App = () => {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/games/:id" element={<SingleGame />} />
          <Route path="/search-api" element={<SearchAPI/>} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
