import React from 'react';
import styles from './styles.module.css';

interface Props {
  title: string;
  description: string;
}

export const Toast = ({ title, description }: Props) => {
  return (
    <div className={styles.toast}>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};
