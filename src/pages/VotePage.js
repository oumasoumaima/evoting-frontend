import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { voteService, voterService } from '../services/api';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Loader2, Check, AlertCircle, CheckCircle2, User, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

function VotePage() {
  const [candidates, setCandidates] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [voters, setVoters] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedProposal, setSelectedProposal] = useState('');
  const [selectedVoter, setSelectedVoter] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [candidatesData, proposalsData, votersData] = await Promise.all([
        voteService.getCandidates(),
        voteService.getProposals(),
        voterService.getEligibleVoters()
      ]);

      setCandidates(candidatesData);
      setProposals(proposalsData);
      setVoters(votersData);

      const activeProposal = proposalsData.find(p => p.active);
      if (activeProposal) {
        setSelectedProposal(activeProposal.id.toString());
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Impossible de charger les données du scrutin.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    if (!selectedVoter || !selectedCandidate || !selectedProposal) {
      setMessage({
        type: 'error',
        text: 'Veuillez compléter tous les champs pour valider votre vote.'
      });
      return;
    }

    setSubmitting(true);
    try {
      await voteService.castVote(
        selectedVoter,
        parseInt(selectedCandidate),
        parseInt(selectedProposal)
      );

      setMessage({ type: 'success', text: 'Votre vote a été enregistré et sécurisé sur la blockchain.' });
      setSelectedVoter('');
      setSelectedCandidate('');

      // Refresh voters list
      const updatedVoters = await voterService.getEligibleVoters();
      setVoters(updatedVoters);
    } catch (error) {
      console.error('Vote error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Erreur technique lors du vote.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const getCandidateInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 relative z-10" />
        </div>
        <span className="text-xl font-medium text-slate-600 dark:text-slate-300 animate-pulse">Préparation de l'isoloir...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-2 backdrop-blur-sm">
          <VoteIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Espace de Vote <span className="text-blue-600">Sécurisé</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Votre voix compte. Sélectionnez votre identité, vérifiez le scrutin en cours, et choisissez votre candidat en toute confidentialité.
        </p>
      </motion.div>

      {/* Configuration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 md:p-8 rounded-3xl max-w-4xl mx-auto"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              Identité de l'électeur
            </Label>
            <Select value={selectedVoter} onValueChange={setSelectedVoter}>
              <SelectTrigger className="h-12 bg-white/50 border-slate-200 focus:ring-blue-500 text-lg">
                <SelectValue placeholder="Qui êtes-vous ?" />
              </SelectTrigger>
              <SelectContent>
                {voters.map((voter) => (
                  <SelectItem key={voter.cin} value={voter.cin} className="cursor-pointer">
                    <span className="font-medium">{voter.firstName} {voter.lastName}</span>
                    <span className="text-muted-foreground text-xs ml-2">({voter.cin})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 pl-1">
              {voters.length > 0 ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {voters.length} électeurs éligibles en attente
                </span>
              ) : (
                "Tous les électeurs ont voté."
              )}
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              Scrutin en cours
            </Label>
            <Select value={selectedProposal} onValueChange={setSelectedProposal} disabled={proposals.length <= 1}>
              <SelectTrigger className="h-12 bg-white/50 border-slate-200 focus:ring-purple-500 text-lg">
                <SelectValue placeholder="Sélectionner le scrutin" />
              </SelectTrigger>
              <SelectContent>
                {proposals.map((proposal) => (
                  <SelectItem key={proposal.id} value={proposal.id.toString()}>
                    {proposal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Message Alert */}
      <AnimatePresence mode="wait">
        {message.text && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-center"
          >
            <div className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-xl border shadow-lg backdrop-blur-md",
              message.type === 'success'
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                : "bg-red-50/90 border-red-200 text-red-800"
            )}>
              {message.type === 'success' ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <AlertCircle className="h-6 w-6 text-red-600" />}
              <span className="font-medium text-lg">{message.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candidates Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold px-1 border-l-4 border-blue-500 pl-4">Liste des Candidats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {candidates.map((candidate) => {
            const isSelected = selectedCandidate === candidate.id.toString();
            return (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCandidate(candidate.id.toString())}
                className="cursor-pointer h-full"
              >
                <div className={cn(
                  "relative h-full p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col gap-4 overflow-hidden group",
                  isSelected
                    ? "bg-blue-600/5 border-blue-500 shadow-xl shadow-blue-500/20"
                    : "bg-white/40 dark:bg-white/5 border-white/20 hover:border-blue-300 hover:shadow-lg backdrop-blur-md"
                )}>
                  {/* Selection Indicator */}
                  <div className={cn(
                    "absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
                    isSelected ? "bg-blue-500 text-white scale-100" : "bg-slate-200 dark:bg-slate-700 text-transparent scale-90 group-hover:scale-100"
                  )}>
                    <Check className="h-5 w-5" />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner transition-colors",
                      isSelected ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    )}>
                      {getCandidateInitials(candidate.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold leading-tight">{candidate.name}</h3>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">{candidate.party}</p>
                    </div>
                  </div>

                  <div className="flex-1 mt-2 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {candidate.program || "Programme non communiqué."}
                  </div>

                  {isSelected && (
                    <motion.div
                      layoutId="outline"
                      className="absolute inset-0 border-2 border-blue-500 rounded-3xl pointer-events-none"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {(selectedCandidate && selectedVoter && selectedProposal) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-2 rounded-full shadow-2xl flex items-center gap-4 pr-3 pl-3">
              <div className="hidden sm:flex flex-col px-4 text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">Prêt à voter ?</span>
                <span className="text-slate-500 text-xs text-nowrap">Action irréversible</span>
              </div>
              <Button
                size="lg"
                className="rounded-full px-8 h-12 text-base shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    Confirmer le vote
                    <CheckCircle2 className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple icon wrapper
const VoteIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 12 2 2 4-4" /><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" /><path d="M22 19H2" />
  </svg>
);

export default VotePage;
