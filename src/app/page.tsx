'use client';
import { Button, Chip } from '@nextui-org/react';
import React from 'react';
import Image from 'next/image';
import { Footer } from '../components/Footer/Footer';
import Copy from '../components/Copy/Copy';
import clsx from 'clsx';

import styles from './page.module.css';
import { Navbar } from '../components/Navbar/Navbar';
import { useRouter } from 'next/navigation';
import { getAddresses } from '../addresses';
import { CHAINS } from '../config';
import { MigrationBanner } from '../components/MigrationBanner/MigrationBanner';
import { splitStringIntoChunks } from '../utils/format';

const Box = ({
  children,
  onClick,
  backgroundImage,
  backgroundColor,
  className,
  style,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const active = onClick !== undefined;
  return (
    <div
      onClick={onClick}
      className={clsx(styles.box, active && styles.active, className)}
      style={{
        backgroundColor: backgroundColor || undefined,
        ...style,
      }}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="Background Box"
          fill
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}
      {children}
    </div>
  );
};

export default function Page() {
  const assetAddress = getAddresses(CHAINS[0]).asset;
  const chunkedAddress = splitStringIntoChunks(assetAddress, 17);
  const router = useRouter();

  return (
    <div className="layout">
      <Navbar isDApp={false} />

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '80px',
        }}
      >
        <MigrationBanner />

        <h1
          style={{
            marginTop: '60px',
            fontSize: '100px',
            marginBottom: '10px',
          }}
        >
          HELLO
        </h1>
        <h2
          style={{
            fontSize: '50px',
            textTransform: 'uppercase',
            marginTop: '-10px',
            fontWeight: 'bold',
          }}
        >
          {'I’m Leonardo AI'}
        </h2>
        <h3
          style={{
            marginBottom: '60px',
            fontSize: '20px',
            textTransform: 'uppercase',
          }}
        >
          {'AI for the bankless, AI for the games'}
        </h3>

        <div className={styles.landingBoxes}>
          <div className={styles.firstColumn}>
            <Box className={styles.imageTo3DBox}>
              <span>IMAGE-TO-3D</span>
              <span> Memecomic </span>
              <span> Portfolio Mgmt </span>
            </Box>

            <Box className={styles.contractAddressBox}>
              {chunkedAddress.map((chunk, index) => {
                if (index === chunkedAddress.length - 1) {
                  return (
                    <div key={chunk} className={styles.contractAddressSplit}>
                      <div>{chunk}</div>
                      <Copy text={assetAddress} />
                    </div>
                  );
                }
                return <div key={chunk}>{chunk}</div>;
              })}

              <div className={styles.contractAddress}>CONTRACT ADDRESS</div>
            </Box>

            <Box
              className={styles.buyNowBox}
              onClick={() =>
                window.open(
                  'https://app.uniswap.org/swap?exactField=output&&outputCurrency=0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f&inputCurrency=ETH&chain=base',
                )
              }
            >
              <div className={styles.buyNowBoxText}>
                <div className={styles.buyNowBuyNow}>BUY NOW</div>
                <div className={styles.buyNowLeonai}>$LEONAI</div>
              </div>

              <div className={styles.tokens}>
                <Image
                  src="/leonai.png"
                  alt="$LEONAI"
                  className={styles.leonaiTokenImage}
                  width={80}
                  height={80}
                />

                <div className={styles.uniswapToken}>
                  <Image
                    className={styles.uniswapTokenImage}
                    src="/uniswap.svg"
                    alt="$UNI"
                    fill
                  />
                </div>
              </div>
            </Box>
          </div>
          <div className={styles.secondColumn}>
            <Box className={styles.over300k}>
              <span className={styles.over300kFirst}>Over</span>
              <span className={styles.over300kSecond}>$16k</span>
              <span className={styles.over300kThird}>PER DAY</span>
            </Box>

            <Box
              className={styles.voteDao}
              onClick={() => window.open('https://dao.leonardo.cash')}
            >
              <span className={styles.voteDaoFirst}>VOTE</span>
              <span className={styles.voteDaoSecond}>DAO</span>
            </Box>

            <Box
              className={styles.xBox}
              onClick={() => window.open('https://x.com/Leonardo__AI')}
            >
              <div className={styles.xBoxScreenContainer}>
                <div className={styles.xBoxScreen}>
                  <Image src="/screen.png" alt="Screen" fill />
                </div>
              </div>
              <div className={styles.xBoxPhoneContainer}>
                <div className={styles.xBoxPhone}>
                  <Image src="/phone.png" alt="Phone" fill />
                </div>
              </div>
            </Box>

            <Box className={styles.logoBox}>
              <div className={styles.logo}>
                <Image
                  src={'/logo.webp'}
                  alt="Logo LeonardoAI"
                  width={150}
                  height={150}
                />
              </div>
              <span className={styles.logoTextFirst}>LEONARDO</span>
              <span className={styles.logoTextSecond}>AI</span>
            </Box>

            <Box className={styles.launchingBox}>
              <span className={styles.launchingBoxFirst}>Launching</span>
              <span className={styles.launchingBoxSecond}>Q1 2025</span>
            </Box>

            <Box className={styles.techStackBox}>
              <span>Tech stack</span>
              <div className={styles.techStackGrid}>
                <Chip size="md" color="primary" variant="bordered">
                  G.A.M.E.
                </Chip>
                <Chip size="md" color="primary" variant="bordered">
                  COMIC-AI
                </Chip>
                <Chip size="md" color="primary" variant="bordered">
                  Virtuals
                </Chip>
                <Chip size="md" color="primary" variant="bordered">
                  More
                </Chip>
              </div>
            </Box>

            <Box
              className={styles.stakeBox}
              onClick={() => router.push('/platform/staking')}
            >
              <span className={styles.stakeBoxFirst}>REWARDING ONLY THE</span>
              <div className={styles.stakeBoxSecond}>
                <div className={styles.stakeBoxSecondInnerFirst}>TOP 100</div>
                <div className={styles.stakeBoxSecondInnerSecond}>STAKERS</div>
              </div>
              <Button
                color="primary"
                onPress={() => router.push('/platform/staking')}
              >
                STAKE NOW
              </Button>
            </Box>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
