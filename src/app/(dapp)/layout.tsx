'use client';
import React from 'react';
import Providers from './providers';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="layout">
        <header>
          <ConnectButton />
        </header>
        {children}
        <footer>{/* <Blocknumber /> */}</footer>
      </div>
    </Providers>
  );
}
