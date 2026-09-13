import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'PsycheAI — Bilimsel Dijital Psikolojik Profil',
  description: 'Kanıta dayalı psikometrik profil motoru ve çok kuramlı analitik sentez',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-bg-app min-h-screen text-text-primary antialiased flex">
        {/* Persistent left application sidebar */}
        <Sidebar />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1440px] w-full mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
