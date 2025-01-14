import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import styles from './styles.module.css';
import { Button } from '@nextui-org/react';
import clsx from 'clsx';

interface Props {
  children: React.ReactNode;
  icon?: React.ReactElement;
  onClick?: () => void;
  cta?: string | React.ReactNode;
  type?: 'warning' | 'info' | 'success' | 'error';
}

const Icon = (type: string) => {
  switch (type) {
    case 'info':
      return <ExclamationTriangleIcon />;
    case 'success':
      return <CheckBadgeIcon />;
    case 'error':
      return <ExclamationCircleIcon />;
    case 'warning':
    default:
      return <ExclamationTriangleIcon />;
  }
};

const Disclaimer = ({ children, onClick, cta, type = 'warning' }: Props) => {
  const isCTAString = typeof cta === 'string';
  const icon = Icon(type);
  return (
    <div className={`${styles.layout} ${styles[type]}`}>
      <div className={styles.left}>
        {React.cloneElement(icon, {
          className: clsx(styles.icon, styles[`${type}Icon`]),
        })}
        <div className={styles.message}>{children}</div>
      </div>
      {cta && (
        <div className={styles.right}>
          {isCTAString && onClick ? (
            <Button color="primary" onPress={onClick}>
              {cta}
            </Button>
          ) : (
            cta
          )}
        </div>
      )}
    </div>
  );
};

export default Disclaimer;
