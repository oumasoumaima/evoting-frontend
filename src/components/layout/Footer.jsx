import React from 'react';
import { Vote } from 'lucide-react';

export function Footer() {
    return (
        <footer className="mt-auto border-t border-white/10 bg-black/5 backdrop-blur-sm">
            <div className="container mx-auto py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 opacity-70">
                        <div className="p-1 rounded bg-primary/10">
                            <Vote className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium">
                            © 2025 SecureVote.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors">Politique de Confidentialité</a>
                        <a href="#" className="hover:text-primary transition-colors">Conditions d'Utilisation</a>
                        <a href="#" className="hover:text-primary transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
