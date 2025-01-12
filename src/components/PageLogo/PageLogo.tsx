import Image from 'next/image';

import styles from './styles.module.css';

export const PageLogo = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.logo}>
        <Image src={'/logo.webp'} alt="Logo LeonardoAI" fill />
      </div>
      <div className={styles.title}>
        <div>LEONARDO</div>
        <div className={styles.purple}>AI</div>
      </div>
    </div>
  );
};
