import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import VoterRegistration from './pages/VoterRegistration';
import VotePage from './pages/VotePage';
import Results from './pages/Results';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">🗳️ E-Voting System</h1>
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Accueil</Link>
              <Link to="/register" className="hover:underline">Inscription</Link>
              <Link to="/vote" className="hover:underline">Voter</Link>
              <Link to="/results" className="hover:underline">Résultats</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<VoterRegistration />} />
          <Route path="/vote" element={<VotePage />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
