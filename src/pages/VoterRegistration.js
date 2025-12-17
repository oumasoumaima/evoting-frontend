import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { voterService } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck, UserPlus } from 'lucide-react';

function VoterRegistration() {
  const [formData, setFormData] = useState({
    cin: '',
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    address: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
        text: `Inscription réussie ! Bienvenue ${formData.firstName}. Redirection vers le vote...`
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

      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/vote');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message?.includes('Unique index') ||
        error.response?.data?.message?.includes('constraint')) {
        setMessage({
          type: 'error',
          text: `Ce CIN est déjà enregistré.`
        });
      } else {
        const errorMsg = error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.';
        setMessage({ type: 'error', text: errorMsg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">

        {/* Left Side - Visuals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col space-y-8 p-8"
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
              Rejoignez la <br />
              <span className="text-blue-400">Démocratie Numérique</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-md">
              Inscrivez-vous en quelques minutes pour participer aux futures élections. Votre identité est protégée par les standards de sécurité les plus stricts.
            </p>
          </div>

          <div className="grid gap-6">
            {[
              { title: "Vérification Identité", desc: "Contrôle automatique du CIN" },
              { title: "Accès Sécurisé", desc: "Authentification forte" },
              { title: "Vote Confidential", desc: "Anonymat garanti" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 backdrop-blur-sm"
              >
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-panel border-none shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-blue-500" />
                Créer un compte électeur
              </CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous avec vos informations exactes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium border shadow-sm ${message.type === 'success'
                    ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200'
                    : 'bg-red-50/80 text-red-900 border-red-200'
                    }`}
                >
                  {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
                  {message.text}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="cin" className="text-white">Numéro CIN</Label>
                  <Input
                    id="cin"
                    name="cin"
                    placeholder="Ex: AB123456"
                    value={formData.cin}
                    onChange={handleChange}
                    required
                    pattern="[A-Z]{2}[0-9]{6}"
                    title="2 lettres majuscules suivies de 6 chiffres"
                    className="glass-input h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Jean"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="glass-input h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Dupont"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="glass-input h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="jean.dupont@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="glass-input h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-white">Date de naissance</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    className="glass-input h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white">Adresse</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Adresse complète"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="glass-input h-11"
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold mt-6 shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    "Confirmer l'inscription"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center bg-slate-50/50 dark:bg-black/10 py-4 mt-2">
              <p className="text-xs text-muted-foreground text-center">
                Données chiffrées et sécurisées.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default VoterRegistration;
