import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { resultService } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2, RefreshCw, Trophy, Users, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadResults();
        // Auto-refresh every 30s
        const interval = setInterval(loadResults, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadResults = async () => {
        try {
            // Don't show global loading on refresh, just update data
            if (results.length === 0) setLoading(true);
            setError(null);
            const data = await resultService.getResults();
            const sortedData = data.sort((a, b) => b.totalVotes - a.totalVotes);
            setResults(sortedData);
        } catch (error) {
            console.error('Error loading results:', error);
            setError('Impossible de charger les résultats.');
        } finally {
            setLoading(false);
        }
    };

    const totalVotes = results.reduce((sum, r) => sum + (r.totalVotes || 0), 0);
    const winner = results.length > 0 ? results[0] : null;

    const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

    if (loading && results.length === 0) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500 relative z-10" />
                </div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <p className="font-bold text-slate-900 dark:text-white mb-1">{label}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {payload[0].value} votes
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6"
            >
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">Résultats du Scrutin</h1>
                    <p className="text-slate-400 mt-2 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Mise à jour en temps réel
                    </p>
                </div>
                <Button onClick={loadResults} variant="outline" className="gap-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
                    Actualiser
                </Button>
            </motion.div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="glass-panel border-none shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">Participation Totale</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{totalVotes}</div>
                            <p className="text-xs text-slate-400 mt-1">Votes enregistrés</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2 lg:col-span-3">
                    <Card className="glass-panel border-none shadow-lg bg-gradient-to-br from-white/10 to-blue-500/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">Tendance Actuelle</CardTitle>
                            <Trophy className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            {winner ? (
                                <div className="flex items-center gap-6">
                                    <div>
                                        <div className="text-3xl font-bold text-emerald-400">{winner.candidateName}</div>
                                        <div className="text-sm text-slate-400">{winner.party || "Indépendant"}</div>
                                    </div>
                                    <div className="h-12 w-px bg-slate-700 mx-2"></div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-white">
                                            {totalVotes > 0 ? ((winner.totalVotes / totalVotes) * 100).toFixed(1) : 0}%
                                        </span>
                                        <span className="text-xs text-slate-400">Suffrages exprimés</span>
                                    </div>
                                    <div className="flex-1 hidden md:block pl-6">
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${totalVotes > 0 ? ((winner.totalVotes / totalVotes) * 100) : 0}%` }}
                                                className="h-full bg-emerald-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted-foreground">En attente des premiers votes...</div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Chart Section */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="glass-panel border-none shadow-xl h-[500px]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                Répartition des Voix
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[420px] p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={results} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis
                                        dataKey="candidateName"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                        angle={-45}
                                        textAnchor="end"
                                        interval={0}
                                        height={60}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b' }}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="totalVotes" radius={[8, 8, 0, 0]} animationDuration={1500}>
                                        {results.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Detailed List Section */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="glass-panel border-none shadow-xl h-[500px] overflow-hidden flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-purple-500" />
                                Détails par Candidat
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                            <div className="space-y-6">
                                {results.map((result, index) => (
                                    <motion.div
                                        key={result.candidateId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 + 0.5 }}
                                        className="space-y-2 group"
                                    >
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs bg-slate-800 text-slate-300">
                                                    {index + 1}
                                                </div>
                                                <span className="font-semibold text-slate-200">{result.candidateName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white">{result.totalVotes}</span>
                                                <span className="text-xs text-slate-400">votes</span>
                                            </div>
                                        </div>
                                        <div className="relative h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${totalVotes > 0 ? (result.totalVotes / totalVotes) * 100 : 0}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className="absolute top-0 left-0 h-full rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                        </div>
                                        <div className="text-right text-xs font-medium text-slate-500">
                                            {totalVotes > 0 ? ((result.totalVotes / totalVotes) * 100).toFixed(1) : 0}%
                                        </div>
                                    </motion.div>
                                ))}
                                {results.length === 0 && !error && (
                                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                        <p>En attente de données...</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

export default Results;
