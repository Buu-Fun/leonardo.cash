'use client';
import React from 'react';

import { Footer } from '@/src/components/Footer/Footer';
import { PageLogo } from '@/src/components/PageLogo/PageLogo';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="layout">
      <div className="navbarContainer">
        <div className="navbar">
          <a href="/">
            <PageLogo />
          </a>
        </div>
      </div>
      {children}
      <Footer />
    </div>
  );
}
