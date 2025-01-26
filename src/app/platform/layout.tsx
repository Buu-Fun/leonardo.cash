'use client';
import React from 'react';
import Providers from './providers';

import { Footer } from '@/src/components/Footer/Footer';
import { Navbar } from '@/src/components/Navbar/Navbar';
import { ToastContainer } from 'react-toastify';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="layout">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Navbar isDApp />
        {children}
        <Footer />
      </div>
    </Providers>
  );
}
