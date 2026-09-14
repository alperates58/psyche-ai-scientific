import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

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
      <body className="bg-bg-app min-h-screen text-text-primary antialiased">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
