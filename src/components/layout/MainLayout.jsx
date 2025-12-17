import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function MainLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col font-sans antialiased">
            <Header />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
}
