import React from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

interface Props {
  type?: 'info' | 'success' | 'error';
  title: string;
  description: string;
}

export const Toast = ({ type = 'info', title, description }: Props) => {
  return (
    <div className={styles.toast}>
      <div className={clsx(styles.title, styles[type])}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};
