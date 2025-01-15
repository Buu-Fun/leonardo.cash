import Image from 'next/image';

import styles from './styles.module.css';

export const PageLogo = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.logo}>
        <Image src={'/logo.webp'} alt="Logo LeonardoAI" fill />
      </div>
      <span className={styles.logoTextFirst}>LEONARDO</span>
      <span className={styles.logoTextSecond}>AI</span>
    </div>
  );
};
