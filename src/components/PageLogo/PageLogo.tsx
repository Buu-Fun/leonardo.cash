import Image from 'next/image';

import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

export const PageLogo = () => {
  const router = useRouter();
  return (
    <div className={styles.layout} onClick={() => router.push('/')}>
      <div className={styles.logo}>
        <Image src={'/logo.webp'} alt="Logo LeonardoAI" fill />
      </div>
      <span className={styles.logoTextFirst}>LEONARDO</span>
      <span className={styles.logoTextSecond}>AI</span>
    </div>
  );
};
