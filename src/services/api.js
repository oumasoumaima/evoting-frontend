import axios from 'axios';

const VOTER_API_URL = 'http://localhost:8081';
const VOTE_API_URL = 'http://localhost:8082';
const RESULT_API_URL = 'http://localhost:8083';

// Voter Service
export const voterService = {
  register: (voter) => axios.post(`${VOTER_API_URL}/voters`, voter),

  getEligibleVoters: async () => {
    try {
      const response = await axios.get(`${VOTER_API_URL}/voters`);
      const allVoters = response.data._embedded?.voters || [];

      // Filtrer les électeurs éligibles (actifs et n'ayant pas voté)
      return allVoters.filter(voter => voter.isActive && !voter.hasVoted);
    } catch (error) {
      console.error('Error fetching voters:', error);
      throw error;
    }
  }
};

// Vote Service
export const voteService = {
  getCandidates: async () => {
    try {
      const response = await axios.get(`${VOTE_API_URL}/candidates`);
      return response.data._embedded?.candidates || [];
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  getProposals: async () => {
    try {
      const response = await axios.get(`${VOTE_API_URL}/proposals`);
      return response.data._embedded?.proposals || [];
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }
  },

  // ✅ CORRIGÉ: Utilise /votes/submit et voterCin
  castVote: (cin, candidateId, proposalId) =>
      axios.post(`${VOTE_API_URL}/votes/submit`, {
        voterCin: cin,
        candidateId,
        proposalId
      })
};

// Result Service
export const resultService = {
  getResults: async () => {
    try {
      const response = await axios.get(`${RESULT_API_URL}/results`);
      const results = response.data._embedded?.voteResults || [];

      // Trier par nombre de votes décroissant
      return results.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0));
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  }
};