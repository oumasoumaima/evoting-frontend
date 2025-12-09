import React, { useState } from 'react';
import { voterService } from '../services/api';
import './RegisterPage.css';

function VoterRegistration() {
  const [formData, setFormData] = useState({
    cin: '',
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    address: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const voter = {
        ...formData,
        hasVoted: false,
        isActive: true
      };

      await voterService.register(voter);
      setMessage({
        type: 'success',
        text: `✅ Inscription réussie ! Bienvenue ${formData.firstName} ${formData.lastName}`
      });

      // Réinitialiser le formulaire
      setFormData({
        cin: '',
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        address: ''
      });
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response?.data?.message?.includes('Unique index') ||
          error.response?.data?.message?.includes('constraint')) {
        setMessage({
          type: 'error',
          text: `❌ Ce CIN (${formData.cin}) est déjà enregistré. Veuillez utiliser un autre CIN.`
        });
      } else {
        const errorMsg = error.response?.data?.message || error.message || 'Erreur lors de l\'inscription';
        setMessage({ type: 'error', text: `❌ ${errorMsg}` });
      }
    }
  };

  return (
      <div className="register-page">
        <h2>Inscription Électeur</h2>

        {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
              type="text"
              name="cin"
              placeholder="CIN (ex: AB123456)"
              value={formData.cin}
              onChange={handleChange}
              required
              pattern="[A-Z]{2}[0-9]{6}"
              title="Format: 2 lettres majuscules suivies de 6 chiffres (ex: AB123456)"
          />
          <input
              type="text"
              name="firstName"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={handleChange}
              required
          />
          <input
              type="text"
              name="lastName"
              placeholder="Nom"
              value={formData.lastName}
              onChange={handleChange}
              required
          />
          <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
          />
          <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              title="Vous devez avoir au moins 18 ans"
          />
          <input
              type="text"
              name="address"
              placeholder="Adresse"
              value={formData.address}
              onChange={handleChange}
              required
          />
          <button type="submit">S'inscrire</button>
        </form>
      </div>
  );
}

export default VoterRegistration;