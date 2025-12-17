import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Vote, BarChart2, UserPlus, Home, LogIn } from 'lucide-react';

export function Header() {
    const location = useLocation();

    const navItems = [
        { href: '/', label: 'Accueil', icon: Home },
        { href: '/register', label: 'Inscription', icon: UserPlus },
        { href: '/vote', label: 'Voter', icon: Vote },
        { href: '/results', label: 'Résultats', icon: BarChart2 },
    ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full"
        >
            <div className="container mx-auto px-4 py-4">
                <div className="glass-panel rounded-2xl px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-transform group-hover:scale-105">
                            <Vote className="h-6 w-6" />
                            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            SecureVote
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                        isActive
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                    {item.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 rounded-lg border border-primary/20 bg-primary/5 -z-10"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                            <LogIn className="h-4 w-4" />
                            Connexion
                        </Button>
                        <Button size="sm" className="glass-button rounded-full px-6">
                            Commencer
                        </Button>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
