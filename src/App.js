import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import Home from './pages/Home';
import VoterRegistration from './pages/VoterRegistration';
import VotePage from './pages/VotePage';
import Results from './pages/Results';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<VoterRegistration />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;

