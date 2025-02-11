import { useEffect, useState } from 'react';
import styles from './MigrationBanner.module.css';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

const migrationVideoKey = 'showMigrationVideo';

export function MigrationBanner() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const locally = localStorage.getItem(migrationVideoKey);
    if (!locally) {
      setTimeout(() => {
        localStorage.setItem(migrationVideoKey, 'true');
        setShowVideo(true);
      }, 2500);
    }
  }, []);

  const onClose = () => {
    localStorage.setItem(migrationVideoKey, 'false');
    setShowVideo(false);
  };

  return (
    <div className={styles.migrationBanner}>
      {showVideo && (
        <div className={styles.videoOverlay}>
          <div className={styles.videoContainer}>
            <div className={styles.closeIconContainer}>
              <XMarkIcon className={styles.closeIcon} onClick={onClose} />
            </div>
            <LiteYouTubeEmbed
              id="gH6OMrwPqO4"
              title="Migration Video"
              noCookie
              params="autoplay=1"
            />
          </div>
        </div>
      )}
      <div className={styles.left}>
        <div className={styles.solanaLogo}>
          <svg
            className={styles.solanaLogo}
            width="398"
            height="312"
            viewBox="0 0 398 312"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_347_50)">
              <path
                d="M64.6 237.9C67 235.5 70.3 234.1 73.8 234.1H391.2C397 234.1 399.9 241.1 395.8 245.2L333.1 307.9C330.7 310.3 327.4 311.7 323.9 311.7H6.50002C0.700016 311.7 -2.19998 304.7 1.90002 300.6L64.6 237.9Z"
                fill="white"
              />
              <path
                d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0H391.2C397 0 399.9 7 395.8 11.1L333.1 73.8C330.7 76.2 327.4 77.6 323.9 77.6H6.50002C0.700016 77.6 -2.19998 70.6 1.90002 66.5L64.6 3.8Z"
                fill="white"
              />
              <path
                d="M333.1 120.1C330.7 117.7 327.4 116.3 323.9 116.3H6.50002C0.700016 116.3 -2.19998 123.3 1.90002 127.4L64.6 190.1C67 192.5 70.3 193.9 73.8 193.9H391.2C397 193.9 399.9 186.9 395.8 182.8L333.1 120.1Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_347_50">
                <rect width="397.7" height="311.7" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.migrationBannerText}>
          WE ARE MIGRATING TO $BUU
        </span>
        <div className={styles.migrationBannerVideoContainer}>
          <span
            className={styles.migrationBannerCAText}
            onClick={() => {
              window.open(
                'https://dexscreener.com/solana/CfscKScJarnPmFokMyK94Do2dpgGLzqrH67bb2vUN1uB',
              );
            }}
          >
            CA: 88n8pBT6doB5rHP7WcAaG8TuVY1baWazzxAS7Bm8virt
          </span>
          <div className={styles.videoIcon} onClick={() => setShowVideo(true)}>
            <VideoCameraIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
