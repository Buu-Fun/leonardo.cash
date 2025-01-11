'use client';
import React from 'react';
import Providers from './providers';
import '@rainbow-me/rainbowkit/styles.css';
import '../output.css';
import '../styles/globals.css';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import clsx from 'clsx';
import { Blocknumber } from '../components/Blocknumber';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Leonardo AI</title>
        <meta name="description" content="Leonardo AI" />
        <meta
          property="og:title"
          content="Housing: Real Estate opportunities for everyone"
        />
        <meta property="og:description" content="Leonardo AI" />
        <meta
          property="twitter:title"
          content="Housing: Real Estate opportunities for everyone"
        />
        <meta property="twitter:description" content="Leonardo AI" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          <div className="layout">
            <header>
              <ConnectButton />
            </header>
            {children}
            <footer>{/* <Blocknumber /> */}</footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
