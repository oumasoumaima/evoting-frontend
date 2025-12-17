import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Vote, BarChart2, ShieldCheck, Globe, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 lg:py-48">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="container relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Système de Vote Sécurisé 2025
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
              Le Futur de la <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                Participation Citoyenne
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Une plateforme de vote électronique de nouvelle génération.
              Garantissant l'intégrité, la transparence et l'accessibilité pour chaque électeur.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300">
                  Commencer l'inscription
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/vote">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Accéder à l'espace de vote
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={item}>
            <Link to="/register" className="block h-full group">
              <div className="glass-panel h-full p-8 rounded-3xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 border-t-4 border-t-blue-500">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Inscription Rapide</h3>
                <p className="text-slate-300 leading-relaxed">
                  Vérification d'identité instantanée via CNI. Processus sécurisé et conforme aux normes gouvernementales.
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link to="/vote" className="block h-full group">
              <div className="glass-panel h-full p-8 rounded-3xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 border-t-4 border-t-emerald-500">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                  <Vote className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Vote Sécurisé</h3>
                <p className="text-slate-300 leading-relaxed">
                  Interface de vote intuitive et confidentielle. Chiffrement de bout en bout de votre bulletin.
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={item}>
            <Link to="/results" className="block h-full group">
              <div className="glass-panel h-full p-8 rounded-3xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 border-t-4 border-t-purple-500">
                <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                  <BarChart2 className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Résultats Live</h3>
                <p className="text-slate-300 leading-relaxed">
                  Transparence totale avec visualisation des résultats en temps réel. Données immutables.
                </p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex flex-col items-center gap-3 text-center">
              <ShieldCheck className="h-12 w-12 text-blue-600" />
              <span className="font-semibold text-lg">Cryptage Militaire</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <Globe className="h-12 w-12 text-indigo-600" />
              <span className="font-semibold text-lg">Accessible Partout</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              <span className="font-semibold text-lg">Audit en Temps Réel</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

