'use client';
import React from 'react';
import Providers from './providers';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Footer } from '@/src/components/Footer/Footer';
import { PageLogo } from '@/src/components/PageLogo/PageLogo';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="layout">
        <div className="navbarContainer">
          <div className="navbar">
            <a href="/">
              <PageLogo />
            </a>

            <ConnectButton />
          </div>
        </div>
        {children}
        <Footer />
      </div>
    </Providers>
  );
}
