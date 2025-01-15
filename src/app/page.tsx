'use client';
import { Button, Chip, useDisclosure } from '@nextui-org/react';
import React from 'react';
import Image from 'next/image';
import { Footer } from '../components/Footer/Footer';
import { ASSET_ADDRESS } from '../config';
import { splitStringIntoChunks } from '../utils/format';
import Copy from '../components/Copy/Copy';
import clsx from 'clsx';
import { PageLogo } from '../components/PageLogo/PageLogo';
import { SwapModal } from '../components/SwapModal/SwapModal';

import styles from './page.module.css';

const Box = ({
  children,
  href,
  onClick,
  backgroundImage,
  backgroundColor,
  className,
  style,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  href?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const active = href || onClick;

  if (href) {
    return (
      <a
        href={href}
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
      </a>
    );
  }

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
  const chunkedAddress = splitStringIntoChunks(ASSET_ADDRESS, 17);
  const swapDisclosure = useDisclosure();

  return (
    <div className="layout">
      <SwapModal {...swapDisclosure} />
      <div className="navbar">
        <PageLogo />

        <a href="/staking">
          <Button color="primary">Launch App</Button>
        </a>
      </div>
      <main style={{ display: 'flex', flexDirection: 'column' }}>
        <h1
          style={{
            marginTop: '60px',
          }}
        >
          HELLO
        </h1>
        <h2>{'I’m Leonardo AI'}</h2>
        <h3
          style={{
            marginBottom: '60px',
          }}
        >
          {
            "We're helping launch millions of new LSTs. We're building the future of AI."
          }
        </h3>

        <div className={styles.landingBoxes}>
          <div className={styles.firstColumn}>
            <Box className={styles.imageTo3DBox}>
              <span>IMAGE-TO-3D</span>
              <span> All freely tradable. </span>
              <span> Zero slippage. </span>
            </Box>

            <Box className={styles.contractAddressBox}>
              {chunkedAddress.map((chunk, index) => {
                if (index === chunkedAddress.length - 1) {
                  return (
                    <div key={chunk} className={styles.contractAddressSplit}>
                      <div>{chunk}</div>
                      <Copy text={ASSET_ADDRESS} />
                    </div>
                  );
                }
                return <div key={chunk}>{chunk}</div>;
              })}

              <div className={styles.contractAddress}>CONTRACT ADDRESS</div>
            </Box>

            <Box
              className={styles.buyNowBox}
              onClick={() => swapDisclosure.onOpen()}
              href="https://app.uniswap.org/swap?exactField=output&&outputCurrency=0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f&inputCurrency=ETH&chain=base"
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
              <span className={styles.over300kSecond}>$300K</span>
              <span className={styles.over300kThird}>PER DAY</span>
            </Box>

            <Box className={styles.voteDao}>
              <span className={styles.voteDaoFirst}>VOTE</span>
              <span className={styles.voteDaoSecond}>DAO</span>
            </Box>

            <Box className={styles.xBox} href="https://x.com/Leonardo__AI">
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

            <Box className={styles.stakeBox} href="/staking">
              <span className={styles.stakeBoxFirst}>REWARDING ONLY THE</span>
              <div className={styles.stakeBoxSecond}>
                <div className={styles.stakeBoxSecondInnerFirst}>TOP 100</div>
                <div className={styles.stakeBoxSecondInnerSecond}>STAKERS</div>
              </div>
              <Button color="primary">STAKE NOW</Button>
            </Box>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
