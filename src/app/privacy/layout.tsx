'use client';
import React from 'react';

import { Footer } from '@/src/components/Footer/Footer';
import { Navbar } from '@/src/components/Navbar/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout">
      <Navbar isDApp={false} />
      {children}
      <Footer />
    </div>
  );
}
