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
              id="HaWTWjGPTvI"
              title="Migration Video"
              noCookie
              params="autoplay=1"
            />
          </div>
        </div>
      )}
      <div className={styles.migrationBannerText}>WE ARE MIGRATING TO $BUU</div>
      <div className={styles.migrationBannerCA}>
        <div className={styles.migrationBannerCAText}>{'CA: <CA_ADDRESS>'}</div>
        <div className={styles.videoIcon}>
          <VideoCameraIcon onClick={() => setShowVideo(true)} />
        </div>
      </div>
    </div>
  );
}
