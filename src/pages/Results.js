import React, { useState, useEffect } from 'react';
import { resultService } from '../services/api';
import './Results.css';

function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await resultService.getResults();
            setResults(data);
        } catch (error) {
            console.error('Error loading results:', error);
            setError('❌ Erreur lors du chargement des résultats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Chargement des résultats...</div>;
    }

    if (error) {
        return (
            <div className="results-page">
                <div className="error">{error}</div>
                <button onClick={loadResults}>Réessayer</button>
            </div>
        );
    }

    const totalVotes = results.reduce((sum, r) => sum + (r.totalVotes || 0), 0);

    return (
        <div className="results-page">
            <h2>Résultats du Vote</h2>

            <div className="total-votes">
                <strong>Total des votes:</strong> {totalVotes}
            </div>

            <div className="results-list">
                {results.length === 0 ? (
                    <p>Aucun résultat disponible</p>
                ) : (
                    results.map((result, index) => (
                        <div key={result.id} className="result-card">
                            <div className="rank">#{index + 1}</div>
                            <div className="candidate-info">
                                <h3>{result.candidateName}</h3>
                                <div className="votes">
                                    <strong>{result.totalVotes}</strong> votes
                                    {totalVotes > 0 && (
                                        <span className="percentage">
                                            ({((result.totalVotes / totalVotes) * 100).toFixed(1)}%)
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{
                                        width: `${totalVotes > 0 ? (result.totalVotes / totalVotes) * 100 : 0}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button onClick={loadResults} className="refresh-button">
                🔄 Actualiser
            </button>
        </div>
    );
}

export default Results;