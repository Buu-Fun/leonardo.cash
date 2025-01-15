'use client';
import React from 'react';
import { X } from '../icons/X';
import styles from './styles.module.css';

export const Footer = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.up}>
          <div className={styles.left}>
            <div>© 2025 Leonardo AI - All rights reserved</div>
            <a
              href="/terms"
              style={{
                color: 'var(--primary-color)',
              }}
            >
              Terms of Service
            </a>
          </div>
          <div className={styles.right}>
            <a
              href="https://x.com/Leonardo__AI"
              target="_blank"
              rel="noreferrer"
            >
              <X className={styles.button} />
            </a>
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
