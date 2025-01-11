'use client';
import { Button } from '@nextui-org/react';
import React from 'react';
// import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Box = ({
  backgroundImage,
  children,
}: {
  backgroundImage?: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    }}
  >
    <Image
      src={backgroundImage || '/background.webp'}
      alt="Background"
      fill
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
    {children}
  </div>
);

export default function Page() {
  // const router = useRouter();
  return (
    <div className="layout">
      <header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={'/logo.webp'}
            alt="Logo LeonardoAI"
            width={80}
            height={80}
          />
          <span
            style={{
              color: '#FFFFFF',
              fontFamily: 'Bebas Neue',
              fontSize: '41.329px',
              fontStyle: 'italic',
              fontWeight: '700',
              lineHeight: '42.939px',
              letterSpacing: '-0.072px',
              textTransform: 'uppercase',
            }}
          >
            LEONARDO
          </span>
          <span
            style={{
              color: '#803BF1',
              fontFamily: 'Bebas Neue',
              fontSize: '41.329px',
              fontStyle: 'italic',
              fontWeight: '700',
              lineHeight: '42.939px',
              letterSpacing: '-0.072px',
              textTransform: 'uppercase',
            }}
          >
            AI
          </span>
        </div>

        <Button disabled color="primary">
          Coming soon
        </Button>
      </header>
      <main>
        <span
          style={{
            color: '#FFFFFF',
            fontFamily: 'Bebas Neue',
            fontSize: '70px',
            fontStyle: 'italic',
            fontWeight: '700',
            lineHeight: '42.939px',
            letterSpacing: '-0.072px',
            textTransform: 'uppercase',
          }}
        >
          COMING SOON
        </span>
      </main>
      <footer></footer>
    </div>
  );
}
