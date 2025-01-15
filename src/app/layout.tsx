'use client';
import React from 'react';
import Providers from './providers';
import '@rainbow-me/rainbowkit/styles.css';
// import '../output.css';
import '../styles/globals.css';
import Image from 'next/image';

// import { Blocknumber } from '../components/Blocknumber';

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
        <meta property="og:title" content="LeonardoAI" />
        <meta property="og:description" content="Leonardo AI" />
        <meta property="twitter:title" content="LeonardoAI" />
        <meta property="twitter:description" content="Leonardo AI" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 0,
          }}
        >
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              width: '100vw',
              zIndex: 1,
            }}
          />
          <Image src="/background.png" alt="background" fill />
        </div>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
