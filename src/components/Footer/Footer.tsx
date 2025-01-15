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
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div
            style={{
              marginLeft: '10px',
              fontSize: '12px',
              color: '#FFFFFF70',
            }}
          >
            {'© 2025 Leonardo AI - All rights reserved'}
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
    </div>
  );
};
