import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContextProvider } from './context.js';
import './styles/global.css';

import Home from './pages/home.jsx';
import LandingPage from './pages/landing.jsx';
import Profile from './pages/profile.jsx';
import RegisterGame from './pages/registerGame.jsx';
import SignUpForm from './pages/signupForm.jsx';
import SingleGame from './pages/singleGame.jsx';
import SubmitReview from './pages/submitReview.jsx';

const App = () => {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/hello" element={<LandingPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register-game" element={<RegisterGame />} />
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/games/:id" element={<SingleGame />} />
            <Route path="/games/:id/submit-review" element={<SubmitReview />} />
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
