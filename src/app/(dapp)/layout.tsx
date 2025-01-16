'use client';
import React from 'react';
import Providers from './providers';

import { Footer } from '@/src/components/Footer/Footer';
import { Navbar } from '@/src/components/Navbar/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="layout">
        <Navbar isDApp />
        {children}
        <Footer />
      </div>
    </Providers>
  );
}
