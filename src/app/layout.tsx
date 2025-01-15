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
        <title>Leonardo AI Agent - A Game-Changing Experiment</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Leonardo AI Agent - A Game-Changing Experiment"
        />
        <meta
          name="twitter:description"
          content="Meet Leonardo, the AI agent combining game theory and advanced models to deliver AI-generated content through smarter interactions in the agentic gaming era. 🚀"
        />
        <meta name="twitter:image" content="https://i.imgur.com/VHCMRSy.jpeg" />
        <meta name="twitter:creator" content="@Leonardo__AI" />
        <meta name="twitter:site" content="@Leonardo__AI" />
        <meta property="og:url" content="https://leonardo.cash" />
        <meta
          property="og:title"
          content="Leonardo AI Agent - A Game-Changing Experiment"
        />
        <meta
          property="og:description"
          content="Meet Leonardo, the AI agent combining game theory and advanced models to deliver AI-generated content through smarter interactions in the agentic gaming era. 🚀"
        />
        <meta property="og:image" content="https://i.imgur.com/VHCMRSy.jpeg" />
        <meta property="og:url" content="https://leonardo.cash" />
        <meta property="og:type" content="website" />
        <link
          href="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css"
          rel="stylesheet"
        />
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"></script>
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
