'use client';
import React from 'react';
import { X } from '../icons/X';
import styles from './Footer.module.css';
import { useRouter } from 'next/navigation';
import { TelegramIcon } from '../icons/TelegramIcon';

export const Footer = () => {
  const router = useRouter();
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.up}>
          <div className={styles.left}>
            <div>© 2025 Leonardo AI - All rights reserved</div>
            <div className={styles.links}>
              <div
                onClick={() => router.push('/terms')}
                style={{
                  color: 'var(--primary-color)',
                }}
              >
                Terms of Service
              </div>
              <div
                onClick={() => router.push('/privacy')}
                style={{
                  color: 'var(--primary-color)',
                }}
              >
                Privacy Policy
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div onClick={() => window.open('https://x.com/Leonardo__AI')}>
              <X className={styles.button} />
            </div>

            <div
              onClick={() => window.open('https://t.me/leonardo_ai_official')}
            >
              <TelegramIcon className={styles.button} />
            </div>
          </div>
        </div>

        <div className={styles.down}>
          &quot;Leonardo AI&quot; including the platform, website
          (https://leonardo.cash) and project is a brand and product of Relayer
          X LLC, a Republic of Georgia registered entity with Company ID
          412781636 and holder of the full Virtual Asset Service Provider (VASP)
          licence N. 01-2024 registered in Avtomshenebeli st., N 88, (plot
          N01/298), (free industrial zone) Kutaisi, Georgia&quot;
        </div>
      </div>
    </div>
  );
};
