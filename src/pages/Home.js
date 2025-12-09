import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Système de Vote Électronique</h1>
        <p className="text-xl text-gray-600">
          Plateforme de vote électronique
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <Link to="/register" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
          <div className="text-4xl mb-4">👤</div>
          <h2 className="text-2xl font-bold mb-2">Inscription</h2>
          <p className="text-gray-600">
            Inscrivez-vous comme électeur pour participer aux élections
          </p>
        </Link>

        <Link to="/vote" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
          <div className="text-4xl mb-4">🗳️</div>
          <h2 className="text-2xl font-bold mb-2">Voter</h2>
          <p className="text-gray-600">
            Exercez votre droit de vote en toute sécurité
          </p>
        </Link>

        <Link to="/results" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2">Résultats</h2>
          <p className="text-gray-600">
            Consultez les résultats en temps réel
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
