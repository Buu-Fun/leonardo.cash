'use client';
import Image from 'next/image';
import React from 'react';
import { X } from '../icons/X';
// import { Discord } from '../icons/Discord';
// import { Instagram } from '../icons/Instagram';
// import { Youtube } from '../icons/Youtube';
import styles from './styles.module.css';

export const Footer = () => {
  return (
    <div className="footer">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Bebas Neue',
            fontSize: '20px',
            fontStyle: 'italic',
            fontWeight: '700',
            lineHeight: '42.939px',
            letterSpacing: '-0.072px',
            textTransform: 'uppercase',
          }}
        >
          <Image
            src={'/logo.webp'}
            alt="Logo LeonardoAI"
            width={40}
            height={40}
          />
          <span
            style={{
              color: '#FFFFFF',
            }}
          >
            LEONARDO
          </span>
          <span
            style={{
              color: '#803BF1',
            }}
          >
            AI
          </span>
        </div>
        <div
          style={{
            marginLeft: '10px',
            fontSize: '12px',
            color: '#FFFFFF70',
          }}
        >
          {'© 2024 Leonardo AI. All rights reserved'}
        </div>
        {/* <div>{'Terms and Conditions, Privacy Policy, Copyright Notice'}</div> */}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* <Discord
          className={styles.button}
          onClick={() => {
            window.open('https://discord.com/', '_blank');
          }}
        /> */}
        <a href="https://x.com/Leonardo__AI" target="_blank" rel="noreferrer">
          <X className={styles.button} />
        </a>

        {/* <Instagram />
        <Youtube /> */}
      </div>
    </div>
  );
};
