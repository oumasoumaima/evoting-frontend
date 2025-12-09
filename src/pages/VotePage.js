import React, { useState, useEffect } from 'react';
import { voteService, voterService } from '../services/api';
import './VotePage.css';

function VotePage() {
  const [candidates, setCandidates] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [voters, setVoters] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedProposal, setSelectedProposal] = useState('');
  const [selectedVoter, setSelectedVoter] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des données...');

      const [candidatesData, proposalsData, votersData] = await Promise.all([
        voteService.getCandidates(),
        voteService.getProposals(),
        voterService.getEligibleVoters()
      ]);

      console.log('✅ Candidats:', candidatesData);
      console.log('✅ Propositions:', proposalsData);
      console.log('✅ Électeurs:', votersData);

      setCandidates(candidatesData);
      setProposals(proposalsData);
      setVoters(votersData);

      // Sélectionner automatiquement la première proposition active
      const activeProposal = proposalsData.find(p => p.active);
      if (activeProposal) {
        setSelectedProposal(activeProposal.id.toString());
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      setMessage({
        type: 'error',
        text: '❌ Erreur lors du chargement des données'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!selectedVoter || !selectedCandidate || !selectedProposal) {
      setMessage({
        type: 'error',
        text: '❌ Veuillez remplir tous les champs'
      });
      return;
    }

    try {
      console.log('🗳️ Envoi du vote:', {
        cin: selectedVoter,
        candidateId: parseInt(selectedCandidate),
        proposalId: parseInt(selectedProposal)
      });

      await voteService.castVote(
          selectedVoter,
          parseInt(selectedCandidate),
          parseInt(selectedProposal)
      );

      setMessage({ type: 'success', text: '✅ Vote enregistré avec succès !' });

      // Réinitialiser le formulaire
      setSelectedVoter('');
      setSelectedCandidate('');

      // Recharger les électeurs
      const updatedVoters = await voterService.getEligibleVoters();
      setVoters(updatedVoters);

    } catch (error) {
      console.error('❌ Vote error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Erreur lors du vote';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
      <div className="vote-page">
        <h2>Voter</h2>

        {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          <select
              value={selectedVoter}
              onChange={(e) => setSelectedVoter(e.target.value)}
              required
          >
            <option value="">Sélectionner votre nom</option>
            {voters.map((voter) => (
                <option key={voter.cin} value={voter.cin}>
                  {voter.firstName} {voter.lastName} (CIN: {voter.cin})
                </option>
            ))}
          </select>

          <select
              value={selectedProposal}
              onChange={(e) => setSelectedProposal(e.target.value)}
              required
          >
            <option value="">Sélectionner une proposition</option>
            {proposals.map((proposal) => (
                <option key={proposal.id} value={proposal.id}>
                  {proposal.title}
                </option>
            ))}
          </select>

          <select
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              required
          >
            <option value="">Sélectionner un candidat</option>
            {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} - {candidate.party}
                </option>
            ))}
          </select>

          <button type="submit">Voter</button>
        </form>

        {voters.length > 0 && (
            <div className="info-box">
              📊 {voters.length} électeur(s) éligible(s)
            </div>
        )}

        <div className="candidates-list">
          <h3>Candidats disponibles</h3>
          {candidates.map((candidate) => (
              <div key={candidate.id} className="candidate-card">
                <h4>{candidate.name}</h4>
                <p><strong>Parti:</strong> {candidate.party}</p>
                <p>{candidate.program}</p>
              </div>
          ))}
        </div>
      </div>
  );
}

export default VotePage;